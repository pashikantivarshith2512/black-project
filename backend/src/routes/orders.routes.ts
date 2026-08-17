import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { optionalAuthenticate, authenticate, requireAdmin, AuthenticatedRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { OrderStatus, DeliveryOption } from '@prisma/client';

const router = Router();

const orderItemSchema = z.object({
  menuItemId: z.string().min(1, 'Menu item ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  specialNotes: z.string().optional(),
});

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Customer name is required'),
  customerEmail: z.string().email('Invalid customer email'),
  customerPhone: z.string().min(8, 'Phone number is required'),
  deliveryOption: z.enum(['DINE_IN', 'KERBSIDE_PICKUP', 'NO_CONTACT_DELIVERY']),
  address: z.string().optional(),
  specialInstructions: z.string().optional(),
  items: z.array(orderItemSchema).min(1, 'Cart cannot be empty'),
});

router.post('/', optionalAuthenticate, validate(checkoutSchema), async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const { customerName, customerEmail, customerPhone, deliveryOption, address, specialInstructions, items } = req.body;

    const itemIds = items.map((i: any) => i.menuItemId);
    const dbMenuItems = await prisma.menuItem.findMany({
      where: { id: { in: itemIds } },
    });

    if (dbMenuItems.length !== items.length) {
      res.status(400).json({ success: false, message: 'One or more items in your cart are invalid or unavailable.' });
      return;
    }

    let totalAmount = 0;
    const orderItemsToCreate = items.map((item: any) => {
      const dbItem = dbMenuItems.find((m) => m.id === item.menuItemId)!;
      totalAmount += dbItem.price * item.quantity;
      return {
        menuItemId: dbItem.id,
        quantity: item.quantity,
        price: dbItem.price,
        specialNotes: item.specialNotes || null,
      };
    });

    const orderNumber = `IKG-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        userId: req.user?.userId || null,
        customerName,
        customerEmail,
        customerPhone,
        deliveryOption: deliveryOption as DeliveryOption,
        address: address || null,
        totalAmount,
        status: OrderStatus.PENDING,
        paymentStatus: 'TEST_MODE_PENDING',
        specialInstructions: specialInstructions || null,
        items: {
          create: orderItemsToCreate,
        },
      },
      include: {
        items: {
          include: { menuItem: true },
        },
      },
    });

    if (req.user?.userId) {
      const pointsEarned = Math.floor(totalAmount / 10);
      if (pointsEarned > 0) {
        await prisma.loyaltyAccount.upsert({
          where: { userId: req.user.userId },
          update: {
            points: { increment: pointsEarned },
            totalEarned: { increment: pointsEarned },
            history: {
              create: {
                points: pointsEarned,
                type: 'EARNED',
                description: `Earned ${pointsEarned} points for Order #${orderNumber}`,
              },
            },
          },
          create: {
            userId: req.user.userId,
            points: pointsEarned,
            totalEarned: pointsEarned,
            history: {
              create: [
                {
                  points: pointsEarned,
                  type: 'EARNED',
                  description: `Earned ${pointsEarned} points for Order #${orderNumber}`,
                },
              ],
            },
          },
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/my-orders', authenticate, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.userId },
      include: {
        items: {
          include: { menuItem: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', optionalAuthenticate, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const id = String(req.params.id);
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { menuItem: true },
        },
      },
    });

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

router.get('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { status, search } = req.query;

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: String(search), mode: 'insensitive' } },
        { customerName: { contains: String(search), mode: 'insensitive' } },
        { customerEmail: { contains: String(search), mode: 'insensitive' } },
        { customerPhone: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: { menuItem: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
});

router.put('/:id/status', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const { status } = req.body;

    if (!Object.values(OrderStatus).includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid order status value.' });
      return;
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: { menuItem: true },
        },
      },
    });

    res.json({ success: true, message: `Order status updated to ${status}`, data: updatedOrder });
  } catch (error) {
    next(error);
  }
});

export default router;
