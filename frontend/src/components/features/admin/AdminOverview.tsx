import { getTopProducts, getSalesByHour, getSalesByDay, getProductSalesSummary } from "@/services/report_service"
import { ReportProduct, SalesByHourReport, SalesByDayReport, ProductSalesSummary } from "@/types/product_type"
import { useEffect, useState } from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

// transient UI state (will be populated from API)
const INITIAL_NUMBER = 0


// chart data shape: { hour: string, sales: number }

const AdminOverview = () => {
  const [topProducts, setTopProducts] = useState<ReportProduct[]>([])
  const [hourlySales, setHourlySales] = useState<{ hour: string; sales: number }[]>([])
  const [daySales, setDaySales] = useState<{ date: string; total: number }[]>([])
  const [weekSales, setWeekSales] = useState<number>(INITIAL_NUMBER)
  const [monthSales, setMonthSales] = useState<number>(INITIAL_NUMBER)
  const [yearSales, setYearSales] = useState<number>(INITIAL_NUMBER)
  const [totalSales, setTotalSales] = useState<number>(INITIAL_NUMBER)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [chartsLoading, setChartsLoading] = useState<boolean>(true)
  const [chartsError, setChartsError] = useState<string | null>(null)

  const todayStr = new Date().toISOString().slice(0, 10)
  const [selectedDate, setSelectedDate] = useState<string>(todayStr)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        // top products and hourly
        const [productsData, hourlyData, productSummaries] = await Promise.all([
          getTopProducts(),
          getSalesByHour(),
          getProductSalesSummary(),
        ])

        setTopProducts(productsData || [])

        const chart = (hourlyData || []).map((h: SalesByHourReport) => ({
          hour: h.hour,
          sales: Math.round(h.total),
        }))
        setHourlySales(chart)

        // compute totalSales from product summaries
        const total = (productSummaries || []).reduce((s: number, p: ProductSalesSummary) => s + (p.total_revenue || 0), 0)
        setTotalSales(Math.round(total))

        // compute weekly, monthly, yearly sums using sales/daily endpoint
        const now = new Date()
        const toDate = (d: Date) => d.toISOString().slice(0, 10)

        // week: Monday..today
        const weekday = now.getDay() === 0 ? 7 : now.getDay()
        const monday = new Date(now)
        monday.setDate(now.getDate() - (weekday - 1))

        const weekStart = toDate(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate()))
        const today = toDate(now)

        // month start
        const monthStart = toDate(new Date(now.getFullYear(), now.getMonth(), 1))

        // year start
        const yearStart = toDate(new Date(now.getFullYear(), 0, 1))

        const [weekData, monthData, yearData] = await Promise.all([
          getSalesByDay(weekStart, today),
          getSalesByDay(monthStart, today),
          getSalesByDay(yearStart, today),
        ])

        const sum = (arr: SalesByDayReport[]) => (arr || []).reduce((s, r) => s + (r.total || 0), 0)
        setWeekSales(Math.round(sum(weekData)))
        setMonthSales(Math.round(sum(monthData)))
        setYearSales(Math.round(sum(yearData)))
      } catch (err: any) {
        console.error(err)
        setError(err?.message || "failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, []);

  // fetch charts (hourly for selectedDate and last-7-days daily totals)
  useEffect(() => {
    const fetchCharts = async (dateStr: string) => {
      setChartsLoading(true)
      setChartsError(null)
      try {
        const hourly = await getSalesByHour(dateStr)
        setHourlySales((hourly || []).map((h: SalesByHourReport) => ({ hour: h.hour, sales: Math.round(h.total) })))

        // last 7 days (inclusive) — fill missing days with 0
        const d = new Date(dateStr)
        const start = new Date(d)
        start.setDate(d.getDate() - 6)
        const startStr = start.toISOString().slice(0, 10)
        const daily = (await getSalesByDay(startStr, dateStr)) || []

        // build a map from date -> total for quick lookup
        const dailyMap = new Map<string, number>(
          daily.map((dd: SalesByDayReport) => [dd.date, dd.total || 0])
        )

        // produce exactly 7 entries from start .. selectedDate (inclusive)
        const days: { date: string; total: number }[] = []
        for (let i = 0; i < 7; i++) {
          const cur = new Date(start)
          cur.setDate(start.getDate() + i)
          const key = cur.toISOString().slice(0, 10)
          const total = Math.round(dailyMap.get(key) || 0)
          days.push({ date: key, total })
        }

        setDaySales(days)
      } catch (err: any) {
        console.error("charts error", err)
        setChartsError(err?.message || "failed to load charts")
      } finally {
        setChartsLoading(false)
      }
    }

    fetchCharts(selectedDate)
  }, [selectedDate])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">ภาพรวมของร้าน</h2>

      {/* Statistic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-6">กำลังโหลดข้อมูล...</div>
        ) : error ? (
          <div className="col-span-full text-center text-red-600 py-6">{error}</div>
        ) : (
          <>
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="text-sm text-gray-600">ยอดขายทั้งสัปดาห์</h3>
              <p className="text-2xl font-bold text-green-600">฿{weekSales.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="text-sm text-gray-600">ยอดขายทั้งเดือน</h3>
              <p className="text-2xl font-bold text-blue-600">฿{monthSales.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="text-sm text-gray-600">ยอดขายทั้งปี</h3>
              <p className="text-2xl font-bold text-purple-600">฿{yearSales.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="text-sm text-gray-600">ยอดขายทั้งหมด</h3>
              <p className="text-2xl font-bold text-amber-600">฿{totalSales.toLocaleString()}</p>
            </div>
          </>
        )}
      </div>

      {/* Top Selling Products */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">สินค้าขายดีประจำสัปดาห์</h3>
        <div className="space-y-3">
          {topProducts.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b">
              <span>{item.name}</span>
              <span className="font-semibold">{item.quantity} ชิ้น</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hourly Sales Chart */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">ยอดขายรายชั่วโมง</h3>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">เลือกวัน</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border px-2 py-1 rounded"
            />
          </div>
        </div>

        {chartsLoading ? (
          <div className="py-12 text-center text-gray-500">กำลังโหลดกราฟ...</div>
        ) : chartsError ? (
          <div className="py-6 text-center text-red-600">{chartsError}</div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {/* 24-hour chart for selectedDate */}
            <div className="bg-white">
              <h4 className="text-sm text-gray-600 px-4 pt-2">ย้อนหลัง 24 ชั่วโมง ({selectedDate})</h4>
              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <LineChart data={hourlySales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sales" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 7-day chart ending at selectedDate */}
            <div className="bg-white">
              <h4 className="text-sm text-gray-600 px-4 pt-2">ย้อนหลัง 7 วัน</h4>
              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <LineChart data={daySales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="total" stroke="#06b6d4" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminOverview
