import { prisma } from "../lib/prisma";


export async function checkUserBan(userId: string): Promise<{
  blocked: boolean;
  reason?: string | null;
}> {
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      status: true,
      banReason: true,
      banExpiresAt: true,
    },
  });

  if (!dbUser) {
    return { blocked: true };
  }

  if (dbUser.status === "BANNED") {
    // Auto-unban if expired
    if (
      dbUser.banExpiresAt &&
      new Date() > dbUser.banExpiresAt
    ) {
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

    return {
      blocked: true,
      reason: dbUser.banReason,
    };
  }

  return { blocked: false };
}
