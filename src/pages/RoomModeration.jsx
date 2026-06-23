import { useState } from "react";
import { Tabs, Table, Modal, Input, Badge, Select, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";

// Moderation datasets
const initialPendingData = [
  {
    id: "p1",
    title: "Phòng trọ cao cấp có ban công, đủ đồ",
    hostName: "Trần Quốc Bảo",
    price: "4.500.000 VND / tháng",
    address: "Quận 3, TP. Hồ Chí Minh",
    description: "Phòng trọ diện tích 30m2 đầy đủ nội thất: giường tủ, tủ lạnh, điều hòa, máy giặt. Có ban công thoáng mát hướng gió Nam.",
    imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=600",
    structure: "SINGLE",
    floorArea: 30,
    mezzanineArea: 10,
    amenities: [
      { name: "WiFi", compensationAmount: 500000 },
      { name: "Điều hòa", compensationAmount: 1000000 },
      { name: "Máy giặt", compensationAmount: 1500000 },
      { name: "Nóng lạnh", compensationAmount: 800000 },
      { name: "Tủ quần áo", compensationAmount: 1200000 }
    ]
  },
  {
    id: "p2",
    title: "Căn hộ dịch vụ studio mini giá rẻ",
    hostName: "Lê Hoài Nam",
    price: "3.200.000 VND / tháng",
    address: "Bình Thạnh, TP. Hồ Chí Minh",
    description: "Phòng trọ khép kín an ninh tốt, giờ giấc tự do, có chỗ để xe máy miễn phí tầng trệt.",
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=600",
    structure: "APARTMENT",
    floorArea: 25,
    mezzanineArea: 0,
    amenities: [
      { name: "WiFi", compensationAmount: 500000 },
      { name: "Điều hòa", compensationAmount: 1000000 },
      { name: "Thang máy", compensationAmount: 0 },
      { name: "Khóa vân tay", compensationAmount: 1500000 }
    ]
  },
  {
    id: "p3",
    title: "Phòng trọ ghép tiện nghi cho sinh viên",
    hostName: "Phạm Thu Hương",
    price: "1.800.000 VND / tháng",
    address: "Cầu Giấy, Hà Nội",
    description: "Phòng gần các trường Đại học lớn, đầy đủ thiết bị gia dụng dùng chung bếp và phòng khách.",
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=600",
    structure: "WHOLE",
    floorArea: 75,
    mezzanineArea: 25,
    amenities: [
      { name: "WiFi", compensationAmount: 500000 },
      { name: "Điều hòa", compensationAmount: 1000000 },
      { name: "Máy giặt", compensationAmount: 1500000 },
      { name: "Tủ lạnh", compensationAmount: 2000000 },
      { name: "Bếp nấu", compensationAmount: 500000 },
      { name: "Chỗ để xe", compensationAmount: 0 }
    ]
  }
];

const initialReportedData = [
  {
    id: "r1",
    title: "Chung cư mini view hồ Tây cực chill",
    hostName: "Vũ Văn Thanh",
    price: "6.000.000 VND / tháng",
    address: "Tây Hồ, Hà Nội",
    reporterName: "Nguyễn Minh Anh",
    reason: "Thông tin ảo",
    description: "Căn hộ chung cư mini thực tế không có view hồ và diện tích nhỏ hơn nhiều so với hình ảnh quảng cáo.",
    imageUrl: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=600",
    structure: "APARTMENT",
    floorArea: 45,
    mezzanineArea: 0,
    amenities: [
      { name: "WiFi", compensationAmount: 500000 },
      { name: "Điều hòa", compensationAmount: 1000000 },
      { name: "Thang máy", compensationAmount: 0 },
      { name: "Bể bơi", compensationAmount: 0 }
    ]
  },
  {
    id: "r2",
    title: "Phòng trọ giá siêu rẻ sát đại học",
    hostName: "Hoàng Đức Duy",
    price: "1.200.000 VND / tháng",
    address: "Thủ Đức, TP. Hồ Chí Minh",
    reporterName: "Phạm Hữu Nghĩa",
    reason: "Lừa đảo tiền cọc",
    description: "Yêu cầu chuyển khoản đặt cọc giữ phòng trước khi đến xem, sau khi cọc thì chủ nhà khóa số điện thoại.",
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600",
    structure: "SINGLE",
    floorArea: 15,
    mezzanineArea: 5,
    amenities: [
      { name: "WiFi", compensationAmount: 500000 },
      { name: "Quạt điện", compensationAmount: 200000 }
    ]
  },
  {
    id: "r3",
    title: "Nhà nguyên căn đầy đủ tiện nghi",
    hostName: "Đặng Hồng Nhung",
    price: "12.000.000 VND / tháng",
    address: "Quận 10, TP. Hồ Chí Minh",
    reporterName: "Bùi Thị Minh",
    reason: "Phòng đã cho thuê",
    description: "Gọi điện hỏi phòng chủ nhà báo đã cho thuê từ 1 tháng trước nhưng bài viết vẫn hiển thị và đẩy tin liên tục.",
    imageUrl: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=600",
    structure: "WHOLE",
    floorArea: 90,
    mezzanineArea: 30,
    amenities: [
      { name: "WiFi", compensationAmount: 500000 },
      { name: "Điều hòa", compensationAmount: 1000000 },
      { name: "Máy giặt", compensationAmount: 1500000 },
      { name: "Sân thượng", compensationAmount: 0 },
      { name: "Gara ô tô", compensationAmount: 0 }
    ]
  }
];

// RoomModeration page component
function RoomModeration() {
  const [pendingData, setPendingData] = useState(initialPendingData);
  const [reportedData, setReportedData] = useState(initialReportedData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalSource, setModalSource] = useState(""); // "pending" or "reported"
  const [actionReason, setActionReason] = useState("");

  // Search query and room structure filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [structureFilter, setStructureFilter] = useState("ALL");

  // Filter list dynamically by query search and structural config
  const getFilteredList = (list) => {
    return list.filter((item) => {
      const matchSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStructure = structureFilter === "ALL" || item.structure === structureFilter;
      return matchSearch && matchStructure;
    });
  };

  const filteredPendingData = getFilteredList(pendingData);
  const filteredReportedData = getFilteredList(reportedData);

  // Open modal handler
  const handleOpenModal = (item, source) => {
    setSelectedItem(item);
    setModalSource(source);
    setActionReason("");
    setIsModalOpen(true);
  };

  // Close modal handler
  const handleCloseModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  // Approve listing handler (Pending tab)
  const handleApprove = () => {
    if (!selectedItem) return;
    setPendingData((prev) => prev.filter((item) => item.id !== selectedItem.id));
    message.success("Duyệt bài đăng thành công!");
    handleCloseModal();
  };

  // Reject listing handler (Pending tab)
  const handleReject = () => {
    if (!selectedItem) return;
    if (!actionReason.trim()) {
      message.error("Vui lòng nhập lý do từ chối!");
      return;
    }
    setPendingData((prev) => prev.filter((item) => item.id !== selectedItem.id));
    message.success("Từ chối bài đăng thành công!");
    handleCloseModal();
  };

  // Keep listing handler (Reported tab)
  const handleKeep = () => {
    if (!selectedItem) return;
    setReportedData((prev) => prev.filter((item) => item.id !== selectedItem.id));
    message.success("Giữ lại bài đăng thành công!");
    handleCloseModal();
  };

  // Take down listing handler (Reported tab)
  const handleTakeDown = () => {
    if (!selectedItem) return;
    if (!actionReason.trim()) {
      message.error("Vui lòng nhập lý do gỡ bài!");
      return;
    }
    setReportedData((prev) => prev.filter((item) => item.id !== selectedItem.id));
    message.success("Gỡ bài đăng vi phạm thành công!");
    handleCloseModal();
  };

  // Columns definition for Pending tab
  const pendingColumns = [
    {
      title: "Tiêu đề phòng",
      dataIndex: "title",
      key: "title",
      render: (text) => <span className="font-semibold text-onBackgroundLight">{text}</span>,
    },
    {
      title: "Chủ trọ",
      dataIndex: "hostName",
      key: "hostName",
    },
    {
      title: "Giá thuê",
      dataIndex: "price",
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
          className="text-orangePrimary font-semibold hover:text-orangeSecondary transition-colors duration-150 text-sm"
        >
          Xem chi tiết
        </button>
      ),
    },
  ];

  // Columns definition for Reported tab
  const reportedColumns = [
    {
      title: "Tiêu đề phòng",
      dataIndex: "title",
      key: "title",
      render: (text) => <span className="font-semibold text-onBackgroundLight">{text}</span>,
    },
    {
      title: "Chủ trọ",
      dataIndex: "hostName",
      key: "hostName",
    },
    {
      title: "Người báo cáo",
      dataIndex: "reporterName",
      key: "reporterName",
    },
    {
      title: "Lý do vi phạm",
      dataIndex: "reason",
      key: "reason",
      render: (text) => <span className="text-red-500 font-medium">{text}</span>,
    },
    {
      title: "Tác vụ",
      key: "action",
      render: (_, record) => (
        <button
          onClick={() => handleOpenModal(record, "reported")}
          className="text-red-500 font-semibold hover:text-red-700 transition-colors duration-150 text-sm"
        >
          Xử lý vi phạm
        </button>
      ),
    },
  ];

  // Tabs layout configuration
  const tabItems = [
    {
      key: "pendingTab",
      label: (
        <span className="flex items-center gap-2">
          Chờ kiểm duyệt
          <Badge
            count={filteredPendingData.length}
            style={{ backgroundColor: "#FF6F43" }}
          />
        </span>
      ),
      children: (
        <Table
          dataSource={filteredPendingData}
          columns={pendingColumns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
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
          dataSource={filteredReportedData}
          columns={reportedColumns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      ),
    },
  ];

  return (
    // Moderation page wrapper
    <div className="bg-surfaceLight rounded-xl p-6 shadow-sm border border-onBackgroundLight/5">
      {/* Header section */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-onBackgroundLight">
          QUẢN LÝ KIỂM DUYỆT PHÒNG TRỌ
        </h3>
        <p className="text-sm text-onBackgroundLight/40">
          Phê duyệt tin đăng mới và xử lý khiếu nại báo cáo vi phạm từ người thuê
        </p>
      </div>

      {/* Filtering toolbar */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-backgroundLight p-4 rounded-xl border border-onBackgroundLight/5">
        {/* Search text query input */}
        <div className="flex flex-col gap-1.5 text-left">
          <span className="text-xs font-semibold text-onBackgroundLight/50">TÌM KIẾM BÀI ĐĂNG</span>
          <Input
            prefix={<SearchOutlined className="text-onBackgroundLight/30" />}
            placeholder="Tìm theo tiêu đề hoặc địa chỉ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-lg"
            allowClear
          />
        </div>

        {/* Structure type filter */}
        <div className="flex flex-col gap-1.5 text-left">
          <span className="text-xs font-semibold text-onBackgroundLight/50">CẤU TRÚC PHÒNG</span>
          <Select
            value={structureFilter}
            onChange={(value) => setStructureFilter(value)}
            options={[
              { value: "ALL", label: "Tất cả loại phòng" },
              { value: "SINGLE", label: "Phòng đơn (SINGLE)" },
              { value: "WHOLE", label: "Nguyên căn (WHOLE)" },
              { value: "APARTMENT", label: "Căn hộ (APARTMENT)" }
            ]}
            className="w-full"
          />
        </div>
      </div>

      {/* Active tabs wrapper */}
      <Tabs defaultActiveKey="pendingTab" items={tabItems} className="custom-tabs" />

      {/* Details review modal */}
      <Modal
        title={
          <span className="text-lg font-bold text-onBackgroundLight">
            {modalSource === "pending"
              ? `KIỂM DUYỆT BÀI ĐĂNG: ${selectedItem?.title}`
              : `XỬ LÝ VI PHẠM: ${selectedItem?.title}`}
          </span>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        width={700}
        footer={
          <div className="flex justify-end gap-3 pt-4 border-t border-onBackgroundLight/10">
            {modalSource === "pending" ? (
              <>
                <button
                  onClick={handleReject}
                  className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-150 text-sm font-medium"
                >
                  TỪ CHỐI
                </button>
                <button
                  onClick={handleApprove}
                  className="px-5 py-2.5 bg-tealAccent hover:bg-tealAccent/90 text-white font-bold rounded-lg transition-colors duration-150 text-sm"
                >
                  DUYỆT BÀI ĐĂNG
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleKeep}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-onBackgroundLight/80 rounded-lg transition-colors duration-150 text-sm font-medium"
                >
                  GIỮ LẠI BÀI ĐĂNG
                </button>
                <button
                  onClick={handleTakeDown}
                  className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors duration-150 text-sm"
                >
                  GỠ BÀI ĐĂNG NGAY
                </button>
              </>
            )}
          </div>
        }
      >
        {selectedItem && (
          <div className="space-y-4 mt-4 text-left">
            {/* Room preview and details */}
            <div className="flex gap-4 items-start bg-backgroundLight p-4 rounded-xl border border-onBackgroundLight/5">
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.title}
                className="w-32 h-24 object-cover rounded-lg bg-onBackgroundLight/10 flex-shrink-0"
              />
              <div className="space-y-1">
                <h4 className="font-bold text-onBackgroundLight">{selectedItem.title}</h4>
                <p className="text-sm text-onBackgroundLight/60">
                  <span className="font-medium">Chủ trọ:</span> {selectedItem.hostName}
                </p>
                <p className="text-sm text-orangePrimary font-semibold">{selectedItem.price}</p>
                <p className="text-xs text-onBackgroundLight/40">{selectedItem.address}</p>
              </div>
            </div>

            {/* Technical specifications grid layout */}
            <div className="grid grid-cols-2 gap-4 bg-backgroundLight p-4 rounded-xl border border-onBackgroundLight/5 mb-4">
              <div>
                <span className="text-xs font-semibold text-onBackgroundLight/45 block">LOẠI CẤU TRÚC PHÒNG</span>
                <span className="text-sm font-semibold text-onBackgroundLight">
                  {selectedItem.structure === "SINGLE" && "Phòng đơn"}
                  {selectedItem.structure === "WHOLE" && "Nguyên căn"}
                  {selectedItem.structure === "APARTMENT" && "Căn hộ"}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-onBackgroundLight/45 block">DIỆN TÍCH PHÒNG TRỌ</span>
                <span className="text-sm font-semibold text-onBackgroundLight">
                  Diện tích sàn: {selectedItem.floorArea} m² | Diện tích gác: {selectedItem.mezzanineArea} m²
                </span>
              </div>
            </div>

            {/* Amenities chips container */}
            <div className="space-y-1 bg-backgroundLight p-4 rounded-xl border border-onBackgroundLight/5">
              <span className="text-xs font-semibold text-onBackgroundLight/50 block">TIỆN ÍCH CUNG CẤP</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedItem.amenities?.map((amenity, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orangePrimary/10 text-orangePrimary"
                  >
                    {amenity.name} (Đền bù: {new Intl.NumberFormat("vi-VN").format(amenity.compensationAmount)} đ)
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-onBackgroundLight/50">MÔ TẢ CHI TIẾT</span>
              <p className="text-sm text-onBackgroundLight/85 bg-backgroundLight p-3 rounded-lg border border-onBackgroundLight/5">
                {selectedItem.description}
              </p>
            </div>

            {/* Report specific reason info */}
            {modalSource === "reported" && (
              <div className="space-y-1">
                <span className="text-xs font-semibold text-red-500">LÝ DO BỊ BÁO CÁO (Từ: {selectedItem.reporterName})</span>
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 font-medium">
                  {selectedItem.reason}
                </p>
              </div>
            )}

            {/* Admin action reason input */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-onBackgroundLight/50 block">
                Lý do xử lý / Ghi chú gửi cho chủ nhà (Bắt buộc nếu từ chối hoặc gỡ bài)
              </label>
              <Input.TextArea
                rows={3}
                placeholder="Nhập lý do chi tiết..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className="rounded-lg"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default RoomModeration;
