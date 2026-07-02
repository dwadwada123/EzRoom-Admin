import { useState } from "react";
import { Table, Tag, Input, Select, Modal } from "antd";
import { SearchOutlined } from "@ant-design/icons";

// Financial audit transaction dataset matching Android Invoice models
const initialTransactions = [
  {
    id: "TX982173",
    contractId: "HD-2026-001",
    roomId: "r1",
    roomName: "Phòng trọ cao cấp có ban công, đủ đồ (P.201)",
    hostName: "Trần Quốc Bảo",
    period: "06/2026",
    roomPrice: 4500000,
    oldElectricity: 120,
    newElectricity: 245,
    oldWater: 45,
    newWater: 52,
    otherCosts: [
      { reason: "Phí dọn dẹp vệ sinh định kỳ", amount: 100000 }
    ],
    amount: 5142500, // 4500000 + (125 * 3500) + (7 * 15000) + 100000
    method: "VNPAY",
    type: "RENT",
    commission: 225000, // 5% of roomPrice (4.5M)
    date: "07/06/2026",
    status: "PAID",
    electricityPrice: 3500,
    waterPrice: 15000
  },
  {
    id: "TX982174",
    contractId: "HD-2026-002",
    roomId: "r2",
    roomName: "Căn hộ dịch vụ studio mini giá rẻ",
    hostName: "Lê Hoài Nam",
    period: "06/2026",
    roomPrice: 3200000,
    oldElectricity: 0,
    newElectricity: 0,
    oldWater: 0,
    newWater: 0,
    otherCosts: [],
    amount: 3200000, // Deposit amount
    method: "MOMO",
    type: "DEPOSIT",
    commission: 0, // 0 commission on deposits
    date: "07/06/2026",
    status: "PAID",
    electricityPrice: 4000,
    waterPrice: 18000
  },
  {
    id: "TX982175",
    contractId: "HD-2026-003",
    roomId: "r3",
    roomName: "Phòng trọ ghép tiện nghi cho sinh viên (Phòng A)",
    hostName: "Phạm Thu Hương",
    period: "06/2026",
    roomPrice: 1800000,
    oldElectricity: 150,
    newElectricity: 210,
    oldWater: 80,
    newWater: 85,
    otherCosts: [],
    amount: 2085000, // 1800000 + (60 * 3500) + (5 * 15000)
    method: "VNPAY",
    type: "RENT",
    commission: 90000, // 5% of roomPrice (1.8M)
    date: "06/06/2026",
    status: "PAID",
    electricityPrice: 3500,
    waterPrice: 15000
  },
  {
    id: "TX982176",
    contractId: "HD-2026-004",
    roomId: "r4",
    roomName: "Chung cư mini view hồ Tây cực chill (P.502)",
    hostName: "Vũ Văn Thanh",
    period: "05/06/2026",
    roomPrice: 6000000,
    oldElectricity: 200,
    newElectricity: 310,
    oldWater: 100,
    newWater: 108,
    otherCosts: [
      { reason: "Đền bù vỡ kính", amount: 150000 }
    ],
    amount: 6728000, // 6000000 + (110 * 3800) + (8 * 20000) + 150000
    method: "MOMO",
    type: "RENT",
    commission: 300000, // 5% of roomPrice (6M)
    date: "05/06/2026",
    status: "PAID",
    electricityPrice: 3800,
    waterPrice: 20000
  },
  {
    id: "TX982177",
    contractId: "HD-2026-005",
    roomId: "r5",
    roomName: "Phòng trọ giá siêu rẻ sát đại học",
    hostName: "Hoàng Đức Duy",
    period: "04/06/2026",
    roomPrice: 1200000,
    oldElectricity: 0,
    newElectricity: 0,
    oldWater: 0,
    newWater: 0,
    otherCosts: [
      { reason: "Đền bù hỏng ổ khóa cửa", amount: 200000 }
    ],
    amount: 200000,
    method: "VNPAY",
    type: "COMPENSATION",
    commission: 0, // 0 commission on compensation costs
    date: "04/06/2026",
    status: "PAID",
    electricityPrice: 3500,
    waterPrice: 15000
  }
];

