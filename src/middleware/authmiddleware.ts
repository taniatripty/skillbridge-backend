

// import { NextFunction, Request, Response } from "express";
// import { auth } from "../lib/auth";
// import { prisma } from "../lib/prisma";

// export enum UserRoles {
//   STUDENT = "STUDENT",
//   ADMIN = "ADMIN",
//   TUTOR = "TUTOR",
// }

// declare global {
//   namespace Express {
//     interface Request {
//       user?: {
//         id: string;
//         email: string;
//         name: string;
//         role: UserRoles;
//         emailVerified: boolean;
//         tutorProfileId?: string | null;
//       };
//     }
//   }
// }

// const authmiddleware = (...roles: UserRoles[]) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const headers = new Headers();

//       for (const [key, value] of Object.entries(req.headers)) {
//         if (typeof value === "string") {
//           headers.set(key, value);
//         } else if (Array.isArray(value)) {
//           headers.set(key, value.join(", "));
//         }
//       }

//       const session = await auth.api.getSession({
//         headers,
//       });

//       if (!session) {
//         return res.status(401).json({
//           success: false,
//           message: "Unauthorized. Please login.",
//         });
//       }

//       if (!session.user.emailVerified) {
//         return res.status(403).json({
//           success: false,
//           message: "Email not verified.",
//         });
//       }

//       // Check user status
//       const dbUser = await prisma.user.findUnique({
//         where: {
//           id: session.user.id,
//         },
//         select: {
//           status: true,
//           banReason: true,
//           banExpiresAt: true,
//         },
//       });

//       if (!dbUser) {
//         return res.status(404).json({
//           success: false,
//           message: "User not found.",
//         });
//       }

//       // BANNED USER
//       if (dbUser.status === "BANNED") {
//         // Check temporary ban expiration
//         if (
//           dbUser.banExpiresAt &&
//           new Date() > dbUser.banExpiresAt
//         ) {
//           await prisma.user.update({
//             where: {
//               id: session.user.id,
//             },
//             data: {
//               status: "ACTIVE",
//               banReason: null,
//               banExpiresAt: null,
//             },
//           });
//         } else {
//           return res.status(403).json({
//             success: false,
//             message:
//               dbUser.banReason ||
//               "Your account has been suspended.",
//           });
//         }
//       }

//       // Tutor profile
//       let tutorProfileId: string | null = null;

//       if (session.user.role === UserRoles.TUTOR) {
//         const tutorProfile = await prisma.tutorProfile.findUnique({
//           where: {
//             userId: session.user.id,
//           },
//           select: {
//             id: true,
//           },
//         });

//         if (!tutorProfile) {
//           return res.status(403).json({
//             success: false,
//             message: "Tutor profile not found.",
//           });
//         }

//         tutorProfileId = tutorProfile.id;
//       }

//       req.user = {
//         id: session.user.id,
//         email: session.user.email,
//         name: session.user.name,
//         role: session.user.role as UserRoles,
//         emailVerified: session.user.emailVerified,
//         tutorProfileId,
//       };

//       // Role check
//       if (
//         roles.length > 0 &&
//         !roles.includes(req.user.role)
//       ) {
//         return res.status(403).json({
//           success: false,
//           message: "Forbidden. Access denied.",
//         });
//       }

//       next();
//     } catch (error) {
//       console.error("Auth Middleware Error:", error);

//       return res.status(500).json({
//         success: false,
//         message: "Authentication failed.",
//       });
//     }
//   };
// };

// export default authmiddleware;

// import { NextFunction, Request, Response } from "express";
// import { auth } from "../lib/auth";
// import { prisma } from "../lib/prisma";

// export enum UserRoles {
//   STUDENT = "STUDENT",
//   ADMIN = "ADMIN",
//   TUTOR = "TUTOR",
// }

// declare global {
//   namespace Express {
//     interface Request {
//       user?: {
//         id: string;
//         email: string;
//         name: string;
//         role: UserRoles;
//         emailVerified: boolean;
//         tutorProfileId?: string | null;
//       };
//     }
//   }
// }

// const authmiddleware = (...roles: UserRoles[]) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       // Convert Express headers to Web Headers
//       const headers = new Headers();

//       for (const [key, value] of Object.entries(req.headers)) {
//         if (typeof value === "string") {
//           headers.set(key, value);
//         } else if (Array.isArray(value)) {
//           headers.set(key, value.join(", "));
//         }
//       }

//       // Get Better Auth session
//       const session = await auth.api.getSession({
//         headers,
//       });

//       if (!session) {
//         return res.status(401).json({
//           success: false,
//           message: "Unauthorized. Please login.",
//         });
//       }

//       // Email verification check
//       if (!session.user.emailVerified) {
//         return res.status(403).json({
//           success: false,
//           message: "Please verify your email first.",
//         });
//       }

//       // Get latest user status from database
//       const dbUser = await prisma.user.findUnique({
//         where: {
//           id: session.user.id,
//         },
//         select: {
//           status: true,
//           banReason: true,
//           banExpiresAt: true,
//         },
//       });

//       if (!dbUser) {
//         return res.status(404).json({
//           success: false,
//           message: "User not found.",
//         });
//       }

