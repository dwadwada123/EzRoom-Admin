import { useState } from "react";
import { Table, Tag, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";

// Financial audit transaction dataset
const initialTransactions = [
  {
    id: "TX982173",
    contractId: "HD-2026-001",
    roomName: "Phòng trọ cao cấp có ban công, đủ đồ",
    hostName: "Trần Quốc Bảo",
    amount: 4500000,
    method: "VNPAY",
    type: "DEPOSIT",
    commission: 225000,
    date: "07/06/2026",
  },
  {
    id: "TX982174",
    contractId: "HD-2026-002",
    roomName: "Căn hộ dịch vụ studio mini giá rẻ",
    hostName: "Lê Hoài Nam",
    amount: 3200000,
    method: "MOMO",
    type: "DEPOSIT",
    commission: 160000,
    date: "07/06/2026",
  },
  {
    id: "TX982175",
    contractId: "HD-2026-003",
    roomName: "Phòng trọ ghép tiện nghi cho sinh viên",
    hostName: "Phạm Thu Hương",
    amount: 1800000,
    method: "VNPAY",
    type: "DEPOSIT",
    commission: 90000,
    date: "06/06/2026",
  },
  {
    id: "TX982176",
    contractId: "HD-2026-004",
    roomName: "Chung cư mini view hồ Tây cực chill",
    hostName: "Vũ Văn Thanh",
    amount: 6000000,
    method: "MOMO",
    type: "RENT",
    commission: 300000,
    date: "05/06/2026",
  },
  {
    id: "TX982177",
    contractId: "HD-2026-005",
    roomName: "Phòng trọ giá siêu rẻ sát đại học",
    hostName: "Hoàng Đức Duy",
    amount: 1200000,
    method: "VNPAY",
    type: "COMPENSATION",
    commission: 60000,
    date: "04/06/2026",
  },
];

function TransactionHistory() {
  const [transactions] = useState(initialTransactions);

  // Search query local state
  const [searchText, setSearchText] = useState("");

  // Transaction type and method filter states
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [methodFilter, setMethodFilter] = useState("ALL");

  // Dynamic filtering for search keyword, type and payment method
  const filteredTransactions = transactions.filter((item) => {
    const matchSearch =
      item.id.toLowerCase().includes(searchText.toLowerCase()) ||
      item.hostName.toLowerCase().includes(searchText.toLowerCase());
    const matchType = typeFilter === "ALL" || item.type === typeFilter;
    const matchMethod = methodFilter === "ALL" || item.method === methodFilter;
    return matchSearch && matchType && matchMethod;
  });

  const columns = [
    {
      title: "Mã giao dịch",
      dataIndex: "id",
      key: "id",
      render: (text, record) => (
        // Render transaction ID and muted linked contract ID
        <div className="flex flex-col text-left">
          <span className="text-onBackgroundLight/40 font-mono">{text}</span>
          {record.contractId && (
            <span className="text-[10px] text-onBackgroundLight/30 font-mono">
              HĐ: {record.contractId}
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Phòng trọ",
      dataIndex: "roomName",
      key: "roomName",
      render: (text) => <span className="font-semibold text-onBackgroundLight">{text}</span>,
    },
    {
      title: "Chủ trọ",
      dataIndex: "hostName",
      key: "hostName",
    },
    {
      title: "Tổng tiền thanh toán",
      dataIndex: "amount",
      key: "amount",
      render: (val) => `${new Intl.NumberFormat("vi-VN").format(val)} đ`,
    },
    {
      title: "Loại giao dịch",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        if (type === "DEPOSIT") {
          return <Tag color="blue">Cọc giữ chỗ</Tag>;
        }
        if (type === "RENT") {
          return <Tag color="green">Tiền phòng</Tag>;
        }
        return <Tag color="volcano">Đền bù tài sản</Tag>;
      },
    },
    {
      title: "Cổng thanh toán",
      dataIndex: "method",
      key: "method",
      render: (method) => {
        if (method === "VNPAY") {
          return <Tag color="blue">VNPAY</Tag>;
        }
        return <Tag color="magenta">MOMO</Tag>;
      },
    },
    {
      title: "Hoa hồng thu về (5%)",
      dataIndex: "commission",
      key: "commission",
      render: (val) => (
        <span className="text-orangePrimary font-bold">
          {new Intl.NumberFormat("vi-VN").format(val)} đ
        </span>
      ),
    },
  ];

  return (
    // Transaction history layout container
    <div className="bg-surfaceLight rounded-xl p-6 shadow-sm border border-onBackgroundLight/5">
      {/* Title section */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-onBackgroundLight">
            NHẬT KÝ GIAO DỊCH & ĐỐI SOÁT DOANH THU
          </h3>
          <p className="text-sm text-onBackgroundLight/40">
            Hệ thống tự động theo dõi dòng tiền đặt cọc giữ phòng và trích xuất hoa hồng 5% từ các hóa đơn thành công
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {/* Transaction type filter */}
          <div className="flex flex-col gap-1 text-left">
            <span className="text-xs font-semibold text-onBackgroundLight/50">LOẠI GIAO DỊCH</span>
            <Select
              value={typeFilter}
              onChange={(value) => setTypeFilter(value)}
              options={[
                { value: "ALL", label: "Tất cả loại giao dịch" },
                { value: "DEPOSIT", label: "Tiền cọc giữ chỗ" },
                { value: "RENT", label: "Tiền phòng hàng tháng" },
                { value: "COMPENSATION", label: "Tiền đền bù thiệt hại" }
              ]}
              className="w-48"
            />
          </div>

          {/* Payment method filter */}
          <div className="flex flex-col gap-1 text-left">
            <span className="text-xs font-semibold text-onBackgroundLight/50">CỔNG THANH TOÁN</span>
            <Select
              value={methodFilter}
              onChange={(value) => setMethodFilter(value)}
              options={[
                { value: "ALL", label: "Tất cả cổng thanh toán" },
                { value: "MOMO", label: "Ví điện tử MoMo" },
                { value: "VNPAY", label: "Cổng VNPAY" }
              ]}
              className="w-48"
            />
          </div>

          {/* Search keyword query input */}
          <div className="flex flex-col gap-1 text-left">
            <span className="text-xs font-semibold text-onBackgroundLight/50">TÌM KIẾM CHI TIẾT</span>
            <Input
              prefix={<SearchOutlined className="text-onBackgroundLight/30" />}
              placeholder="Tìm theo mã giao dịch, chủ nhà..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-64 rounded-lg"
              allowClear
            />
          </div>
        </div>
      </div>

      {/* Transaction list table */}
      <div className="overflow-x-auto">
        <Table
          dataSource={filteredTransactions}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  );
}

export default TransactionHistory;
