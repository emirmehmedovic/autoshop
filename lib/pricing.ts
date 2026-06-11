import { prisma } from "./prisma"

interface User {
  id: string
  customerType: "B2C" | "B2B"
  b2bProfile?: {
    priceGroupId: string | null
    priceGroup?: {
      discount: number
    } | null
  } | null
}

/**
 * Dobija cijenu proizvoda za određenog korisnika
 * - B2C korisnici: obična cijena
 * - B2B korisnici: cijena iz cjenovne grupe ili popust na osnovnu cijenu
 */
export async function getProductPriceForUser(
  productId: string,
  basePrice: number,
  user?: User | null
): Promise<number> {
  // Ako nema korisnika ili je B2C, vrati osnovnu cijenu
  if (!user || user.customerType === "B2C") {
    return basePrice
  }

  // Ako je B2B i ima cjenovnu grupu
  if (user.b2bProfile?.priceGroupId) {
    // Provjeri da li postoji specifična cijena za ovaj proizvod u grupi
    const productPrice = await prisma.productPriceGroup.findFirst({
      where: {
        productId,
        priceGroupId: user.b2bProfile.priceGroupId,
      },
    })

    if (productPrice) {
      return productPrice.price
    }

    // Ako nema specifične cijene, primijeni popust grupe
    if (user.b2bProfile.priceGroup) {
      const discount = user.b2bProfile.priceGroup.discount
      return basePrice * (1 - discount / 100)
    }
  }

  // Fallback na osnovnu cijenu
  return basePrice
}

/**
 * Dobija cijene za više proizvoda odjednom (batch operacija)
 */
export async function getProductPricesForUser(
  products: Array<{ id: string; price: number }>,
  user?: User | null
): Promise<Map<string, number>> {
  const priceMap = new Map<string, number>()

  // Ako nema korisnika ili je B2C
  if (!user || user.customerType === "B2C") {
    products.forEach((p) => priceMap.set(p.id, p.price))
    return priceMap
  }

  // Ako je B2B sa cjenovnom grupom
  if (user.b2bProfile?.priceGroupId) {
    const productIds = products.map((p) => p.id)

    // Dohvati sve specifične cijene odjednom
    const productPrices = await prisma.productPriceGroup.findMany({
      where: {
        productId: { in: productIds },
        priceGroupId: user.b2bProfile.priceGroupId,
      },
    })

    const specificPrices = new Map(productPrices.map((p) => [p.productId, p.price]))
    const discount = user.b2bProfile.priceGroup?.discount || 0

    // Popuni mapu cijena
    products.forEach((product) => {
      const specificPrice = specificPrices.get(product.id)
      if (specificPrice) {
        priceMap.set(product.id, specificPrice)
      } else if (discount > 0) {
        priceMap.set(product.id, product.price * (1 - discount / 100))
      } else {
        priceMap.set(product.id, product.price)
      }
    })
  } else {
    // B2B bez grupe - osnovne cijene
    products.forEach((p) => priceMap.set(p.id, p.price))
  }

  return priceMap
}

/**
 * Formatira cijenu sa valutom
 */
export function formatPrice(price: number): string {
  return `${price.toFixed(2)} KM`
}
