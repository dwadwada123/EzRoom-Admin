import { useState, useEffect, useCallback } from "react";
import { Table, Modal, Input, Button, message, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { API_BASE_URL } from "../config/api";

function AmenityManagement() {
  const [amenities, setAmenities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("ROOM");
  const [loading, setLoading] = useState(false);

  // Search state
  const [searchText, setSearchText] = useState("");

  const fetchAmenities = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/amenities`);
      if (res.ok) {
        const data = await res.json();
        setAmenities(data);
      }
    } catch {
      message.error("Lỗi khi tải danh sách tiện ích");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => fetchAmenities(), 0);
  }, [fetchAmenities]);

  // Open modal
  const handleOpenModal = () => {
    setNewName("");
    setNewType("ROOM");
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Add amenity
  const handleAdd = async () => {
    if (!newName.trim()) {
      message.error("Vui lòng nhập tên tiện ích!");
      return;
    }
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/amenities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), type: newType }),
      });
      if (res.ok) {
        message.success("Thêm tiện ích mới thành công");
        handleCloseModal();
        fetchAmenities();
      } else {
        message.error("Lỗi khi thêm tiện ích");
      }
    } catch {
      message.error("Lỗi kết nối máy chủ");
    }
  };

  // Delete amenity
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/amenities/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        message.success("Đã xóa (ẩn) tiện ích thành công");
        fetchAmenities();
      } else {
        message.error("Lỗi khi xóa tiện ích");
      }
    } catch {
      message.error("Lỗi kết nối máy chủ");
    }
  };

  // Filter amenities
  const filteredAmenities = amenities.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Table columns
  const columns = [
    {
      title: "Tên tiện ích",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="font-semibold text-onBackgroundLight">{text}</span>,
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color={type === "ROOM" ? "blue" : "purple"}>
          {type === "ROOM" ? "Tiện ích trong phòng" : "Tiện ích tòa nhà"}
        </Tag>
      ),
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
    // Layout container
    <div className="double-bezel-outer animate-fade-in">
      <div className="double-bezel-inner p-6 bg-white/95 backdrop-blur-md">
        {/* Toolbar */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]">
          <div>
            <h3 className="text-sm font-bold text-onBackgroundLight tracking-wider uppercase">
              QUẢN LÝ TIỆN ÍCH
            </h3>
            <p className="text-xs text-slate-400 font-semibold mt-1">
              Quản lý danh mục tiện ích phòng và tiện ích tòa nhà hiển thị trên nền tảng
            </p>
          </div>
          <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
            <Input
              prefix={<SearchOutlined className="text-slate-300" />}
              placeholder="Tìm nhanh tên tiện ích..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
            <Button 
              type="primary" 
              onClick={handleOpenModal} 
              className="rounded-xl font-bold tracking-wide text-xs uppercase shadow-[0_2px_8px_rgba(2,132,199,0.1)] active:scale-95 transition-all duration-500 ease-premium h-10 px-5"
            >
              + Thêm tiện ích mới
            </Button>
          </div>
        </div>

        {/* Amenities table */}
        <div className="overflow-x-auto">
          <Table
            dataSource={filteredAmenities}
            columns={columns}
            rowKey={(record) => record.id || record._id}
            loading={loading}
            pagination={{ pageSize: 10 }}
            className="custom-premium-table"
          />
        </div>

        {/* Create modal */}
        <Modal
          title={<span className="text-sm font-bold text-onBackgroundLight tracking-wider uppercase">THÊM TIỆN ÍCH MỚI</span>}
          open={isModalOpen}
          onCancel={handleCloseModal}
          onOk={handleAdd}
          okText="Thêm mới"
          cancelText="Hủy"
          okButtonProps={{ className: "bg-techBluePrimary hover:bg-techBluePrimary/90 border-none rounded-xl font-bold uppercase tracking-wider text-xs px-4" }}
        >
          <div className="space-y-4 py-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Tên tiện ích
              </label>
              <Input
                placeholder="Ví dụ: Hồ bơi, Bảo vệ 24/7..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Phân loại
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setNewType('ROOM')}
                  className={`flex-1 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    newType === 'ROOM'
                      ? 'bg-blue-500 text-white shadow-md border border-blue-500'
                      : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Phòng (Máy lạnh, v.v)
                </button>
                <button
                  type="button"
                  onClick={() => setNewType('PROPERTY')}
                  className={`flex-1 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    newType === 'PROPERTY'
                      ? 'bg-purple-500 text-white shadow-md border border-purple-500'
                      : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Tòa nhà (Thang máy, v.v)
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default AmenityManagement;
