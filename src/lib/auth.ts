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
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: ["http://localhost:3000","http://localhost:5000"],

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "STUDENT",
        required: true,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },


emailVerification: {
  sendOnSignUp: true,
  autoSignInAfterVerification:true,
  sendVerificationEmail: async ({ user, url }) => {
    await transporter.sendMail({
      from: `"Prisma SkillBridge" <${process.env.USER}>`,
      to: user.email,
      subject: "Verify your email",
      html: `
        <h2>Email Verification</h2>
        <p>Hello ${user.name},</p>
        <a href="${url}" style="padding:12px 24px;background:#2563eb;color:white;border-radius:6px;text-decoration:none">
          Verify Email
        </a>
        <p>${url}</p>
      `,
    });
  },
},

  socialProviders: {
    google: {
     
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  }
});
