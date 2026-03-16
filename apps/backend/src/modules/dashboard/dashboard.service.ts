import prisma from "../../config/db";
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  eachDayOfInterval,
  format,
} from "date-fns";

export async function getDashboardStats(userId: string) {
  const now = new Date();
  const firstDayOfMonth = startOfMonth(now);
  const lastDayOfMonth = endOfMonth(now);
  const firstDayLastMonth = startOfMonth(subMonths(now, 1));
  const lastDayLastMonth = endOfMonth(subMonths(now, 1));

  const [
    patientCount,
    monthAppointments,
    lastMonthAppointments,
    completedAppointments,
    pendingAppointments,
    nextAppointments,
    appointmentsByStatus,
    appointmentsByDay,
  ] = await prisma.$transaction([
    prisma.patient.count({
      where: {
        appointments: {
          some: { userId },
        },
      },
    }),
    prisma.appointment.count({
      where: {
        userId,
        date: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
    }),
    prisma.appointment.count({
      where: {
        userId,
        date: {
          gte: firstDayLastMonth,
          lte: lastDayLastMonth,
        },
      },
    }),
    prisma.appointment.count({
      where: {
        userId,
        status: "COMPLETED",
      },
    }),
    prisma.appointment.count({
      where: {
        userId,
        status: { in: ["PENDING", "CONFIRMED"] },
        date: { gte: now },
      },
    }),
    prisma.appointment.findMany({
      where: {
        userId,
        date: { gte: now },
        status: { not: "CANCELLED" },
      },
      take: 5,
      orderBy: {
        date: "asc",
      },
      include: {
        patient: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    }),
    prisma.appointment.groupBy({
      by: ["status"],
      where: {
        userId,
        date: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
      _count: true,
      orderBy: {
        status: "asc",
      },
    }),
    prisma.$queryRaw<Array<{ day: number; count: bigint }>>`
      SELECT EXTRACT(DOW FROM "date")::int as day, COUNT(*)::bigint as count
      FROM appointments
      WHERE "userId" = ${userId}
        AND "date" >= ${firstDayOfMonth}::date
        AND "date" <= ${lastDayOfMonth}::date
      GROUP BY EXTRACT(DOW FROM "date")
      ORDER BY day
    `,
  ]);

  const trend =
    lastMonthAppointments > 0
      ? (
          ((monthAppointments - lastMonthAppointments) /
            lastMonthAppointments) *
          100
        ).toFixed(1)
      : "0";

  const statusData = appointmentsByStatus.map((item) => ({
    status: item.status,
    count: (item as { _count: { _all: number } })._count._all,
  }));

  const dayData = (appointmentsByDay || []).map((item) => ({
    day: Number(item.day),
    count: Number(item.count),
  }));

  const weekDays = [0, 1, 2, 3, 4, 5, 6];
  const completeDayData = weekDays.map((day) => {
    const existing = dayData.find((d) => d.day === day);
    return {
      day,
      dayName: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][day],
      count: existing ? existing.count : 0,
    };
  });

  return {
    stats: {
      patients: patientCount,
      appointments: monthAppointments,
      completed: completedAppointments,
      pending: pendingAppointments,
      trend: parseFloat(trend),
    },
    nextAppointments,
    charts: {
      byStatus: statusData,
      byDay: completeDayData,
    },
  };
}
