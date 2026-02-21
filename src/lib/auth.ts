// import { betterAuth } from "better-auth";
// import { prismaAdapter } from "better-auth/adapters/prisma";
// import nodemailer from "nodemailer";
// import { prisma } from "./prisma";

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.USER,
//     pass: process.env.PASSWORD,
//   },
// });

// export const auth = betterAuth({
//   database: prismaAdapter(prisma, {
//     provider: "postgresql",
//   }),
//   trustedOrigins: ["http://localhost:3000", "http://localhost:5000"],

//   user: {
//     additionalFields: {
//       role: {
//         type: "string",
//         defaultValue: "STUDENT",
//         required: true,
//       },
//       phone: {
//         type: "string",
//         required: false,
//       },
//       // status: {
//       //   type: "string",
//       //   defaultValue: "ACTIVE",
//       //   required: false,
//       // },
//     },
//   },
 

//   emailAndPassword: {
//     enabled: true,
//     autoSignIn: false,
//     requireEmailVerification: true,
//   },

//   emailVerification: {
//     sendOnSignUp: true,
//     autoSignInAfterVerification: true, 

  
//     sendVerificationEmail: async ({ user, url }) => {
//   try {
//     // Parse the URL safely
//     const verificationUrl = new URL(url);

//     // Set callbackURL safely (this will not break token)
//     verificationUrl.searchParams.set(
//       "callbackURL",
//       `${process.env.NEXT_PUBLIC_FRONTEND_URL}/verify-email`
//     );

//     const finalURL = verificationUrl.toString();

//     // Send email
//     await transporter.sendMail({
//       from: `"Prisma SkillBridge" <${process.env.USER}>`,
//       to: user.email,
//       subject: "Verify your email",
//       html: `
//         <h2>Email Verification</h2>
//         <p>Hello ${user.name},</p>
//         <a href="${finalURL}" style="padding:12px 24px;background:#2563eb;color:white;border-radius:6px;text-decoration:none">
//           Verify Email
//         </a>
//         <p>${finalURL}</p>
//       `,
//     });

//     console.log("Verification email sent to", user.email);
//   } catch (err) {
//     console.error("Error sending verification email:", err);
//   }
// }

//   },

//   socialProviders: {
//     google: {
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     },
//   },
// });

// import { betterAuth } from "better-auth";
// import { prismaAdapter } from "better-auth/adapters/prisma";
// import nodemailer from "nodemailer";
// import { prisma } from "./prisma";

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.USER,
//     pass: process.env.PASSWORD,
//   },
// });

// export const auth = betterAuth({
//   database: prismaAdapter(prisma, {
//     provider: "postgresql",
//   }),

//   trustedOrigins: [
//     "http://localhost:3000",
//     "http://localhost:5000",
//   ],

//   user: {
//     additionalFields: {
//       role: {
//         type: "string",
//         defaultValue: "STUDENT",
//         required: true,
//       },
//       phone: {
//         type: "string",
//         required: false,
//       },
//     },
//   },

// callbacks: {
//   async signIn({ user }:{ user: { id: string } }): Promise<boolean> {
//     const dbUser = await prisma.user.findUnique({
//       where: { id: user.id },
//       select: { status: true, banReason: true, banExpiresAt: true },
//     });

//     if (!dbUser) return false; // block login if user not found

//     // Auto-unban if expired
//     if (dbUser.status === "BANNED") {
//       if (dbUser.banExpiresAt && new Date() > dbUser.banExpiresAt) {
//         await prisma.user.update({
//           where: { id: user.id },
//           data: { status: "ACTIVE", banReason: null, banExpiresAt: null },
//         });
//         return true;
//       }

//       //  BLOCK LOGIN
//     //   (user as any).banMessage = dbUser.banReason || "Your account has been suspended.";
//     //   return false;
//     // }
//      throw new Error(
//         dbUser.banReason || "Your account has been suspended. Contact support."
//       );
//     }

//     return true;
//   },
// },

//   emailAndPassword: {
//     enabled: true,
//     autoSignIn: false,
//     requireEmailVerification: true,
//   },

//   emailVerification: {
//     sendOnSignUp: true,
//     autoSignInAfterVerification: true,

//     sendVerificationEmail: async ({ user, url }) => {
//       try {
//         const verificationUrl = new URL(url);

//         verificationUrl.searchParams.set(
//           "callbackURL",
//           `${process.env.NEXT_PUBLIC_FRONTEND_URL}/verify-email`
//         );

//         const finalURL = verificationUrl.toString();

//         await transporter.sendMail({
//           from: `"Prisma SkillBridge" <${process.env.USER}>`,
//           to: user.email,
//           subject: "Verify your email",
//           html: `
//             <h2>Email Verification</h2>
//             <p>Hello ${user.name},</p>
//             <a href="${finalURL}" 
//                style="padding:12px 24px;background:#2563eb;color:white;border-radius:6px;text-decoration:none">
//               Verify Email
//             </a>
//             <p>${finalURL}</p>
//           `,
//         });

//         console.log("Verification email sent to", user.email);
//       } catch (err) {
//         console.error("Error sending verification email:", err);
//       }
//     },
//   },

//   socialProviders: {
//     google: {
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     },
//   },
// });

// lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer from "nodemailer";
import { prisma } from "./prisma";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:5000",
    "https://skillbridge-backend-hazel.vercel.app"

  ],

  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "STUDENT", required: true },
      phone: { type: "string", required: false },
    },
  },

  // ------------------------
  // Email & Password Login
  // ------------------------
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,

    // This runs BEFORE session creation
    authorize: async ({ email, password }: { email: string; password: string }) => {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        throw new Error("Invalid credentials");
      }

      // 🔴 BLOCK BANNED USERS BEFORE SESSION
      if (user.status === "BANNED") {
        // Auto-unban if expired
        if (user.banExpiresAt && new Date() > user.banExpiresAt) {
          await prisma.user.update({
            where: { id: user.id },
            data: { status: "ACTIVE", banReason: null, banExpiresAt: null },
          });
        } else {
          throw new Error(user.banReason || "Your account has been suspended.");
        }
      }

      // Return object for BetterAuth to verify password
      return {
        id: user.id,
        email: user.email,
      };
    },
  },

  // ------------------------
  // Email Verification
  // ------------------------
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,

    sendVerificationEmail: async ({ user, url }) => {
      try {
        const verificationUrl = new URL(url);
        verificationUrl.searchParams.set(
          "callbackURL",
          `${process.env.NEXT_PUBLIC_FRONTEND_URL}/verify-email`
        );

        await transporter.sendMail({
          from: `"Prisma SkillBridge" <${process.env.USER}>`,
          to: user.email,
          subject: "Verify your email",
          html: `
            <h2>Email Verification</h2>
            <p>Hello ${user.name},</p>
            <a href="${verificationUrl.toString()}" 
               style="padding:12px 24px;background:#2563eb;color:white;border-radius:6px;text-decoration:none">
              Verify Email
            </a>
            <p>${verificationUrl.toString()}</p>
          `,
        });

        console.log("Verification email sent to", user.email);
      } catch (err) {
        console.error("Error sending verification email:", err);
      }
    },
  },

  // ------------------------
  // Social Login
  // ------------------------
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
