import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status");
  const where = status ? { status } : {};

  const prints = await prisma.printJob.findMany({
    where,
    include: {
      requestedBy: true,
      comments: { include: { author: true }, orderBy: { createdAt: "asc" } },
    },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json(prints);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, url, thumbnailUrl, description, priority, userId } = body;

  if (!title || !userId) {
    return NextResponse.json(
      { error: "Title and userId are required" },
      { status: 400 }
    );
  }

  const maxPosition = await prisma.printJob.aggregate({
    _max: { position: true },
    where: { status: { in: ["queued", "printing"] } },
  });

  const print = await prisma.printJob.create({
    data: {
      title,
      url: url || null,
      thumbnailUrl: thumbnailUrl || null,
      description: description || null,
      priority: priority || "normal",
      position: (maxPosition._max.position ?? -1) + 1,
      userId,
    },
    include: {
      requestedBy: true,
      comments: { include: { author: true } },
    },
  });
  return NextResponse.json(print, { status: 201 });
}
