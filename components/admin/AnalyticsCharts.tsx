"use client"

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface AnalyticsChartsProps {
  revenueByDate: Record<string, number>
  adSpendByDate: Record<string, number>
}

export function AnalyticsCharts({ revenueByDate, adSpendByDate }: AnalyticsChartsProps) {
  // Kombinovanje podataka za grafik
  const allDates = Array.from(
    new Set([...Object.keys(revenueByDate), ...Object.keys(adSpendByDate)])
  ).sort()

  const chartData = allDates.map((date) => ({
    date: new Date(date).toLocaleDateString("bs-BA", { month: "short", day: "numeric" }),
    prihod: revenueByDate[date] || 0,
    spend: adSpendByDate[date] || 0,
    roas: adSpendByDate[date] ? (revenueByDate[date] || 0) / adSpendByDate[date] : 0,
  }))

  return (
    <div className="space-y-8">
      {/* Prihod vs Ad Spend */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <div className="w-1 h-6 bg-orange-500 rounded-full mr-3" />
          Prihod vs Ad Spend
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
            <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
            <Tooltip
              formatter={(value) => `${Number(value || 0).toFixed(2)} KM`}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                color: '#111827',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend wrapperStyle={{ color: '#6b7280' }} />
            <Line
              type="monotone"
              dataKey="prihod"
              stroke="#f97316"
              strokeWidth={3}
              name="Prihod"
              dot={{ fill: '#f97316', r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="spend"
              stroke="#3b82f6"
              strokeWidth={3}
              name="Ad Spend"
              dot={{ fill: '#3b82f6', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ROAS po danima */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <div className="w-1 h-6 bg-purple-500 rounded-full mr-3" />
          ROAS po danima
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
            <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
            <Tooltip
              formatter={(value) => `${Number(value || 0).toFixed(2)}x`}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                color: '#111827',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend wrapperStyle={{ color: '#6b7280' }} />
            <Bar dataKey="roas" fill="#8b5cf6" name="ROAS" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
