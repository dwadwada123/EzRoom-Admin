import { useState, useEffect } from "react";
import { Table, Tag, Input, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import API_BASE_URL from "../config/api";

function ContractManagement() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`${API_BASE_URL}/api/admin/contracts`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.status === 401) { localStorage.removeItem("adminToken"); window.location.reload(); return; }
        const data = await res.json();
        if (Array.isArray(data)) {
          setContracts(data);
        }
      } catch (err) {
        console.error("Lỗi lấy danh sách hợp đồng:", err);
        message.error("Lỗi lấy danh sách hợp đồng!");
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  // Filter contracts
  const filteredContracts = contracts.filter((item) => {
    const renterName = item.renterName || "";
    const roomName = item.roomName || "";
    return (
      renterName.toLowerCase().includes(searchText.toLowerCase()) ||
      roomName.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const columns = [
    {
      title: "Mã hợp đồng",
      dataIndex: "_id",
      key: "_id",
      render: (text, record) => <span className="font-mono text-onBackgroundLight/40">{text || record.id}</span>,
    },
    {
      title: "Phòng trọ",
      dataIndex: "roomName",
      key: "roomName",
      render: (text) => <span className="font-semibold text-onBackgroundLight">{text}</span>,
    },
    {
      title: "Người thuê",
      key: "renter",
      render: (_, record) => (
        <div className="flex flex-col text-left">
          <span className="font-medium text-onBackgroundLight">{record.renterName}</span>
          <span className="text-xs text-onBackgroundLight/40">{record.renterPhone}</span>
        </div>
      ),
    },
    {
      title: "Thời hạn",
      key: "duration",
      render: (_, record) => (
        <span>
          {record.startDate} - {record.endDate}
        </span>
      ),
    },
    {
      title: "Tiền đặt cọc",
      dataIndex: "depositAmount",
      key: "depositAmount",
      render: (val) => `${new Intl.NumberFormat("vi-VN").format(val)} đ`,
    },
    {
      title: "Trạng thái cọc (Escrow)",
      dataIndex: "depositStatus",
      key: "depositStatus",
      render: (status) => {
        switch (status) {
          case "UNPAID":
            return <Tag color="default">Chờ đóng cọc</Tag>;
          case "FROZEN":
            return <Tag color="blue">Đang đóng băng</Tag>;
          case "DISBURSED":
            return <Tag color="green">Đã giải ngân</Tag>;
          case "REFUNDED":
            return <Tag color="orange">Đã hoàn cọc</Tag>;
          default:
            return <Tag color="default">{status}</Tag>;
        }
      },
    },
    {
      title: "Trạng thái hợp đồng",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        switch (status) {
          case "WAITING_SIGN":
          case "WAITING_DEPOSIT":
            return <Tag color="cyan">Chờ ký kết</Tag>;
          case "ACTIVE":
            return <Tag color="success">Đang hoạt động</Tag>;
          case "DISPUTED":
            return <Tag color="error">Đang tranh chấp</Tag>;
          case "TERMINATED":
            return <Tag color="warning">Đã chấm dứt</Tag>;
          default:
            return <Tag color="default">{status}</Tag>;
        }
      },
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
              QUẢN LÝ HỢP ĐỒNG ĐIỆN TỬ
            </h3>
            <p className="text-xs text-slate-400 font-semibold mt-1">
              Danh sách hợp đồng thuê trọ và trạng thái đặt cọc giữ chỗ trên hệ thống
            </p>
          </div>
          <div>
            <Input
              prefix={<SearchOutlined className="text-slate-300" />}
              placeholder="Tìm theo tên khách thuê hoặc tên phòng..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </div>
        </div>

        {/* Contracts table */}
        <div className="overflow-x-auto">
          <Table
            loading={loading}
            dataSource={filteredContracts}
            columns={columns}
            rowKey={(record) => record._id || record.id}
            pagination={{ pageSize: 5 }}
            className="custom-premium-table"
          />
        </div>
      </div>
    </div>
  );
}

export default ContractManagement;
