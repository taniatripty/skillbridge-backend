

// import { NextFunction, Request, Response } from "express";
// import { auth } from "../lib/auth";
// import { prisma } from "../lib/prisma";


// export enum UserRoles {
//   STUDENT = "STUDENT",
//   ADMIN = "ADMIN",
//   TUTOR = "TUTOR",
// }

// /* -------------------- */
// /* Extend Express Types */
// /* -------------------- */
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

// /* -------------------- */
// /* Auth Middleware      */
// /* -------------------- */
// const authmiddleware = (...roles: UserRoles[]) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       /* -------------------- */
//       /* Get Session          */
//       /* -------------------- */
//       const session = await auth.api.getSession({
//         headers: req.headers as any,
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

//       /* -------------------- */
//       /* Fetch Tutor Profile  */
//       /* -------------------- */
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

//       /* -------------------- */
//       /* Attach User to Req   */
//       /* -------------------- */
//       req.user = {
//         id: session.user.id,
//         email: session.user.email,
//         name: session.user.name,
//         role: session.user.role as UserRoles,
//         emailVerified: session.user.emailVerified,
//         tutorProfileId,
//       };

//       /* -------------------- */
//       /* Role Guard           */
//       /* -------------------- */
//       if (roles.length && !roles.includes(req.user.role)) {
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

// /* -------------------- */
// /* Extend Express Types */
// /* -------------------- */
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

// /* -------------------- */
// /* Auth Middleware      */
// /* -------------------- */
// const authmiddleware = (...roles: UserRoles[]) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       /* -------------------- */
//       /* Get Session          */
//       /* -------------------- */
//       const session = await auth.api.getSession({
//         headers: req.headers as any,
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

//       /* -------------------- */
//       /* 🔴 Ban Check         */
//       /* -------------------- */
//       const dbUser = await prisma.user.findUnique({
//         where: { id: session.user.id },
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

//       if (dbUser.status === "BANNED") {
//         // Auto-unban if expired
//         if (
//           dbUser.banExpiresAt &&
//           new Date() > dbUser.banExpiresAt
//         ) {
//           await prisma.user.update({
//             where: { id: session.user.id },
//             data: {
//               status: "ACTIVE",
//               banReason: null,
//               banExpiresAt: null,
//             },
//           });
//         } else {
//           return res.status(403).json({
//             success: false,
//             message: `Account banned. Reason: ${dbUser.banReason}`,
//           });
//         }
//       }

//       /* -------------------- */
//       /* Fetch Tutor Profile  */
//       /* -------------------- */
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

//       /* -------------------- */
//       /* Attach User to Req   */
//       /* -------------------- */
//       req.user = {
//         id: session.user.id,
//         email: session.user.email,
//         name: session.user.name,
//         role: session.user.role as UserRoles,
//         emailVerified: session.user.emailVerified,
//         tutorProfileId,
//       };

//       /* -------------------- */
//       /* Role Guard           */
//       /* -------------------- */
//       if (roles.length && !roles.includes(req.user.role)) {
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

/* -------------------- */
/* User Roles Enum      */
/* -------------------- */
export enum UserRoles {
  STUDENT = "STUDENT",
  ADMIN = "ADMIN",
  TUTOR = "TUTOR",
}

/* -------------------- */
/* Extend Express Types */
/* -------------------- */
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

/* -------------------- */
/* Utility: Ban Check   */
/* -------------------- */
async function checkUserBan(userId: string) {
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      status: true,
      banReason: true,
      banExpiresAt: true,
    },
  });

  if (!dbUser) return { blocked: true, reason: "User not found" };

  if (dbUser.status === "BANNED") {
    // Auto-unban if ban expired
    if (dbUser.banExpiresAt && new Date() > dbUser.banExpiresAt) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          status: "ACTIVE",
          banReason: null,
          banExpiresAt: null,
        },
      });
      return { blocked: false };
    }

    return { blocked: true, reason: dbUser.banReason };
  }

  return { blocked: false };
}

/* -------------------- */
/* Auth Middleware      */
/* -------------------- */
const authmiddleware = (...roles: UserRoles[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      /* -------------------- */
      /* Get Session          */
      /* -------------------- */
      const session = await auth.api.getSession({
        headers: req.headers as any,
      });

      if (!session) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized. Please login.",
        });
      }

      if (!session.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "Email not verified.",
        });
      }

      /* -------------------- */
      /* 🔴 Ban Check         */
      /* -------------------- */
      const banCheck = await checkUserBan(session.user.id);

      if (banCheck.blocked) {
        return res.status(403).json({
          success: false,
          message: banCheck.reason
            ? `Account banned. Reason: ${banCheck.reason}`
            : "Your account has been suspended.",
        });
      }

      /* -------------------- */
      /* Fetch Tutor Profile  */
      /* -------------------- */
      let tutorProfileId: string | null = null;

      if (session.user.role === UserRoles.TUTOR) {
        const tutorProfile = await prisma.tutorProfile.findUnique({
          where: { userId: session.user.id },
          select: { id: true },
        });

        if (!tutorProfile) {
          return res.status(403).json({
            success: false,
            message: "Tutor profile not found.",
          });
        }

        tutorProfileId = tutorProfile.id;
      }

      /* -------------------- */
      /* Attach User to Req   */
      /* -------------------- */
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role as UserRoles,
        emailVerified: session.user.emailVerified,
        tutorProfileId,
      };

      /* -------------------- */
      /* Role Guard           */
      /* -------------------- */
      if (roles.length && !roles.includes(req.user.role)) {
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
