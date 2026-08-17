import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { validate } from '../middleware/validate';

const router = Router();

const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
});

router.post('/', validate(newsletterSchema), async (req, res, next) => {
  try {
    const { email } = req.body;

    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing) {
      if (existing.isSubscribed) {
        res.json({ success: true, message: 'You are already subscribed to the IKIGAI Journal!' });
        return;
      } else {
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { isSubscribed: true },
        });
        res.json({ success: true, message: 'Welcome back! Your subscription has been reactivated.' });
        return;
      }
    }

    await prisma.newsletterSubscriber.create({
      data: { email },
    });

    res.status(201).json({
      success: true,
      message: 'Welcome to the IKIGAI Journal! You will receive exclusive coffee stories and seasonal menu previews.',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
