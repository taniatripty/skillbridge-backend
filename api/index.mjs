// src/app.ts
import express3 from "express";
import { toNodeHandler } from "better-auth/node";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer from "nodemailer";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel TutorProfile {\n  id           String   @id @default(uuid())\n  userId       String   @unique\n  hourlyRate   Float\n  experience   Int?\n  education    String?\n  languages    String[]\n  isVerified   Boolean  @default(false)\n  totalReviews Int      @default(0)\n  createdAt    DateTime @default(now())\n  updatedAt    DateTime @updatedAt\n\n  name  String?\n  email String?\n  image String?\n\n  // Relations\n  categories   TutorCategory[]\n  availability AvailabilitySlot[]\n  bookings     Booking[]\n  reviews      Review[]\n}\n\nmodel Category {\n  id        String   @id @default(uuid())\n  name      String   @unique\n  createdAt DateTime @default(now())\n\n  tutors TutorCategory[]\n}\n\nmodel TutorCategory {\n  tutorProfileId String\n  categoryId     String\n\n  tutorProfile TutorProfile @relation(fields: [tutorProfileId], references: [id])\n  category     Category     @relation(fields: [categoryId], references: [id])\n\n  @@id([tutorProfileId, categoryId])\n}\n\nmodel AvailabilitySlot {\n  id             String @id @default(uuid())\n  tutorProfileId String\n\n  dayOfWeek DayOfWeek\n  startTime String\n  endTime   String\n  isBooked  Boolean   @default(false)\n\n  createdAt DateTime @default(now())\n\n  // relations\n  bookings     Booking[]\n  tutorProfile TutorProfile @relation(fields: [tutorProfileId], references: [id])\n}\n\nmodel Booking {\n  id String @id @default(uuid())\n\n  studentId          String // references User.id\n  tutorProfileId     String\n  availabilitySlotId String\n\n  status      BookingStatus @default(CONFIRMED)\n  cancelledBy CancelledBy?\n  price       Float\n\n  createdAt DateTime @default(now())\n\n  // relations\n  availabilitySlot AvailabilitySlot @relation(fields: [availabilitySlotId], references: [id])\n\n  tutorProfile TutorProfile @relation(fields: [tutorProfileId], references: [id])\n  review       Review?\n}\n\nmodel Review {\n  id String @id @default(uuid())\n\n  bookingId      String @unique\n  studentId      String\n  tutorProfileId String\n\n  rating  Int\n  comment String?\n\n  createdAt DateTime @default(now())\n\n  // relations\n  booking      Booking      @relation(fields: [bookingId], references: [id])\n  tutorProfile TutorProfile @relation(fields: [tutorProfileId], references: [id])\n}\n\nenum BookingStatus {\n  CONFIRMED\n  COMPLETED\n  CANCELLED\n}\n\nenum CancelledBy {\n  STUDENT\n  TUTOR\n}\n\nenum DayOfWeek {\n  MON\n  TUE\n  WED\n  THU\n  FRI\n  SAT\n  SUN\n}\n\nmodel User {\n  id            String    @id\n  name          String\n  email         String\n  emailVerified Boolean   @default(false)\n  image         String?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n\n  role         String     @default("STUDENT")\n  phone        String?\n  status       UserStatus @default(ACTIVE)\n  banReason    String?\n  banExpiresAt DateTime?\n  banLogs      BanLog[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel BanLog {\n  id        String   @id @default(uuid())\n  reason    String\n  createdAt DateTime @default(now())\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nenum UserStatus {\n  ACTIVE\n  BANNED\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"TutorProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"hourlyRate","kind":"scalar","type":"Float"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"education","kind":"scalar","type":"String"},{"name":"languages","kind":"scalar","type":"String"},{"name":"isVerified","kind":"scalar","type":"Boolean"},{"name":"totalReviews","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"categories","kind":"object","type":"TutorCategory","relationName":"TutorCategoryToTutorProfile"},{"name":"availability","kind":"object","type":"AvailabilitySlot","relationName":"AvailabilitySlotToTutorProfile"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToTutorProfile"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToTutorProfile"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"tutors","kind":"object","type":"TutorCategory","relationName":"CategoryToTutorCategory"}],"dbName":null},"TutorCategory":{"fields":[{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorCategoryToTutorProfile"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToTutorCategory"}],"dbName":null},"AvailabilitySlot":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"dayOfWeek","kind":"enum","type":"DayOfWeek"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"isBooked","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"bookings","kind":"object","type":"Booking","relationName":"AvailabilitySlotToBooking"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"AvailabilitySlotToTutorProfile"}],"dbName":null},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"availabilitySlotId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"cancelledBy","kind":"enum","type":"CancelledBy"},{"name":"price","kind":"scalar","type":"Float"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"availabilitySlot","kind":"object","type":"AvailabilitySlot","relationName":"AvailabilitySlotToBooking"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"BookingToTutorProfile"},{"name":"review","kind":"object","type":"Review","relationName":"BookingToReview"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToReview"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"ReviewToTutorProfile"}],"dbName":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"role","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"banReason","kind":"scalar","type":"String"},{"name":"banExpiresAt","kind":"scalar","type":"DateTime"},{"name":"banLogs","kind":"object","type":"BanLog","relationName":"BanLogToUser"}],"dbName":"user"},"BanLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"reason","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"BanLogToUser"}],"dbName":null},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD
  }
});
var auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:5000"
  ],
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "STUDENT", required: true },
      phone: { type: "string", required: false }
    }
  },
  // ------------------------
  // Email & Password Login
  // ------------------------
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    // This runs BEFORE session creation
    authorize: async ({ email, password }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new Error("Invalid credentials");
      }
      if (user.status === "BANNED") {
        if (user.banExpiresAt && /* @__PURE__ */ new Date() > user.banExpiresAt) {
          await prisma.user.update({
            where: { id: user.id },
            data: { status: "ACTIVE", banReason: null, banExpiresAt: null }
          });
        } else {
          throw new Error(user.banReason || "Your account has been suspended.");
        }
      }
      return {
        id: user.id,
        email: user.email
      };
    }
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
          `
        });
        console.log("Verification email sent to", user.email);
      } catch (err) {
        console.error("Error sending verification email:", err);
      }
    }
  },
  // ------------------------
  // Social Login
  // ------------------------
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  }
});

// src/app.ts
import cors from "cors";

// src/modules/categories/categories.routes.ts
import { Router } from "express";

// src/modules/categories/categories.services.ts
var createCategory = async (name) => {
  const normalizedName = name.trim().toLowerCase().split(" ").map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  ).join(" ");
  const exists = await prisma.category.findUnique({
    where: { name: normalizedName }
  });
  if (exists) {
    throw new Error("Category already exists");
  }
  return prisma.category.create({
    data: {
      name: normalizedName
    }
  });
};
var getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: { createdAt: "desc" }
  });
};
var categoryservices = {
  createCategory,
  getAllCategories
};

// src/modules/categories/categories.controller.ts
var createCategory2 = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const category = await categoryservices.createCategory(name);
    res.status(201).json({
      success: true,
      data: category
    });
  } catch (er) {
    res.status(400).json({
      success: false,
      message: er.message
    });
  }
};
var getAllCategories2 = async (req, res) => {
  try {
    const categories = await categoryservices.getAllCategories();
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories"
    });
  }
};
var categoryController = {
  createCategory: createCategory2,
  getAllCategories: getAllCategories2
};

// src/middleware/authmiddleware.ts
async function checkUserBan(userId) {
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      status: true,
      banReason: true,
      banExpiresAt: true
    }
  });
  if (!dbUser) return { blocked: true, reason: "User not found" };
  if (dbUser.status === "BANNED") {
    if (dbUser.banExpiresAt && /* @__PURE__ */ new Date() > dbUser.banExpiresAt) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          status: "ACTIVE",
          banReason: null,
          banExpiresAt: null
        }
      });
      return { blocked: false };
    }
    return { blocked: true, reason: dbUser.banReason };
  }
  return { blocked: false };
}
var authmiddleware = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized. Please login."
        });
      }
      if (!session.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "Email not verified."
        });
      }
      const banCheck = await checkUserBan(session.user.id);
      if (banCheck.blocked) {
        return res.status(403).json({
          success: false,
          message: banCheck.reason ? `Account banned. Reason: ${banCheck.reason}` : "Your account has been suspended."
        });
      }
      let tutorProfileId = null;
      if (session.user.role === "TUTOR" /* TUTOR */) {
        const tutorProfile = await prisma.tutorProfile.findUnique({
          where: { userId: session.user.id },
          select: { id: true }
        });
        if (!tutorProfile) {
          return res.status(403).json({
            success: false,
            message: "Tutor profile not found."
          });
        }
        tutorProfileId = tutorProfile.id;
      }
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        emailVerified: session.user.emailVerified,
        tutorProfileId
      };
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden. Access denied."
        });
      }
      next();
    } catch (error) {
      console.error("Auth Middleware Error:", error);
      return res.status(500).json({
        success: false,
        message: "Authentication failed."
      });
    }
  };
};
var authmiddleware_default = authmiddleware;

// src/modules/categories/categories.routes.ts
var router = Router();
router.get("/", categoryController.getAllCategories);
router.post("/", authmiddleware_default("ADMIN" /* ADMIN */), categoryController.createCategory);
var categoryRoutes = router;

// src/modules/tutor/tutor.routes.ts
import express from "express";

// src/modules/tutor/tutor.services.ts
var createTutor = async (userId, payload) => {
  const existingTutor = await prisma.tutorProfile.findUnique({
    where: { userId }
  });
  if (existingTutor) {
    throw new Error("Tutor profile already exists");
  }
  const tutorData = {
    userId,
    hourlyRate: payload.hourlyRate,
    languages: payload.subjects,
    name: payload.name,
    email: payload.email,
    image: payload.image || null
  };
  if (payload.experience !== void 0) {
    tutorData.experience = payload.experience;
  }
  if (payload.education !== void 0) {
    tutorData.education = payload.education;
  }
  const tutorProfile = await prisma.tutorProfile.create({
    data: tutorData
  });
  await prisma.user.update({
    where: { id: userId },
    data: { role: "TUTOR" }
  });
  return tutorProfile;
};
var updateAvailability = async (userId, slots) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { userId }
  });
  if (!tutor) {
    throw new Error("Tutor profile not found");
  }
  await prisma.availabilitySlot.deleteMany({
    where: {
      tutorProfileId: tutor.id,
      isBooked: false
    }
  });
  await prisma.availabilitySlot.createMany({
    data: slots.map((slot) => ({
      tutorProfileId: tutor.id,
      dayOfWeek: slot.dayOfWeek,
      // ✅ Prisma enum
      startTime: slot.startTime,
      endTime: slot.endTime
    }))
  });
  return {
    success: true,
    message: "Availability updated successfully"
  };
};
var getAllTutors = async ({
  rating,
  hourlyRate,
  languages
}) => {
  const andConditions = [];
  if (hourlyRate !== void 0) {
    andConditions.push({ hourlyRate });
  }
  if (languages.length > 0) {
    andConditions.push({
      languages: {
        hasSome: languages
      }
    });
  }
  if (rating !== void 0) {
    const grouped = await prisma.review.groupBy({
      by: ["tutorProfileId"],
      _avg: { rating: true },
      having: {
        rating: {
          _avg: {
            gte: rating
          }
        }
      }
    });
    const tutorIds = grouped.map((g) => g.tutorProfileId);
    if (tutorIds.length === 0) {
      return [];
    }
    andConditions.push({
      id: { in: tutorIds }
    });
  }
  const tutors = await prisma.tutorProfile.findMany({
    where: {
      AND: andConditions
    },
    include: {
      availability: true,
      reviews: {
        select: { rating: true }
      }
    }
  });
  return tutors.map((tutor) => ({
    ...tutor,
    averageRating: tutor.reviews.length === 0 ? 0 : tutor.reviews.reduce((a, b) => a + b.rating, 0) / tutor.reviews.length
  }));
};
var getPopularTutors = async () => {
  const tutors = await prisma.tutorProfile.findMany({
    include: {
      reviews: {
        select: { rating: true }
      },
      availability: true
    }
  });
  const popularTutors = tutors.map((tutor) => ({
    ...tutor,
    averageRating: tutor.reviews.length === 0 ? 0 : tutor.reviews.reduce((sum, r) => sum + r.rating, 0) / tutor.reviews.length
  })).filter((tutor) => tutor.averageRating >= 4).sort((a, b) => b.averageRating - a.averageRating);
  return popularTutors;
};
var getTutorProfileById = async (tutorProfileId) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: {
      id: tutorProfileId
    },
    include: {
      availability: {
        select: {
          id: true,
          dayOfWeek: true,
          startTime: true,
          endTime: true,
          isBooked: true
        },
        orderBy: {
          dayOfWeek: "asc"
        }
      },
      reviews: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          studentId: true
        },
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });
  if (!tutor) {
    throw new Error("Tutor profile not found");
  }
  return tutor;
};
var tutorServices = {
  createTutor,
  updateAvailability,
  getAllTutors,
  getTutorProfileById,
  getPopularTutors
};

// src/modules/tutor/tutor.controller.ts
var createTutorProfile = async (req, res) => {
  try {
    const user = req?.user;
    const result = await tutorServices.createTutor(
      user?.id,
      req.body
    );
    res.status(201).json({
      success: true,
      message: "Tutor profile created successfully",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create tutor profile"
    });
  }
};
var updateAvailability2 = async (req, res) => {
  try {
    const user = req?.user;
    const userId = user?.id;
    const { availability } = req.body;
    if (!Array.isArray(availability)) {
      return res.status(400).json({
        success: false,
        message: "Availability must be an array"
      });
    }
    const result = await tutorServices.updateAvailability(
      userId,
      availability
    );
    res.status(200).json({
      success: true,
      data: result,
      message: "Availability updated successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var getAllTutors2 = async (req, res) => {
  try {
    const rating = typeof req.query.rating === "string" ? Number(req.query.rating) : void 0;
    const hourlyRate = typeof req.query.hourlyRate === "string" ? Number(req.query.hourlyRate) : void 0;
    const toTitleCase = (text) => text.trim().toLowerCase().split(" ").map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
    const languages = typeof req.query.languages === "string" ? req.query.languages.split(",").map((l) => toTitleCase(l)) : [];
    const tutors = await tutorServices.getAllTutors({
      rating,
      hourlyRate,
      languages
    });
    res.status(200).json({
      success: true,
      data: tutors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var getPopularTutors2 = async (req, res) => {
  try {
    const tutors = await tutorServices.getPopularTutors();
    res.status(200).json({
      success: true,
      data: tutors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var getTutorById = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const tutor = await tutorServices.getTutorProfileById(tutorId);
    res.status(200).json({
      success: true,
      data: tutor
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || "Tutor not found"
    });
  }
};
var tutorController = {
  createTutorProfile,
  updateAvailability: updateAvailability2,
  getAllTutors: getAllTutors2,
  getTutorById,
  getPopularTutors: getPopularTutors2
};

// src/modules/tutor/tutor.routes.ts
var router2 = express.Router();
router2.post(
  "/",
  authmiddleware_default("STUDENT" /* STUDENT */),
  tutorController.createTutorProfile
);
router2.put(
  "/availability",
  authmiddleware_default("TUTOR" /* TUTOR */),
  tutorController.updateAvailability
);
router2.get("/popular", tutorController.getPopularTutors);
router2.get("/:tutorId", tutorController.getTutorById);
router2.get("/", tutorController.getAllTutors);
var tutotRoutes = router2;

// src/modules/booking/booking.routes.ts
import express2 from "express";

// src/modules/booking/booking.services.ts
var createBooking = async (studentId, payload) => {
  const slot = await prisma.availabilitySlot.findUnique({
    where: { id: payload.availabilitySlotId }
  });
  if (!slot) {
    throw new Error("Availability slot not found");
  }
  if (slot.isBooked) {
    throw new Error("Slot already booked");
  }
  if (slot.tutorProfileId !== payload.tutorProfileId) {
    throw new Error("Invalid tutor-slot combination");
  }
  const booking = await prisma.$transaction(async (tx) => {
    const createdBooking = await tx.booking.create({
      data: {
        studentId,
        tutorProfileId: payload.tutorProfileId,
        availabilitySlotId: payload.availabilitySlotId,
        price: payload.price
      }
    });
    await tx.availabilitySlot.update({
      where: { id: payload.availabilitySlotId },
      data: { isBooked: true }
    });
    return createdBooking;
  });
  return booking;
};
var getBookingsByStudent = async (studentId) => {
  const bookings = await prisma.booking.findMany({
    where: {
      studentId
    },
    include: {
      tutorProfile: {
        select: {
          id: true,
          name: true,
          image: true,
          hourlyRate: true,
          languages: true
        }
      },
      // include slot info
      availabilitySlot: {
        select: {
          dayOfWeek: true,
          startTime: true,
          endTime: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return bookings;
};
var getBooking = async () => {
  const bookings = await prisma.booking.findMany({
    include: {
      tutorProfile: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          hourlyRate: true,
          languages: true
        }
      },
      // include slot info
      availabilitySlot: {
        select: {
          dayOfWeek: true,
          startTime: true,
          endTime: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return bookings;
};
var getStudentBookingStats = async (studentId) => {
  const user = await prisma.user.findUnique({
    where: { id: studentId },
    select: { status: true, banReason: true }
  });
  if (!user) {
    return {
      data: null,
      error: "User not found",
      banned: false,
      banReason: null
    };
  }
  if (user.status === "BANNED") {
    return {
      data: null,
      error: null,
      banned: true,
      banReason: user.banReason || "Your account has been suspended."
    };
  }
  const [total, confirmed, completed, cancelled] = await Promise.all([
    prisma.booking.count({ where: { studentId } }),
    prisma.booking.count({ where: { studentId, status: "CONFIRMED" } }),
    prisma.booking.count({ where: { studentId, status: "COMPLETED" } }),
    prisma.booking.count({ where: { studentId, status: "CANCELLED" } })
  ]);
  return {
    data: { total, confirmed, completed, cancelled },
    error: null,
    banned: false,
    banReason: null
  };
};
var getBookingByIdForStudent = async (bookingId, studentId) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      studentId
    },
    include: {
      tutorProfile: {
        select: {
          id: true,
          name: true,
          image: true,
          hourlyRate: true,
          languages: true
        }
      },
      availabilitySlot: {
        select: {
          dayOfWeek: true,
          startTime: true,
          endTime: true
        }
      }
    }
  });
  return booking;
};
var getBookingsByTutor = async (tutorProfileId) => {
  return await prisma.booking.findMany({
    where: {
      tutorProfileId
    },
    include: {
      availabilitySlot: {
        select: {
          dayOfWeek: true,
          startTime: true,
          endTime: true
        }
      },
      tutorProfile: {
        select: {
          name: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var getTutorStatistics = async (tutorProfileId, userId) => {
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { status: true, banReason: true, banExpiresAt: true }
  });
  if (!dbUser) {
    throw new Error("User not found");
  }
  if (dbUser.status === "BANNED") {
    if (dbUser.banExpiresAt && /* @__PURE__ */ new Date() > dbUser.banExpiresAt) {
      await prisma.user.update({
        where: { id: userId },
        data: { status: "ACTIVE", banReason: null, banExpiresAt: null }
      });
    } else {
      throw new Error(
        dbUser.banReason || "Your account is banned. Contact support."
      );
    }
  }
  const bookingGrouped = await prisma.booking.groupBy({
    by: ["status"],
    where: {
      tutorProfileId
    },
    _count: {
      status: true
    }
  });
  const bookingStats = {
    totalBookings: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  };
  bookingGrouped.forEach((item) => {
    bookingStats.totalBookings += item._count.status;
    switch (item.status) {
      case "CONFIRMED":
        bookingStats.confirmed = item._count.status;
        break;
      case "COMPLETED":
        bookingStats.completed = item._count.status;
        break;
      case "CANCELLED":
        bookingStats.cancelled = item._count.status;
        break;
    }
  });
  const reviewStats = await prisma.review.aggregate({
    where: { tutorProfileId },
    _count: { id: true },
    _avg: { rating: true }
  });
  return {
    bookings: bookingStats,
    reviews: {
      totalReviews: reviewStats._count.id,
      averageRating: reviewStats._avg.rating ? Number(reviewStats._avg.rating.toFixed(1)) : 0
    }
  };
};
var updateBookingStatus = async (bookingId, tutorProfileId, status) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId }
  });
  if (!booking) {
    throw new Error("Booking not found");
  }
  if (booking.tutorProfileId !== tutorProfileId) {
    throw new Error("You can only update your own bookings");
  }
  return await prisma.booking.update({
    where: { id: bookingId },
    data: { status }
  });
};
var cancelBooking = async (bookingId, studentId) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId }
  });
  if (!booking) {
    throw new Error("Booking not found");
  }
  if (booking.studentId !== studentId) {
    throw new Error("You are not allowed to cancel this booking");
  }
  await prisma.availabilitySlot.update({
    where: { id: booking.availabilitySlotId },
    data: { isBooked: false }
  });
  await prisma.booking.delete({
    where: { id: bookingId }
  });
  return { id: bookingId };
};
var bookingServices = {
  createBooking,
  getBooking,
  getBookingsByStudent,
  getStudentBookingStats,
  getBookingByIdForStudent,
  getBookingsByTutor,
  getTutorStatistics,
  cancelBooking,
  updateBookingStatus
};

// src/modules/booking/booking.controller.ts
var createBooking2 = async (req, res) => {
  try {
    const studentId = req?.user?.id;
    const { tutorProfileId, availabilitySlotId, price } = req.body;
    if (!tutorProfileId || !availabilitySlotId || !price) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }
    const booking = await bookingServices.createBooking(studentId, {
      tutorProfileId,
      availabilitySlotId,
      price
    });
    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var getMyBookings = async (req, res) => {
  try {
    const studentId = req?.user?.id;
    const bookings = await bookingServices.getBookingsByStudent(studentId);
    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var getBookings = async (req, res) => {
  try {
    ;
    const bookings = await bookingServices.getBooking();
    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var getMyBookingStats = async (req, res) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User not found."
      });
    }
    const stats = await bookingServices.getStudentBookingStats(studentId);
    if (stats.banned) {
      return res.status(403).json({
        success: false,
        message: stats.banReason || "Your account has been suspended."
      });
    }
    res.status(200).json({
      success: true,
      data: stats.data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var getTutorBookings = async (req, res) => {
  try {
    const tutorProfileId = req.user?.tutorProfileId;
    if (!tutorProfileId) {
      return res.status(403).json({
        success: false,
        message: "Tutor profile not found"
      });
    }
    const bookings = await bookingServices.getBookingsByTutor(
      tutorProfileId
    );
    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var getTutorStatistics2 = async (req, res) => {
  try {
    const tutorProfileId = req.user?.tutorProfileId;
    const userId = req.user?.id;
    if (!tutorProfileId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Tutor profile or user not found"
      });
    }
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { status: true, banReason: true, banExpiresAt: true }
    });
    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    if (dbUser.status === "BANNED") {
      if (dbUser.banExpiresAt && /* @__PURE__ */ new Date() > dbUser.banExpiresAt) {
        await prisma.user.update({
          where: { id: userId },
          data: { status: "ACTIVE", banReason: null, banExpiresAt: null }
        });
      } else {
        return res.status(403).json({
          success: false,
          message: dbUser.banReason || "Your account has been banned. Contact support."
        });
      }
    }
    const stats = await bookingServices.getTutorStatistics(
      tutorProfileId,
      userId
    );
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong"
    });
  }
};
var getBookingById = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const studentId = req?.user?.id;
    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required"
      });
    }
    const booking = await bookingServices.getBookingByIdForStudent(
      bookingId,
      studentId
    );
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }
    return res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong"
    });
  }
};
var cancelBooking2 = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const studentId = req.user?.id;
    const result = await bookingServices.cancelBooking(
      bookingId,
      studentId
    );
    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var updateBookingStatus2 = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body;
    const tutorProfileId = req.user?.tutorProfileId;
    if (!["CANCELLED", "COMPLETED"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
    const updatedBooking = await bookingServices.updateBookingStatus(
      bookingId,
      tutorProfileId,
      status
    );
    res.status(200).json({ success: true, data: updatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var bookingController = {
  createBooking: createBooking2,
  getBookings,
  getMyBookings,
  getMyBookingStats,
  getBookingById,
  cancelBooking: cancelBooking2,
  getTutorBookings,
  getTutorStatistics: getTutorStatistics2,
  updateBookingStatus: updateBookingStatus2
};

// src/modules/booking/booking.routes.ts
var router3 = express2.Router();
router3.post(
  "/",
  authmiddleware_default("STUDENT" /* STUDENT */),
  bookingController.createBooking
);
router3.get(
  "/",
  authmiddleware_default("STUDENT" /* STUDENT */),
  bookingController.getMyBookings
);
router3.get(
  "/all",
  authmiddleware_default("ADMIN" /* ADMIN */),
  bookingController.getBookings
);
router3.get(
  "/my/status",
  authmiddleware_default("STUDENT" /* STUDENT */),
  bookingController.getMyBookingStats
);
router3.get(
  "/tutor/statistics",
  authmiddleware_default("TUTOR" /* TUTOR */),
  bookingController.getTutorStatistics
);
router3.get("/tutorbooking", authmiddleware_default("TUTOR" /* TUTOR */), bookingController.getTutorBookings);
router3.patch("/:id/status", authmiddleware_default("TUTOR" /* TUTOR */), bookingController.updateBookingStatus);
router3.get("/:id", authmiddleware_default("STUDENT" /* STUDENT */, "TUTOR" /* TUTOR */), bookingController.getBookingById);
router3.delete(
  "/:id",
  authmiddleware_default("STUDENT" /* STUDENT */, "ADMIN" /* ADMIN */),
  bookingController.cancelBooking
);
var bookingRoutes = router3;

// src/modules/review/review.routes.ts
import { Router as Router2 } from "express";

// src/modules/review/review.services.ts
var createReview = async ({
  bookingId,
  studentId,
  rating,
  comment
}) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId }
  });
  if (!booking) throw new Error("Booking not found");
  if (booking.studentId !== studentId) {
    throw new Error("Unauthorized booking access");
  }
  if (booking.status !== "COMPLETED") {
    throw new Error("You can only review completed bookings");
  }
  const existingReview = await prisma.review.findUnique({
    where: { bookingId }
  });
  if (existingReview) {
    throw new Error("Review already submitted");
  }
  return prisma.review.create({
    data: {
      bookingId,
      studentId,
      tutorProfileId: booking.tutorProfileId,
      rating,
      ...comment ? { comment } : {}
    }
  });
};
var getReviewsForTutor = async (tutorProfileId) => {
  return prisma.review.findMany({
    where: {
      tutorProfileId
    },
    include: {
      booking: {
        select: {
          id: true,
          createdAt: true
        }
      },
      tutorProfile: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var getAllReviewsForTutor = async () => {
  return prisma.review.findMany({
    include: {
      booking: {
        select: {
          id: true,
          createdAt: true
        }
      },
      tutorProfile: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var reviewServices = {
  createReview,
  getReviewsForTutor,
  getAllReviewsForTutor
};

// src/modules/review/review.controller.ts
var createReview2 = async (req, res) => {
  try {
    const studentId = req.user?.id;
    const bookingIdParam = req.params.bookingId;
    const { rating, comment } = req.body;
    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    if (!bookingIdParam || Array.isArray(bookingIdParam)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking id"
      });
    }
    const bookingId = bookingIdParam;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5"
      });
    }
    const review = await reviewServices.createReview({
      bookingId,
      studentId,
      rating,
      comment
    });
    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: review
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var getLoggedTutorReviews = async (req, res) => {
  try {
    const tutorProfileId = req.user?.tutorProfileId;
    if (!tutorProfileId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const reviews = await reviewServices.getReviewsForTutor(
      tutorProfileId
    );
    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var getAllTutorReviews = async (req, res) => {
  try {
    const reviews = await reviewServices.getAllReviewsForTutor();
    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var reviewController = {
  createReview: createReview2,
  getLoggedTutorReviews,
  getAllTutorReviews
};

// src/modules/review/review.routes.ts
var router4 = Router2();
router4.post(
  "/:bookingId",
  authmiddleware_default("STUDENT" /* STUDENT */),
  reviewController.createReview
);
router4.get(
  "/tutor",
  authmiddleware_default("TUTOR" /* TUTOR */),
  reviewController.getLoggedTutorReviews
);
router4.get(
  "/all",
  reviewController.getAllTutorReviews
);
var reviewRoutes = router4;

// src/modules/user/user.routes.ts
import { Router as Router3 } from "express";

// src/modules/user/user.services.ts
var getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      phone: true,
      status: true,
      createdAt: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var banUser = async (userId, reason, days) => {
  if (!reason.trim()) {
    throw new Error("Ban reason is required");
  }
  if (!days || days <= 0) {
    throw new Error("Ban days must be greater than 0");
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      status: true
    }
  });
  if (!user) {
    throw new Error("User not found");
  }
  if (user.status === "BANNED") {
    throw new Error("User already banned");
  }
  const banExpiresAt = /* @__PURE__ */ new Date();
  banExpiresAt.setDate(banExpiresAt.getDate() + days);
  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: {
        status: "BANNED",
        banReason: reason,
        banExpiresAt
      }
    });
    await tx.banLog.create({
      data: {
        userId,
        reason
      }
    });
  });
  return {
    success: true,
    expiresAt: banExpiresAt
  };
};
var unbanUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!user) {
    throw new Error("User not found");
  }
  if (user.status !== "BANNED") {
    throw new Error("User is not banned");
  }
  await prisma.user.update({
    where: { id: userId },
    data: {
      status: "ACTIVE",
      banReason: null,
      banExpiresAt: null
    }
  });
  return true;
};
var getDashboardStats = async () => {
  const [
    totalUsers,
    totalStudents,
    totalTutors,
    totalAdmins
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.user.count({ where: { role: "STUDENT" /* STUDENT */ } }),
    prisma.user.count({ where: { role: "TUTOR" /* TUTOR */ } }),
    prisma.user.count({ where: { role: "ADMIN" /* ADMIN */ } })
  ]);
  const [
    totalBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
    prisma.booking.count({ where: { status: "COMPLETED" } }),
    prisma.booking.count({ where: { status: "CANCELLED" } })
  ]);
  return {
    user: {
      totalUsers,
      totalStudents,
      totalTutors,
      totalAdmins
    },
    bookings: {
      totalBookings,
      confirmed: confirmedBookings,
      completed: completedBookings,
      cancelled: cancelledBookings
    }
  };
};
var updateProfile = async ({
  userId,
  name,
  email,
  phone,
  image
}) => {
  const data = {};
  if (name?.trim()) data.name = name;
  if (phone?.trim()) data.phone = phone;
  if (image?.trim()) data.image = image;
  if (email?.trim()) {
    const exists = await prisma.user.findUnique({
      where: { email }
    });
    if (exists && exists.id !== userId) {
      throw new Error("Email already in use");
    }
    data.email = email;
  }
  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      image: true,
      updatedAt: true
    }
  });
};
var userService = {
  getAllUsers,
  updateProfile,
  banUser,
  unbanUser,
  getDashboardStats
};

// src/modules/user/user.controller.ts
var getAllUsers2 = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    });
  }
};
var banUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, days } = req.body;
    if (!reason || !days) {
      return res.status(400).json({
        success: false,
        message: "Reason and days are required."
      });
    }
    await userService.banUser(id, reason, Number(days));
    return res.status(200).json({
      success: true,
      message: "User banned successfully."
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var unbanUserController = async (req, res) => {
  try {
    const { id } = req.params;
    await userService.unbanUser(id);
    return res.status(200).json({
      success: true,
      message: "User unbanned successfully."
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var updateProfile2 = async (req, res) => {
  try {
    const user = req?.user;
    const userId = user?.id;
    const { name, email, phone, image } = req.body;
    const updatedUser = await userService.updateProfile({
      userId,
      name,
      email,
      phone,
      image
    });
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile"
    });
  }
};
var getAdminDashboardStats = async (req, res) => {
  try {
    const stats = await userService.getDashboardStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var userController = {
  getAllUsers: getAllUsers2,
  updateProfile: updateProfile2,
  banUserController,
  unbanUserController,
  getAdminDashboardStats
};

// src/modules/user/user.routes.ts
var router5 = Router3();
router5.get(
  "/",
  authmiddleware_default("ADMIN" /* ADMIN */),
  userController.getAllUsers
);
router5.get(
  "/all",
  userController.getAdminDashboardStats
);
router5.patch(
  "/ban/:id",
  authmiddleware_default("ADMIN" /* ADMIN */),
  userController.banUserController
);
router5.patch(
  "/unban/:id",
  authmiddleware_default("ADMIN" /* ADMIN */),
  userController.unbanUserController
);
router5.patch("/profile", authmiddleware_default("STUDENT" /* STUDENT */, "TUTOR" /* TUTOR */, "ADMIN" /* ADMIN */), userController.updateProfile);
var userRoutes = router5;

// src/middleware/notFound.ts
function notFound(req, res) {
  res.status(404).json({
    message: "Route not found!",
    path: req.originalUrl,
    date: Date()
  });
}

// src/app.ts
var app = express3();
app.use(cors({
  origin: process.env.APP_URL,
  credentials: true
}));
app.use(express3.json());
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/categories", categoryRoutes);
app.use("/api/tutor", tutotRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);
app.use(notFound);
app.get("/", (req, res) => {
  res.send("SkillBridge Backend");
});
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
