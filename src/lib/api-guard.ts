import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return {
      error: NextResponse.json({ error: " Unauthorized" }, { status: 401 }),
    };
  }
  return { session };
}

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  if (session.user.role !== "admin") {
    return {
      error: NextResponse.json({ error: " Forbidden -Admin only" }, { status: 403 }),
    };
  }
  return { session };
}
