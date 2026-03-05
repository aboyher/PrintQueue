import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { status, priority, position, title, description } = body;

  const data: Record<string, unknown> = {};
  if (status !== undefined) {
    data.status = status;
    if (status === "done" || status === "cancelled") {
      data.completedAt = new Date();
    }
  }
  if (priority !== undefined) data.priority = priority;
  if (position !== undefined) data.position = position;
  if (title !== undefined) data.title = title;
  if (description !== undefined) data.description = description;

  const print = await prisma.printJob.update({
    where: { id },
    data,
    include: {
      requestedBy: true,
      comments: { include: { author: true } },
    },
  });
  return NextResponse.json(print);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.printJob.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
