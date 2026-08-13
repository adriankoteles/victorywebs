"use server";

import { cookies } from "next/headers";

export async function loginAdminAction(password: string) {
  // Zkontrolujeme heslo proti proměnné prostředí
  const adminPassword = process.env.ADMIN_PASSWORD || "victory123";

  if (password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 dní
      path: "/",
    });
    return { success: true };
  }

  return { success: false };
}


