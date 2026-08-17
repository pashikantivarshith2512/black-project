import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { optionalAuthenticate, authenticate, requireAdmin, AuthenticatedRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

const reviewSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  rating: z.number().int().min(1, 'Rating must be at least 1 star').max(5, 'Maximum rating is 5 stars'),
  comment: z.string().min(5, 'Review comment must be at least 5 characters'),
});

router.get('/', async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
});

router.post('/', optionalAuthenticate, validate(reviewSchema), async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const { name, rating, comment } = req.body;

    const newReview = await prisma.review.create({
      data: {
        userId: req.user?.userId || null,
        name,
        rating,
        comment,
        isApproved: false,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your review! It will be displayed after quick moderation.',
      data: newReview,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/admin', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
});

router.put('/:id/approve', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const { isApproved } = req.body;

    const updated = await prisma.review.update({
      where: { id },
      data: { isApproved: Boolean(isApproved) },
    });

    res.json({ success: true, message: 'Review approval status updated', data: updated });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const id = String(req.params.id);
    await prisma.review.delete({ where: { id } });
    res.json({ success: true, message: 'Review deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

export default router;
