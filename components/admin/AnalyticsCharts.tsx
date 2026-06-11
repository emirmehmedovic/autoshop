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
      <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <div className="w-1 h-6 bg-lime-400 rounded-full mr-3" />
          Prihod vs Ad Spend
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <Tooltip
              formatter={(value) => `${Number(value || 0).toFixed(2)} KM`}
              contentStyle={{
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#fff'
              }}
            />
            <Legend wrapperStyle={{ color: '#9ca3af' }} />
            <Line
              type="monotone"
              dataKey="prihod"
              stroke="#a3e635"
              strokeWidth={3}
              name="Prihod"
              dot={{ fill: '#a3e635', r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="spend"
              stroke="#60a5fa"
              strokeWidth={3}
              name="Ad Spend"
              dot={{ fill: '#60a5fa', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ROAS po danima */}
      <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <div className="w-1 h-6 bg-purple-400 rounded-full mr-3" />
          ROAS po danima
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <Tooltip
              formatter={(value) => `${Number(value || 0).toFixed(2)}x`}
              contentStyle={{
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#fff'
              }}
            />
            <Legend wrapperStyle={{ color: '#9ca3af' }} />
            <Bar dataKey="roas" fill="#a78bfa" name="ROAS" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
