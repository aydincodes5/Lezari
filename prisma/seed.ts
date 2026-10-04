const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Add a hero slide
  await prisma.heroSlide.create({
    data: {
      image: '/hero-bg.jpg', // Placeholder image path
      heading: 'Elegance in Every Detail',
      description: 'Discover our premium collection of anti-tarnish jewellery.',
      button_text: 'Shop Now',
      button_url: '/shop',
      order: 1,
      active: true,
    }
  })

  // Add categories
  const cat1 = await prisma.category.create({
    data: { name: 'Necklaces', slug: 'necklaces', order: 1 }
  })
  const cat2 = await prisma.category.create({
    data: { name: 'Earrings', slug: 'earrings', order: 2 }
  })
  const cat3 = await prisma.category.create({
    data: { name: 'Rings', slug: 'rings', order: 3 }
  })
  const cat4 = await prisma.category.create({
    data: { name: 'Bracelets', slug: 'bracelets', order: 4 }
  })

  // Add products
  await prisma.product.create({
    data: {
      name: 'Classic Gold Chain',
      slug: 'classic-gold-chain',
      description: 'A timeless 18k gold plated chain, perfect for everyday wear. Anti-tarnish and waterproof.',
      short_description: 'Timeless 18k gold plated chain.',
      price: 1499,
      original_price: 1999,
      stock: 50,
      categoryId: cat1.id,
      featured: true,
      new_arrival: true,
    }
  })
  
  await prisma.product.create({
    data: {
      name: 'Pearl Drop Earrings',
      slug: 'pearl-drop-earrings',
      description: 'Elegant freshwater pearl drops on a minimalist gold hook. Sophisticated and lightweight.',
      short_description: 'Freshwater pearl drops.',
      price: 1299,
      stock: 30,
      categoryId: cat2.id,
      featured: true,
    }
  })

  console.log('Database seeded!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
