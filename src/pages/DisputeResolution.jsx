import { useState } from "react";
import { Tabs, Table, Modal, Input, Badge, Tag, Space, message } from "antd";
import { AlertOutlined, SafetyCertificateOutlined } from "@ant-design/icons";

// Mock disputes dataset
const initialDisputes = [
  {
    id: "dr1",
    type: "REVIEW_APPEAL", // Appeal against a host's negative review on a renter
    senderName: "Nguyễn Thị Hoa",
    senderRole: "RENTER",
    targetName: "Đánh giá từ Lê Văn Tám (Chủ nhà)",
    targetDetail: "Đánh giá: 1★ - 'Khách thuê vô ý thức, tự ý hủy xem phòng không báo trước và cãi cọ.'",
    appealReason: "Tôi có nhắn tin báo trước cho chủ nhà 2 tiếng qua hệ thống tin nhắn vì bận việc đột xuất gia đình, thái độ vẫn rất lịch sự. Chủ nhà đánh giá sai sự thật làm ảnh hưởng xấu đến Điểm uy tín của tôi.",
    evidenceUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=600",
    status: "PENDING",
    createdAt: "2026-07-02 14:30"
  },
  {
    id: "dr2",
    type: "LISTING_APPEAL", // Appeal against an admin's listing takedown (reported by renter)
    senderName: "Vũ Quốc Anh",
    senderRole: "HOST",
    targetName: "Bài đăng: Căn hộ dịch vụ tiện ích khu trung tâm (P.302)",
    targetDetail: "Bài đăng bị gỡ do báo cáo 'Thông tin ảo / Địa chỉ không tồn tại'",
    appealReason: "Cơ sở của tôi có giấy đăng ký kinh doanh và giấy tờ sở hữu đất đầy đủ đính kèm bên dưới. Tin đăng bị báo cáo ảo là do cạnh tranh không lành mạnh từ các bên môi giới xung quanh.",
    evidenceUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=600",
    status: "PENDING",
    createdAt: "2026-07-03 09:15"
  },
  {
    id: "dr3",
    type: "LISTING_APPEAL",
    senderName: "Lê Hoài Nam",
    senderRole: "HOST",
    targetName: "Bài đăng: Căn hộ dịch vụ studio mini giá rẻ",
    targetDetail: "Bài đăng bị gỡ do báo cáo 'Lừa đảo cọc trước'",
    appealReason: "Khách thuê tự ý hủy thỏa thuận thuê trước 1 ngày nhận phòng và đòi lại tiền cọc giữ chỗ. Theo điều khoản thỏa thuận cọc lúc đầu, khách tự hủy sẽ mất cọc. Tôi không lừa đảo.",
    evidenceUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=600",
    status: "APPROVED",
    createdAt: "2026-07-01 10:20",
    resolvedAt: "2026-07-01 16:45",
    resolutionNote: "Đã xác minh thỏa thuận đặt cọc giữ chỗ hợp lệ giữa hai bên. Khôi phục bài đăng hoạt động trở lại."
  },
  {
    id: "dr4",
    type: "REVIEW_APPEAL",
    senderName: "Phạm Thúy Hằng",
    senderRole: "RENTER",
    targetName: "Đánh giá từ Trần Minh Hoàng (Chủ nhà)",
    targetDetail: "Đánh giá: 2★ - 'Khách thuê thanh toán chậm tiền phòng tháng 6'",
    appealReason: "Hợp đồng quy định đóng tiền trước ngày 5 hàng tháng. Tôi chuyển khoản tối ngày 4 nhưng ngân hàng bị lỗi giao dịch chậm 24h, tôi đã gửi ảnh bill chuyển tiền tối ngày 4 cho chủ nhà từ trước.",
    evidenceUrl: "https://images.unsplash.com/photo-1616077168079-7e09a677fb2c?auto=format&fit=crop&q=80&w=600",
    status: "REJECTED",
    createdAt: "2026-06-30 08:00",
    resolvedAt: "2026-06-30 15:30",
    resolutionNote: "Giao dịch thực tế báo lỗi và chủ nhà thực nhận vào ngày 6. Đánh giá của chủ nhà phản ánh đúng thực tế trễ hạn. Bác bỏ khiếu nại."
  }
];

