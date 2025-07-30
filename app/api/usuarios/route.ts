import { NextResponse } from "next/server";
import { db } from "../../_lib/prisma";
import { User } from "@prisma/client";

export async function GET() {
  const users: User[] = await db.user.findMany();
  return NextResponse.json({ users });
}
