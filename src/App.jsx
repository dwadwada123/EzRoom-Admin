import { useState } from "react";
import { ConfigProvider } from "antd";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import EkycModeration from "./pages/EkycModeration";
import RoomModeration from "./pages/RoomModeration";
import UserManagement from "./pages/UserManagement";
import AmenityManagement from "./pages/AmenityManagement";
import TransactionHistory from "./pages/TransactionHistory";
import ContractManagement from "./pages/ContractManagement";
import DisputeResolution from "./pages/DisputeResolution";
import Login from "./pages/Login";

// Theme token configuration
const themeConfig = {
  token: {
    colorPrimary: "#0284C7",
    colorSuccess: "#10B981",
    colorBgLayout: "#F8FAFC",
    colorTextBase: "#0F172A",
    borderRadius: 14,
    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
  },
  components: {
    Button: {
      borderRadius: 14,
      controlHeight: 40,
    },
    Input: {
      borderRadius: 14,
      controlHeight: 40,
    },
    Select: {
      borderRadius: 14,
      controlHeight: 40,
    },
    Table: {
      headerBg: "transparent",
      headerColor: "rgba(15, 23, 42, 0.5)",
      rowHoverBg: "rgba(2, 132, 199, 0.03)",
    },
    Modal: {
      borderRadiusLG: 24,
    },
  },
};

// Root component test UI
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("adminToken"));
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle administrator logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsLoggedIn(false);
  };

  // Layout dynamic render matrix
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "transactions":
        return <TransactionHistory />;
      case "ekyc":
        return <EkycModeration />;
      case "contracts":
        return <ContractManagement />;
      case "amenities":
        return <AmenityManagement />;
      case "moderation":
        return <RoomModeration />;
      case "users":
        return <UserManagement />;
      case "disputes":
        return <DisputeResolution />;
      default:
        return null;
    }
  };

  return (
    <ConfigProvider theme={themeConfig}>
      {!isLoggedIn ? (
        <Login onLoginSuccess={() => setIsLoggedIn(true)} />
      ) : (
        /* Layout wrapper */
        <div className="flex h-screen w-screen overflow-hidden premium-mesh-bg">
          {/* Sidebar navigation */}
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setSidebarOpen(false); // Auto close sidebar on mobile tap
            }} 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen} 
          />

          {/* Main layout container with padding to create spacing from outer edges */}
          <div className="flex-grow h-screen p-4 lg:pl-2 flex flex-col w-full overflow-hidden">
            {/* Unified Floating Glass Card */}
            <div className="flex-grow h-full bg-surfaceLight/80 backdrop-blur-md rounded-2xl border border-onBackgroundLight/5 shadow-2xl flex flex-col overflow-hidden relative">
              {/* Header */}
              <Header 
                activeTab={activeTab} 
                onLogout={handleLogout} 
                onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
              />

              {/* Main content viewport scrolling independently */}
              <main className="p-4 md:p-6 flex-grow overflow-y-auto">
                {renderContent()}
              </main>
            </div>
          </div>
        </div>
      )}
    </ConfigProvider>
  );
}

export default App;