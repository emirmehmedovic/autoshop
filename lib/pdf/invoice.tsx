import React from "react"
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer"

// Stilovi za PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  companyInfo: {
    fontSize: 10,
    color: "#666",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    padding: 8,
    fontWeight: "bold",
    borderBottom: "2px solid #e5e7eb",
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottom: "1px solid #e5e7eb",
  },
  col1: { width: "50%" },
  col2: { width: "15%", textAlign: "center" },
  col3: { width: "15%", textAlign: "right" },
  col4: { width: "20%", textAlign: "right", fontWeight: "bold" },
  totals: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 5,
    width: "50%",
  },
  totalLabel: {
    width: "60%",
    textAlign: "right",
    paddingRight: 10,
  },
  totalValue: {
    width: "40%",
    textAlign: "right",
  },
  grandTotal: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    paddingTop: 10,
    borderTop: "2px solid #333",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#999",
  },
})

interface InvoiceData {
  invoiceNumber: string
  orderNumber: string
  date: Date
  companyInfo: {
    name: string
    address: string
    pib: string
    phone: string
    email: string
  }
  customer: {
    name: string
    address: string
    city: string
    zip?: string
    pib?: string
    companyName?: string
  }
  items: Array<{
    name: string
    quantity: number
    unitPrice: number
    total: number
  }>
  subtotal: number
  shipping: number
  discount: number
  total: number
}

export function InvoiceDocument({ data }: { data: InvoiceData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>FAKTURA</Text>
          <Text style={styles.companyInfo}>{data.companyInfo.name}</Text>
          <Text style={styles.companyInfo}>{data.companyInfo.address}</Text>
          <Text style={styles.companyInfo}>PIB: {data.companyInfo.pib}</Text>
          <Text style={styles.companyInfo}>Tel: {data.companyInfo.phone}</Text>
          <Text style={styles.companyInfo}>Email: {data.companyInfo.email}</Text>
        </View>

        {/* Invoice info */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text>Broj fakture:</Text>
            <Text style={{ fontWeight: "bold" }}>{data.invoiceNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text>Broj narudžbe:</Text>
            <Text>{data.orderNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text>Datum:</Text>
            <Text>{new Date(data.date).toLocaleDateString("bs-BA")}</Text>
          </View>
        </View>

        {/* Customer info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kupac:</Text>
          {data.customer.companyName && (
            <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
              {data.customer.companyName}
            </Text>
          )}
          <Text>{data.customer.name}</Text>
          <Text>{data.customer.address}</Text>
          <Text>
            {data.customer.zip && `${data.customer.zip} `}
            {data.customer.city}
          </Text>
          {data.customer.pib && <Text>PIB: {data.customer.pib}</Text>}
        </View>

        {/* Items table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Proizvod</Text>
            <Text style={styles.col2}>Kol.</Text>
            <Text style={styles.col3}>Cijena</Text>
            <Text style={styles.col4}>Ukupno</Text>
          </View>

          {data.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.col1}>{item.name}</Text>
              <Text style={styles.col2}>{item.quantity}</Text>
              <Text style={styles.col3}>{item.unitPrice.toFixed(2)} KM</Text>
              <Text style={styles.col4}>{item.total.toFixed(2)} KM</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Međuzbir:</Text>
            <Text style={styles.totalValue}>{data.subtotal.toFixed(2)} KM</Text>
          </View>

          {data.discount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Popust:</Text>
              <Text style={styles.totalValue}>-{data.discount.toFixed(2)} KM</Text>
            </View>
          )}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Dostava:</Text>
            <Text style={styles.totalValue}>
              {data.shipping === 0 ? "Besplatna" : `${data.shipping.toFixed(2)} KM`}
            </Text>
          </View>

          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text style={styles.totalLabel}>UKUPNO:</Text>
            <Text style={styles.totalValue}>{data.total.toFixed(2)} KM</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          AutoShop • www.autoshop.ba • Hvala na kupovini!
        </Text>
      </Page>
    </Document>
  )
}
