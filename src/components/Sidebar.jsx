import {
  DashboardOutlined,
  VerifiedOutlined,
  FileProtectOutlined,
  TeamOutlined,
  AppstoreAddOutlined,
  TransactionOutlined,
  FileTextOutlined,
  AlertOutlined,
} from "@ant-design/icons";

// Sidebar component
function Sidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) {
  // Append tab item link matrix
  const menuItems = [
    { key: "dashboard", label: "Bảng điều khiển", icon: <DashboardOutlined /> },
    { key: "transactions", label: "Lịch sử Giao dịch", icon: <TransactionOutlined /> },
    { key: "ekyc", label: "Duyệt định danh eKYC", icon: <VerifiedOutlined /> },
    { key: "contracts", label: "Quản lý Hợp đồng", icon: <FileTextOutlined /> },
    { key: "amenities", label: "Quản lý Tiện ích", icon: <AppstoreAddOutlined /> },
    { key: "moderation", label: "Kiểm duyệt phòng trọ", icon: <FileProtectOutlined /> },
    { key: "users", label: "Quản lý tài khoản", icon: <TeamOutlined /> },
    { key: "disputes", label: "Giải quyết khiếu nại", icon: <AlertOutlined /> },
  ];

  return (
    <>
      {/* Background backdrop overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-500 ease-premium"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Floating Sidebar wrapper with padding */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 w-66 h-screen p-4 lg:pr-2 flex-shrink-0 z-50 transition-transform duration-500 ease-premium lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Double-bezel outer structure */}
        <div className="double-bezel-outer h-full">
          {/* Double-bezel inner core */}
          <div className="double-bezel-inner h-full flex flex-col overflow-hidden bg-white/95 backdrop-blur-md">
            {/* Sidebar header logo */}
            <div className="h-16 flex items-center px-6 border-b border-slate-100 bg-slate-50/50 justify-between">
              <span className="text-base font-extrabold text-techBluePrimary tracking-wider uppercase drop-shadow-[0_2px_6px_rgba(2,132,199,0.08)]">
                EzRoom Admin
              </span>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-slate-400 hover:text-slate-600 font-bold border-none bg-transparent cursor-pointer text-sm p-1"
              >
                ✕
              </button>
            </div>

            {/* Navigation menu list */}
            <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-500 ease-premium text-left relative active:scale-[0.97] group ${
                      isActive
                        ? "bg-techBluePrimary text-white font-semibold shadow-[0_4px_12px_rgba(2,132,199,0.2)]"
                        : "text-onBackgroundLight/60 hover:bg-slate-50 hover:text-techBluePrimary"
                    }`}
                  >
                    <span className={`text-lg flex items-center transition-transform duration-500 ease-premium ${!isActive && "group-hover:scale-110"}`}>
                      {item.icon}
                    </span>
                    <span className="text-sm font-semibold tracking-wide">{item.label}</span>
                    {isActive && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
