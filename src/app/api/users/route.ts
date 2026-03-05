import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const users = await prisma.user.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const { name, avatar } = await req.json();
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  const user = await prisma.user.upsert({
    where: { name: name.trim() },
    update: { avatar: avatar || undefined },
    create: { name: name.trim(), avatar: avatar || "🧑" },
  });
  return NextResponse.json(user);
}
