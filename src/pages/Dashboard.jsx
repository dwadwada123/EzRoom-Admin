import {
  UserOutlined,
  HomeOutlined,
  HourglassOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
  CartesianGrid,
} from "recharts";

// Analytics dashboard chart data
const analyticsData = [
  { name: "Tháng 1", deposit: 120, commission: 6.0 },
  { name: "Tháng 2", deposit: 155, commission: 7.75 },
  { name: "Tháng 3", deposit: 180, commission: 9.0 },
  { name: "Tháng 4", deposit: 220, commission: 11.0 },
  { name: "Tháng 5", deposit: 248, commission: 12.4 },
  { name: "Tháng 6", deposit: 310, commission: 15.5 },
];

// Dashboard component
function Dashboard() {
  return (
    // Dashboard main container
    <div className="space-y-8">
      {/* Analytics stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Card 1: Users */}
        <div className="bg-surfaceLight rounded-xl p-6 shadow-sm border border-onBackgroundLight/5 flex items-start justify-between">
          <div className="space-y-2">
            <span className="text-sm font-medium text-onBackgroundLight/50">
              Tổng thành viên
            </span>
            <div className="text-3xl font-extrabold text-onBackgroundLight">
              1,244
            </div>
            <p className="text-xs text-onBackgroundLight/40 font-medium">
              344 Chủ nhà | 900 Người thuê
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orangePrimary/10 flex items-center justify-center text-orangePrimary text-xl">
            <UserOutlined />
          </div>
        </div>

        {/* Card 2: Rooms */}
        <div className="bg-surfaceLight rounded-xl p-6 shadow-sm border border-onBackgroundLight/5 flex items-start justify-between">
          <div className="space-y-2">
            <span className="text-sm font-medium text-onBackgroundLight/50">
              Tổng phòng trọ
            </span>
            <div className="text-3xl font-extrabold text-onBackgroundLight">
              582
            </div>
            <p className="text-xs text-onBackgroundLight/40 font-medium">
              Đang hoạt động trên hệ thống
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 text-xl">
            <HomeOutlined />
          </div>
        </div>

        {/* Card 3: Pending verification */}
        <div className="bg-surfaceLight rounded-xl p-6 shadow-sm border border-onBackgroundLight/5 flex items-start justify-between">
          <div className="space-y-2">
            <span className="text-sm font-medium text-onBackgroundLight/50">
              Phòng chờ duyệt
            </span>
            <div className="text-3xl font-extrabold text-orangePrimary">
              24
            </div>
            <p className="text-xs text-onBackgroundLight/40 font-medium">
              Yêu cầu đăng tải mới
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orangePrimary/10 flex items-center justify-center text-orangePrimary text-xl">
            <HourglassOutlined />
          </div>
        </div>

        {/* Card 4: eKYC processes */}
        <div className="bg-surfaceLight rounded-xl p-6 shadow-sm border border-onBackgroundLight/5 flex items-start justify-between">
          <div className="space-y-2">
            <span className="text-sm font-medium text-onBackgroundLight/50">
              eKYC chờ xử lý
            </span>
            <div className="text-3xl font-extrabold text-tealAccent">
              12
            </div>
            <p className="text-xs text-onBackgroundLight/40 font-medium">
              Hồ sơ xác thực danh tính
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-tealAccent/10 flex items-center justify-center text-tealAccent text-xl">
            <IdcardOutlined />
          </div>
        </div>
      </div>

      {/* Revenue chart widget */}
      <div className="bg-surfaceLight rounded-xl p-6 shadow-sm border border-onBackgroundLight/5">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-onBackgroundLight">
            Phân tích doanh thu & Hoa hồng hệ thống (5%)
          </h3>
          <p className="text-sm text-onBackgroundLight/40">
            Dữ liệu thống kê 6 tháng gần nhất
          </p>
        </div>

        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={analyticsData}
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                stroke="#6B7280"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                yAxisId="left"
                tickLine={false}
                axisLine={false}
                stroke="#6B7280"
                style={{ fontSize: "12px" }}
                unit=" Tr"
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                stroke="#6B7280"
                style={{ fontSize: "12px" }}
                unit=" Tr"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid rgba(33, 33, 33, 0.1)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value) => [`${value} Triệu VNĐ`]}
              />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: "13px" }}
              />
              <Bar
                yAxisId="left"
                dataKey="deposit"
                name="Tổng tiền cọc giao dịch"
                fill="#FFCDBC"
                radius={[4, 4, 0, 0]}
                barSize={40}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="commission"
                name="Tiền hoa hồng thu về (5%)"
                stroke="#FF6F43"
                strokeWidth={3}
                dot={{ r: 4, fill: "#FF6F43" }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
