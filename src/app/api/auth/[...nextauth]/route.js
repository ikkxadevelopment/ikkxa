// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import axios from 'axios';
// import { OTP_VERIFY, SOCIAL_LOGIN } from "@/constants/apiRoutes";

// const handler = NextAuth({
//     providers: [
//         GoogleProvider({
//             clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
//             clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
//         }),
//         CredentialsProvider({
//             id: 'credentials',
//             name: 'credentials',
//             credentials: {
//                 country_code: { label: "Country Code", type: "text" },
//                 phone: { label: "Phone Number", type: "text" },
//                 email:{label:"email", type:"text"},
//                 otp: { label: "OTP", type: "text" },
//             },
//             async authorize(credentials, req) {
//                 try {

//                     let payload = {};

//                     if (credentials.email) {
//                         // Email OTP
//                         payload = {
//                             email: credentials.email,
//                             otp: credentials.otp,
//                         };
//                     } else if (credentials.phone && credentials.country_code) {
//                         // Phone OTP (with country code)
//                         payload = {
//                             country_code: credentials.country_code,
//                             phone: credentials.phone,
//                             otp: credentials.otp,
//                         };
//                     } else {
//                         throw new Error('Invalid login credentials');
//                     }

//                     const verifyOtpResponse = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}${OTP_VERIFY}`, payload);

//                     if (verifyOtpResponse.status === 200) {
//                         const { token, first_name, last_name, image, phone, email } = verifyOtpResponse.data?.data;
//                         return {
//                             token,
//                             phone,
//                             first_name,
//                             last_name,
//                             image,
//                             email: email || '',
//                         };
//                     } else {
//                         throw new Error('Invalid OTP');
//                     }
//                 } catch (error) {
//                     console.error('Error verifying OTP:', error);
//                     throw new Error('Invalid OTP');
//                 }
//             }
//         })
//     ],
//     callbacks: {
//         async signIn({ user, account, profile }) {
//             if (account.provider === 'google') {
//                 try {
//                     // Call the socialLogin API
//                     const socialLoginResponse = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}${SOCIAL_LOGIN}`, {
//                         uid: user.id,
//                         email: profile.email,
//                         phone:"",
//                         dob:"",
//                         gender:"",
//                         name: profile.name,
//                         image: profile.picture,
//                     });

//                     if (socialLoginResponse.status === 200) {
//                         const { token, first_name, last_name, image, phone, email, socials } = socialLoginResponse.data?.data;

//                         // Store response data in user object
//                         user.token = token;
//                         user.first_name = first_name;
//                         user.last_name = last_name;
//                         user.image = image;
//                         user.phone = phone;
//                         user.email = email;
//                         user.socials = socials;
//                         console.log('Social login successful:', socialLoginResponse.data);
//                     } else {
//                         console.error('Social login failed');
//                     }
//                 } catch (error) {
//                     console.error('Error during social login:', error);
//                 }
//             }
//             return true;
//         },
//         async jwt({ token, user, account, profile }) {
//             if (account && profile) {
//                 token.gender = profile.gender || null;
//                 token.dob = profile.birthday || null;
//             }
//             if (user) {
//                 token.accessToken = user.token;
//                 token.first_name = user.first_name;
//                 token.last_name = user.last_name;
//                 token.phone = user.phone;
//                 token.image = user.image;
//                 token.email = user.email;
//             }

//             return token;
//         },
//         async session({ session, token }) {
//             session.user.first_name = token.first_name;
//             session.user.last_name = token.last_name;
//             session.user.phone = token.phone;
//             session.user.image = token.image;
//             session.accessToken = token.accessToken;
//             session.user.email = token.email;
//             return session;
//         }
//     },
//     session: {
//         strategy: 'jwt',
//     },
//     jwt: {
//         secret: process.env.NEXTAUTH_SECRET,
//     },
//     secret: process.env.NEXTAUTH_SECRET,
// });

// export { handler as GET, handler as POST };

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { OTP_VERIFY, SOCIAL_LOGIN } from "@/constants/apiRoutes";

const handler = async (req, res) => {
  // Extract language from the URL
  const nextLocale = req.cookies.get("NEXT_LOCALE")?.value || "ar-SA";
  const [locale, country] = nextLocale.split("-");
  const baseUrl =
    country === "SA"
      ? process.env.NEXT_PUBLIC_API_BASE_URL_SA
      : process.env.NEXT_PUBLIC_API_BASE_URL_AE;

  return await NextAuth(req, res, {
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
        },
        async authorize(credentials, req) {
          try {
            const trxId = req.body.trx_id;
            let payload = {};

            if (credentials.email) {
              // Email OTP
              payload = {
                email: credentials.email,
                otp: credentials.otp,
                ...(trxId ? { trx_id: trxId } : {}),
              };
            } else if (credentials.phone && credentials.country_code) {
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

            const verifyOtpResponse = await axios.post(
              `${baseUrl}${OTP_VERIFY}`,
              payload
            );

            if (verifyOtpResponse.status === 200) {
              const { token, first_name, last_name, image, phone, email } =
                verifyOtpResponse.data?.data;
              return {
                token,
                phone,
                first_name,
                last_name,
                image,
                email: email || "",
              };
            } else {
              throw new Error("Invalid OTP");
            }
          } catch (error) {
            console.error("Error verifying OTP:", error);
            throw new Error("Invalid OTP");
          }
        },
      }),
    ],
    callbacks: {
      async signIn({ user, account, profile }) {
        if (account.provider === "google") {
          try {
            // Call the socialLogin API
            const socialLoginResponse = await axios.post(
              `${baseUrl}${SOCIAL_LOGIN}`,
              {
                uid: user.id,
                email: profile.email,
                phone: "",
                dob: "",
                gender: "",
                name: profile.name,
                image: profile.picture,
              }
            );

            if (socialLoginResponse.status === 200) {
              const {
                token,
                first_name,
                last_name,
                image,
                phone,
                email,
                socials,
              } = socialLoginResponse.data?.data;

              user.token = token;
              user.first_name = first_name;
              user.last_name = last_name;
              user.image = image;
              user.phone = phone;
              user.email = email;
              user.socials = socials;
              console.log("Social login successful:", socialLoginResponse.data);
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
    cookies: {
      // Set the cookie domain for session cookies (use your live domain)
      session: {
        domain: process.env.NEXTAUTH_URL?.replace(/^https?:\/\//, "") || undefined, // Use the value of NEXTAUTH_URL if available
      },
      csrfToken: {
        domain: process.env.NEXTAUTH_URL?.replace(/^https?:\/\//, "") || undefined,
      },
    },
    jwt: {
      secret: process.env.NEXTAUTH_SECRET,
    },
    secret: process.env.NEXTAUTH_SECRET,
  });
};

export { handler as GET, handler as POST };
