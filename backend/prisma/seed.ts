import { PrismaClient, Role, GalleryCategory, DeliveryOption, OrderStatus, ReservationStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding IKIGAI Café Database...');

  // 1. Clean existing records
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.review.deleteMany();
  await prisma.gallery.deleteMany();
  await prisma.loyaltyTransaction.deleteMany();
  await prisma.loyaltyAccount.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.user.deleteMany();

  // 2. Users (Admin + Customer)
  const adminPasswordHash = await bcrypt.hash('AdminPassword123!', 10);
  const customerPasswordHash = await bcrypt.hash('CustomerPassword123!', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@cafeikigai.com',
      password: adminPasswordHash,
      name: 'IKIGAI Administrator',
      phone: '09849000120',
      role: Role.ADMIN,
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@cafeikigai.com',
      password: customerPasswordHash,
      name: 'Aarav Sharma',
      phone: '09876543210',
      role: Role.CUSTOMER,
      loyalty: {
        create: {
          points: 240,
          totalEarned: 350,
          history: {
            create: [
              {
                points: 200,
                type: 'EARNED',
                description: 'Earned from Order #IKG-1001',
              },
              {
                points: 150,
                type: 'EARNED',
                description: 'Earned from Order #IKG-1002',
              },
              {
                points: -110,
                type: 'REDEEMED',
                description: 'Redeemed ₹110 discount on Cappuccino',
              },
            ],
          },
        },
      },
    },
  });

  console.log('✅ Created Admin and Customer users');

  // 3. Categories
  const catCoffee = await prisma.category.create({
    data: {
      name: 'COFFEE',
      slug: 'coffee',
      description: 'Artisanal single-origin roasts and espresso creations crafted with precision.',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
    },
  });

  const catFood = await prisma.category.create({
    data: {
      name: 'FOOD',
      slug: 'food',
      description: 'Gourmet savoury dishes, artisanal sandwiches, pasta, pizza & noodles.',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    },
  });

  const catDesserts = await prisma.category.create({
    data: {
      name: 'DESSERTS',
      slug: 'desserts',
      description: 'Handcrafted pastries, Japanese inspired sticky rice & rich chocolate delicacies.',
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
    },
  });

  const catDrinks = await prisma.category.create({
    data: {
      name: 'DRINKS',
      slug: 'drinks',
      description: 'Refreshing botanical mocktails, fresh smoothies and signature beverages.',
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    },
  });

  console.log('✅ Created Categories');

  // 4. Menu Items
  const menuItemsData = [
    // Coffee
    {
      name: 'Signature Cappuccino',
      slug: 'signature-cappuccino',
      description: 'Espresso blend with velvety textured microfoam steamed milk and organic cocoa dust.',
      price: 420,
      categoryId: catCoffee.id,
      availability: true,
      isSpecialty: true,
      image: 'https://images.unsplash.com/photo-1572442388796-11668ba69e54?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Kyoto Style Cold Brew',
      slug: 'kyoto-cold-brew',
      description: 'Slow-drip 18-hour cold brew infused with subtle hints of dark berries & citrus.',
      price: 450,
      categoryId: catCoffee.id,
      availability: true,
      isSpecialty: true,
      image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Double Ristretto Espresso',
      slug: 'double-espresso',
      description: 'Intense short extract with rich crema, highlight of Ethiopian Yirgacheffe notes.',
      price: 380,
      categoryId: catCoffee.id,
      availability: true,
      isSpecialty: false,
      image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Vanilla Bean Latte',
      slug: 'vanilla-bean-latte',
      description: 'Espresso poured over warm silken oat milk sweetened with authentic Madagascar vanilla.',
      price: 440,
      categoryId: catCoffee.id,
      availability: true,
      isSpecialty: false,
      image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80',
    },

    // Food
    {
      name: 'Schezwan Chilli Garlic Noodles',
      slug: 'schezwan-noodles',
      description: 'Wok-tossed noodles with fragrant garlic, crisp bell peppers, scallions and fiery house Schezwan sauce.',
      price: 680,
      categoryId: catFood.id,
      availability: true,
      isSpecialty: true,
      image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Truffle Mushroom Dim Sum',
      slug: 'truffle-dim-sum',
      description: 'Steamed translucent dumplings filled with wild forest mushrooms and aromatic truffle oil.',
      price: 620,
      categoryId: catFood.id,
      availability: true,
      isSpecialty: true,
      image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Classic Baked Lasagna',
      slug: 'baked-lasagna',
      description: 'Layers of hand-rolled pasta, rich slow-simmered marinara, roasted vegetables & molten mozzarella.',
      price: 780,
      categoryId: catFood.id,
      availability: true,
      isSpecialty: false,
      image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Artisanal Burrata Pizza',
      slug: 'burrata-pizza',
      description: 'Wood-fired sourdough crust, San Marzano tomato glaze, fresh creamy burrata, and basil oil.',
      price: 850,
      categoryId: catFood.id,
      availability: true,
      isSpecialty: true,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Smoked Avocado & Feta Toast',
      slug: 'avocado-feta-toast',
      description: 'Grilled sourdough bread topped with crushed hass avocado, crumbled feta, cherry tomatoes & seeds.',
      price: 580,
      categoryId: catFood.id,
      availability: true,
      isSpecialty: false,
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
    },

    // Desserts
    {
      name: 'Classic Venetian Tiramisu',
      slug: 'venetian-tiramisu',
      description: 'Layers of espresso-soaked ladyfingers and whipped mascarpone cream dusted with dark Belgian cocoa.',
      price: 550,
      categoryId: catDesserts.id,
      availability: true,
      isSpecialty: true,
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Matcha & Mango Sticky Rice',
      slug: 'mango-sticky-rice',
      description: 'Sweet coconut infused sticky rice with ripe Alphonso mango slices and ceremonial grade matcha glaze.',
      price: 520,
      categoryId: catDesserts.id,
      availability: true,
      isSpecialty: true,
      image: 'https://images.unsplash.com/photo-1621236378699-8597faf6a176?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Belgian Dark Chocolate Fondant',
      slug: 'dark-chocolate-fondant',
      description: 'Warm chocolate cake with a molten lava core served alongside Madagascar vanilla bean ice cream.',
      price: 620,
      categoryId: catDesserts.id,
      availability: true,
      isSpecialty: false,
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    },

    // Drinks
    {
      name: 'Yuzu Botanical Sparkler',
      slug: 'yuzu-botanical-sparkler',
      description: 'Japanese Yuzu citrus juice with sparkling soda, rosemary infusion and elderflower syrup.',
      price: 480,
      categoryId: catDrinks.id,
      availability: true,
      isSpecialty: true,
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Acai Berry & Mint Smoothie',
      slug: 'acai-berry-smoothie',
      description: 'Blended organic acai berries, Greek yogurt, fresh mint leaves, chia seeds, and coconut water.',
      price: 460,
      categoryId: catDrinks.id,
      availability: true,
      isSpecialty: false,
      image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80',
    },
  ];

  for (const item of menuItemsData) {
    await prisma.menuItem.create({ data: item });
  }

  console.log('✅ Created Menu Items');

  // 5. Customer Reviews
  const reviewsData = [
    {
      name: 'Priya Reddy',
      rating: 5,
      comment: 'Great coffee, Pizza, sandwiches, tasty food and super friendly staff. The ambience is truly peaceful and zen!',
      isApproved: true,
    },
    {
      name: 'Vikram Mehta',
      rating: 5,
      comment: 'Nice place to eat food at Ikigai. Service people also good. The Kyoto Cold Brew is hands down the best in Gachibowli!',
      isApproved: true,
    },
    {
      name: 'Ananya Rao',
      rating: 5,
      comment: 'IKIGAI Cafe gives authentic Japanese minimalism vibes. Love their Schezwan Noodles and Venetian Tiramisu. 10/10!',
      isApproved: true,
    },
    {
      name: 'Rohan Kulkarni',
      rating: 4,
      comment: 'A premium cafe in Kondapur with great seating, high speed WiFi, and incredible dark chocolate fondant.',
      isApproved: true,
    },
  ];

  for (const rev of reviewsData) {
    await prisma.review.create({ data: rev });
  }

  console.log('✅ Created Reviews');

  // 6. Gallery Entries
  const galleryData = [
    {
      title: 'Serene Minimalist Café Interior',
      category: GalleryCategory.AMBIENCE,
      imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Handcrafted Espresso Pour Over',
      category: GalleryCategory.COFFEE,
      imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Artisanal Burrata Pizza',
      category: GalleryCategory.FOOD,
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Cozy Evening Seating',
      category: GalleryCategory.AMBIENCE,
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Weekend Acoustic Evening',
      category: GalleryCategory.EVENTS,
      imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Freshly Brewed Cappuccino Art',
      category: GalleryCategory.CUSTOMER_MOMENTS,
      imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668ba69e54?auto=format&fit=crop&w=800&q=80',
    },
  ];

  for (const item of galleryData) {
    await prisma.gallery.create({ data: item });
  }

  console.log('✅ Created Gallery items');

  // 7. Sample Orders & Reservations
  const capp = await prisma.menuItem.findFirst({ where: { slug: 'signature-cappuccino' } });
  const pizza = await prisma.menuItem.findFirst({ where: { slug: 'burrata-pizza' } });

  if (capp && pizza) {
    await prisma.order.create({
      data: {
        orderNumber: 'IKG-1001',
        userId: customer.id,
        customerName: 'Aarav Sharma',
        customerEmail: 'customer@cafeikigai.com',
        customerPhone: '09876543210',
        deliveryOption: DeliveryOption.DINE_IN,
        totalAmount: 1270,
        status: OrderStatus.COMPLETED,
        paymentStatus: 'PAID_TEST',
        items: {
          create: [
            {
              menuItemId: capp.id,
              quantity: 1,
              price: capp.price,
            },
            {
              menuItemId: pizza.id,
              quantity: 1,
              price: pizza.price,
            },
          ],
        },
      },
    });
  }

  await prisma.reservation.create({
    data: {
      reservationNumber: 'RES-8821',
      userId: customer.id,
      name: 'Aarav Sharma',
      email: 'customer@cafeikigai.com',
      phone: '09876543210',
      date: '2026-08-15',
      time: '19:30',
      guests: 4,
      status: ReservationStatus.CONFIRMED,
      specialRequests: 'Quiet corner table for anniversary celebration.',
    },
  });

  await prisma.newsletterSubscriber.create({
    data: {
      email: 'customer@cafeikigai.com',
    },
  });

  console.log('✨ IKIGAI Café Database successfully seeded!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
