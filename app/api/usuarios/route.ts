import { NextResponse } from "next/server";
import { db } from "../../_lib/prisma";
import { User } from "@prisma/client";

export async function GET() {
  const users: User[] = await db.user.findMany({
    orderBy: { id: "asc" },
  });
  return NextResponse.json(users);
}
