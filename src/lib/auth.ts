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
  trustedOrigins: ["http://localhost:3000"],

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
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verifyEmail = `${process.env.APP_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"prisma skillbridge" <prisma@gmail.com>',
          to: user.email,
          subject: "Email verification",
          text: `Hellow ${user.name} verified your email`,
          html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Verify Your Email</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f6f8;
        font-family: Arial, Helvetica, sans-serif;
      }
      .wrapper {
        width: 100%;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        margin: auto;
        background: #ffffff;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }
      h2 {
        color: #333333;
      }
      p {
        color: #555555;
        font-size: 15px;
        line-height: 1.6;
      }
      .btn {
        display: inline-block;
        margin-top: 20px;
        padding: 12px 24px;
        background-color: #2563eb;
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
      }
      .link {
        margin-top: 15px;
        word-break: break-all;
        color: #2563eb;
        font-size: 14px;
      }
      .footer {
        margin-top: 30px;
        text-align: center;
        font-size: 13px;
        color: #888888;
      }
    </style>
  </head>

  <body>
    <div class="wrapper">
      <div class="container">
        <h2>Email Verification</h2>

        <p>
          Thank you for registering at <strong>Prisma Blog</strong>.
          Please verify your email address to activate your account.
        </p>

        <a href="${verifyEmail}" class="btn">
          Verify Email
        </a>

        <p>If the button does not work, copy and paste this link:</p>

        <p class="link">${verifyEmail}</p>

        <p>
          This link will expire soon.  
          If you did not create this account, please ignore this email.
        </p>

        <div class="footer">
          © Prisma Blog. All rights reserved.
        </div>
      </div>
    </div>
  </body>
</html>
`, 
        });

        console.log("Message sent:", info.messageId);
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
  },
});
