"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export async function setupAdmin() {
  try {
    // Check if any user already exists
    const userCount = await prisma.user.count();
    
    if (userCount > 0) {
      return {
        success: false,
        message: "An admin user already exists. Setup is locked.",
      };
    }

    const email = "admin@akama.com";
    const password = uuidv4().substring(0, 8); // Generate a 12-char random-ish password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "admin",
      },
    });

    return {
      success: true,
      data: {
        email: user.email,
        password: password, // Send the plain password back for display
      },
    };
  } catch (error: any) {
    console.error("Setup error:", error);
    return {
      success: false,
      message: error.message || "Something went wrong during setup.",
    };
  }
}
