// import { NextFunction, Request, Response } from "express";
// import { auth } from "../lib/auth";

// export enum UserRoles {
//      STUDENT = "STUDENT",
//     ADMIN = "ADMIN",
//     TUTOR="TUTOR"
// }
// declare global{
//     namespace Express{
//         interface Request{
//             user?:{
//                 id:string;
//                 email:string;
//                 name:string;
//                 role:UserRoles;
//                 emailVerified: boolean;
                  


//             }
//         }
//     }
// }

// const authmiddleware = (...roles: UserRoles[]) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//   try {
//       const session = await auth.api.getSession({
//       headers: req.headers as any,
//     });
//     if (!session) {
//       return res.status(401).json({
//         success: false,
//         message: "You are not authorized!",
//       });
//     }

//     if (!session.user.emailVerified) {
//       return res.status(403).json({
//         success: false,
//         message: "Email verification required. Please verfiy your email!",
//       });
//     }
//     req.user={
//         id:session.user.id,
//         email:session.user.email,
//         name:session.user.name,
//         role:session.user.role as UserRoles,
//         emailVerified:session.user.emailVerified
        

//     }

//      if (roles.length && !roles.includes(req.user.role as UserRoles)) {
//                 return res.status(403).json({
//                     success: false,
//                     message: "Forbidden! You don't have permission to access this resources!"
//                 })
//             }
//     next()
//   } catch (error) {
//     next(error)
    
//   }
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
      /* Fetch Tutor Profile  */
      /* -------------------- */
      let tutorProfileId: string | null = null;

      if (session.user.role === UserRoles.TUTOR) {
        const tutorProfile = await prisma.tutorProfile.findUnique({
          where: {
            userId: session.user.id,
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
