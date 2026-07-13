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
            <div className="double-bezel-outer transition-all duration-500 ease-premium hover:-translate-y-1 hover:shadow-lg group">
              <div className="double-bezel-inner p-6 flex items-start justify-between bg-white/95">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                      Tổng thành viên
                    </span>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold text-onBackgroundLight tracking-tight mt-1">
                    1,244
                  </div>
                  <p className="text-[11px] text-slate-400 font-semibold pt-1">
                    344 Chủ nhà (72% đã duyệt eKYC) | 900 Người thuê
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-center text-blue-600 text-lg shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] transition-transform duration-500 ease-premium group-hover:scale-115">
                  <UserOutlined className="drop-shadow-[0_2px_4px_rgba(37,99,235,0.15)]" />
                </div>
              </div>
            </div>

            {/* Card 2: Rooms & Properties */}
            <div className="double-bezel-outer transition-all duration-500 ease-premium hover:-translate-y-1 hover:shadow-lg group">
              <div className="double-bezel-inner p-6 flex items-start justify-between bg-white/95">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                      Cơ sở lưu trú
                    </span>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold text-onBackgroundLight tracking-tight mt-1">
                    582 <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">phòng</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-semibold pt-1">
                    128 Tòa nhà/Dãy trọ | 240 Phòng lẻ
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center justify-center text-purple-600 text-lg shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] transition-transform duration-500 ease-premium group-hover:scale-115">
                  <HomeOutlined className="drop-shadow-[0_2px_4px_rgba(168,85,247,0.15)]" />
                </div>
              </div>
            </div>

          </div>

          {/* Revenue chart widget */}
          <div className="double-bezel-outer">
            <div className="double-bezel-inner p-6 bg-white/95">
              <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-onBackgroundLight uppercase tracking-wider">
                    Phân tích doanh thu & Hoa hồng hệ thống (5%)
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold mt-1">
                    Dữ liệu thống kê 6 tháng gần nhất
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-techMintAccent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-techMintAccent"></span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cập nhật tự động</span>
                </div>
              </div>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={analyticsData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                  >
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0284C7" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#0284C7" stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#0284C7" />
                        <stop offset="100%" stopColor="#10B981" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#F8FAFC" />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      stroke="#94A3B8"
                      style={{ fontSize: "10px", fontWeight: 600 }}
                    />
                    <YAxis
                      yAxisId="left"
                      tickLine={false}
                      axisLine={false}
                      stroke="#94A3B8"
                      style={{ fontSize: "10px", fontWeight: 600 }}
                      unit=" Tr"
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tickLine={false}
                      axisLine={false}
                      stroke="#94A3B8"
                      style={{ fontSize: "10px", fontWeight: 600 }}
                      unit=" Tr"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(15, 23, 42, 0.04)",
                        borderRadius: "16px",
                        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
                        padding: "12px 16px",
                        fontFamily: "'Plus Jakarta Sans', sans-serif"
                      }}
                      formatter={(value) => [`${value} Triệu VNĐ`]}
                    />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      iconType="circle"
                      wrapperStyle={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.02em" }}
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="deposit"
                      name="Tổng tiền cọc giao dịch"
                      fill="url(#barGradient)"
                      radius={[6, 6, 0, 0]}
                      barSize={32}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="commission"
                      name="Tiền hoa hồng thu về (5%)"
                      stroke="url(#lineGradient)"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#0284C7", strokeWidth: 0 }}
                      activeDot={{ r: 6 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (1/3 width): Pending and eKYC Cards */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Card 3: Pending verification */}
          <div className="double-bezel-outer transition-all duration-500 ease-premium hover:-translate-y-1 hover:shadow-lg group flex-1 flex flex-col">
            <div className="double-bezel-inner p-6 flex items-start justify-between bg-white/95 flex-grow">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                    Phòng chờ duyệt
                  </span>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-amber-600 tracking-tight mt-1">
                  24
                </div>
                <p className="text-[11px] text-slate-400 font-semibold pt-1">
                  Yêu cầu đăng tải mới
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50/60 border border-amber-100 flex items-center justify-center text-amber-600 text-lg shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] transition-transform duration-500 ease-premium group-hover:scale-115">
                <HourglassOutlined className="animate-spin [animation-duration:12s] drop-shadow-[0_2px_4px_rgba(245,158,11,0.15)]" />
              </div>
            </div>
          </div>

          {/* Card 4: eKYC processes */}
          <div className="double-bezel-outer transition-all duration-500 ease-premium hover:-translate-y-1 hover:shadow-lg group flex-1 flex flex-col">
            <div className="double-bezel-inner p-6 flex items-start justify-between bg-white/95 flex-grow">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                    eKYC chờ xử lý
                  </span>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-emerald-600 tracking-tight mt-1">
                  12
                </div>
                <p className="text-[11px] text-slate-400 font-semibold pt-1">
                  Hồ sơ xác thực danh tính
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-center text-emerald-600 text-lg shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] transition-transform duration-500 ease-premium group-hover:scale-115">
                <IdcardOutlined className="drop-shadow-[0_2px_4px_rgba(16,185,129,0.15)]" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
