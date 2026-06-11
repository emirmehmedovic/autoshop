import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Kreiranje admin korisnika
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@autoshop.ba' },
    update: {},
    create: {
      email: 'admin@autoshop.ba',
      name: 'Admin AutoShop',
      passwordHash: adminPassword,
      role: 'ADMIN',
      customerType: 'B2C',
      isApproved: true,
    },
  })
  console.log('✅ Admin korisnik kreiran:', admin.email)

  // Kreiranje kategorija
  const categories = [
    {
      name: 'Auto Kozmetika',
      slug: 'auto-kozmetika',
      description: 'Proizvodi za njegu i održavanje vozila',
      sortOrder: 1,
    },
    {
      name: 'Repromatrijali',
      slug: 'repromatrijali',
      description: 'Profesionalni repromatrijali za auto lakirnicu',
      sortOrder: 2,
    },
    {
      name: 'Poliranje',
      slug: 'poliranje',
      description: 'Paste i sredstva za poliranje',
      sortOrder: 3,
    },
    {
      name: 'Pranje',
      slug: 'pranje',
      description: 'Šamponi i sredstva za pranje',
      sortOrder: 4,
    },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
    console.log(`✅ Kategorija kreirana: ${cat.name}`)
  }

  // Kreiranje cjenovnih grupa za B2B
  const priceGroups = [
    { name: 'Veleprodaja A', discount: 15 },
    { name: 'Veleprodaja B', discount: 10 },
    { name: 'Veleprodaja C', discount: 5 },
  ]

  for (const group of priceGroups) {
    await prisma.priceGroup.upsert({
      where: { name: group.name },
      update: {},
      create: group,
    })
    console.log(`✅ Cjenovna grupa kreirana: ${group.name}`)
  }

  // Kreiranje demo proizvoda
  const autoKozmetikaCategory = await prisma.category.findUnique({
    where: { slug: 'auto-kozmetika' },
  })

  if (autoKozmetikaCategory) {
    const products = [
      {
        name: 'Premium Auto Šampon 5L',
        slug: 'premium-auto-sampon-5l',
        description:
          'Profesionalni šampon za pranje vozila. pH neutralan, ne oštećuje vosak. Iznimna moć čišćenja uz nježnu formulu koja čuva lak.',
        shortDesc: 'Profesionalni šampon za pranje vozila, 5L pakovanje',
        sku: 'AK-SMP-001',
        price: 45.0,
        comparePrice: 55.0,
        stock: 50,
        categoryId: autoKozmetikaCategory.id,
        isFeatured: true,
        metaTitle: 'Premium Auto Šampon 5L - AutoShop',
        metaDesc: 'Kupi najbolji auto šampon za profesionalno pranje vozila. Dostupno online.',
      },
      {
        name: 'Nano Vosak 500ml',
        slug: 'nano-vosak-500ml',
        description:
          'Napredna nano tehnologija za dugotrajnu zaštitu laka. Hidrofobni efekat, lak sjaj i zaštita do 6 mjeseci.',
        shortDesc: 'Nano vosak sa hidrofobnim efektom',
        sku: 'AK-VSK-001',
        price: 65.0,
        stock: 30,
        categoryId: autoKozmetikaCategory.id,
        isFeatured: true,
        metaTitle: 'Nano Vosak 500ml - Zaštita Laka',
        metaDesc: 'Premium nano vosak za dugotrajnu zaštitu i sjaj automobila.',
      },
      {
        name: 'Polir Pasta Medium 1kg',
        slug: 'polir-pasta-medium-1kg',
        description:
          'Srednja polir pasta za korekciju lakova. Uklanja ogrebotine, hologramske oznake i oksidaciju.',
        shortDesc: 'Srednja polir pasta za korekciju lakova',
        sku: 'AK-POL-001',
        price: 85.0,
        stock: 25,
        categoryId: autoKozmetikaCategory.id,
        metaTitle: 'Polir Pasta Medium 1kg - Profesionalno Poliranje',
        metaDesc: 'Profesionalna polir pasta za uklanjanje ogrebotina i obnovu laka.',
      },
    ]

    for (const product of products) {
      await prisma.product.upsert({
        where: { sku: product.sku },
        update: {},
        create: product,
      })
      console.log(`✅ Proizvod kreiran: ${product.name}`)
    }
  }

  console.log('🎉 Seeding završen!')
}

main()
  .catch((e) => {
    console.error('❌ Greška pri seedingu:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
