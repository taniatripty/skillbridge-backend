import { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth";

export enum UserRoles {
     USER = "USER",
    ADMIN = "ADMIN"
}
declare global{
    namespace Express{
        interface Request{
            user?:{
                id:string;
                email:string;
                name:string;
                role:UserRoles;
                emailVerified: boolean;


            }
        }
    }
}

const authmiddleware = (...roles: UserRoles[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
  try {
      const session = await auth.api.getSession({
      headers: req.headers as any,
    });
    if (!session) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized!",
      });
    }

    if (!session.user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Email verification required. Please verfiy your email!",
      });
    }
    req.user={
        id:session.user.id,
        email:session.user.email,
        name:session.user.name,
        role:session.user.role as UserRoles,
        emailVerified:session.user.emailVerified

    }

     if (roles.length && !roles.includes(req.user.role as UserRoles)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden! You don't have permission to access this resources!"
                })
            }
    next()
  } catch (error) {
    next(error)
    
  }
  };
};

export default authmiddleware;