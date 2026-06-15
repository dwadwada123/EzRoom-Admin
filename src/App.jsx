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
import Login from "./pages/Login";

// Theme token configuration
const themeConfig = {
  token: {
    colorPrimary: "#FF6F43",
    colorSuccess: "#00BFA5",
    colorBgLayout: "#F8F9FA",
  },
};

// Root component test UI
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("adminToken"));
  const [activeTab, setActiveTab] = useState("dashboard");

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
        <div className="flex h-screen w-screen overflow-hidden bg-backgroundLight">
          {/* Sidebar navigation */}
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Main layout container */}
          <div className="flex-1 h-screen overflow-hidden bg-backgroundLight flex flex-col">
            {/* Header */}
            <Header activeTab={activeTab} onLogout={handleLogout} />

            {/* Main content viewport */}
            <main className="p-6 overflow-y-auto h-[calc(100vh-64px)]">
              {renderContent()}
            </main>
          </div>
        </div>
      )}
    </ConfigProvider>
  );
}

export default App;