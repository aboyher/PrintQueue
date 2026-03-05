import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [totalPrints, queued, printing, done, cancelled, users, recentPrints] =
    await Promise.all([
      prisma.printJob.count(),
      prisma.printJob.count({ where: { status: "queued" } }),
      prisma.printJob.count({ where: { status: "printing" } }),
      prisma.printJob.count({ where: { status: "done" } }),
      prisma.printJob.count({ where: { status: "cancelled" } }),
      prisma.user.findMany({
        include: { _count: { select: { prints: true } } },
        orderBy: { prints: { _count: "desc" } },
      }),
      prisma.printJob.findMany({
        where: { status: "done", completedAt: { not: null } },
        orderBy: { completedAt: "desc" },
        take: 50,
        include: { requestedBy: true },
      }),
    ]);

  // Prints per week (last 8 weeks)
  const eightWeeksAgo = new Date();
  eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);
  const completedRecently = await prisma.printJob.findMany({
    where: {
      status: "done",
      completedAt: { gte: eightWeeksAgo },
    },
    select: { completedAt: true },
  });

  const weeklyData: Record<string, number> = {};
  for (const p of completedRecently) {
    if (!p.completedAt) continue;
    const d = new Date(p.completedAt);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    const key = weekStart.toISOString().split("T")[0];
    weeklyData[key] = (weeklyData[key] || 0) + 1;
  }

  // Top requesters
  const topRequesters = users.map((u) => ({
    name: u.name,
    avatar: u.avatar,
    count: u._count.prints,
  }));

  return NextResponse.json({
    totalPrints,
    queued,
    printing,
    done,
    cancelled,
    topRequesters,
    weeklyData,
    recentPrints,
  });
}
