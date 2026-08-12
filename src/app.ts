// import { toNodeHandler } from "better-auth/node";
// import cors from "cors";
// import express from "express";
// import { auth } from "./lib/auth";
// import { categoryRoutes } from "./modules/categories/categories.routes";

// import cookieParser from "cookie-parser";
// import { notFound } from "./middleware/notFound";
// import { bookingRoutes } from "./modules/booking/booking.routes";
// import { reviewRoutes } from "./modules/review/review.routes";
// import { tutotRoutes } from "./modules/tutor/tutor.routes";
// import { userRoutes } from "./modules/user/user.routes";

// const app = express();
// // app.use(cors({
// //     origin:process.env.APP_URL,
// //     credentials:true

// // }))

// app.use(cookieParser());

// //Allowed origins

// const allowedOrigins = ["https://skillbridge-frontend-alpha.vercel.app", "https://skillbridge-frontend-alpha.vercel.app"];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       // Allow requests without an Origin header
//       // (Postman, server-to-server, etc.)
//       if (!origin) {
//         return callback(null, true);
//       }

//       const isAllowed =
//         allowedOrigins.includes(origin) ||
//         /^https:\/\/skillbridge-frontend-alpha.*\.vercel\.app$/.test(origin);

//       if (isAllowed) {
//         return callback(null, true);
//       }

//       console.warn(`Blocked CORS request from: ${origin}`);

//       return callback(new Error(`Origin ${origin} not allowed by CORS`));
//     },

//     credentials: true,

//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],

//     allowedHeaders: ["Content-Type", "Authorization", "Cookie"],

//     exposedHeaders: ["Set-Cookie"],
//   }),
// );

// // 3️⃣ Handle preflight OPTIONS for all route
// app.options(
//   /.*/,
//   cors({
//     origin: allowedOrigins,
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
//     exposedHeaders: ["Set-Cookie"],
//   }),
// );
// app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.get("/", (req, res) => {
//   res.send("SkillBridge Backend");
// });
// app.all("/api/auth/*splat", toNodeHandler(auth));

// app.use("/api/v1/categories", categoryRoutes);
// app.use("/api/v1/tutor", tutotRoutes);
// app.use("/api/v1/bookings", bookingRoutes);
// app.use("/api/v1/reviews", reviewRoutes);
// app.use("/api/v1/users", userRoutes);

// app.use(notFound);

// export default app;
import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { auth } from "./lib/auth";
import { notFound } from "./middleware/notFound";

import { bookingRoutes } from "./modules/booking/booking.routes";
import { categoryRoutes } from "./modules/categories/categories.routes";
import { reviewRoutes } from "./modules/review/review.routes";
import { tutotRoutes } from "./modules/tutor/tutor.routes";
import { userRoutes } from "./modules/user/user.routes";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://skillbridge-frontend-alpha.vercel.app",
  process.env.FRONTEND_URL,
].filter((origin): origin is string => Boolean(origin));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (
        /^https:\/\/skillbridge-frontend-alpha.*\.vercel\.app$/.test(
          origin,
        )
      ) {
        return callback(null, true);
      }

      console.log("Blocked CORS origin:", origin);

      return callback(
        new Error(`Origin ${origin} not allowed by CORS`),
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
    ],
  }),
);

app.use(cookieParser());

// Better Auth
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.get("/", (_req, res) => {
  res.send("SkillBridge Backend");
});

app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/tutor", tutotRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/users", userRoutes);

app.use(notFound);

export default app;