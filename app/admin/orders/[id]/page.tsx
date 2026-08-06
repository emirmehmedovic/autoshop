import { prisma } from "@/lib/prisma"
import { Breadcrumbs } from "@/components/admin/Breadcrumbs"
import { OrderStatusButtons } from "@/components/admin/OrderStatusButtons"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

export const dynamic = "force-dynamic"

import {
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Clock,
  FileText,
  CheckCircle,
  Truck,
  XCircle,
  RotateCcw,
  Loader,
  ArrowLeft,
} from "lucide-react"

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
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
      statusHistory: {
        orderBy: { createdAt: "desc" },
      },
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
    PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
    CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
    PROCESSING: "bg-purple-50 text-purple-700 border-purple-200",
    SHIPPED: "bg-indigo-50 text-indigo-700 border-indigo-200",
    DELIVERED: "bg-green-50 text-green-700 border-green-200",
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
    RETURNED: "bg-gray-50 text-gray-700 border-gray-200",
  }

  const statusIcons: Record<string, React.ReactNode> = {
    PENDING: <Clock size={16} />,
    CONFIRMED: <CheckCircle size={16} />,
    PROCESSING: <Loader size={16} />,
    SHIPPED: <Truck size={16} />,
    DELIVERED: <Package size={16} />,
    CANCELLED: <XCircle size={16} />,
    RETURNED: <RotateCcw size={16} />,
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Narudžbe", href: "/admin/orders" },
          { label: `#${order.orderNumber}` },
        ]}
      />

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-12 bg-orange-500 rounded-full" />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">
                  Narudžba #{order.orderNumber}
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-bold border ${statusColors[order.status]}`}
                >
                  {statusIcons[order.status]}
                  {statusLabels[order.status]}
                </span>
                {order.isPaid && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-bold bg-green-50 text-green-700 border border-green-200">
                    <CreditCard size={16} />
                    Plaćeno
                  </span>
                )}
              </div>
              <p className="text-gray-600 mt-1">
                {new Date(order.createdAt).toLocaleString("bs-BA", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </div>

          <Link
            href="/admin/orders"
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft size={18} />
            Nazad na listu
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Actions */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <OrderStatusButtons
              orderId={order.id}
              currentStatus={order.status}
              isPaid={order.isPaid}
            />
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package size={20} className="text-orange-500" />
              Proizvodi ({order.items.length})
            </h2>

            <div className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.images[0] ? (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Package size={24} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/admin/products/${item.product.id}/edit`}
                        className="font-bold text-gray-900 hover:text-orange-500 transition"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-500">SKU: {item.product.sku}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm">
                        <span className="text-gray-600">
                          {item.quantity} x {item.unitPrice.toFixed(2)} KM
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-gray-900">
                        {item.total.toFixed(2)}{" "}
                        <span className="text-orange-500">KM</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Međuzbroj</span>
                <span className="font-medium text-gray-900">
                  {order.subtotal.toFixed(2)} KM
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Dostava</span>
                <span className="font-medium text-gray-900">
                  {order.shippingCost === 0
                    ? "Besplatno"
                    : `${order.shippingCost.toFixed(2)} KM`}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Popust</span>
                  <span className="font-medium text-green-600">
                    -{order.discount.toFixed(2)} KM
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                <span className="text-gray-900">Ukupno</span>
                <span className="text-gray-900">
                  {order.total.toFixed(2)}{" "}
                  <span className="text-orange-500">KM</span>
                </span>
              </div>
            </div>
          </div>

          {/* Status History */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={20} className="text-orange-500" />
              Historija statusa
            </h2>

            <div className="space-y-4">
              {order.statusHistory.map((history, index) => (
                <div key={history.id} className="flex gap-4">
                  <div className="relative">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index === 0
                          ? "bg-orange-100 text-orange-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {statusIcons[history.status]}
                    </div>
                    {index < order.statusHistory.length - 1 && (
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-full bg-gray-200" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">
                        {statusLabels[history.status]}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(history.createdAt).toLocaleString("bs-BA", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                    {history.note && (
                      <p className="text-sm text-gray-600 mt-1">{history.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User size={20} className="text-orange-500" />
              Kupac
            </h2>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User size={18} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{order.shippingName}</p>
                  {order.user && (
                    <p className="text-sm text-gray-500">Registrovan korisnik</p>
                  )}
                  {!order.user && (
                    <p className="text-sm text-gray-500">Gost kupac</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={18} className="text-gray-400 mt-0.5" />
                <a
                  href={`tel:${order.shippingPhone}`}
                  className="text-gray-900 hover:text-orange-500 transition"
                >
                  {order.shippingPhone}
                </a>
              </div>

              {(order.guestEmail || order.user?.email) && (
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-gray-400 mt-0.5" />
                  <a
                    href={`mailto:${order.guestEmail || order.user?.email}`}
                    className="text-gray-900 hover:text-orange-500 transition"
                  >
                    {order.guestEmail || order.user?.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-orange-500" />
              Adresa dostave
            </h2>

            <div className="space-y-2 text-gray-700">
              <p className="font-medium">{order.shippingName}</p>
              <p>{order.shippingAddress}</p>
              <p>
                {order.shippingZip && `${order.shippingZip} `}
                {order.shippingCity}
              </p>
              <p>{order.shippingPhone}</p>
            </div>

            {order.shippingNote && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Napomena:</p>
                <p className="text-gray-700">{order.shippingNote}</p>
              </div>
            )}
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-orange-500" />
              Plaćanje
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Način plaćanja</span>
                <span className="font-medium text-gray-900">
                  {order.paymentMethod === "COD" ? "Pouzeće" : order.paymentMethod}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span
                  className={`font-medium ${
                    order.isPaid ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {order.isPaid ? "Plaćeno" : "Čeka naplatu"}
                </span>
              </div>

              {order.isPaid && order.paidAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Datum plaćanja</span>
                  <span className="font-medium text-gray-900">
                    {new Date(order.paidAt).toLocaleDateString("bs-BA")}
                  </span>
                </div>
              )}

              {order.isB2B && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tip kupca</span>
                  <span className="font-medium text-purple-600">B2B</span>
                </div>
              )}

              {order.invoiceRequested && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Faktura</span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 rounded text-sm font-medium">
                    <FileText size={14} />
                    Zahtjevana
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
