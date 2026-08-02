import { useState, useEffect } from "react";
import { Table, Tag, Input, Select, Modal, message, Button } from "antd";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import API_BASE_URL from "../config/api";

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  // Detailed Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`${API_BASE_URL}/api/admin/invoices`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.status === 401) { localStorage.removeItem("adminToken"); window.location.reload(); return; }
        const data = await res.json();
        if (Array.isArray(data)) {
          const mapped = data.map(inv => {
            const elecUsed = Math.max(0, (inv.newElectricity || 0) - (inv.oldElectricity || 0));
            const waterUsed = Math.max(0, (inv.newWater || 0) - (inv.oldWater || 0));
            const otherAmount = (inv.otherCosts || []).reduce((acc, curr) => acc + curr.amount, 0);
            const totalAmount = inv.type === 'DEPOSIT' 
              ? (inv.amount || 0) 
              : ((inv.roomPrice || 0) + (elecUsed * (inv.electricityPrice || 3500)) + (waterUsed * (inv.waterPrice || 15000)) + otherAmount);

            return {
              id: inv._id || inv.id,
              contractId: inv.contractId || "N/A",
              roomId: inv.roomId,
              roomName: inv.roomName,
              hostName: inv.hostName || "Chủ trọ hệ thống",
              period: inv.period,
              roomPrice: inv.roomPrice,
              oldElectricity: inv.oldElectricity,
              newElectricity: inv.newElectricity,
              oldWater: inv.oldWater,
              newWater: inv.newWater,
              otherCosts: inv.otherCosts || [],
              amount: totalAmount,
              method: inv.paymentMethod || "VietQR",
              type: inv.type || "RENT",
              commission: inv.type === 'DEPOSIT' ? 0 : (inv.commission !== undefined ? inv.commission : Math.round((inv.roomPrice || 0) * 0.05)),
              date: inv.dateCreated || "Mới tạo",
              status: inv.status,
              electricityPrice: inv.electricityPrice || 3500,
              waterPrice: inv.waterPrice || 15000
            };
          });
          setTransactions(mapped);
        }
      } catch (err) {
        console.error("Lỗi lấy danh sách đối soát hóa đơn tài chính:", err);
        message.error("Lỗi lấy danh sách đối soát hóa đơn tài chính!");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  // Filter transactions
  const filteredTransactions = transactions.filter((item) => {
    const matchSearch =
      (item.id || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (item.hostName || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (item.roomName || "").toLowerCase().includes(searchText.toLowerCase());
    const matchType = typeFilter === "ALL" || item.type === typeFilter;
    return matchSearch && matchType;
  });

  const handleOpenModal = (tx) => {
    setSelectedTx(tx);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTx(null);
    setIsModalOpen(false);
  };

  // Export CSV
  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      message.warning("Không có dữ liệu để xuất!");
      return;
    }
    const headers = ["Mã GD", "Hợp đồng", "Tên phòng", "Chủ trọ", "Kỳ TT", "Tổng tiền (đ)", "Hoa hồng (đ)", "Thời gian", "Trạng thái"];
    const rows = filteredTransactions.map(t => [
      t.id, t.contractId, `"${t.roomName}"`, `"${t.hostName}"`, t.period,
      t.amount, t.commission, t.date, t.status
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ezroom_transactions_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    message.success(`Đã xuất ${filteredTransactions.length} giao dịch thành công!`);
  };

  const columns = [
    {
      title: "Mã giao dịch",
      dataIndex: "id",
      key: "id",
      render: (text, record) => (
        <div className="flex flex-col text-left">
          <span className="font-mono text-onBackgroundLight/60 text-xs">{text}</span>
          <span className="text-[10px] text-slate-400 mt-0.5">Hợp đồng: {record.contractId}</span>
        </div>
      ),
    },
    {
      title: "Nội dung đối soát",
      key: "content",
      render: (_, record) => (
        <div className="flex flex-col text-left">
          <span className="font-semibold text-onBackgroundLight">{record.roomName}</span>
          <span className="text-xs text-slate-400 mt-0.5">Kỳ thanh toán: {record.period}</span>
        </div>
      ),
    },
    {
      title: "Chủ trọ thụ hưởng",
      dataIndex: "hostName",
      key: "hostName",
    },
    {
      title: "Tổng thanh toán",
      dataIndex: "amount",
      key: "amount",
      render: (val) => (
        <span className="font-bold text-onBackgroundLight">
          {new Intl.NumberFormat("vi-VN").format(val)} đ
        </span>
      ),
    },
    {
      title: "Hoa hồng hệ thống (5%)",
      dataIndex: "commission",
      key: "commission",
      render: (val) => (
        <span className="font-semibold text-techBluePrimary">
          {new Intl.NumberFormat("vi-VN").format(val)} đ
        </span>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        if (status === "PAID" || status === "COMPLETED" || status === "DISBURSED") {
          return <Tag color="green">Đã đối soát (Thành công)</Tag>;
        } else if (status === "REFUNDED") {
          return <Tag color="blue">Hoàn cọc (Thành công)</Tag>;
        }
        return <Tag color="orange">Chờ thanh toán</Tag>;
      },
    },
    {
      title: "Chi tiết",
      key: "action",
      render: (_, record) => (
        <button
          onClick={() => handleOpenModal(record)}
          className="text-techBluePrimary font-semibold hover:text-techBluePrimary/80 transition-all duration-300 text-sm hover:underline hover:scale-105 active:scale-95 inline-block"
        >
          Xem hóa đơn
        </button>
      ),
    },
  ];

  return (
    <div className="double-bezel-outer animate-fade-in">
      <div className="double-bezel-inner p-6 bg-white/95 backdrop-blur-md">
        {/* Toolbar */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="text-left">
              <h3 className="text-sm font-bold text-onBackgroundLight tracking-wider uppercase">
                ĐỐI SOÁT TÀI CHÍNH & LỊCH SỬ GIAO DỊCH
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                Quản lý các khoản thanh toán tiền phòng định kỳ từ người thuê, đối soát tỷ lệ hoa hồng hệ thống 5%
              </p>
            </div>
            {/* Export CSV button */}
            <Button
              icon={<DownloadOutlined />}
              onClick={handleExportCSV}
              className="rounded-xl font-semibold border-techBluePrimary text-techBluePrimary hover:bg-techBluePrimary/5 transition-all duration-300 shrink-0"
            >
              Xuất CSV ({filteredTransactions.length})
            </Button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]">
            <div className="flex-grow text-left">
              <Input
                prefix={<SearchOutlined className="text-slate-300" />}
                placeholder="Tìm theo mã giao dịch, tên chủ nhà hoặc tên phòng..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </div>
            <div className="w-full md:w-64 text-left">
              <Select
                value={typeFilter}
                onChange={(val) => setTypeFilter(val)}
                options={[
                  { value: "ALL", label: "Tất cả giao dịch" },
                  { value: "RENT", label: "Tiền phòng định kỳ (Rent)" },
                  { value: "COMPENSATION", label: "Tiền đền bù & Phát sinh" }
                ]}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="overflow-x-auto">
          <Table
            loading={loading}
            dataSource={filteredTransactions}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            className="custom-premium-table"
          />
        </div>

        {/* Details modal */}
        <Modal
          title={
            <span className="text-sm font-bold text-onBackgroundLight tracking-wider uppercase">
              CHI TIẾT HÓA ĐƠN GIAO DỊCH: {selectedTx?.id}
            </span>
          }
          open={isModalOpen}
          onCancel={handleCloseModal}
          width={650}
          footer={null}
        >
          {selectedTx && (
            <div className="space-y-6 mt-4 text-left text-xs text-slate-600 font-semibold leading-relaxed">
              
              {/* Transaction details */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Hợp đồng liên quan</span>
                  <span className="text-sm font-bold text-slate-700 block mt-1">{selectedTx.contractId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Trạng thái đối soát</span>
                  <span className="mt-1 block">
                    {selectedTx.status === "PAID" ? (
                      <Tag color="green" className="m-0 font-bold">Đã đối soát (Đã thanh toán)</Tag>
                    ) : (
                      <Tag color="orange" className="m-0 font-bold">Chờ thanh toán</Tag>
                    )}
                  </span>
                </div>
              </div>

              {/* Billing breakdown */}
              <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-inner p-4 space-y-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">BẢNG KÊ CHI TIẾT KHOẢN TIỀN</span>
                <div className="space-y-2 text-slate-600">
                  {selectedTx.type === "DEPOSIT" ? (
                    <>
                      <div className="flex justify-between">
                        <span>1. Giá thuê phòng niêm yết:</span>
                        <span className="text-slate-800">{new Intl.NumberFormat("vi-VN").format(selectedTx.roomPrice)} đ/tháng</span>
                      </div>
                      <div className="flex justify-between font-bold text-blue-600 pt-2 border-t border-slate-100">
                        <span>2. Số tiền cọc giữ phòng (Hợp đồng Escrow):</span>
                        <span>{new Intl.NumberFormat("vi-VN").format(selectedTx.amount)} đ</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span>1. Tiền thuê phòng (Cố định):</span>
                        <span className="text-slate-800">{new Intl.NumberFormat("vi-VN").format(selectedTx.roomPrice)} đ</span>
                      </div>

                      {/* Electricity */}
                      {selectedTx.newElectricity > 0 && (
                        <div className="flex justify-between">
                          <span>2. Điện tiêu thụ ({selectedTx.newElectricity - selectedTx.oldElectricity} kWh x {selectedTx.electricityPrice}đ):</span>
                          <span className="text-slate-800">
                            {new Intl.NumberFormat("vi-VN").format(
                              (selectedTx.newElectricity - selectedTx.oldElectricity) * selectedTx.electricityPrice
                            )} đ
                          </span>
                        </div>
                      )}

                      {/* Water */}
                      {selectedTx.newWater > 0 && (
                        <div className="flex justify-between">
                          <span>3. Nước tiêu thụ ({selectedTx.newWater - selectedTx.oldWater} m³ x {selectedTx.waterPrice}đ):</span>
                          <span className="text-slate-800">
                            {new Intl.NumberFormat("vi-VN").format(
                              (selectedTx.newWater - selectedTx.oldWater) * selectedTx.waterPrice
                            )} đ
                          </span>
                        </div>
                      )}

                      {/* Other Costs */}
                      {selectedTx.otherCosts.length > 0 && (
                        <div className="space-y-1.5 border-t border-dashed border-slate-100 pt-2 mt-2">
                          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Chi phí phát sinh khác:</span>
                          {selectedTx.otherCosts.map((c, index) => (
                            <div className="flex justify-between pl-3 text-slate-500 font-semibold" key={index}>
                              <span>• {c.reason}:</span>
                              <span>{new Intl.NumberFormat("vi-VN").format(c.amount)} đ</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Summary amount */}
                      <div className="flex justify-between border-t border-slate-100 pt-3 mt-3 text-sm font-bold text-slate-800">
                        <span>TỔNG CỘNG THANH TOÁN:</span>
                        <span className="text-slate-900">{new Intl.NumberFormat("vi-VN").format(selectedTx.amount)} đ</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Commission info */}
              <div className="bg-blue-50/20 p-4 rounded-2xl border border-blue-100 space-y-3">
                <span className="text-[10px] font-bold text-techBluePrimary uppercase tracking-wider block">PHÍ DỊCH VỤ & PHƯƠNG THỨC</span>
                <div className="grid grid-cols-2 gap-4 text-slate-600 font-semibold">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Tỷ lệ chiết khấu hệ thống</span>
                    <span className="text-sm font-bold text-techBluePrimary block mt-1">
                      {selectedTx.type === "DEPOSIT" ? "0% (Miễn phí cọc)" : "5% giá phòng trọ"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Hoa hồng thu thực tế</span>
                    <span className="text-sm font-bold text-techBluePrimary block mt-1">
                      {new Intl.NumberFormat("vi-VN").format(selectedTx.commission)} đ
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Cổng thanh toán</span>
                    <Tag color="cyan" className="mt-1 font-bold">{selectedTx.method}</Tag>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Thời gian giao dịch</span>
                    <span className="text-slate-800 block mt-1">{selectedTx.date}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default TransactionHistory;