function DisputeResolution() {
  const [disputes, setDisputes] = useState(initialDisputes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [resolutionNote, setResolutionNote] = useState("");

  const pendingDisputes = disputes.filter((d) => d.status === "PENDING");
  const resolvedDisputes = disputes.filter((d) => d.status !== "PENDING");

  const handleOpenModal = (dispute) => {
    setSelectedDispute(dispute);
    setResolutionNote("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedDispute(null);
    setIsModalOpen(false);
  };

  // Approve Appeal: Accept appeal, cancel the penalty/restore the listing
  const handleApproveAppeal = () => {
    if (!selectedDispute) return;
    if (!resolutionNote.trim()) {
      message.error("Vui lòng nhập lý do phê duyệt khiếu nại!");
      return;
    }
    setDisputes((prev) =>
      prev.map((d) =>
        d.id === selectedDispute.id
          ? {
              ...d,
              status: "APPROVED",
              resolvedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
              resolutionNote
            }
          : d
      )
    );
    message.success(
      selectedDispute.type === "REVIEW_APPEAL"
        ? "Đã chấp nhận khiếu nại: Đánh giá tiêu cực đã được gỡ bỏ khỏi người thuê!"
        : "Đã chấp nhận khiếu nại: Bài đăng đã được khôi phục trạng thái hoạt động!"
    );
    handleCloseModal();
  };

  // Reject Appeal: Decline appeal, maintain the rating penalty or listing takedown
  const handleRejectAppeal = () => {
    if (!selectedDispute) return;
    if (!resolutionNote.trim()) {
      message.error("Vui lòng nhập lý do bác bỏ khiếu nại!");
      return;
    }
    setDisputes((prev) =>
      prev.map((d) =>
        d.id === selectedDispute.id
          ? {
              ...d,
              status: "REJECTED",
              resolvedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
              resolutionNote
            }
          : d
      )
    );
    message.error("Đã bác bỏ khiếu nại: Giữ nguyên quyết định xử lý ban đầu.");
    handleCloseModal();
  };

  const pendingColumns = [
    {
      title: "Loại khiếu nại",
      key: "type",
      render: (_, record) =>
        record.type === "REVIEW_APPEAL" ? (
          <Tag color="cyan" icon={<SafetyCertificateOutlined />}>Khiếu nại Đánh giá</Tag>
        ) : (
          <Tag color="magenta" icon={<AlertOutlined />}>Khiếu nại Gỡ bài</Tag>
        ),
    },
    {
      title: "Người khiếu nại",
      key: "sender",
      render: (_, record) => (
        <div className="flex flex-col text-left">
          <span className="font-semibold text-slate-800">{record.senderName}</span>
          <span className="text-[10px] text-slate-400 font-medium">
            {record.senderRole === "RENTER" ? "Người thuê" : "Chủ nhà"}
          </span>
        </div>
      ),
    },
    {
      title: "Đối tượng ảnh hưởng",
      dataIndex: "targetName",
      key: "targetName",
      render: (text) => <span className="font-medium text-slate-700">{text}</span>,
    },
    {
      title: "Thời gian gửi",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Tác vụ",
      key: "action",
      render: (_, record) => (
        <button
          onClick={() => handleOpenModal(record)}
          className="text-techBluePrimary font-semibold hover:text-techBluePrimary/80 transition-all duration-300 text-sm hover:underline hover:scale-105 active:scale-95 inline-block"
        >
          Xử lý khiếu nại
        </button>
      ),
    },
  ];

  const resolvedColumns = [
    {
      title: "Loại khiếu nại",
      key: "type",
      render: (_, record) =>
        record.type === "REVIEW_APPEAL" ? (
          <Tag color="cyan">Khiếu nại Đánh giá</Tag>
        ) : (
          <Tag color="magenta">Khiếu nại Gỡ bài</Tag>
        ),
    },
    {
      title: "Người khiếu nại",
      key: "sender",
      render: (_, record) => (
        <div className="flex flex-col text-left">
          <span className="font-semibold text-slate-800">{record.senderName}</span>
          <span className="text-[10px] text-slate-400 font-medium">
            {record.senderRole === "RENTER" ? "Người thuê" : "Chủ nhà"}
          </span>
        </div>
      ),
    },
    {
      title: "Đối tượng",
      dataIndex: "targetName",
      key: "targetName",
    },
    {
      title: "Kết quả giải quyết",
      key: "status",
      render: (_, record) =>
        record.status === "APPROVED" ? (
          <Tag color="green">Chấp nhận khiếu nại</Tag>
        ) : (
          <Tag color="red">Bác bỏ khiếu nại</Tag>
        ),
    },
    {
      title: "Thời gian giải quyết",
      dataIndex: "resolvedAt",
      key: "resolvedAt",
    },
    {
      title: "Tác vụ",
      key: "action",
      render: (_, record) => (
        <button
          onClick={() => handleOpenModal(record)}
          className="text-slate-500 font-semibold hover:text-slate-700 transition-all duration-300 text-sm hover:underline"
        >
          Xem chi tiết
        </button>
      ),
    },
  ];

  const tabItems = [
    {
      key: "pendingTab",
      label: (
        <span className="flex items-center gap-2">
          Chờ giải quyết
          <Badge count={pendingDisputes.length} style={{ backgroundColor: "#0284C7" }} />
        </span>
      ),
      children: (
        <Table
          dataSource={pendingDisputes}
          columns={pendingColumns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          className="custom-premium-table"
        />
      ),
    },
    {
      key: "resolvedTab",
      label: (
        <span className="flex items-center gap-2">
          Đã giải quyết
          <Badge count={resolvedDisputes.length} style={{ backgroundColor: "#10B981" }} />
        </span>
      ),
      children: (
        <Table
          dataSource={resolvedDisputes}
          columns={resolvedColumns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          className="custom-premium-table"
        />
      ),
    },
  ];

  return (
    <div className="bg-surfaceLight/80 backdrop-blur-md rounded-2xl p-6 border border-onBackgroundLight/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-onBackgroundLight tracking-wide">
          GIẢI QUYẾT KHIẾU NẠI & TRANH CHẤP
        </h3>
        <p className="text-sm text-onBackgroundLight/40">
          Xem xét các yêu cầu kháng cáo về đánh giá xấu của người thuê hoặc các quyết định gỡ bài đăng từ chủ nhà
        </p>
      </div>

      {/* Tabs list */}
      <Tabs defaultActiveKey="pendingTab" items={tabItems} className="custom-tabs" />

      {/* Detail dispute resolution modal */}
      <Modal
        title={
          <span className="text-lg font-bold text-onBackgroundLight">
            CHI TIẾT KHIẾU NẠI: #{selectedDispute?.id}
          </span>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        width={700}
        footer={
          selectedDispute?.status === "PENDING" ? (
            <div className="flex justify-end gap-3 pt-4 border-t border-onBackgroundLight/10">
              <button
                onClick={handleRejectAppeal}
                className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-150 text-sm font-medium"
              >
                BÁC BỎ KHIẾU NẠI
              </button>
              <button
                onClick={handleApproveAppeal}
                className="px-5 py-2.5 bg-techMintAccent hover:bg-techMintAccent/90 text-white font-bold rounded-lg transition-colors duration-150 text-sm"
              >
                CHẤP NHẬN KHIẾU NẠI
              </button>
            </div>
          ) : (
            <div className="flex justify-end gap-3 pt-4 border-t border-onBackgroundLight/10">
              <button
                onClick={handleCloseModal}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors duration-150 text-sm font-medium"
              >
                ĐÓNG
              </button>
            </div>
          )
        }
      >
        {selectedDispute && (
          <div className="space-y-4 mt-4 text-left max-h-[70vh] overflow-y-auto pr-2">
            {/* Appellant details */}
            <div className="grid grid-cols-2 gap-4 bg-backgroundLight p-4 rounded-xl border border-onBackgroundLight/5">
              <div>
                <span className="text-xs text-slate-500 block">Người kháng cáo</span>
                <span className="text-sm font-bold text-slate-800">
                  {selectedDispute.senderName} ({selectedDispute.senderRole === "RENTER" ? "Người thuê" : "Chủ nhà"})
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Thời điểm khiếu nại</span>
                <span className="text-sm font-semibold text-slate-800">{selectedDispute.createdAt}</span>
              </div>
            </div>

            {/* Target item of appeal */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                NỘI DUNG/QUYẾT ĐỊNH BỊ KHIẾU NẠI
              </span>
              <span className="text-sm font-bold text-slate-700 block">{selectedDispute.targetName}</span>
              <p className="text-xs text-slate-500 bg-white p-3 rounded-lg border border-slate-100 mt-2 font-medium">
                {selectedDispute.targetDetail}
              </p>
            </div>

            {/* Reason */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-onBackgroundLight/50">LÝ DO KHÁNG CÁO</span>
              <p className="text-sm text-onBackgroundLight/85 bg-backgroundLight p-3 rounded-lg border border-onBackgroundLight/5">
                {selectedDispute.appealReason}
              </p>
            </div>

            {/* Evidence attachment file */}
            {selectedDispute.evidenceUrl && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-onBackgroundLight/50 block">MINH CHỨNG ĐÍNH KÈM</span>
                <div className="relative rounded-lg overflow-hidden border border-slate-200 w-full max-w-sm bg-slate-100">
                  <img
                    src={selectedDispute.evidenceUrl}
                    alt="Dispute evidence"
                    className="w-full h-auto object-contain max-h-56"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-slate-900/60 p-2 text-center text-xs text-white backdrop-blur-sm font-semibold">
                    Xem ảnh chứng cứ giao dịch / tin nhắn
                  </div>
                </div>
              </div>
            )}

            {/* Resolved state details */}
            {selectedDispute.status !== "PENDING" && (
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 space-y-2">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                  KẾT QUẢ GIẢI QUYẾT CỦA HỆ THỐNG
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-slate-500 block">Trạng thái quyết định</span>
                    <Tag color={selectedDispute.status === "APPROVED" ? "green" : "red"} className="mt-1 font-bold">
                      {selectedDispute.status === "APPROVED" ? "CHẤP NHẬN TRANH CHẤP" : "BÁC BỎ TRANH CHẤP"}
                    </Tag>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Thời gian xử lý</span>
                    <span className="text-sm font-semibold text-slate-800 block mt-1">{selectedDispute.resolvedAt}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-emerald-100/50">
                  <span className="text-xs text-slate-500 block">Ghi chú giải quyết của Admin</span>
                  <p className="text-sm font-medium text-slate-700 mt-1">{selectedDispute.resolutionNote}</p>
                </div>
              </div>
            )}

            {/* Admin input for pending status */}
            {selectedDispute.status === "PENDING" && (
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-onBackgroundLight/50 block">
                  Ghi chú kết quả xử lý và phản hồi gửi đến các bên (Bắt buộc)
                </label>
                <Input.TextArea
                  rows={3}
                  placeholder="Nhập chi tiết ghi chú xử lý để gửi thông báo cho khách thuê/chủ nhà..."
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  className="rounded-lg"
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default DisputeResolution;
