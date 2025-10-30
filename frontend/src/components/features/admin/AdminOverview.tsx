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
  const [weekSales, setWeekSales] = useState<number>(INITIAL_NUMBER)
  const [monthSales, setMonthSales] = useState<number>(INITIAL_NUMBER)
  const [yearSales, setYearSales] = useState<number>(INITIAL_NUMBER)
  const [totalSales, setTotalSales] = useState<number>(INITIAL_NUMBER)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

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
      <div className="bg-white rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">ยอดขายรายชั่วโมง (วันนี้)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={hourlySales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#f59e0b"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default AdminOverview
