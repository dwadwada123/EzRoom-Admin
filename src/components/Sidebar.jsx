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
    // Sidebar container
    <aside className="w-64 h-screen bg-surfaceLight border-r border-onBackgroundLight/10 flex flex-col flex-shrink-0">
      {/* Sidebar header */}
      <div className="h-16 flex items-center px-6 border-b border-onBackgroundLight/10">
        <span className="text-xl font-bold text-orangePrimary tracking-wide">
          EzRoom Admin
        </span>
      </div>

      {/* Navigation menu list */}
      <nav className="flex-1 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-3 py-3 px-6 transition-all duration-200 text-left ${
                isActive
                  ? "bg-orangePrimary/10 text-orangePrimary font-semibold border-r-4 border-orangePrimary"
                  : "text-onBackgroundLight/60 hover:bg-orangePrimary/5 hover:text-orangePrimary border-r-4 border-transparent"
              }`}
            >
              <span className="text-lg flex items-center">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
