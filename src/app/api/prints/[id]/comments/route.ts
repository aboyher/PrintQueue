import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { text, userId } = await req.json();

  if (!text || !userId) {
    return NextResponse.json(
      { error: "text and userId are required" },
      { status: 400 }
    );
  }

  const comment = await prisma.comment.create({
    data: { text, printJobId: id, userId },
    include: { author: true },
  });
  return NextResponse.json(comment, { status: 201 });
}
