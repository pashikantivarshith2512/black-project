import { Router, Response } from 'express';
import { prisma } from '../config/prisma';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

router.get('/me', authenticate, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    let account = await prisma.loyaltyAccount.findUnique({
      where: { userId: req.user!.userId },
      include: {
        history: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!account) {
      account = await prisma.loyaltyAccount.create({
        data: {
          userId: req.user!.userId,
          points: 50,
          totalEarned: 50,
          history: {
            create: [
              {
                points: 50,
                type: 'EARNED',
                description: 'Welcome Bonus Points',
              },
            ],
          },
        },
        include: {
          history: true,
        },
      });
    }

    res.json({ success: true, data: account });
  } catch (error) {
    next(error);
  }
});

export default router;
