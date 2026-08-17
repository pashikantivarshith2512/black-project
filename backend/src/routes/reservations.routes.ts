import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { optionalAuthenticate, authenticate, requireAdmin, AuthenticatedRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { ReservationStatus } from '@prisma/client';

const router = Router();

const reservationSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Phone number is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  guests: z.number().int().min(1, 'At least 1 guest is required').max(20, 'Maximum 20 guests per online booking'),
  specialRequests: z.string().optional(),
});

router.post('/', optionalAuthenticate, validate(reservationSchema), async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const { name, email, phone, date, time, guests, specialRequests } = req.body;

    const reservationNumber = `RES-${Math.floor(1000 + Math.random() * 9000)}`;

    const reservation = await prisma.reservation.create({
      data: {
        reservationNumber,
        userId: req.user?.userId || null,
        name,
        email,
        phone,
        date,
        time,
        guests,
        status: ReservationStatus.PENDING,
        specialRequests: specialRequests || null,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Table reservation request received!',
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/my-reservations', authenticate, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const reservations = await prisma.reservation.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: reservations });
  } catch (error) {
    next(error);
  }
});

router.get('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { status, date, search } = req.query;

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }
    if (date) {
      where.date = String(date);
    }
    if (search) {
      where.OR = [
        { reservationNumber: { contains: String(search), mode: 'insensitive' } },
        { name: { contains: String(search), mode: 'insensitive' } },
        { email: { contains: String(search), mode: 'insensitive' } },
        { phone: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    const reservations = await prisma.reservation.findMany({
      where,
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
    });

    res.json({ success: true, data: reservations });
  } catch (error) {
    next(error);
  }
});

router.put('/:id/status', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const { status } = req.body;

    if (!Object.values(ReservationStatus).includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid reservation status value.' });
      return;
    }

    const updated = await prisma.reservation.update({
      where: { id },
      data: { status },
    });

    res.json({ success: true, message: `Reservation status updated to ${status}`, data: updated });
  } catch (error) {
    next(error);
  }
});

export default router;
