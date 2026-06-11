import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle, Package, Truck, MapPin, Phone, Mail } from "lucide-react"
import { Metadata } from "next"

interface OrderPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: OrderPageProps): Promise<Metadata> {
  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
  })

  return {
    title: order ? `Narudžba #${order.orderNumber}` : "Narudžba",
    description: "Detalji vaše narudžbe",
  }
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: {
                take: 1,
                orderBy: { sortOrder: "asc" },
              },
            },
          },
        },
      },
      user: true,
    },
  })

  if (!order) {
    notFound()
  }

  const statusLabels: Record<string, string> = {
    PENDING: "Na čekanju",
    CONFIRMED: "Potvrđena",
    PROCESSING: "U pripremi",
    SHIPPED: "Poslana",
    DELIVERED: "Dostavljena",
    CANCELLED: "Otkazana",
    RETURNED: "Vraćena",
  }

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200",
    PROCESSING: "bg-purple-100 text-purple-800 border-purple-200",
    SHIPPED: "bg-indigo-100 text-indigo-800 border-indigo-200",
    DELIVERED: "bg-green-100 text-green-800 border-green-200",
    CANCELLED: "bg-red-100 text-red-800 border-red-200",
    RETURNED: "bg-gray-100 text-gray-800 border-gray-200",
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="text-green-600" size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Narudžba primljena!</h1>
        <p className="text-gray-600">
          Hvala vam na kupovini. Vaša narudžba je uspješno kreirana.
        </p>
      </div>

      {/* Order info card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Broj narudžbe</p>
            <p className="text-2xl font-bold text-gray-900">#{order.orderNumber}</p>
          </div>
          <div>
            <span
              className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${
                statusColors[order.status]
              }`}
            >
              {statusLabels[order.status]}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Datum narudžbe</p>
            <p className="font-medium">
              {new Date(order.createdAt).toLocaleDateString("bs-BA", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Način plaćanja</p>
            <p className="font-medium">Pouzećem (COD)</p>
          </div>
        </div>
      </div>

      {/* Proizvodi */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Package size={24} />
          Proizvodi
        </h2>

        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
              <Link
                href={`/product/${item.product.slug}`}
                className="flex-shrink-0 relative w-20 h-20 bg-gray-100 rounded"
              >
                <Image
                  src={item.product.images[0]?.url || "/placeholder-product.svg"}
                  alt={item.product.name}
                  fill
                  className="object-cover rounded"
                  sizes="80px"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/product/${item.product.slug}`}>
                  <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition line-clamp-2">
                    {item.product.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600 mt-1">
                  Količina: {item.quantity} x {item.unitPrice.toFixed(2)} KM
                </p>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="text-lg font-bold text-gray-900">{item.total.toFixed(2)} KM</p>
              </div>
            </div>
          ))}
        </div>

        {/* Totali */}
        <div className="mt-6 pt-6 border-t space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Proizvodi:</span>
            <span>{order.subtotal.toFixed(2)} KM</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Dostava:</span>
            <span className="text-green-600 font-medium">
              {order.shippingCost === 0 ? "Besplatna" : `${order.shippingCost.toFixed(2)} KM`}
            </span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Popust:</span>
              <span>-{order.discount.toFixed(2)} KM</span>
            </div>
          )}
          <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
            <span>Ukupno:</span>
            <span>{order.total.toFixed(2)} KM</span>
          </div>
        </div>
      </div>

      {/* Dostava info */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Truck size={24} />
          Informacije o dostavi
        </h2>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="text-gray-400 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="font-semibold text-gray-900">{order.shippingName}</p>
              <p className="text-gray-600">{order.shippingAddress}</p>
              <p className="text-gray-600">
                {order.shippingZip ? `${order.shippingZip} ` : ""}
                {order.shippingCity}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="text-gray-400 flex-shrink-0" size={20} />
            <p className="text-gray-900">{order.shippingPhone}</p>
          </div>

          {(order.guestEmail || order.user?.email) && (
            <div className="flex items-center gap-3">
              <Mail className="text-gray-400 flex-shrink-0" size={20} />
              <p className="text-gray-900">{order.guestEmail || order.user?.email}</p>
            </div>
          )}

          {order.shippingNote && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-3">
              <p className="text-sm font-medium text-yellow-900 mb-1">Napomena:</p>
              <p className="text-sm text-yellow-800">{order.shippingNote}</p>
            </div>
          )}
        </div>
      </div>

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">Šta se dešava dalje?</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>✅ Vaša narudžba je primljena i biće procesirana u najkraćem roku</li>
          <li>📧 Primili ste email potvrdu sa detaljima narudžbe</li>
          <li>📦 Paket će biti pakovan i poslan u roku od 1 radnog dana</li>
          <li>🚚 Očekivana dostava: 1-3 radna dana</li>
          <li>💰 Platite pouzećem prilikom preuzimanja paketa</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/shop"
          className="flex-1 text-center py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Nastavi sa kupovinom
        </Link>
        {order.user && (
          <Link
            href="/account/orders"
            className="flex-1 text-center py-3 px-6 bg-white text-gray-900 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Moje narudžbe
          </Link>
        )}
      </div>
    </div>
  )
}
