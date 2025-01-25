import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create a customer
    const hashedCustomerPassword = await bcrypt.hash('customer', 10);
    await prisma.user.create({
      data: {
        username: 'customer_user',
        password: hashedCustomerPassword,
        location: 'Bukit Panjang',
        role: 'customer',
      },
    });

    // Create a seller
    const hashedSellerPassword = await bcrypt.hash('seller', 10);
    await prisma.user.create({
      data: {
        username: 'seller_user',
        password: hashedSellerPassword,
        location: 'Yishun',
        role: 'seller',
      },
    });

    console.log('Users seeded successfully with hashed passwords.');
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();