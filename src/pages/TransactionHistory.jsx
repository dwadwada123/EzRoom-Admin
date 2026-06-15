import { useState } from "react";
import { Table, Tag, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

// Financial audit transaction dataset
const initialTransactions = [
  {
    id: "TX982173",
    roomName: "Phòng trọ cao cấp có ban công, đủ đồ",
    hostName: "Trần Quốc Bảo",
    amount: 4500000,
    method: "VNPAY",
    commission: 225000,
    date: "07/06/2026",
  },
  {
    id: "TX982174",
    roomName: "Căn hộ dịch vụ studio mini giá rẻ",
    hostName: "Lê Hoài Nam",
    amount: 3200000,
    method: "MOMO",
    commission: 160000,
    date: "07/06/2026",
  },
  {
    id: "TX982175",
    roomName: "Phòng trọ ghép tiện nghi cho sinh viên",
    hostName: "Phạm Thu Hương",
    amount: 1800000,
    method: "VNPAY",
    commission: 90000,
    date: "06/06/2026",
  },
  {
    id: "TX982176",
    roomName: "Chung cư mini view hồ Tây cực chill",
    hostName: "Vũ Văn Thanh",
    amount: 6000000,
    method: "MOMO",
    commission: 300000,
    date: "05/06/2026",
  },
  {
    id: "TX982177",
    roomName: "Phòng trọ giá siêu rẻ sát đại học",
    hostName: "Hoàng Đức Duy",
    amount: 1200000,
    method: "VNPAY",
    commission: 60000,
    date: "04/06/2026",
  },
];

function TransactionHistory() {
  const [transactions] = useState(initialTransactions);

  // Search query local state
  const [searchText, setSearchText] = useState("");

  // Dynamic search dataset stream
  const filteredTransactions = transactions.filter(
    (item) =>
      item.id.toLowerCase().includes(searchText.toLowerCase()) ||
      item.hostName.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Mã giao dịch",
      dataIndex: "id",
      key: "id",
      render: (text) => <span className="text-onBackgroundLight/40 font-mono">{text}</span>,
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
        <div>
          <Input
            prefix={<SearchOutlined className="text-onBackgroundLight/30" />}
            placeholder="Tìm theo mã giao dịch, chủ nhà..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-80 rounded-lg"
            allowClear
          />
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
