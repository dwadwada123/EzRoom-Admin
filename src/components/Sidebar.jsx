import {
  DashboardOutlined,
  VerifiedOutlined,
  FileProtectOutlined,
  TeamOutlined,
  AppstoreAddOutlined,
  TransactionOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

// Sidebar component
function Sidebar({ activeTab, setActiveTab }) {
  // Append tab item link matrix
  const menuItems = [
    { key: "dashboard", label: "Bảng điều khiển", icon: <DashboardOutlined /> },
    { key: "transactions", label: "Lịch sử Giao dịch", icon: <TransactionOutlined /> },
    { key: "ekyc", label: "Duyệt định danh eKYC", icon: <VerifiedOutlined /> },
    { key: "contracts", label: "Quản lý Hợp đồng", icon: <FileTextOutlined /> },
    { key: "amenities", label: "Quản lý Tiện ích", icon: <AppstoreAddOutlined /> },
    { key: "moderation", label: "Kiểm duyệt bài đăng", icon: <FileProtectOutlined /> },
    { key: "users", label: "Quản lý tài khoản", icon: <TeamOutlined /> },
  ];

  return (
    // Floating Sidebar wrapper with padding
    <aside className="w-66 h-screen p-4 pr-2 flex-shrink-0">
      {/* Floating glass panel container */}
      <div className="h-full bg-surfaceLight/80 backdrop-blur-md rounded-2xl border border-onBackgroundLight/5 shadow-2xl flex flex-col overflow-hidden">
        {/* Sidebar header logo */}
        <div className="h-16 flex items-center px-6 border-b border-onBackgroundLight/5">
          <span className="text-xl font-bold text-techBluePrimary tracking-wide drop-shadow-[0_2px_8px_rgba(2,132,199,0.15)]">
            EzRoom Admin
          </span>
        </div>

        {/* Navigation menu list */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 text-left relative ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-[0_4px_14px_rgba(37,99,235,0.25)] border-l-4 border-blue-300"
                    : "text-onBackgroundLight/60 hover:bg-slate-50 hover:text-techBluePrimary border-l-4 border-transparent"
                }`}
              >
                <span className="text-lg flex items-center">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
