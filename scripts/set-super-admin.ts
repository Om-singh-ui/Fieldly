// scripts/set-super-admin.ts

import { prisma } from "../lib/prisma";

async function setSuperAdmin(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        role: "SUPER_ADMIN",
        isOnboarded: true,
      },
    });

    console.log(` User ${email} is now a SUPER_ADMIN`);
    console.log(`   ID: ${updatedUser.id}`);
    console.log(`   Role: ${updatedUser.role}`);
  } catch (error) {
    console.error("Error setting super admin:", error);
    process.exit(1);
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.error("Usage: npx tsx scripts/set-super-admin.ts <email>");
  process.exit(1);
}

setSuperAdmin(email);