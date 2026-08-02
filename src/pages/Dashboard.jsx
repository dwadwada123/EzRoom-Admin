import { useState, useEffect } from "react";
import API_BASE_URL from "../config/api";
import { Select } from "antd";
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
  CartesianGrid,
} from "recharts";

// Dashboard component
function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalHosts: 0,
    ekycHostsPercent: 0,
    totalRenters: 0,
    totalProperties: 0,
    complexProperties: 0,
    singleProperties: 0,
    totalRooms: 0,
    activeRooms: 0,
    pendingRooms: 0,
    pendingEkyc: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [chartMonths, setChartMonths] = useState(6); // Month range filter
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (token === null) return;
        const res = await fetch(`${API_BASE_URL}/api/admin/dashboard-stats`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        // Handle token expiry
        if (res.status === 401) { localStorage.removeItem("adminToken"); window.location.reload(); return; }
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          setChartData(data.analyticsData);
        }
      } catch (err) {
        console.error("Không thể kết nối đến server backend:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Filter chart data by months
  const visibleChartData = chartData.slice(-chartMonths);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-techBluePrimary"></div>
      </div>
    );
  }

  return (
    // Dashboard container
    <div className="space-y-6">
      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats subgrid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Users stat */}
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
                    {stats.totalUsers.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-slate-400 font-semibold pt-1">
                    {stats.totalHosts} Chủ nhà ({stats.ekycHostsPercent}% đã duyệt eKYC) | {stats.totalRenters} Người thuê
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-center text-blue-600 text-lg shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] transition-transform duration-500 ease-premium group-hover:scale-115">
                  <UserOutlined className="drop-shadow-[0_2px_4px_rgba(37,99,235,0.15)]" />
                </div>
              </div>
            </div>

            {/* Rooms stat */}
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
                    {stats.totalRooms} <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">phòng</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-semibold pt-1">
                    {stats.complexProperties} Dãy trọ (Complex) | {stats.singleProperties} Phòng lẻ
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center justify-center text-purple-600 text-lg shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] transition-transform duration-500 ease-premium group-hover:scale-115">
                  <HomeOutlined className="drop-shadow-[0_2px_4px_rgba(168,85,247,0.15)]" />
                </div>
              </div>
            </div>

          </div>

          {/* Revenue chart */}
          <div className="double-bezel-outer">
            <div className="double-bezel-inner p-6 bg-white/95">
              <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-onBackgroundLight uppercase tracking-wider">
                    Phân tích doanh thu & Hoa hồng hệ thống (5%)
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold mt-1">
                    Dữ liệu thống kê 6 tháng gần nhất (Tr. đ)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Month range selector */}
                  <Select
                    size="small"
                    value={chartMonths}
                    onChange={setChartMonths}
                    options={[
                      { value: 3, label: "3 tháng" },
                      { value: 6, label: "6 tháng" },
                      { value: 12, label: "12 tháng" },
                    ]}
                    className="w-28"
                  />
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-techMintAccent opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-techMintAccent"></span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cập nhật tự động</span>
                  </div>
                </div>
              </div>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={visibleChartData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                  >
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0284C7" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#0284C7" stopOpacity={0.02} />
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
                      dataKey="deposit"
                      name="Tổng tiền cọc giao dịch"
                      fill="url(#barGradient)"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="commission"
                      name="Doanh thu hoa hồng 5%"
                      fill="#10B981"
                      radius={[6, 6, 0, 0]}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Pending rooms */}
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
                  {stats.pendingRooms}
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

          {/* Pending eKYC */}
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
                  {stats.pendingEkyc}
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
