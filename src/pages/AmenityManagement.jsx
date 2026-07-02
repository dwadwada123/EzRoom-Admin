import { useState } from "react";
import { Table, Modal, Input, Button, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";

// Amenities matrix state
const initialAmenities = [
  { id: "a1", name: "WiFi" },
  { id: "a2", name: "Điều hòa" },
  { id: "a3", name: "Máy giặt" },
  { id: "a4", name: "Tủ lạnh" },
  { id: "a5", name: "Giờ giấc tự do" },
  { id: "a6", name: "Bãi xe riêng" },
];

function AmenityManagement() {
  const [amenities, setAmenities] = useState(initialAmenities);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");

  // Search query local state
  const [searchText, setSearchText] = useState("");

  // Open creation modal
  const handleOpenModal = () => {
    setNewName("");
    setIsModalOpen(true);
  };

  // Close creation modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle appending new amenity
  const handleAdd = () => {
    if (!newName.trim()) {
      message.error("Vui lòng nhập tên tiện ích!");
      return;
    }
    const newAmenity = {
      id: `a-${Date.now()}`,
      name: newName.trim(),
    };
    setAmenities((prev) => [...prev, newAmenity]);
    message.success("Thêm tiện ích mới thành công");
    handleCloseModal();
  };

  // Handle deleting amenity from list
  const handleDelete = (id) => {
    setAmenities((prev) => prev.filter((item) => item.id !== id));
    message.success("Xóa tiện ích thành công");
  };

  // Dynamic search dataset stream
  const filteredAmenities = amenities.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Column settings
  const columns = [
    {
      title: "Tên tiện ích",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="font-semibold text-onBackgroundLight">{text}</span>,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <button
          onClick={() => handleDelete(record.id)}
          className="text-red-400 hover:text-red-600 transition-all duration-300 text-sm font-semibold hover:underline hover:scale-105 active:scale-95 inline-block border-none bg-transparent"
        >
          Xóa
        </button>
      ),
    },
  ];

  return (
    // Amenities layout viewport
    <div className="bg-surfaceLight/80 backdrop-blur-md rounded-2xl p-6 border border-onBackgroundLight/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
      {/* Toolbar in flex row */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(15,23,42,0.02)]">
        <div>
          <h3 className="text-lg font-bold text-onBackgroundLight tracking-wide">
            DANH MỤC TIỆN ÍCH DÙNG CHUNG
          </h3>
          <p className="text-sm text-onBackgroundLight/40">
            Quản lý danh sách tiện ích phòng trọ hiển thị cho chủ nhà và người thuê trên nền tảng
          </p>
        </div>
        <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
          <Input
            prefix={<SearchOutlined className="text-onBackgroundLight/30" />}
            placeholder="Tìm nhanh tên tiện ích..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-64 rounded-xl"
            allowClear
          />
          <Button type="primary" onClick={handleOpenModal} className="rounded-xl font-semibold shadow-[0_2px_8px_rgba(2,132,199,0.1)] hover:scale-105 active:scale-95 transition-all duration-300">
            + Thêm tiện ích mới
          </Button>
        </div>
      </div>

      {/* Table block */}
      <div className="overflow-x-auto">
        <Table
          dataSource={filteredAmenities}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          className="custom-premium-table"
        />
      </div>

      {/* Creation form modal */}
      <Modal
        title={<span className="text-lg font-bold text-onBackgroundLight">THÊM TIỆN ÍCH MỚI</span>}
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={handleAdd}
        okText="Thêm mới"
        cancelText="Hủy"
        okButtonProps={{ className: "bg-techBluePrimary hover:bg-techBluePrimary/90 border-none rounded-xl" }}
      >
        <div className="space-y-2 py-4">
          <label className="text-sm font-medium text-onBackgroundLight/70 block">
            Tên tiện ích
          </label>
          <Input
            placeholder="Ví dụ: Hồ bơi, Bảo vệ 24/7..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="rounded-xl"
          />
        </div>
      </Modal>
    </div>
  );
}

export default AmenityManagement;
