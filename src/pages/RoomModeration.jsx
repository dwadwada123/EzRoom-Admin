import { useState, useEffect } from "react";
import { Tabs, Table, Modal, Input, Badge, message, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import API_BASE_URL from "../config/api";

// Room data mapper
const enrichRoomData = (room) => {
  const baseLat = room.propertyId === "prop1" ? 10.7291 : room.propertyId === "prop2" ? 21.0362 : 10.7626;
  const baseLng = room.propertyId === "prop1" ? 106.7022 : room.propertyId === "prop2" ? 105.7839 : 106.6601;

  // Fallback images
  const fallbackImages = [
    { url: room.imageUrl, category: "Mặt tiền" },
    { url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=600", category: "Phòng ngủ" },
    { url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=600", category: "WC" }
  ];

  return {
    ...room,
    latitude: room.latitude || baseLat + (Math.random() - 0.5) * 0.002,
    longitude: room.longitude || baseLng + (Math.random() - 0.5) * 0.002,
    images: room.images || fallbackImages,
    detailedAreas: room.detailedAreas || [
      { roomName: "Không gian chính", areaValue: Math.round(room.floorArea * 0.7 * 10) / 10 },
      { roomName: "Nhà vệ sinh khép kín", areaValue: Math.round(room.floorArea * 0.15 * 10) / 10 },
      { roomName: "Ban công rộng rãi", areaValue: Math.round(room.floorArea * 0.15 * 10) / 10 }
    ]
  };
};

function RoomModeration() {
  const [pendingData, setPendingData] = useState([]);
  const [reportedData, setReportedData] = useState([]);
  const [activeData, setActiveData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalSource, setModalSource] = useState(""); // "pending", "reported", "active", or "processed"
  const [actionReason, setActionReason] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`${API_BASE_URL}/api/admin/rooms/moderation`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.status === 401) { localStorage.removeItem("adminToken"); window.location.reload(); return; }
        const data = await res.json();
        if (Array.isArray(data)) {
          const enriched = data.map(enrichRoomData);
          setPendingData(enriched.filter(r => r.status === 'PENDING'));
          setActiveData(enriched.filter(r => (r.status === 'ACTIVE' || r.status === 'RENTED' || r.status === 'HIDDEN') && (!r.reports || r.reports.length === 0)));
          setReportedData(enriched.filter(r => r.status !== 'REMOVED' && r.status !== 'DELETED' && r.reports && r.reports.length > 0));
          setProcessedData(enriched.filter(r => r.status === 'REMOVED' || r.status === 'DELETED'));
        }
      } catch (err) {
        console.error("Lỗi lấy danh sách phòng trọ:", err);
        message.error("Lỗi lấy danh sách phòng trọ!");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [refreshTrigger]);

  // Aggregate report reasons
  const getSortedReasons = (reports) => {
    if (!reports || reports.length === 0) return [];
    const counts = {};
    reports.forEach((r) => {
      counts[r.reason] = (counts[r.reason] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count);
  };

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Filter list by search query
  const getFilteredList = (list) => {
    return list.filter((item) => {
      return (
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.propertyName && item.propertyName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  };

  const filteredPendingData = getFilteredList(pendingData);
  const filteredReportedData = getFilteredList(reportedData);
  const filteredActiveData = getFilteredList(activeData);
  const filteredProcessedData = getFilteredList(processedData);

  // Open modal
  const handleOpenModal = (item, source) => {
    setSelectedItem(item);
    setModalSource(source);
    setActionReason("");
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  // Approve room
  const approveRoomById = async (roomId) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_BASE_URL}/api/admin/rooms/${roomId}/moderate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ action: "APPROVE" })
      });
      const data = await res.json();
      if (data.success) {
        message.success("Phê duyệt phòng trọ thành công!");
        setRefreshTrigger(prev => prev + 1);
      } else {
        message.error("Lỗi phê duyệt phòng trọ!");
      }
    } catch (err) {
      console.error("Lỗi phê duyệt phòng trọ:", err);
      message.error("Lỗi kết nối máy chủ!");
    }
  };

  // Reject room
  const rejectRoomById = async (roomId, reason) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_BASE_URL}/api/admin/rooms/${roomId}/moderate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ action: "REJECT", reason })
      });
      const data = await res.json();
      if (data.success) {
        message.success("Từ chối đăng tải phòng trọ thành công!");
        setRefreshTrigger(prev => prev + 1);
      } else {
        message.error("Lỗi từ chối đăng tải!");
      }
    } catch (err) {
      console.error("Lỗi từ chối đăng tải phòng trọ:", err);
      message.error("Lỗi kết nối máy chủ!");
    }
  };

  // Approve listing
  const handleApprove = () => {
    if (!selectedItem) return;
    approveRoomById(selectedItem.id || selectedItem._id);
    handleCloseModal();
  };

  // Reject listing
  const handleReject = () => {
    if (!selectedItem) return;
    if (!actionReason.trim()) {
      message.error("Vui lòng nhập lý do từ chối!");
      return;
    }
    rejectRoomById(selectedItem.id || selectedItem._id, actionReason);
    handleCloseModal();
  };

  // Dismiss reports
  const handleKeep = async () => {
    if (!selectedItem) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_BASE_URL}/api/admin/rooms/${selectedItem.id || selectedItem._id}/moderate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ action: "DISMISS_REPORTS" })
      });
      const data = await res.json();
      if (data.success) {
        message.success("Bác bỏ báo cáo & Giữ lại phòng trọ thành công!");
        setRefreshTrigger(prev => prev + 1);
      } else {
        message.error("Lỗi xử lý giữ lại phòng trọ!");
      }
    } catch (err) {
      console.error("Lỗi giữ lại phòng trọ:", err);
      message.error("Lỗi kết nối máy chủ!");
    }
    handleCloseModal();
  };

  // Lock reported listing
  const handleTakeDown = async () => {
    if (!selectedItem) return;
    if (!actionReason.trim()) {
      message.error("Vui lòng nhập lý do khóa phòng!");
      return;
    }
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_BASE_URL}/api/admin/rooms/${selectedItem.id || selectedItem._id}/moderate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ action: "LOCK", reason: actionReason })
      });
      const data = await res.json();
      if (data.success) {
        message.success("Khóa phòng trọ vi phạm thành công!");
        setRefreshTrigger(prev => prev + 1);
      } else {
        message.error("Lỗi khóa phòng trọ!");
      }
    } catch (err) {
      console.error("Lỗi khóa phòng trọ:", err);
      message.error("Lỗi kết nối máy chủ!");
    }
    handleCloseModal();
  };

  // Hide active listing
  const handleHideActive = async () => {
    if (!selectedItem) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_BASE_URL}/api/admin/rooms/${selectedItem.id || selectedItem._id}/moderate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ action: "HIDE" })
      });
      const data = await res.json();
      if (data.success) {
        message.success("Đã ẩn phòng trọ thành công!");
        setRefreshTrigger(prev => prev + 1);
      } else {
        message.error("Lỗi ẩn phòng trọ!");
      }
    } catch (err) {
      console.error("Lỗi ẩn phòng trọ:", err);
      message.error("Lỗi kết nối máy chủ!");
    }
    handleCloseModal();
  };

  // Show active listing
  const handleShowActive = async () => {
    if (!selectedItem) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_BASE_URL}/api/admin/rooms/${selectedItem.id || selectedItem._id}/moderate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ action: "APPROVE" })
      });
      const data = await res.json();
      if (data.success) {
        message.success("Đã mở hiển thị phòng trọ thành công!");
        setRefreshTrigger(prev => prev + 1);
      } else {
        message.error("Lỗi mở hiển thị phòng trọ!");
      }
    } catch (err) {
      console.error("Lỗi hiển thị phòng trọ:", err);
      message.error("Lỗi kết nối máy chủ!");
    }
    handleCloseModal();
  };

  // Delete active listing
  const handleDeleteActive = async () => {
    if (!selectedItem) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_BASE_URL}/api/admin/rooms/${selectedItem.id || selectedItem._id}/moderate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ action: "LOCK", reason: "Yêu cầu xóa từ admin" })
      });
      const data = await res.json();
      if (data.success) {
        message.success("Đã xóa phòng trọ khỏi hệ thống!");
        setRefreshTrigger(prev => prev + 1);
      } else {
        message.error("Lỗi xóa phòng trọ!");
      }
    } catch (err) {
      console.error("Lỗi xóa phòng trọ:", err);
      message.error("Lỗi kết nối máy chủ!");
    }
    handleCloseModal();
  };

  // Pending columns
  const pendingColumns = [
    {
      title: "Tiêu đề phòng",
      dataIndex: "title",
      key: "title",
      render: (text) => <span className="font-semibold text-onBackgroundLight">{text}</span>,
    },
    {
      title: "Hình thức đăng",
      key: "propertyType",
      render: (_, record) => {
        if (record.propertyType === "COMPLEX") {
          return (
            <div className="flex flex-col text-left">
              <Tag color="cyan">Dãy trọ / Tòa nhà</Tag>
              <span className="text-[11px] text-onBackgroundLight/40 font-medium mt-1">
                {record.propertyName}
              </span>
            </div>
          );
        }
        return <Tag color="blue">Phòng lẻ</Tag>;
      },
    },
    {
      title: "Chủ trọ",
      dataIndex: "hostName",
      key: "hostName",
    },
    {
      title: "Giá thuê",
      dataIndex: "priceFormatted",
      key: "price",
    },
    {
      title: "Khu vực",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Tác vụ",
      key: "action",
      render: (_, record) => (
        <button
          onClick={() => handleOpenModal(record, "pending")}
          className="text-techBluePrimary font-semibold hover:text-techBluePrimary/80 transition-all duration-300 text-sm hover:underline hover:scale-105 active:scale-95 inline-block"
        >
          Xem chi tiết
        </button>
      ),
    },
  ];

  // Active columns
  const activeColumns = [
    {
      title: "Tiêu đề phòng",
      dataIndex: "title",
      key: "title",
      render: (text) => <span className="font-semibold text-onBackgroundLight">{text}</span>,
    },
    {
      title: "Hình thức đăng",
      key: "propertyType",
      render: (_, record) => {
        if (record.propertyType === "COMPLEX") {
          return (
            <div className="flex flex-col text-left">
              <Tag color="cyan">Dãy trọ / Tòa nhà</Tag>
              <span className="text-[11px] text-onBackgroundLight/40 font-medium mt-1">
                {record.propertyName}
              </span>
            </div>
          );
        }
        return <Tag color="blue">Phòng lẻ</Tag>;
      },
    },
    {
      title: "Chủ trọ",
      dataIndex: "hostName",
      key: "hostName",
    },
    {
      title: "Giá thuê",
      dataIndex: "priceFormatted",
      key: "price",
    },
    {
      title: "Trạng thái hiển thị",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        if (status === "ACTIVE") {
          return <Tag color="green">Đang hiển thị</Tag>;
        }
        return <Tag color="orange">Đã ẩn (Admin)</Tag>;
      },
    },
    {
      title: "Tác vụ",
      key: "action",
      render: (_, record) => (
        <button
          onClick={() => handleOpenModal(record, "active")}
          className="text-techBluePrimary font-semibold hover:text-techBluePrimary/80 transition-all duration-300 text-sm hover:underline hover:scale-105 active:scale-95 inline-block"
        >
          Quản lý phòng trọ
        </button>
      ),
    },
  ];

  // Reported columns
  const reportedColumns = [
    {
      title: "Tiêu đề phòng",
      dataIndex: "title",
      key: "title",
      render: (text) => <span className="font-semibold text-onBackgroundLight">{text}</span>,
    },
    {
      title: "Hình thức đăng",
      key: "propertyType",
      render: (_, record) => {
        if (record.propertyType === "COMPLEX") {
          return (
            <div className="flex flex-col text-left">
              <Tag color="cyan">Dãy trọ / Tòa nhà</Tag>
              <span className="text-[11px] text-onBackgroundLight/40 font-medium mt-1">
                {record.propertyName}
              </span>
            </div>
          );
        }
        return <Tag color="blue">Phòng lẻ</Tag>;
      },
    },
    {
      title: "Chủ trọ",
      dataIndex: "hostName",
      key: "hostName",
    },
    {
      title: "Số lượt báo cáo",
      key: "reportCount",
      render: (_, record) => (
        <span className="font-semibold text-slate-700">
          {record.reports?.length || 0} lượt
        </span>
      ),
    },
    {
      title: "Lý do vi phạm chính",
      key: "reason",
      render: (_, record) => {
        const sorted = getSortedReasons(record.reports);
        return sorted.length > 0 ? (
          <span className="text-red-500 font-medium">{sorted[0].reason}</span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      title: "Tác vụ",
      key: "action",
      render: (_, record) => (
        <button
          onClick={() => handleOpenModal(record, "reported")}
          className="text-red-500 font-semibold hover:text-red-700 transition-all duration-300 text-sm hover:underline hover:scale-105 active:scale-95 inline-block"
        >
          Xử lý vi phạm
        </button>
      ),
    },
  ];

  // Processed columns
  const processedColumns = [
    {
      title: "Tiêu đề phòng",
      dataIndex: "title",
      key: "title",
      render: (text) => <span className="font-semibold text-slate-700">{text}</span>,
    },
    {
      title: "Hình thức đăng",
      key: "propertyType",
      render: (_, record) => {
        if (record.propertyType === "COMPLEX") {
          return (
            <div className="flex flex-col text-left">
              <Tag color="cyan">Dãy trọ / Tòa nhà</Tag>
              <span className="text-[11px] text-onBackgroundLight/40 font-medium mt-1">
                {record.propertyName}
              </span>
            </div>
          );
        }
        return <Tag color="blue">Phòng lẻ</Tag>;
      },
    },
    {
      title: "Chủ trọ",
      dataIndex: "hostName",
      key: "hostName",
    },
    {
      title: "Trạng thái xử lý",
      key: "status",
      render: (_, record) => {
        if (record.status === "REMOVED") {
          return <Tag color="error">Đã gỡ / Vi phạm</Tag>;
        }
        return <Tag color="default">Đã xóa mềm</Tag>;
      },
    },
    {
      title: "Tác vụ",
      key: "action",
      render: (_, record) => (
        <button
          onClick={() => handleOpenModal(record, "processed")}
          className="text-techBluePrimary font-semibold hover:underline text-sm"
        >
          Xem chi tiết
        </button>
      ),
    },
  ];

  // Tabs configuration
  const tabItems = [
    {
      key: "pendingTab",
      label: (
        <span className="flex items-center gap-2">
          Chờ kiểm duyệt
          <Badge
            count={filteredPendingData.length}
            style={{ backgroundColor: "#0284C7" }}
          />
        </span>
      ),
      children: (
        <Table
          loading={loading}
          dataSource={filteredPendingData}
          columns={pendingColumns}
          rowKey={(record) => record._id || record.id}
          pagination={{ pageSize: 5 }}
          className="custom-premium-table"
        />
      ),
    },
    {
      key: "activeTab",
      label: (
        <span className="flex items-center gap-2">
          Đang hiển thị / Đã duyệt
          <Badge
            count={filteredActiveData.length}
            style={{ backgroundColor: "#10B981" }}
          />
        </span>
      ),
      children: (
        <Table
          loading={loading}
          dataSource={filteredActiveData}
          columns={activeColumns}
          rowKey={(record) => record._id || record.id}
          pagination={{ pageSize: 5 }}
          className="custom-premium-table"
        />
      ),
    },
    {
      key: "reportedTab",
      label: (
        <span className="flex items-center gap-2">
          Bị báo cáo vi phạm
          <Badge
            count={filteredReportedData.length}
            style={{ backgroundColor: "#FF4D4F" }}
          />
        </span>
      ),
      children: (
        <Table
          loading={loading}
          dataSource={filteredReportedData}
          columns={reportedColumns}
          rowKey={(record) => record._id || record.id}
          pagination={{ pageSize: 5 }}
          className="custom-premium-table"
        />
      ),
    },
    {
      key: "processedTab",
      label: (
        <span className="flex items-center gap-2">
          Đã xử lý
          <Badge
            count={filteredProcessedData.length}
            style={{ backgroundColor: "#94A3B8" }}
          />
        </span>
      ),
      children: (
        <Table
          loading={loading}
          dataSource={filteredProcessedData}
          columns={processedColumns}
          rowKey={(record) => record._id || record.id}
          pagination={{ pageSize: 5 }}
          className="custom-premium-table"
        />
      ),
    },
  ];

  return (
    // Moderation container
    <div className="double-bezel-outer animate-fade-in">
      <div className="double-bezel-inner p-6 bg-white/95 backdrop-blur-md">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-onBackgroundLight tracking-wider uppercase">
            QUẢN LÝ KIỂM DUYỆT PHÒNG
          </h3>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Phê duyệt phòng trọ mới, quản lý phòng trọ đang hoạt động và xử lý báo cáo vi phạm từ người thuê
          </p>
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]">
          {/* Search input */}
          <div className="flex-grow text-left">
            <Input
              prefix={<SearchOutlined className="text-slate-300" />}
              placeholder="Tìm theo tiêu đề, địa chỉ hoặc tên tòa nhà..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultActiveKey="pendingTab" items={tabItems} className="custom-tabs" />

        {/* Details modal */}
        <Modal
          title={
            <span className="text-sm font-bold text-onBackgroundLight tracking-wider uppercase">
              {modalSource === "pending" && `KIỂM DUYỆT PHÒNG`}
              {modalSource === "reported" && `XỬ LÝ VI PHẠM`}
              {modalSource === "active" && `QUẢN LÝ PHÒNG TRỌ ĐANG HIỂN THỊ`}
              {modalSource === "processed" && `CHI TIẾT PHÒNG ĐÃ XỬ LÝ`}
            </span>
          }
          open={isModalOpen}
          onCancel={handleCloseModal}
          width={750}
          footer={
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              {modalSource === "pending" && (
                <>
                  <button
                    onClick={handleReject}
                    className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-500 ease-premium text-xs font-bold tracking-widest uppercase active:scale-95 shadow-[0_2px_8px_rgba(239,68,68,0.15)]"
                  >
                    Từ chối
                  </button>
                  <button
                    onClick={handleApprove}
                    className="px-5 py-2.5 bg-techMintAccent hover:bg-techMintAccent/90 text-white font-bold rounded-xl transition-all duration-500 ease-premium text-xs tracking-widest uppercase active:scale-95 shadow-[0_2px_8px_rgba(16,185,129,0.15)]"
                  >
                    Duyệt phòng trọ
                  </button>
                </>
              )}
              
              {modalSource === "reported" && (
                <>
                  <button
                    onClick={handleKeep}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all duration-500 ease-premium text-xs font-bold tracking-widest uppercase active:scale-95 border border-slate-200"
                  >
                    Giữ lại phòng trọ
                  </button>
                  <button
                    onClick={handleTakeDown}
                    className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all duration-500 ease-premium text-xs tracking-widest uppercase active:scale-95 shadow-[0_2px_8px_rgba(239,68,68,0.15)]"
                  >
                    Khóa phòng trọ ngay
                  </button>
                </>
              )}

              {modalSource === "active" && (
                <>
                  {selectedItem?.status === "ACTIVE" ? (
                    <button
                      onClick={handleHideActive}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-all duration-500 ease-premium text-xs font-bold tracking-widest uppercase active:scale-95 shadow-[0_2px_8px_rgba(245,158,11,0.15)]"
                    >
                      Tạm ẩn bài
                    </button>
                  ) : (
                    <button
                      onClick={handleShowActive}
                      className="px-5 py-2.5 bg-techMintAccent hover:bg-techMintAccent/90 text-white rounded-xl transition-all duration-500 ease-premium text-xs font-bold tracking-widest uppercase active:scale-95 shadow-[0_2px_8px_rgba(16,185,129,0.15)]"
                    >
                      Mở hiển thị lại
                    </button>
                  )}
                  <button
                    onClick={handleDeleteActive}
                    className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all duration-500 ease-premium text-xs tracking-widest uppercase active:scale-95 shadow-[0_2px_8px_rgba(239,68,68,0.15)]"
                  >
                    Khóa phòng trọ ngay
                  </button>
                </>
              )}
            </div>
          }
        >
          {selectedItem && (
            <div className="space-y-5 mt-4 text-left max-h-[70vh] overflow-y-auto pr-2">
              {/* Room preview and details */}
              <div className="flex gap-4 items-start bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  className="w-32 h-24 object-cover rounded-xl bg-slate-200 flex-shrink-0 border border-slate-150 shadow-sm"
                />
                <div className="space-y-1">
                  <h4 className="font-bold text-onBackgroundLight text-sm leading-snug">{selectedItem.title}</h4>
                  <p className="text-xs text-slate-500">
                    <span className="font-semibold">Chủ trọ:</span> {selectedItem.hostName}
                  </p>
                  <p className="text-sm text-techBluePrimary font-extrabold">
                    {new Intl.NumberFormat("vi-VN").format(selectedItem.price)} đ / tháng
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    {selectedItem.detailedAddress}, {selectedItem.address}
                  </p>
                </div>
              </div>

              {/* Image gallery */}
              {selectedItem.images && selectedItem.images.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                    BỘ SƯU TẬP ẢNH THỰC TẾ (PHÂN LOẠI THEO DANH MỤC)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                    {selectedItem.images.map((img, idx) => (
                      <div key={idx} className="relative group overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-slate-100 aspect-[4/3] flex items-center justify-center">
                        <img
                          src={img.url}
                          alt={`Room view ${idx}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute top-2 left-2 px-2.5 py-0.5 text-[9px] font-extrabold tracking-wide uppercase bg-slate-900/70 text-white rounded-full backdrop-blur-sm shadow-md">
                          {img.category || "Chưa phân loại"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Property info */}
              {selectedItem.propertyType === "COMPLEX" && (
                <div className="bg-cyan-50/30 p-4 rounded-2xl border border-cyan-100/50 space-y-2">
                  <span className="text-[10px] font-bold text-cyan-600 uppercase block tracking-wider">
                    THÔNG TIN TÒA NHÀ / DÃY TRỌ CHỨA PHÒNG NÀY
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Tên Tòa nhà / Dãy trọ</span>
                      <span className="font-bold text-slate-700 block mt-1">{selectedItem.propertyName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Tiện ích chung tòa nhà</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {selectedItem.commonAmenities?.map((amenity, idx) => (
                          <span key={idx} className="inline-block px-2.5 py-0.5 text-[9px] font-bold tracking-wide uppercase bg-cyan-100/60 text-cyan-700 rounded-full">
                            {amenity.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sibling rooms */}
              {selectedItem.propertyType === "COMPLEX" && selectedItem.propertyId && modalSource === "pending" && (
                <div className="space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-bold text-cyan-600 uppercase block tracking-wider">
                      Danh sách các phòng chờ duyệt cùng Tòa nhà
                    </span>
                    <Badge
                      count={pendingData.filter((item) => item.propertyId === selectedItem.propertyId).length}
                      style={{ backgroundColor: "#0284C7" }}
                    />
                  </div>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {pendingData
                      .filter((item) => item.propertyId === selectedItem.propertyId)
                      .map((room) => (
                        <div key={room.id} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm animate-fade-in">
                          <div className="flex flex-col text-left">
                            <span className="text-xs font-bold text-slate-700">{room.title}</span>
                            <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                              Giá: {new Intl.NumberFormat("vi-VN").format(room.price)} đ/tháng | Diện tích: {room.floorArea}m²
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => approveRoomById(room.id)}
                              className="px-3 py-1 bg-techMintAccent hover:bg-techMintAccent/90 text-white text-[10px] font-bold tracking-wider uppercase rounded-lg active:scale-95 transition-all duration-300 border-none cursor-pointer"
                            >
                              Duyệt
                            </button>
                            <button
                              onClick={() => {
                                if (!actionReason.trim()) {
                                  message.error("Vui lòng nhập lý do từ chối vào ô Ghi chú bên dưới trước!");
                                  return;
                                }
                                rejectRoomById(room.id, actionReason);
                              }}
                              className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold tracking-wider uppercase rounded-lg hover:bg-red-600 active:scale-95 transition-all duration-300 border-none cursor-pointer"
                            >
                              Từ chối
                            </button>
                          </div>
                        </div>
                      ))}
                    {pendingData.filter((item) => item.propertyId === selectedItem.propertyId).length === 0 && (
                      <span className="text-xs text-slate-400 font-medium block text-center py-2">
                        Đã duyệt hoặc từ chối hết tất cả phòng của tòa nhà này!
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Specs grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">LOẠI HÌNH & DIỆN TÍCH</span>
                  <span className="text-xs font-bold text-slate-700 block mt-1">
                    {selectedItem.structure === "SINGLE" && "Phòng trọ truyền thống"}
                    {selectedItem.structure === "WHOLE" && "Nhà nguyên căn"}
                    {selectedItem.structure === "APARTMENT" && "Căn hộ dịch vụ/Studio"}
                    {` (Sàn: ${selectedItem.floorArea} m²${selectedItem.mezzanineArea > 0 ? ` + Gác: ${selectedItem.mezzanineArea} m²` : ""})`}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">ĐƠN GIÁ ĐIỆN & NƯỚC MẶT ĐỊNH</span>
                  <span className="text-xs font-bold text-slate-700 block mt-1">
                    Điện: {new Intl.NumberFormat("vi-VN").format(selectedItem.electricityPrice)} đ/kWh | Nước: {new Intl.NumberFormat("vi-VN").format(selectedItem.waterPrice)} đ/m³
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">TỌA ĐỘ BẢN ĐỒ (GPS)</span>
                  <span className="text-xs font-bold text-slate-700 block mt-1">
                    Lat: {selectedItem.latitude?.toFixed(5)} | Lng: {selectedItem.longitude?.toFixed(5)}
                  </span>
                </div>
              </div>

              {/* Detailed areas breakdown */}
              {selectedItem.detailedAreas && selectedItem.detailedAreas.length > 0 && (
                <div className="space-y-1.5 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                    PHÂN RÃ DIỆN TÍCH CHI TIẾT
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                    {selectedItem.detailedAreas.map((area, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-slate-100 text-xs shadow-sm">
                        <span className="text-slate-400 block font-semibold">{area.roomName}</span>
                        <span className="font-extrabold text-slate-700 block mt-1 text-sm">{area.areaValue} m²</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Google Maps embed */}
              <div className="space-y-1.5 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                  VỊ TRÍ BẢN ĐỒ CHI TIẾT (GOOGLE MAPS PIN)
                </span>
                <iframe
                  title="Bản đồ vị trí phòng"
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  src={`https://maps.google.com/maps?q=${selectedItem.latitude},${selectedItem.longitude}&z=15&output=embed`}
                  className="rounded-xl border border-slate-200 shadow-sm mt-2"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>

              {/* Amenities chips container */}
              <div className="space-y-1.5 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">TIỆN ÍCH TRONG PHÒNG & ĐỀN BÙ</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedItem.amenities?.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-techBluePrimary/10 text-techBluePrimary border border-techBluePrimary/5"
                    >
                      {amenity.name} {amenity.compensationAmount > 0 && `(Đền bù: ${new Intl.NumberFormat("vi-VN").format(amenity.compensationAmount)} đ)`}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">MÔ TẢ CHI TIẾT</span>
                <p className="text-xs leading-relaxed text-slate-600 bg-slate-50/30 p-3 rounded-2xl border border-slate-100 font-medium">
                  {selectedItem.description}
                </p>
              </div>

              {/* Report specific reason info */}
              {modalSource === "reported" && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block">
                    LÝ DO BỊ BÁO CÁO ({selectedItem.reports?.length || 0} lượt báo cáo)
                  </span>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {getSortedReasons(selectedItem.reports).map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-xs bg-red-50/50 p-3 rounded-xl border border-red-100 font-bold text-red-600 shadow-sm"
                      >
                        <span>{item.reason}</span>
                        <span className="text-[10px] bg-red-200/50 px-2.5 py-0.5 rounded-full text-red-700 font-bold">
                          {item.count} lượt
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin action reason input */}
              {(modalSource === "reported" || modalSource === "pending" || modalSource === "active") && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Lý do xử lý / Ghi chú gửi cho chủ nhà (Bắt buộc khi từ chối, tạm ẩn hoặc gỡ bài)
                  </label>
                  <Input.TextArea
                    rows={3}
                    placeholder="Nhập lý do chi tiết để hệ thống thông báo cho chủ nhà..."
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default RoomModeration;
