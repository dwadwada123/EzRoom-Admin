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
    <div className="space-y-6">
      {/* Asymmetric main grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3 width): Stats and Revenue Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subgrid for primary stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Users */}
            <div className="bg-surfaceLight/80 backdrop-blur-sm rounded-2xl p-6 border border-onBackgroundLight/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-start justify-between hover:-translate-y-1 hover:border-blue-500/20 hover:shadow-[0_12px_24px_rgba(59,130,246,0.15)] transition-all duration-300 group">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-onBackgroundLight/40 tracking-wider uppercase">
                    Tổng thành viên
                  </span>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                </div>
                <div className="text-4xl font-light text-onBackgroundLight tracking-tight mt-1">
                  1,244
                </div>
                <p className="text-xs text-onBackgroundLight/40 font-medium pt-1">
                  344 Chủ nhà (72% đã duyệt eKYC) | 900 Người thuê
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-xl shadow-[0_0_15px_rgba(59,130,246,0.15)] group-hover:scale-110 transition-transform duration-300">
                <UserOutlined className="drop-shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
              </div>
            </div>

            {/* Card 2: Rooms & Properties */}
            <div className="bg-surfaceLight/80 backdrop-blur-sm rounded-2xl p-6 border border-onBackgroundLight/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-start justify-between hover:-translate-y-1 hover:border-purple-500/20 hover:shadow-[0_12px_24px_rgba(168,85,247,0.15)] transition-all duration-300 group">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-onBackgroundLight/40 tracking-wider uppercase">
                    Cơ sở lưu trú
                  </span>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                  </span>
                </div>
                <div className="text-4xl font-light text-onBackgroundLight tracking-tight mt-1">
                  582 <span className="text-sm font-semibold text-onBackgroundLight/50">phòng</span>
                </div>
                <p className="text-xs text-onBackgroundLight/40 font-medium pt-1">
                  128 Tòa nhà/Dãy trọ | 240 Phòng lẻ
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 text-xl shadow-[0_0_15px_rgba(168,85,247,0.15)] group-hover:scale-110 transition-transform duration-300">
                <HomeOutlined className="drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
              </div>
            </div>
          </div>

          {/* Revenue chart widget */}
          <div className="bg-surfaceLight/80 backdrop-blur-sm rounded-2xl p-6 border border-onBackgroundLight/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-onBackgroundLight">
                  Phân tích doanh thu & Hoa hồng hệ thống (5%)
                </h3>
                <p className="text-sm text-onBackgroundLight/40">
                  Dữ liệu thống kê 6 tháng gần nhất
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-techMintAccent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-techMintAccent"></span>
                </span>
                <span className="text-xs text-onBackgroundLight/40 font-medium">Cập nhật thời gian thực</span>
              </div>
            </div>

            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={analyticsData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                >
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0284C7" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#0284C7" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#0284C7" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    stroke="#9CA3AF"
                    style={{ fontSize: "11px", fontWeight: 500 }}
                  />
                  <YAxis
                    yAxisId="left"
                    tickLine={false}
                    axisLine={false}
                    stroke="#9CA3AF"
                    style={{ fontSize: "11px", fontWeight: 500 }}
                    unit=" Tr"
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickLine={false}
                    axisLine={false}
                    stroke="#9CA3AF"
                    style={{ fontSize: "11px", fontWeight: 500 }}
                    unit=" Tr"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(15, 23, 42, 0.05)",
                      borderRadius: "16px",
                      boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
                      padding: "12px 16px",
                      fontFamily: "'Plus Jakarta Sans', sans-serif"
                    }}
                    formatter={(value) => [`${value} Triệu VNĐ`]}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ fontSize: "12px", fontWeight: 500 }}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="deposit"
                    name="Tổng tiền cọc giao dịch"
                    fill="url(#barGradient)"
                    radius={[8, 8, 0, 0]}
                    barSize={40}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="commission"
                    name="Tiền hoa hồng thu về (5%)"
                    stroke="url(#lineGradient)"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#0284C7", strokeWidth: 0 }}
                    activeDot={{ r: 7 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column (1/3 width): Pending and eKYC Cards */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Card 3: Pending verification */}
          <div className="bg-surfaceLight/80 backdrop-blur-sm rounded-2xl p-6 border border-onBackgroundLight/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-start justify-between hover:-translate-y-1 hover:border-amber-500/20 hover:shadow-[0_12px_24px_rgba(245,158,11,0.15)] transition-all duration-300 group flex-1">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-onBackgroundLight/40 tracking-wider uppercase">
                  Phòng chờ duyệt
                </span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
              </div>
              <div className="text-4xl font-light text-amber-600 tracking-tight mt-1">
                24
              </div>
              <p className="text-xs text-onBackgroundLight/40 font-medium pt-1">
                Yêu cầu đăng tải mới
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 text-xl shadow-[0_0_15px_rgba(245,158,11,0.15)] group-hover:scale-110 transition-transform duration-300">
              <HourglassOutlined className="animate-spin [animation-duration:10s] drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
            </div>
          </div>

          {/* Card 4: eKYC processes */}
          <div className="bg-surfaceLight/80 backdrop-blur-sm rounded-2xl p-6 border border-onBackgroundLight/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-start justify-between hover:-translate-y-1 hover:border-emerald-500/20 hover:shadow-[0_12px_24px_rgba(16,185,129,0.15)] transition-all duration-300 group flex-1">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-onBackgroundLight/40 tracking-wider uppercase">
                  eKYC chờ xử lý
                </span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <div className="text-4xl font-light text-emerald-600 tracking-tight mt-1">
                12
              </div>
              <p className="text-xs text-onBackgroundLight/40 font-medium pt-1">
                Hồ sơ xác thực danh tính
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 text-xl shadow-[0_0_15px_rgba(16,185,129,0.15)] group-hover:scale-110 transition-transform duration-300">
              <IdcardOutlined className="drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
