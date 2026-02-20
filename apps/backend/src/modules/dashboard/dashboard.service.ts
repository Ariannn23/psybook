import prisma from "../../config/db";
import { startOfMonth, endOfMonth, subMonths, eachDayOfInterval, format } from "date-fns";

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
    // Total patients
    prisma.patient.count(),
    // Appointments this month
    prisma.appointment.count({
      where: {
        date: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
    }),
    // Appointments last month (for comparison)
    prisma.appointment.count({
      where: {
        date: {
          gte: firstDayLastMonth,
          lte: lastDayLastMonth,
        },
      },
    }),
    // Completed appointments (total)
    prisma.appointment.count({
      where: {
        status: "COMPLETED",
      },
    }),
    // Pending appointments (future)
    prisma.appointment.count({
      where: {
        status: { in: ["PENDING", "CONFIRMED"] },
        date: { gte: now },
      },
    }),
    // Next 5 appointments
    prisma.appointment.findMany({
      where: {
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
    // Appointments by status (for pie chart)
    prisma.appointment.groupBy({
      by: ["status"],
      where: {
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
    // Appointments by day of week (for bar chart)
    prisma.$queryRaw<Array<{ day: number; count: bigint }>>`
      SELECT EXTRACT(DOW FROM date)::int as day, COUNT(*)::bigint as count
      FROM appointments
      WHERE date >= ${firstDayOfMonth}::date
        AND date <= ${lastDayOfMonth}::date
      GROUP BY EXTRACT(DOW FROM date)
      ORDER BY day
    `,
  ]);

  // Calculate trend
  const trend = lastMonthAppointments > 0
    ? ((monthAppointments - lastMonthAppointments) / lastMonthAppointments * 100).toFixed(1)
    : "0";

  // Format appointments by status
  const statusData = appointmentsByStatus.map((item) => ({
    status: item.status,
    count: typeof item._count === 'number' ? item._count : 0,
  }));

  // Format appointments by day
  const dayData = appointmentsByDay.map((item) => ({
    day: Number(item.day),
    count: Number(item.count),
  }));

  // Fill missing days with 0
  const weekDays = [0, 1, 2, 3, 4, 5, 6]; // Sunday = 0
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
