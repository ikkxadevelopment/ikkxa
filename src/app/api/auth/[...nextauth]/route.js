import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import { OTP_VERIFY, SOCIAL_LOGIN } from "@/constants/apiRoutes";

// ---------------------------------------------------------------------------
// Debug helpers — kept while we're stabilising on Cloudflare Workers.
// ---------------------------------------------------------------------------
const lastTrace = { steps: [], error: null };
const trace = (step, payload) => {
  try {
    lastTrace.steps.push({ step, t: Date.now(), payload });
    if (lastTrace.steps.length > 50) lastTrace.steps.shift();
    console.log(`[auth-trace] ${step}`, JSON.stringify(payload || {}));
  } catch (_) {}
};

const getBaseUrlFromLocale = () => {
  try {
    const c = cookies();
    const nextLocale = c.get("NEXT_LOCALE")?.value || "ar-SA";
    const [, country] = nextLocale.split("-");
    return {
      baseUrl:
        country === "SA"
          ? process.env.NEXT_PUBLIC_API_BASE_URL_SA
          : process.env.NEXT_PUBLIC_API_BASE_URL_AE,
      locale: nextLocale,
    };
  } catch (e) {
    return {
      baseUrl:
        process.env.NEXT_PUBLIC_API_BASE_URL_SA ||
        process.env.NEXT_PUBLIC_API_BASE_URL_AE ||
        process.env.NEXT_PUBLIC_BASE_URL,
      locale: "ar-SA",
    };
  }
};

// ---------------------------------------------------------------------------
// Static auth options — built once at module load, not per request. This is
// the canonical NextAuth v4 App Router pattern and is what works most
// reliably on Cloudflare Workers (the Pages-Router-style `NextAuth(req, ctx,
// options)` shape was being unstable post-authorize).
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
      // Reset per-request trace.
      lastTrace.steps = [];
      lastTrace.error = null;
      trace("authorize_start", {
        hasEmail: !!credentials?.email,
        hasPhone: !!credentials?.phone,
      });
      try {
        const { baseUrl, locale } = getBaseUrlFromLocale();
        trace("authorize_locale", { locale, baseUrl });

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

        if (!verifyOtpResponse.ok) throw new Error("Invalid OTP");

        const data = await verifyOtpResponse.json();
        const { token, first_name, last_name, image, phone, email } =
          data?.data || {};

        trace("authorize_parsed", {
          hasToken: !!token,
          hasEmail: !!email,
          hasPhone: !!phone,
        });

        if (!token) throw new Error("Invalid OTP");

        const user = {
          id: String(token),
          token: String(token),
          phone: phone ? String(phone) : "",
          first_name: first_name ? String(first_name) : "",
          last_name: last_name ? String(last_name) : "",
          image: image ? String(image) : "",
          email: email ? String(email) : "",
        };
        trace("authorize_return", { id_present: !!user.id });
        return user;
      } catch (error) {
        trace("authorize_error", {
          message: error?.message,
          name: error?.name,
        });
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
      trace("signIn_start", {
        provider: account?.provider,
        user_id: user?.id ?? null,
      });
      try {
        if (account?.provider === "google") {
          const { baseUrl } = getBaseUrlFromLocale();
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
          }
        }
        trace("signIn_done");
        return true;
      } catch (error) {
        trace("signIn_error", {
          message: error?.message,
          name: error?.name,
        });
        console.error("signIn callback error:", error);
        return true;
      }
    },
    async jwt({ token, user, account, profile }) {
      trace("jwt_start", {
        has_user: !!user,
        has_account: !!account,
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
          if (!token.sub && user.id) token.sub = String(user.id);
        }
        trace("jwt_done", { sub: token?.sub ?? null });
        return token;
      } catch (error) {
        trace("jwt_error", {
          message: error?.message,
          name: error?.name,
          stack: error?.stack?.slice(0, 500),
        });
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
        trace("session_error", {
          message: error?.message,
          name: error?.name,
        });
        console.error("session callback error:", error);
        return session;
      }
    },
  },
  session: { strategy: "jwt" },
  jwt: { secret: process.env.NEXTAUTH_SECRET },
  secret: process.env.NEXTAUTH_SECRET,
  // Surface NextAuth-internal errors so they bubble up to our wrapper.
  events: {
    async signIn(message) {
      trace("event_signIn", { user_id: message?.user?.id ?? null });
    },
    async session(message) {
      trace("event_session");
    },
  },
  logger: {
    error: (code, ...args) => {
      const msg = (args[0] instanceof Error ? args[0].message : String(args[0])) || "";
      const stack = args[0]?.stack || null;
      trace("logger_error", { code, message: msg, stack: stack?.slice(0, 800) });
      lastTrace.error = { code, message: msg, stack: stack?.slice(0, 800) };
      console.error(`[next-auth][error][${code}]`, ...args);
    },
    warn: (code) => {
      trace("logger_warn", { code });
    },
    debug: () => {},
  },
};

// The actual NextAuth handler — canonical App Router pattern.
const nextAuthHandler = NextAuth(authOptions);

const handler = async (req, ctx) => {
  // /api/auth/__debug — env presence check
  const url = req?.url ? new URL(req.url) : null;
  const pathname = url?.pathname || "";

  if (pathname.endsWith("/__debug")) {
    const debugEnv = {
      has_NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      has_NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || null,
      has_GOOGLE_CLIENT_ID: !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      has_GOOGLE_CLIENT_SECRET: !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      has_API_BASE_URL_SA: !!process.env.NEXT_PUBLIC_API_BASE_URL_SA,
      has_API_BASE_URL_AE: !!process.env.NEXT_PUBLIC_API_BASE_URL_AE,
      providers_count: providers.length,
      pattern: "canonical-app-router",
    };
    return new Response(JSON.stringify(debugEnv, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (pathname.endsWith("/__debug-last")) {
    return new Response(JSON.stringify(lastTrace, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  trace("request_in", { method: req?.method, pathname });

  try {
    const result = await nextAuthHandler(req, ctx);
    trace("nextauth_returned", {
      status: result?.status ?? null,
      has_set_cookie: !!result?.headers?.get?.("set-cookie"),
    });
    return result;
  } catch (err) {
    lastTrace.error = {
      message: err?.message || String(err),
      name: err?.name || null,
      stack: err?.stack?.slice(0, 2000) || null,
    };
    trace("nextauth_crash", lastTrace.error);
    console.error("[auth-debug] crash:", err);
    return new Response(
      JSON.stringify(
        {
          error: "auth_handler_crash",
          ...lastTrace.error,
          steps: lastTrace.steps,
        },
        null,
        2
      ),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export { handler as GET, handler as POST };
