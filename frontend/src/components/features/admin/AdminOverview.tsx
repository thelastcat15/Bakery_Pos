import { getTopProducts } from "@/services/report_service"
import { ReportProduct } from "@/types/product_type"
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

// Mock sales data
const weekSales = 25000
const monthSales = 120000
const yearSales = 1200000
const totalSales = 3500000


const mockHourlySales = [
  { hour: "6:00", sales: 5 },
  { hour: "7:00", sales: 12 },
  { hour: "8:00", sales: 25 },
  { hour: "9:00", sales: 18 },
  { hour: "10:00", sales: 22 },
  { hour: "11:00", sales: 30 },
  { hour: "12:00", sales: 45 },
  { hour: "13:00", sales: 38 },
  { hour: "14:00", sales: 28 },
  { hour: "15:00", sales: 35 },
  { hour: "16:00", sales: 20 },
  { hour: "17:00", sales: 15 },
  { hour: "18:00", sales: 8 },
]

const AdminOverview = () => {
  const [topProducts, setTopProducts] = useState<ReportProduct[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTopProducts();
      setTopProducts(data);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">ภาพรวมของร้าน</h2>

      {/* Statistic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm text-gray-600">ยอดขายทั้งสัปดาห์</h3>
          <p className="text-2xl font-bold text-green-600">
            ฿{weekSales.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm text-gray-600">ยอดขายทั้งเดือน</h3>
          <p className="text-2xl font-bold text-blue-600">
            ฿{monthSales.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm text-gray-600">ยอดขายทั้งปี</h3>
          <p className="text-2xl font-bold text-purple-600">
            ฿{yearSales.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm text-gray-600">ยอดขายทั้งหมด</h3>
          <p className="text-2xl font-bold text-amber-600">
            ฿{totalSales.toLocaleString()}
          </p>
        </div>
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
          <LineChart data={mockHourlySales}>
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
