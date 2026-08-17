import { Router } from 'express';
import { prisma } from '../config/prisma';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/stats', authenticate, requireAdmin, async (_req, res, next) => {
  try {
    const totalOrders = await prisma.order.count();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrdersCount = await prisma.order.count({
      where: { createdAt: { gte: today } },
    });

    const revenueResult = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: { not: 'CANCELLED' } },
    });

    const totalCustomers = await prisma.user.count({
      where: { role: 'CUSTOMER' },
    });

    const totalReservations = await prisma.reservation.count();
    const pendingReservations = await prisma.reservation.count({
      where: { status: 'PENDING' },
    });

    const pendingReviews = await prisma.review.count({
      where: { isApproved: false },
    });

    const totalMenuItems = await prisma.menuItem.count();

    res.json({
      success: true,
      data: {
        totalOrders,
        todayOrders: todayOrdersCount,
        totalRevenue: revenueResult._sum.totalAmount || 0,
        totalCustomers,
        totalReservations,
        pendingReservations,
        pendingReviews,
        totalMenuItems,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