//       // =========================
//       // BAN CHECK
//       // =========================
//       if (dbUser.status === "BANNED") {
//         // Temporary ban expired
//         if (
//           dbUser.banExpiresAt &&
//           new Date() > dbUser.banExpiresAt
//         ) {
//           await prisma.user.update({
//             where: {
//               id: session.user.id,
//             },
//             data: {
//               status: "ACTIVE",
//               banReason: null,
//               banExpiresAt: null,
//             },
//           });
//         } else {
//           // Ban is still active
//           return res.status(403).json({
//             success: false,
//             message:
//               dbUser.banReason ||
//               "Your account has been suspended.",
//           });
//         }
//       }

//       // =========================
//       // TUTOR PROFILE
//       // =========================
//       let tutorProfileId: string | null = null;

//       if (session.user.role === UserRoles.TUTOR) {
//         const tutorProfile = await prisma.tutorProfile.findUnique({
//           where: {
//             userId: session.user.id,
//           },
//           select: {
//             id: true,
//           },
//         });

//         if (!tutorProfile) {
//           return res.status(403).json({
//             success: false,
//             message: "Tutor profile not found.",
//           });
//         }

//         tutorProfileId = tutorProfile.id;
//       }

//       // =========================
//       // ATTACH USER TO REQUEST
//       // =========================
//       req.user = {
//         id: session.user.id,
//         email: session.user.email,
//         name: session.user.name,
//         role: session.user.role as UserRoles,
//         emailVerified: session.user.emailVerified,
//         tutorProfileId,
//       };

//       // =========================
//       // ROLE CHECK
//       // =========================
//       if (
//         roles.length > 0 &&
//         !roles.includes(req.user.role)
//       ) {
//         return res.status(403).json({
//           success: false,
//           message: "Forbidden. Access denied.",
//         });
//       }

//       next();
//     } catch (error) {
//       console.error("Auth Middleware Error:", error);

//       return res.status(500).json({
//         success: false,
//         message: "Authentication failed.",
//       });
//     }
//   };
// };

// export default authmiddleware;

import { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

export enum UserRoles {
  STUDENT = "STUDENT",
  ADMIN = "ADMIN",
  TUTOR = "TUTOR",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: UserRoles;
        emailVerified: boolean;
        tutorProfileId?: string | null;
      };
    }
  }
}

const authmiddleware = (...roles: UserRoles[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // =====================================
      // CHECK COOKIES
      // =====================================

      console.log("Request Cookie Header:", req.headers.cookie);
      console.log("Parsed Cookies:", req.cookies);

      const sessionToken =
        req.cookies["__Secure-better-auth.session_token"] ||
        req.cookies["better-auth.session_token"] ||
        req.cookies["__Secure-session_token"] ||
        req.cookies["session_token"];

      if (!sessionToken) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized. Please login.",
        });
      }

      console.log("Session Token Found");

      // =====================================
      // GET BETTER AUTH SESSION
      // =====================================

      const cookieHeader = req.headers.cookie;

      if (!cookieHeader) {
        return res.status(401).json({
          success: false,
          message: "No authentication cookie found.",
        });
      }

      const headers = new Headers();

      headers.set("cookie", cookieHeader);

      const session = await auth.api.getSession({
        headers,
      });

      // =====================================
      // SESSION CHECK
      // =====================================

      if (!session) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired session.",
        });
      }

      // =====================================
      // EMAIL VERIFICATION
      // =====================================

      if (!session.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "Please verify your email first.",
        });
      }

      // =====================================
      // GET LATEST USER FROM DATABASE
      // =====================================

      const dbUser = await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          emailVerified: true,
          status: true,
          banReason: true,
          banExpiresAt: true,
        },
      });

      if (!dbUser) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      // =====================================
      // BAN CHECK
      // =====================================

      if (dbUser.status === "BANNED") {
        // Temporary ban expired
        if (
          dbUser.banExpiresAt &&
          new Date() > dbUser.banExpiresAt
        ) {
          await prisma.user.update({
            where: {
              id: dbUser.id,
            },
            data: {
              status: "ACTIVE",
              banReason: null,
              banExpiresAt: null,
            },
          });
        } else {
          return res.status(403).json({
            success: false,
            banned: true,
            message:
              dbUser.banReason ||
              "Your account has been suspended.",
          });
        }
      }

      // =====================================
      // TUTOR PROFILE
      // =====================================

      let tutorProfileId: string | null = null;

      if (dbUser.role === UserRoles.TUTOR) {
        const tutorProfile =
          await prisma.tutorProfile.findUnique({
            where: {
              userId: dbUser.id,
            },
            select: {
              id: true,
            },
          });

        if (!tutorProfile) {
          return res.status(403).json({
            success: false,
            message: "Tutor profile not found.",
          });
        }

        tutorProfileId = tutorProfile.id;
      }

      // =====================================
      // ATTACH USER TO REQUEST
      // =====================================

      req.user = {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role as UserRoles,
        emailVerified: dbUser.emailVerified,
        tutorProfileId,
      };

      // =====================================
      // ROLE CHECK
      // =====================================

      if (
        roles.length > 0 &&
        !roles.includes(req.user.role)
      ) {
        return res.status(403).json({
          success: false,
          message: "Forbidden. Access denied.",
        });
      }

      next();
    } catch (error) {
      console.error("Auth Middleware Error:", error);

      return res.status(500).json({
        success: false,
        message: "Authentication failed.",
      });
    }
  };
};

export default authmiddleware;