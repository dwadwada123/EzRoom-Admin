import { LogoutOutlined, MenuOutlined } from "@ant-design/icons";

// Header component
function Header({ activeTab, onLogout, onToggleSidebar }) {
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
        return "KIỂM DUYỆT PHÒNG TRỌ";
      case "users":
        return "QUẢN LÝ TÀI KHOẢN";
      default:
        return "HỆ THỐNG QUẢN TRỊ";
    }
  };

  return (
    // Sticky frosted glass header
    <header className="sticky top-0 w-full h-16 bg-white/70 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 md:px-6 z-20 transition-all duration-500 ease-premium">
      {/* Active tab title */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-500 hover:text-techBluePrimary hover:bg-slate-50 rounded-xl transition-all duration-500 ease-premium active:scale-90 flex items-center justify-center border-none bg-transparent"
        >
          <MenuOutlined className="text-base" />
        </button>
        <h2 className="text-xs font-extrabold text-onBackgroundLight tracking-[0.16em] uppercase">
          {getHeaderTitle(activeTab)}
        </h2>
      </div>

      {/* User profile and actions */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          {/* User squircle avatar */}
          <div className="w-9 h-9 rounded-xl bg-techBluePrimary/10 flex items-center justify-center overflow-hidden border border-techBluePrimary/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]">
            <svg
              className="w-4 h-4 text-techBluePrimary"
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
            <span className="text-xs font-bold text-onBackgroundLight tracking-wide">
              Trần Vũ Phong
            </span>
            <span className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">
              Quản trị viên
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-[1px] h-5 bg-slate-100" />

        {/* Logout button */}
        <button
          onClick={onLogout}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50/60 rounded-xl transition-all duration-500 ease-premium active:scale-90"
          title="Đăng xuất"
        >
          <LogoutOutlined className="text-sm" />
        </button>
      </div>
    </header>
  );
}

export default Header;
