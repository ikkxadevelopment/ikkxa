import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import { OTP_VERIFY, SOCIAL_LOGIN } from "@/constants/apiRoutes";

// ---------------------------------------------------------------------------
// Cloudflare Workers-safe JWT encode/decode.
//
// NextAuth v4's default jwt.encode is `jose.EncryptJWT` with A256GCM, which
// transitively calls Node's `crypto.createCipheriv`. Cloudflare's `unenv`
// polyfill does NOT implement createCipheriv, so the default path crashes
// with "[unenv] crypto.createCipheriv is not implemented yet!" on Workers
// the moment NextAuth tries to issue a session cookie.
//
// We swap in HS256-signed JWTs using WebCrypto's SubtleCrypto.sign, which
// is available natively on Workers (and on Node 18+). Session tokens are
// signed (tamper-proof) but not encrypted — standard JWS, appropriate for
// our OTP-issued session payload.
// ---------------------------------------------------------------------------
const DEFAULT_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

const _enc = new TextEncoder();
const _dec = new TextDecoder();

const b64uEncode = (buf) => {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
};

const b64uDecode = (str) => {
  let s = String(str).replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
};

const importHmacKey = (secret) =>
  crypto.subtle.importKey(
    "raw",
    _enc.encode(String(secret || "")),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );

const workerJwtEncode = async ({ token = {}, secret, maxAge = DEFAULT_MAX_AGE }) => {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    ...token,
    iat: now,
    exp: now + (maxAge || DEFAULT_MAX_AGE),
    jti:
      (typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID()) ||
      Math.random().toString(36).slice(2),
  };
  const headerB64 = b64uEncode(
    _enc.encode(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  );
  const payloadB64 = b64uEncode(_enc.encode(JSON.stringify(payload)));
  const signingInput = `${headerB64}.${payloadB64}`;
  const key = await importHmacKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, _enc.encode(signingInput));
  return `${signingInput}.${b64uEncode(sig)}`;
};

const workerJwtDecode = async ({ token, secret }) => {
  if (!token) return null;
  try {
    const parts = String(token).split(".");
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, sigB64] = parts;
    const key = await importHmacKey(secret);
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      b64uDecode(sigB64),
      _enc.encode(`${headerB64}.${payloadB64}`)
    );
    if (!ok) return null;
    const payload = JSON.parse(_dec.decode(b64uDecode(payloadB64)));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch (_e) {
    return null;
  }
};

// ---------------------------------------------------------------------------
// Determine the per-request API base URL from the NEXT_LOCALE cookie.
// Called from inside `authorize` / `signIn` so we can pick the right
// backend (SA vs AE) without rebuilding NextAuth on every request.
// ---------------------------------------------------------------------------
const getBaseUrlFromLocale = () => {
  try {
    const c = cookies();
    const nextLocale = c.get("NEXT_LOCALE")?.value || "ar-SA";
    const [, country] = nextLocale.split("-");
    return country === "SA"
      ? process.env.NEXT_PUBLIC_API_BASE_URL_SA
      : process.env.NEXT_PUBLIC_API_BASE_URL_AE;
  } catch {
    return (
      process.env.NEXT_PUBLIC_API_BASE_URL_SA ||
      process.env.NEXT_PUBLIC_API_BASE_URL_AE ||
      process.env.NEXT_PUBLIC_BASE_URL
    );
  }
};

// ---------------------------------------------------------------------------
// Providers — Credentials is always present; Google only when its env vars
// are configured (otherwise GoogleProvider init can throw with undefined
// credentials on stricter runtimes).
// ---------------------------------------------------------------------------
const providers = [
  CredentialsProvider({
    id: "credentials",
    name: "credentials",
    credentials: {
      country_code: { label: "Country Code", type: "text" },
      phone: { label: "Phone Number", type: "text" },
      email: { label: "email", type: "text" },
      otp: { label: "OTP", type: "text" },
      trx_id: { label: "Transaction ID", type: "text" },
    },
    async authorize(credentials) {
      try {
        const baseUrl = getBaseUrlFromLocale();
        const trxId = credentials?.trx_id;
        let payload;

        if (credentials?.email) {
          payload = {
            email: credentials.email,
            otp: credentials.otp,
            ...(trxId ? { trx_id: trxId } : {}),
          };
        } else if (credentials?.phone && credentials?.country_code) {
          payload = {
            country_code: credentials.country_code,
            phone: credentials.phone,
            otp: credentials.otp,
            ...(trxId ? { trx_id: trxId } : {}),
          };
        } else {
          throw new Error("Invalid login credentials");
        }

        // Use native fetch (not axios) for Workers compatibility.
        const res = await fetch(`${baseUrl}${OTP_VERIFY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Invalid OTP");

        const data = await res.json();
        const { token, first_name, last_name, image, phone, email } =
          data?.data || {};

        if (!token) throw new Error("Invalid OTP");

        // NextAuth requires user.id for the JWT subject claim. Use the
        // backend-issued token as a stable per-user id.
        return {
          id: String(token),
          token: String(token),
          phone: phone ? String(phone) : "",
          first_name: first_name ? String(first_name) : "",
          last_name: last_name ? String(last_name) : "",
          image: image ? String(image) : "",
          email: email ? String(email) : "",
        };
      } catch (error) {
        console.error("Error verifying OTP:", error);
        throw new Error("Invalid OTP");
      }
    },
  }),
];

if (
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID &&
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
) {
  providers.push(
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authOptions = {
  providers,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "google") return true;
      try {
        const baseUrl = getBaseUrlFromLocale();
        const res = await fetch(`${baseUrl}${SOCIAL_LOGIN}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: user.id,
            email: profile.email,
            phone: "",
            dob: "",
            gender: "",
            name: profile.name,
            image: profile.picture,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const {
            token,
            first_name,
            last_name,
            image,
            phone,
            email,
            socials,
          } = data?.data || {};
          user.token = token;
          user.first_name = first_name;
          user.last_name = last_name;
          user.image = image;
          user.phone = phone;
          user.email = email;
          user.socials = socials;
        }
      } catch (error) {
        console.error("Error during social login:", error);
      }
      return true;
    },
    async jwt({ token, user, account, profile }) {
      if (account && profile) {
        token.gender = profile.gender || null;
        token.dob = profile.birthday || null;
      }
      if (user) {
        token.accessToken = user.token;
        token.first_name = user.first_name;
        token.last_name = user.last_name;
        token.phone = user.phone;
        token.image = user.image;
        token.email = user.email;
        if (!token.sub && user.id) token.sub = String(user.id);
      }
      return token;
    },
    async session({ session, token }) {
      session.user = session.user || {};
      session.user.first_name = token.first_name;
      session.user.last_name = token.last_name;
      session.user.phone = token.phone;
      session.user.image = token.image;
      session.accessToken = token.accessToken;
      session.user.email = token.email;
      return session;
    },
  },
  session: { strategy: "jwt", maxAge: DEFAULT_MAX_AGE },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: DEFAULT_MAX_AGE,
    // WebCrypto HS256 — bypasses the unenv createCipheriv crash on
    // Cloudflare Workers. See the top of this file for the full story.
    encode: workerJwtEncode,
    decode: workerJwtDecode,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
