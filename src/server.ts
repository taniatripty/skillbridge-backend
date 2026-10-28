



import app from "./app";
import { prisma } from "./lib/prisma";

const port = process.env.PORT || 8080;

async function main() {
  try {
    // 1️⃣ Connect to database
    await prisma.$connect();
    console.log("Prisma connected successfully");

    // 2️⃣ Only start server in local development
    // Vercel automatically handles serverless deployment
    if (!process.env.VERCEL) {
      app.listen(port, () => {
        console.log(`Server running locally at http://localhost:${port}`);
      });
    }
  } catch (err) {
    console.error("Error occurred during startup:", err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Run the main function
main();

//  Export the app for Vercel serverless
export default app;