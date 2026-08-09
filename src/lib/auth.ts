
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

  trustedOrigins: ["http://localhost:3000", "http://localhost:3000"],

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "STUDENT",
        input: false,
      },
      phone: { type: "string", required: false, input: true },
    },
  },

  callbacks: {
    session: async ({ session, user }: { session: any; user: any }) => {
      return {
        ...session,
        user: {
          ...session.user,
          role: user.role,
          phone: user.phone,
        },
      };
    },
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: true,
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
      path: "/",
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
    authorize: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
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
          `${process.env.NEXT_PUBLIC_FRONTEND_URL}/verify-email`,
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
});
