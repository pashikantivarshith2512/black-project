import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import { validate } from '../middleware/validate';

const router = Router();

const chatSchema = z.object({
  message: z.string().min(1, 'Message is required'),
});

router.post('/chat', validate(chatSchema), async (req, res, next) => {
  try {
    const { message } = req.body;
    const query = message.toLowerCase();

    const isExternalApiConfigured = Boolean(env.AI_API_KEY && env.AI_API_KEY.trim().length > 0);

    let reply = '';
    let isMockMode = !isExternalApiConfigured;

    if (query.includes('time') || query.includes('timing') || query.includes('open') || query.includes('hours')) {
      reply = 'IKIGAI Café is open every day from 8:00 AM to 11:00 PM. We welcome you for morning espresso, mid-day lunch, or peaceful evening coffee!';
    } else if (query.includes('location') || query.includes('address') || query.includes('where')) {
      reply = 'We are located at Ground Floor of M.R PRIME Building (LEEWAY), Kondapur, Laxmi Cyber City, Whitefields, Gachibowli, Hyderabad, Telangana 500084. Call us at 098490 00120!';
    } else if (query.includes('reserve') || query.includes('booking') || query.includes('table')) {
      reply = 'You can reserve a table directly on our website under the "Reservations" section, or call us at 098490 00120 for special arrangements.';
    } else if (query.includes('recommend') || query.includes('special') || query.includes('best')) {
      reply = 'Our guest favorites include the Kyoto Style Cold Brew, Truffle Mushroom Dim Sum, Schezwan Chilli Garlic Noodles, and Venetian Tiramisu!';
    } else if (query.includes('menu') || query.includes('food') || query.includes('coffee') || query.includes('pizza') || query.includes('dessert') || query.includes('price')) {
      const items = await prisma.menuItem.findMany({
        take: 5,
        orderBy: { isSpecialty: 'desc' },
      });
      const itemNames = items.map((i) => `${i.name} (₹${i.price})`).join(', ');
      reply = `Here are some featured items from our menu: ${itemNames}. Explore our full online menu to place a kerbside pickup or delivery order!`;
    } else {
      reply = `Thank you for reaching out to IKIGAI Café! We are a Japanese-inspired luxury coffee house in Kondapur, Hyderabad. How may I assist you with our artisanal coffee, food menu, or table reservations today?`;
    }

    res.json({
      success: true,
      data: {
        reply,
        isMockMode,
        note: isMockMode ? 'Operating on IKIGAI Intelligent Rule Engine. Set AI_API_KEY in backend .env to integrate live Gemini/OpenAI.' : undefined,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
