import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

const menuItemSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().min(5, 'Description is required'),
  price: z.number().positive('Price must be greater than 0'),
  categoryName: z.string().min(1, 'Category is required'),
  availability: z.boolean().default(true),
  isSpecialty: z.boolean().default(false),
  image: z.string().url('Image must be a valid URL'),
});

router.get('/', async (req, res, next) => {
  try {
    const { category, search } = req.query;

    const where: any = {};
    if (category && category !== 'ALL') {
      where.category = {
        name: {
          equals: String(category),
          mode: 'insensitive',
        },
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    const items = await prisma.menuItem.findMany({
      where,
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    const categories = await prisma.category.findMany({
      select: { id: true, name: true, slug: true, description: true, image: true },
    });

    res.json({ success: true, data: { items, categories } });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const item = await prisma.menuItem.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!item) {
      res.status(404).json({ success: false, message: 'Menu item not found.' });
      return;
    }

    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
});

// Admin endpoints for Menu CRUD
router.post('/', authenticate, requireAdmin, validate(menuItemSchema), async (req, res, next) => {
  try {
    const { name, description, price, categoryName, availability, isSpecialty, image } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    let categoryObj = await prisma.category.findFirst({
      where: { name: { equals: categoryName, mode: 'insensitive' } },
    });

    if (!categoryObj) {
      categoryObj = await prisma.category.create({
        data: {
          name: categoryName.toUpperCase(),
          slug: categoryName.toLowerCase(),
        },
      });
    }

    const newItem = await prisma.menuItem.create({
      data: {
        name,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        description,
        price,
        categoryId: categoryObj.id,
        availability,
        isSpecialty,
        image,
      },
      include: { category: true },
    });

    res.status(201).json({ success: true, message: 'Menu item created', data: newItem });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const { name, description, price, categoryName, availability, isSpecialty, image } = req.body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price !== undefined) updateData.price = Number(price);
    if (availability !== undefined) updateData.availability = Boolean(availability);
    if (isSpecialty !== undefined) updateData.isSpecialty = Boolean(isSpecialty);
    if (image) updateData.image = image;

    if (categoryName) {
      let categoryObj = await prisma.category.findFirst({
        where: { name: { equals: categoryName, mode: 'insensitive' } },
      });
      if (!categoryObj) {
        categoryObj = await prisma.category.create({
          data: { name: categoryName.toUpperCase(), slug: categoryName.toLowerCase() },
        });
      }
      updateData.categoryId = categoryObj.id;
    }

    const updatedItem = await prisma.menuItem.update({
      where: { id },
      data: updateData,
      include: { category: true },
    });

    res.json({ success: true, message: 'Menu item updated', data: updatedItem });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const id = String(req.params.id);
    await prisma.menuItem.delete({ where: { id } });
    res.json({ success: true, message: 'Menu item deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

export default router;
