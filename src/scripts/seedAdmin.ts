import { prisma } from "../lib/prisma";
import { UserRoles } from "../middleware/authmiddleware";

async function seedAdmin() {
  try {
    const adminData = {
      name: process.env.ADMIN_NAME!,
      email: process.env.ADMIN_EMAIL!,
      password: process.env.ADMIN_PASSWORD!,
      role: UserRoles.ADMIN,
    };

    // check user exist on db or not
    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (existingUser) {
      console.error("User already exists!!");
      return;
    }

    const signUpAdmin = await fetch(
      " https://skillbridge-backend-nine.vercel.app/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          origin: "https://skillbridge-frontend-alpha.vercel.app",
        },

        body: JSON.stringify(adminData),
      },
    );
    if (signUpAdmin.ok) {
      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });
      // console.log(' emailvarifiend status updated')
    }

    console.log(signUpAdmin);
  } catch (e) {
    console.error(e);
  }
}

seedAdmin();
