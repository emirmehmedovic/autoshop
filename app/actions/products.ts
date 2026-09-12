"use server"

import { prisma } from "@/lib/prisma"

export async function getMoreProducts(offset: number, limit: number) {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      isFeatured: false,
    },
    include: {
      category: true,
      images: {
        orderBy: { sortOrder: "asc" },
        take: 1,
      },
    },
    skip: offset,
    take: limit,
    orderBy: { createdAt: "desc" },
  })

  return products
}
