import { useState } from "react";
import { Table, Tag, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

// Electronic contracts mock dataset
const initialContracts = [
  {
    id: "HD-2026-001",
    roomName: "Phòng trọ cao cấp có ban công, đủ đồ",
    renterName: "Phạm Hữu Nghĩa",
    renterPhone: "0909 123 456",
    startDate: "01/06/2026",
    endDate: "01/06/2027",
    depositAmount: 4500000,
    depositStatus: "PAID",
    dateSigned: "31/05/2026",
  },
  {
    id: "HD-2026-002",
    roomName: "Căn hộ dịch vụ studio mini giá rẻ",
    renterName: "Nguyễn Minh Anh",
    renterPhone: "0938 765 432",
    startDate: "05/06/2026",
    endDate: "05/12/2026",
    depositAmount: 3200000,
    depositStatus: "PAID",
    dateSigned: "04/06/2026",
  },
  {
    id: "HD-2026-003",
    roomName: "Phòng trọ ghép tiện nghi cho sinh viên",
    renterName: "Bùi Thị Minh",
    renterPhone: "0912 345 678",
    startDate: "10/06/2026",
    endDate: "10/06/2027",
    depositAmount: 1800000,
    depositStatus: "UNPAID",
    dateSigned: "08/06/2026",
  },
  {
    id: "HD-2026-004",
    roomName: "Chung cư mini view hồ Tây cực chill",
    renterName: "Lê Văn Tám",
    renterPhone: "0987 654 321",
    startDate: "15/06/2026",
    endDate: "15/06/2027",
    depositAmount: 6000000,
    depositStatus: "PAID",
    dateSigned: "12/06/2026",
  },
  {
    id: "HD-2026-005",
    roomName: "Phòng trọ giá siêu rẻ sát đại học",
    renterName: "Hoàng Thu Thảo",
    renterPhone: "0966 333 444",
    startDate: "20/06/2026",
    endDate: "20/12/2026",
    depositAmount: 1200000,
    depositStatus: "UNPAID",
    dateSigned: "18/06/2026",
  },
];

function ContractManagement() {
  const [contracts] = useState(initialContracts);

  // Search query local state
  const [searchText, setSearchText] = useState("");

  // Dynamic search dataset stream
  const filteredContracts = contracts.filter(
    (item) =>
      item.renterName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.roomName.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Mã hợp đồng",
      dataIndex: "id",
      key: "id",
      render: (text) => <span className="font-mono text-onBackgroundLight/40">{text}</span>,
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
      title: "Trạng thái cọc",
      dataIndex: "depositStatus",
      key: "depositStatus",
      render: (status) => {
        // Check deposit status in uppercase format
        if (status === "PAID") {
          return <Tag color="#10B981">Đã đóng cọc</Tag>;
        }
        return <Tag color="#0284C7">Chờ đóng cọc</Tag>;
      },
    },
  ];

  return (
    // Contract layout container
    <div className="bg-surfaceLight/80 backdrop-blur-md rounded-2xl p-6 border border-onBackgroundLight/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
      {/* Toolbar flex row */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(15,23,42,0.02)]">
        <div>
          <h3 className="text-lg font-bold text-onBackgroundLight tracking-wide">
            QUẢN LÝ HỢP ĐỒNG ĐIỆN TỬ
          </h3>
          <p className="text-sm text-onBackgroundLight/40">
            Danh sách hợp đồng thuê trọ và trạng thái đặt cọc giữ chỗ trên hệ thống
          </p>
        </div>
        <div>
          <Input
            prefix={<SearchOutlined className="text-onBackgroundLight/30" />}
            placeholder="Tìm theo tên khách thuê hoặc tên phòng..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-80 rounded-xl"
            allowClear
          />
        </div>
      </div>

      {/* Contract list table */}
      <div className="overflow-x-auto">
        <Table
          dataSource={filteredContracts}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          className="custom-premium-table"
        />
      </div>
    </div>
  );
}

export default ContractManagement;
