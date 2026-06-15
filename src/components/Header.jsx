import { LogoutOutlined } from "@ant-design/icons";

// Header component
function Header({ activeTab, onLogout }) {
  // Map tab key to uppercase Vietnamese title
  const getHeaderTitle = (tab) => {
    switch (tab) {
      case "dashboard":
        return "BẢNG ĐIỀU KHIỂN";
      case "transactions":
        return "LỊCH SỬ GIAO DỊCH HỆ THỐNG";
      case "ekyc":
        return "DUYỆT ĐỊNH DANH EKYC";
      case "contracts":
        return "QUẢN LÝ HỢP ĐỒNG HỆ THỐNG";
      case "amenities":
        return "QUẢN LÝ DANH MỤC TIỆN ÍCH TRỌ";
      case "moderation":
        return "KIỂM DUYỆT BÀI ĐĂNG";
      case "users":
        return "QUẢN LÝ TÀI KHOẢN";
      default:
        return "HỆ THỐNG QUẢN TRỊ";
    }
  };

  return (
    // Header container
    <header className="h-16 bg-surfaceLight shadow-sm flex items-center justify-between px-6 z-10 flex-shrink-0">
      {/* Active tab title */}
      <h2 className="text-lg font-bold text-onBackgroundLight tracking-wide">
        {getHeaderTitle(activeTab)}
      </h2>

      {/* User profile and actions */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          {/* User avatar */}
          <div className="w-9 h-9 rounded-full bg-orangePrimary/10 flex items-center justify-center overflow-hidden">
            <svg
              className="w-6 h-6 text-orangePrimary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>

          {/* User info */}
          <div className="flex flex-col text-left">
            <span className="text-sm font-semibold text-onBackgroundLight">
              Trần Vũ Phong
            </span>
            <span className="text-xs text-onBackgroundLight/50">
              Quản trị viên
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-[1px] h-6 bg-onBackgroundLight/10" />

        {/* Logout button */}
        <button
          onClick={onLogout}
          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
          title="Đăng xuất"
        >
          <LogoutOutlined className="text-lg" />
        </button>
      </div>
    </header>
  );
}

export default Header;
