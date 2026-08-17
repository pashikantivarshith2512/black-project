import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { GalleryCategory } from '@prisma/client';

const router = Router();

const gallerySchema = z.object({
  title: z.string().min(2, 'Title is required'),
  category: z.enum(['AMBIENCE', 'FOOD', 'COFFEE', 'EVENTS', 'CUSTOMER_MOMENTS']),
  imageUrl: z.string().url('Image must be a valid URL'),
});

router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query;

    const where: any = {};
    if (category && category !== 'ALL') {
      where.category = category;
    }

    const items = await prisma.gallery.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticate, requireAdmin, validate(gallerySchema), async (req, res, next) => {
  try {
    const { title, category, imageUrl } = req.body;
    const newItem = await prisma.gallery.create({
      data: {
        title,
        category: category as GalleryCategory,
        imageUrl,
      },
    });
    res.status(201).json({ success: true, message: 'Gallery entry added', data: newItem });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const id = String(req.params.id);
    await prisma.gallery.delete({ where: { id } });
    res.json({ success: true, message: 'Gallery item deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

export default router;