function TransactionHistory() {
  const [transactions] = useState(initialTransactions);
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [methodFilter, setMethodFilter] = useState("ALL");

  // Detailed Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);

  // Dynamic filtering for search keyword, type and payment method
  const filteredTransactions = transactions.filter((item) => {
    const matchSearch =
      item.id.toLowerCase().includes(searchText.toLowerCase()) ||
      item.hostName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.roomName.toLowerCase().includes(searchText.toLowerCase());
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
        <div className="flex flex-col text-left">
          <span className="text-onBackgroundLight/60 font-mono font-bold">{text}</span>
          {record.contractId && (
            <span className="text-[10px] text-onBackgroundLight/40 font-mono">
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
      title: "Tổng thanh toán",
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
          return <Tag color="cyan">Cọc giữ chỗ</Tag>;
        }
        if (type === "RENT") {
          return <Tag color="green">Tiền phòng</Tag>;
        }
        return <Tag color="red">Đền bù tài sản</Tag>;
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
      title: "Hoa hồng hệ thống (5%)",
      dataIndex: "commission",
      key: "commission",
      render: (val, record) => {
        if (record.type !== "RENT") {
          return <span className="text-slate-400 text-xs">Không thu (0 đ)</span>;
        }
        return (
          <span className="text-techBluePrimary font-bold">
            {new Intl.NumberFormat("vi-VN").format(val)} đ
          </span>
        );
      },
    },
    {
      title: "Tác vụ",
      key: "action",
      render: (_, record) => (
        <button
          onClick={() => {
            setSelectedTx(record);
            setIsModalOpen(true);
          }}
          className="text-techBluePrimary font-semibold hover:text-techBluePrimary/80 transition-all duration-300 text-sm hover:underline"
        >
          Chi tiết đối soát
        </button>
      ),
    },
  ];

  return (
    <div className="bg-surfaceLight/80 backdrop-blur-md rounded-2xl p-6 border border-onBackgroundLight/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
      {/* Title section */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-onBackgroundLight tracking-wide">
            NHẬT KÝ GIAO DỊCH & ĐỐI SOÁT DOANH THU
          </h3>
          <p className="text-sm text-onBackgroundLight/40">
            Hệ thống tự động theo dõi dòng tiền thanh toán và trích xuất hoa hồng 5% từ tiền phòng thuê thực tế
          </p>
        </div>
      </div>

      {/* Toolbar filters wrapper */}
      <div className="mb-6 flex flex-wrap items-end gap-4 bg-backgroundLight p-4 rounded-xl border border-onBackgroundLight/5">
        {/* Transaction type filter */}
        <div className="flex flex-col gap-1 text-left flex-1 min-w-[200px]">
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
            className="w-full"
          />
        </div>

        {/* Payment method filter */}
        <div className="flex flex-col gap-1 text-left flex-1 min-w-[200px]">
          <span className="text-xs font-semibold text-onBackgroundLight/50">CỔNG THANH TOÁN</span>
          <Select
            value={methodFilter}
            onChange={(value) => setMethodFilter(value)}
            options={[
              { value: "ALL", label: "Tất cả cổng thanh toán" },
              { value: "MOMO", label: "Ví điện tử MoMo" },
              { value: "VNPAY", label: "Cổng VNPAY" }
            ]}
            className="w-full"
          />
        </div>

        {/* Search keyword query input */}
        <div className="flex flex-col gap-1 text-left flex-1 min-w-[240px]">
          <span className="text-xs font-semibold text-onBackgroundLight/50">TÌM KIẾM CHI TIẾT</span>
          <Input
            prefix={<SearchOutlined className="text-onBackgroundLight/30" />}
            placeholder="Tìm theo mã GD, phòng, chủ nhà..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full rounded-xl"
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
          className="custom-premium-table"
        />
      </div>

      {/* Financial Audit Details Modal */}
      <Modal
        title={
          <span className="text-lg font-bold text-onBackgroundLight">
            CHI TIẾT ĐỐI SOÁT HÓA ĐƠN: {selectedTx?.id}
          </span>
        }
        open={isModalOpen}
        onCancel={() => {
          setSelectedTx(null);
          setIsModalOpen(false);
        }}
        width={650}
        footer={null}
      >
        {selectedTx && (
          <div className="space-y-4 mt-4 text-left">
            {/* General Info */}
            <div className="grid grid-cols-2 gap-4 bg-backgroundLight p-4 rounded-xl border border-onBackgroundLight/5">
              <div>
                <span className="text-xs text-onBackgroundLight/40 block">Tên phòng trọ</span>
                <span className="text-sm font-semibold text-onBackgroundLight">{selectedTx.roomName}</span>
              </div>
              <div>
                <span className="text-xs text-onBackgroundLight/40 block">Chủ trọ</span>
                <span className="text-sm font-semibold text-onBackgroundLight">{selectedTx.hostName}</span>
              </div>
              <div>
                <span className="text-xs text-onBackgroundLight/40 block">Kỳ hóa đơn / Ngày tạo</span>
                <span className="text-sm font-semibold text-onBackgroundLight">
                  Tháng {selectedTx.period || "-"} | {selectedTx.date}
                </span>
              </div>
              <div>
                <span className="text-xs text-onBackgroundLight/40 block">Phương thức thanh toán</span>
                <span className="text-sm font-semibold text-onBackgroundLight">
                  {selectedTx.method} (Đã thanh toán)
                </span>
              </div>
            </div>

            {/* Bill Breakdown */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-onBackgroundLight/50 block">CHI TIẾT DÒNG TIỀN HÓA ĐƠN</span>
              <div className="border border-onBackgroundLight/5 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-backgroundLight border-b border-onBackgroundLight/5 text-[11px] font-bold text-onBackgroundLight/40 uppercase">
                      <th className="p-3 pl-4">Hạng mục chi phí</th>
                      <th className="p-3 text-right">Chi tiết số đo</th>
                      <th className="p-3 pr-4 text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Fixed room rent */}
                    {selectedTx.type === "RENT" && (
                      <tr className="border-b border-onBackgroundLight/5">
                        <td className="p-3 pl-4 font-medium text-slate-800">Tiền phòng cố định</td>
                        <td className="p-3 text-right text-slate-500">-</td>
                        <td className="p-3 pr-4 text-right font-semibold text-slate-800">
                          {new Intl.NumberFormat("vi-VN").format(selectedTx.roomPrice)} đ
                        </td>
                      </tr>
                    )}

                    {/* Electric */}
                    {selectedTx.type === "RENT" && selectedTx.newElectricity > selectedTx.oldElectricity && (
                      <tr className="border-b border-onBackgroundLight/5">
                        <td className="p-3 pl-4 font-medium text-slate-800">Tiền điện</td>
                        <td className="p-3 text-right text-slate-500">
                          {selectedTx.oldElectricity} &rarr; {selectedTx.newElectricity} ({selectedTx.newElectricity - selectedTx.oldElectricity} kWh) &times; {selectedTx.electricityPrice}đ
                        </td>
                        <td className="p-3 pr-4 text-right font-semibold text-slate-800">
                          {new Intl.NumberFormat("vi-VN").format((selectedTx.newElectricity - selectedTx.oldElectricity) * selectedTx.electricityPrice)} đ
                        </td>
                      </tr>
                    )}

                    {/* Water */}
                    {selectedTx.type === "RENT" && selectedTx.newWater > selectedTx.oldWater && (
                      <tr className="border-b border-onBackgroundLight/5">
                        <td className="p-3 pl-4 font-medium text-slate-800">Tiền nước</td>
                        <td className="p-3 text-right text-slate-500">
                          {selectedTx.oldWater} &rarr; {selectedTx.newWater} ({selectedTx.newWater - selectedTx.oldWater} m³) &times; {selectedTx.waterPrice}đ
                        </td>
                        <td className="p-3 pr-4 text-right font-semibold text-slate-800">
                          {new Intl.NumberFormat("vi-VN").format((selectedTx.newWater - selectedTx.oldWater) * selectedTx.waterPrice)} đ
                        </td>
                      </tr>
                    )}

                    {/* Other costs list */}
                    {selectedTx.otherCosts?.map((cost, idx) => (
                      <tr key={idx} className="border-b border-onBackgroundLight/5">
                        <td className="p-3 pl-4 font-medium text-slate-800">{cost.reason}</td>
                        <td className="p-3 text-right text-slate-500">-</td>
                        <td className="p-3 pr-4 text-right font-semibold text-slate-800">
                          {new Intl.NumberFormat("vi-VN").format(cost.amount)} đ
                        </td>
                      </tr>
                    ))}

                    {/* Deposit cost details */}
                    {selectedTx.type === "DEPOSIT" && (
                      <tr className="border-b border-onBackgroundLight/5">
                        <td className="p-3 pl-4 font-medium text-slate-800">Tiền đặt cọc giữ chỗ phòng</td>
                        <td className="p-3 text-right text-slate-500">-</td>
                        <td className="p-3 pr-4 text-right font-semibold text-slate-800">
                          {new Intl.NumberFormat("vi-VN").format(selectedTx.amount)} đ
                        </td>
                      </tr>
                    )}

                    {/* Total billing amount row */}
                    <tr className="bg-slate-50 font-bold text-slate-900">
                      <td className="p-3 pl-4">TỔNG CỘNG HÓA ĐƠN</td>
                      <td className="p-3 text-right">-</td>
                      <td className="p-3 pr-4 text-right text-techBluePrimary text-base">
                        {new Intl.NumberFormat("vi-VN").format(selectedTx.amount)} đ
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Platform Audit Section */}
            <div className="bg-techBluePrimary/5 border border-techBluePrimary/10 rounded-xl p-4 space-y-3">
              <span className="text-xs font-bold text-techBluePrimary uppercase tracking-wider block">
                ĐỐI SOÁT PHÍ NỀN TẢNG (ADMIN AUDIT)
              </span>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs text-slate-500 block">Quy tắc thu hoa hồng</span>
                  <span className="font-semibold text-slate-700">
                    {selectedTx.type === "RENT" ? "Thu 5% trên Tiền phòng gốc" : "Không áp dụng (Thu 0%)"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Số tiền hoa hồng (5%)</span>
                  <span className="font-bold text-amber-600">
                    {new Intl.NumberFormat("vi-VN").format(selectedTx.commission)} đ
                  </span>
                </div>
                <div className="col-span-2 pt-2 border-t border-techBluePrimary/10 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-slate-500">Doanh thu thực chuyển cho Chủ trọ</span>
                    <p className="text-[10px] text-slate-400">(Tổng cộng hóa đơn - Phí 5% tiền phòng)</p>
                  </div>
                  <span className="text-base font-bold text-emerald-600">
                    {new Intl.NumberFormat("vi-VN").format(selectedTx.amount - selectedTx.commission)} đ
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default TransactionHistory;
