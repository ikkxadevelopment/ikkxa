import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { OTP_VERIFY, SOCIAL_LOGIN } from "@/constants/apiRoutes";

// Parse cookies from a Cookie header string.
// We avoid `req.cookies.get(...)` because that API is not consistently
// available across runtimes (Node / Vercel / Cloudflare Workers via OpenNext).
const parseCookieHeader = (cookieHeader) => {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader
      .split(";")
      .map((c) => c.trim())
      .filter(Boolean)
      .map((c) => {
        const eq = c.indexOf("=");
        if (eq === -1) return [c, ""];
        const k = c.slice(0, eq).trim();
        const v = c.slice(eq + 1).trim();
        try {
          return [k, decodeURIComponent(v)];
        } catch {
          return [k, v];
        }
      })
  );
};

const handler = async (req, ctx) => {
  // Determine API base URL from the NEXT_LOCALE cookie at request time.
  // Read directly from the Cookie header so this works on every runtime
  // (Cloudflare Workers does not always expose req.cookies.get).
  const cookieHeader =
    (req?.headers?.get && req.headers.get("cookie")) ||
    req?.headers?.cookie ||
    "";
  const cookies = parseCookieHeader(cookieHeader);
  const nextLocale = cookies["NEXT_LOCALE"] || "ar-SA";
  const [, country] = nextLocale.split("-");
  const baseUrl =
    country === "SA"
      ? process.env.NEXT_PUBLIC_API_BASE_URL_SA
      : process.env.NEXT_PUBLIC_API_BASE_URL_AE;

  // TEMP DEBUG: surface env presence + any caught error so we can see what's
  // crashing the credentials callback on Cloudflare Workers. Remove once fixed.
  const debugEnv = {
    has_NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    has_NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || null,
    has_GOOGLE_CLIENT_ID: !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    has_GOOGLE_CLIENT_SECRET: !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    baseUrl: baseUrl || null,
    locale: nextLocale,
  };
  console.log("[auth-debug] env:", JSON.stringify(debugEnv));

  // Expose env presence via a debug-only path so we can inspect from the browser
  // without needing access to Worker logs.
  if (req?.url && new URL(req.url).pathname.endsWith("/__debug")) {
    return new Response(JSON.stringify(debugEnv, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    return await NextAuth(req, ctx, {
    providers: [
      GoogleProvider({
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      }),
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
            const trxId = credentials?.trx_id;
            let payload = {};

            if (credentials?.email) {
              // Email OTP
              payload = {
                email: credentials.email,
                otp: credentials.otp,
                ...(trxId ? { trx_id: trxId } : {}),
              };
            } else if (credentials?.phone && credentials?.country_code) {
              // Phone OTP (with country code)
              payload = {
                country_code: credentials.country_code,
                phone: credentials.phone,
                otp: credentials.otp,
                ...(trxId ? { trx_id: trxId } : {}),
              };
            } else {
              throw new Error("Invalid login credentials");
            }

            // Use fetch (native, Workers-compatible) instead of axios.
            const verifyOtpResponse = await fetch(
              `${baseUrl}${OTP_VERIFY}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              }
            );

            if (!verifyOtpResponse.ok) {
              throw new Error("Invalid OTP");
            }

            const data = await verifyOtpResponse.json();
            const {
              token,
              first_name,
              last_name,
              image,
              phone,
              email,
            } = data?.data || {};

            if (!token) {
              throw new Error("Invalid OTP");
            }

            return {
              token,
              phone,
              first_name,
              last_name,
              image,
              email: email || "",
            };
          } catch (error) {
            console.error("Error verifying OTP:", error);
            throw new Error("Invalid OTP");
          }
        },
      }),
    ],
    callbacks: {
      async signIn({ user, account, profile }) {
        if (account?.provider === "google") {
          try {
            const socialLoginResponse = await fetch(
              `${baseUrl}${SOCIAL_LOGIN}`,
              {
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
              }
            );

            if (socialLoginResponse.ok) {
              const data = await socialLoginResponse.json();
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
            } else {
              console.error("Social login failed");
            }
          } catch (error) {
            console.error("Error during social login:", error);
          }
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
        }
        return token;
      },
      async session({ session, token }) {
        session.user.first_name = token.first_name;
        session.user.last_name = token.last_name;
        session.user.phone = token.phone;
        session.user.image = token.image;
        session.accessToken = token.accessToken;
        session.user.email = token.email;
        return session;
      },
    },
    session: {
      strategy: "jwt",
    },
    // NOTE: The previous `cookies: { session: { domain }, csrfToken: { domain } }`
    // config was malformed (NextAuth expects `sessionToken.options.domain`, not
    // `session.domain`). On Vercel it was silently ignored; on Cloudflare
    // Workers it could interact badly with cookie handling. Removed — NextAuth
    // will set its default cookies for the current host, which is what we want.
    jwt: {
      secret: process.env.NEXTAUTH_SECRET,
    },
    secret: process.env.NEXTAUTH_SECRET,
    });
  } catch (err) {
    // TEMP DEBUG: surface the real error so we can see what's crashing on
    // Cloudflare Workers (otherwise OpenNext just returns an empty 500).
    console.error("[auth-debug] crash:", err);
    return new Response(
      JSON.stringify({
        error: "auth_handler_crash",
        message: err?.message || String(err),
        name: err?.name || null,
        stack: err?.stack || null,
        env: debugEnv,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export { handler as GET, handler as POST };
