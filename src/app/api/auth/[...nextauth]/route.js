import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { OTP_VERIFY, SOCIAL_LOGIN } from "@/constants/apiRoutes";

// ---------------------------------------------------------------------------
// In-memory trace store so we can inspect the most recent NextAuth callback
// chain from outside the Worker (we can't reliably tap into runtime logs).
// Exposed via GET /api/auth/__debug-last.
// ---------------------------------------------------------------------------
const lastTrace = {
  steps: [],
  error: null,
};
const trace = (step, payload) => {
  try {
    lastTrace.steps.push({ step, t: Date.now(), payload });
    if (lastTrace.steps.length > 50) lastTrace.steps.shift();
    console.log(`[auth-trace] ${step}`, JSON.stringify(payload || {}));
  } catch (_) {
    /* noop */
  }
};

// Parse cookies from a Cookie header string.
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

  const debugEnv = {
    has_NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    has_NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || null,
    has_GOOGLE_CLIENT_ID: !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    has_GOOGLE_CLIENT_SECRET: !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    baseUrl: baseUrl || null,
    locale: nextLocale,
  };

  // /api/auth/__debug — env presence
  if (req?.url && new URL(req.url).pathname.endsWith("/__debug")) {
    return new Response(JSON.stringify(debugEnv, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  // /api/auth/__debug-last — trace from the most recent NextAuth call
  if (req?.url && new URL(req.url).pathname.endsWith("/__debug-last")) {
    return new Response(JSON.stringify(lastTrace, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Reset the trace for this request.
  lastTrace.steps = [];
  lastTrace.error = null;
  trace("request_in", { url: req?.url, method: req?.method, env: debugEnv });

  // Build providers list dynamically — drop GoogleProvider if env vars are
  // not present (otherwise provider init may misbehave on Workers).
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
        trace("authorize_start", { hasEmail: !!credentials?.email, hasPhone: !!credentials?.phone });
        try {
          const trxId = credentials?.trx_id;
          let payload = {};

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

          const verifyOtpResponse = await fetch(`${baseUrl}${OTP_VERIFY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          trace("authorize_fetch_done", {
            status: verifyOtpResponse.status,
            ok: verifyOtpResponse.ok,
          });

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

          trace("authorize_parsed", {
            hasToken: !!token,
            hasEmail: !!email,
            hasPhone: !!phone,
            hasFirstName: !!first_name,
            hasLastName: !!last_name,
          });

          if (!token) {
            throw new Error("Invalid OTP");
          }

          // NextAuth REQUIRES a user.id field for the JWT subject. Without
          // it the encode step can throw on some runtimes. Use the API
          // token (which is unique per user) as the stable id.
          const user = {
            id: String(token),
            token,
            phone: phone ?? "",
            first_name: first_name ?? "",
            last_name: last_name ?? "",
            image: image ?? "",
            email: email || "",
          };
          trace("authorize_return", { id_present: !!user.id });
          return user;
        } catch (error) {
          trace("authorize_error", { message: error?.message, name: error?.name });
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
  } else {
    trace("google_provider_skipped", {
      reason: "missing NEXT_PUBLIC_GOOGLE_CLIENT_ID or _SECRET",
    });
  }

  try {
    trace("nextauth_call_start");
    const result = await NextAuth(req, ctx, {
      providers,
      callbacks: {
        async signIn({ user, account, profile }) {
          trace("signIn_start", {
            provider: account?.provider,
            user_id: user?.id ?? null,
          });
          try {
            if (account?.provider === "google") {
              const socialLoginResponse = await fetch(`${baseUrl}${SOCIAL_LOGIN}`, {
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
              }
            }
            trace("signIn_done");
            return true;
          } catch (error) {
            trace("signIn_error", { message: error?.message, name: error?.name });
            console.error("signIn callback error:", error);
            return true; // still let user in via credentials
          }
        },
        async jwt({ token, user, account, profile }) {
          trace("jwt_start", {
            has_user: !!user,
            has_account: !!account,
            existing_sub: token?.sub ?? null,
          });
          try {
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
              // Force a string sub so JWE encoding can't choke on undefined.
              if (!token.sub && user.id) token.sub = String(user.id);
            }
            trace("jwt_done", { sub: token?.sub ?? null });
            return token;
          } catch (error) {
            trace("jwt_error", { message: error?.message, name: error?.name });
            console.error("jwt callback error:", error);
            throw error;
          }
        },
        async session({ session, token }) {
          trace("session_start");
          try {
            session.user = session.user || {};
            session.user.first_name = token.first_name;
            session.user.last_name = token.last_name;
            session.user.phone = token.phone;
            session.user.image = token.image;
            session.accessToken = token.accessToken;
            session.user.email = token.email;
            trace("session_done");
            return session;
          } catch (error) {
            trace("session_error", { message: error?.message, name: error?.name });
            console.error("session callback error:", error);
            return session;
          }
        },
      },
      session: { strategy: "jwt" },
      jwt: { secret: process.env.NEXTAUTH_SECRET },
      secret: process.env.NEXTAUTH_SECRET,
    });
    trace("nextauth_call_done", {
      status: result?.status ?? null,
      has_body: !!result?.body,
    });
    return result;
  } catch (err) {
    lastTrace.error = {
      message: err?.message || String(err),
      name: err?.name || null,
      stack: err?.stack || null,
    };
    trace("nextauth_crash", lastTrace.error);
    console.error("[auth-debug] crash:", err);
    return new Response(
      JSON.stringify(
        {
          error: "auth_handler_crash",
          ...lastTrace.error,
          env: debugEnv,
          steps: lastTrace.steps,
        },
        null,
        2
      ),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export { handler as GET, handler as POST };
