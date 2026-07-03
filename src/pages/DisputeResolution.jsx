import { useState } from "react";
import { Tabs, Table, Modal, Input, Badge, Tag, Space, message, Select } from "antd";
import { AlertOutlined, SafetyCertificateOutlined, ArrowRightOutlined, SearchOutlined } from "@ant-design/icons";

// Mock dispute cases dataset (two-sided appeals)
const initialDisputeCases = [
  {
    id: "CASE-101",
    type: "REVIEW_DISPUTE",
    targetName: "Đánh giá uy tín Người thuê: Nguyễn Thị Hoa",
    status: "PENDING",
    createdAt: "2026-07-02 14:30",
    
    // Appellant (the one claiming the penalty is unfair)
    appellantName: "Nguyễn Thị Hoa",
    appellantRole: "RENTER",
    appealReason: "Tôi có nhắn tin báo trước cho chủ nhà 2 tiếng qua hệ thống tin nhắn vì bận việc đột xuất gia đình, thái độ vẫn rất lịch sự. Chủ nhà đánh giá sai sự thật làm ảnh hưởng xấu đến Điểm uy tín của tôi.",
    appealEvidenceUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=600",
    
    // Original claim (why they were penalized)
    originalAuthorName: "Lê Văn Tám (Chủ nhà)",
    originalComment: "Đánh giá: 1★ - 'Khách thuê vô ý thức, tự ý hủy xem phòng không báo trước và cãi cọ.'"
  },
  {
    id: "CASE-102",
    type: "LISTING_DISPUTE",
    targetName: "Quyết định gỡ Bài đăng: Căn hộ dịch vụ tiện ích khu trung tâm (P.302)",
    status: "PENDING",
    createdAt: "2026-07-03 09:15",
    
    // Appellant (the Host claiming the listing is genuine)
    appellantName: "Vũ Quốc Anh",
    appellantRole: "HOST",
    appealReason: "Cơ sở của tôi có giấy đăng ký kinh doanh và giấy tờ sở hữu đất đầy đủ đính kèm bên dưới. Tin đăng bị báo cáo ảo là do cạnh tranh không lành mạnh từ các bên môi giới xung quanh.",
    appealEvidenceUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=600",
    
    // Original claim (why it was blocked - aggregated reports)
    originalAuthorName: "Báo cáo gộp từ 3 khách thuê",
    originalComment: "Báo cáo: 'Thông tin ảo / Địa chỉ không tồn tại thực tế trên bản đồ, gọi điện không liên lạc được.'"
  },
  {
    id: "CASE-103",
    type: "LISTING_DISPUTE",
    targetName: "Quyết định gỡ Bài đăng: Căn hộ dịch vụ studio mini giá rẻ",
    status: "APPROVED",
    createdAt: "2026-07-01 10:20",
    resolvedAt: "2026-07-01 16:45",
    resolutionNote: "Đã xác minh thỏa thuận đặt cọc giữ chỗ hợp lệ giữa hai bên. Khôi phục bài đăng hoạt động trở lại.",
    
    appellantName: "Lê Hoài Nam",
    appellantRole: "HOST",
    appealReason: "Khách thuê tự ý hủy thỏa thuận thuê trước 1 ngày nhận phòng và đòi lại tiền cọc giữ chỗ. Theo thỏa thuận ban đầu, tự hủy sẽ mất cọc. Tôi không lừa đảo.",
    appealEvidenceUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=600",
    
    originalAuthorName: "Báo cáo từ khách thuê: Phạm Văn Đồng",
    originalComment: "Báo cáo: 'Lừa đảo cọc giữ chỗ phòng trọ, đòi tiền lại không trả'"
  },
  {
    id: "CASE-104",
    type: "REVIEW_DISPUTE",
    targetName: "Đánh giá uy tín Người thuê: Phạm Thúy Hằng",
    status: "REJECTED",
    createdAt: "2026-06-30 08:00",
    resolvedAt: "2026-06-30 15:30",
    resolutionNote: "Giao dịch thực tế báo lỗi và chủ nhà thực nhận vào ngày 6 (quá hạn ngày 5). Đánh giá của chủ nhà phản ánh đúng thực tế trễ hạn. Bác bỏ khiếu nại.",
    
    appellantName: "Phạm Thúy Hằng",
    appellantRole: "RENTER",
    appealReason: "Hợp đồng quy định đóng tiền trước ngày 5 hàng tháng. Tôi chuyển khoản tối ngày 4 nhưng ngân hàng bị lỗi giao dịch chậm 24h, tôi đã gửi ảnh bill chuyển tiền tối ngày 4 cho chủ nhà từ trước.",
    appealEvidenceUrl: "https://images.unsplash.com/photo-1616077168079-7e09a677fb2c?auto=format&fit=crop&q=80&w=600",
    
    originalAuthorName: "Trần Minh Hoàng (Chủ nhà)",
    originalComment: "Đánh giá: 2★ - 'Khách thuê thanh toán chậm tiền phòng tháng 6'"
  }
];

function DisputeResolution() {
  const [cases, setCases] = useState(initialDisputeCases);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [resolutionNote, setResolutionNote] = useState("");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const handleOpenModal = (disputeCase) => {
    setSelectedCase(disputeCase);
    setResolutionNote("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCase(null);
    setIsModalOpen(false);
  };

  const handleApproveAppeal = () => {
    if (!selectedCase) return;
    if (!resolutionNote.trim()) {
      message.error("Vui lòng nhập lý do phê duyệt khiếu nại!");
      return;
    }
    setCases((prev) =>
      prev.map((c) =>
        c.id === selectedCase.id
          ? {
              ...c,
              status: "APPROVED",
              resolvedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
              resolutionNote
            }
          : c
      )
    );
    message.success("Đã chấp nhận khiếu nại: Đảo ngược hình phạt/Khôi phục tin đăng thành công!");
    handleCloseModal();
  };

  const handleRejectAppeal = () => {
    if (!selectedCase) return;
    if (!resolutionNote.trim()) {
      message.error("Vui lòng nhập lý do bác bỏ khiếu nại!");
      return;
    }
    setCases((prev) =>
      prev.map((c) =>
        c.id === selectedCase.id
          ? {
              ...c,
              status: "REJECTED",
              resolvedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
              resolutionNote
            }
          : c
      )
    );
    message.error("Đã bác bỏ khiếu nại: Giữ nguyên hình phạt ban đầu.");
    handleCloseModal();
  };

  // Filter cases logic
  const getFilteredCases = (list) => {
    return list.filter((item) => {
      const matchSearch =
        !searchQuery.trim() ||
        item.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.appellantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.originalAuthorName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = typeFilter === "ALL" || item.type === typeFilter;
      return matchSearch && matchType;
    });
  };

  const pendingCases = getFilteredCases(cases.filter((c) => c.status === "PENDING"));
  const resolvedCases = getFilteredCases(cases.filter((c) => c.status !== "PENDING"));

  const pendingColumns = [
    {
      title: "Mã Vụ việc",
      dataIndex: "id",
      key: "id",
      render: (text) => <span className="font-bold text-slate-800">{text}</span>,
    },
    {
      title: "Loại đối thoại",
      key: "type",
      render: (_, record) =>
        record.type === "REVIEW_DISPUTE" ? (
          <Tag color="cyan" icon={<SafetyCertificateOutlined />}>Khiếu nại Đánh giá</Tag>
        ) : (
          <Tag color="magenta" icon={<AlertOutlined />}>Khiếu nại Gỡ bài</Tag>
        ),
    },
    {
      title: "Bên Kháng nghị (Bị phạt)",
      key: "appellant",
      render: (_, record) => (
        <div className="flex flex-col text-left">
          <span className="font-semibold text-slate-800">{record.appellantName}</span>
          <span className="text-[10px] text-slate-400 font-medium">
            {record.appellantRole === "RENTER" ? "Người thuê" : "Chủ nhà"}
          </span>
        </div>
      ),
    },
    {
      title: "Bên Nguyên cáo (Gửi báo cáo/đánh giá)",
      key: "originalAuthor",
      render: (_, record) => (
        <span className="font-medium text-slate-600">{record.originalAuthorName}</span>
      ),
    },
    {
      title: "Đối tượng tranh chấp",
      dataIndex: "targetName",
      key: "targetName",
      render: (text) => (
        <span className="font-medium text-slate-700 block max-w-xs truncate" title={text}>
          {text}
        </span>
      ),
    },
    {
      title: "Tác vụ",
      key: "action",
      render: (_, record) => (
        <button
          onClick={() => handleOpenModal(record)}
          className="text-techBluePrimary font-semibold hover:text-techBluePrimary/80 transition-all duration-300 text-sm hover:underline hover:scale-105 active:scale-95 inline-block"
        >
          Xử lý tranh chấp
        </button>
      ),
    },
  ];

  const resolvedColumns = [
    {
      title: "Mã Vụ việc",
      dataIndex: "id",
      key: "id",
      render: (text) => <span className="font-bold text-slate-800">{text}</span>,
    },
    {
      title: "Loại đối thoại",
      key: "type",
      render: (_, record) =>
        record.type === "REVIEW_DISPUTE" ? (
          <Tag color="cyan">Khiếu nại Đánh giá</Tag>
        ) : (
          <Tag color="magenta">Khiếu nại Gỡ bài</Tag>
        ),
    },
    {
      title: "Bên kháng nghị",
      dataIndex: "appellantName",
      key: "appellantName",
    },
    {
      title: "Kết quả",
      key: "status",
      render: (_, record) =>
        record.status === "APPROVED" ? (
          <Tag color="green">Chấp nhận khiếu nại (Đảo ngược phạt)</Tag>
        ) : (
          <Tag color="red">Bác bỏ khiếu nại (Giữ nguyên phạt)</Tag>
        ),
    },
    {
      title: "Thời gian xử lý",
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
          Tranh chấp chờ giải quyết
          <Badge count={pendingCases.length} style={{ backgroundColor: "#0284C7" }} />
        </span>
      ),
      children: (
        <Table
          dataSource={pendingCases}
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
          Lịch sử đã giải quyết
          <Badge count={resolvedCases.length} style={{ backgroundColor: "#10B981" }} />
        </span>
      ),
      children: (
        <Table
          dataSource={resolvedCases}
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
          GIẢI QUYẾT KHIẾU NẠI & TRANH CHẤP HAI CHIỀU
        </h3>
        <p className="text-sm text-onBackgroundLight/40">
          Xem xét thông tin đối thoại hai chiều: lý do báo cáo ban đầu đối chiếu song song với minh chứng giải trình từ bên kháng cáo
        </p>
      </div>

      {/* Filter toolbar */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(15,23,42,0.02)]">
        <div className="flex-grow text-left">
          <Input
            prefix={<SearchOutlined className="text-onBackgroundLight/30" />}
            placeholder="Tìm theo mã vụ việc, bên kháng nghị hoặc nội dung tranh chấp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-xl"
            allowClear
          />
        </div>
        <div className="w-full md:w-64 text-left">
          <Select
            value={typeFilter}
            onChange={(val) => setTypeFilter(val)}
            options={[
              { value: "ALL", label: "Tất cả loại tranh chấp" },
              { value: "REVIEW_DISPUTE", label: "Khiếu nại Đánh giá" },
              { value: "LISTING_DISPUTE", label: "Khiếu nại Gỡ bài đăng" }
            ]}
            className="w-full"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultActiveKey="pendingTab" items={tabItems} className="custom-tabs" />

      {/* Two-sided resolution modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-onBackgroundLight">
              ĐỐI CHIẾU TRANH CHẤP HAI CHIỀU: {selectedCase?.id}
            </span>
            <Tag color={selectedCase?.type === "REVIEW_DISPUTE" ? "cyan" : "magenta"}>
              {selectedCase?.type === "REVIEW_DISPUTE" ? "Review Appeal" : "Listing Takedown Appeal"}
            </Tag>
          </div>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        width={850}
        footer={
          selectedCase?.status === "PENDING" ? (
            <div className="flex justify-end gap-3 pt-4 border-t border-onBackgroundLight/10">
              <button
                onClick={handleRejectAppeal}
                className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-150 text-sm font-medium"
              >
                BÁC BỎ KHIẾU NẠI (Giữ nguyên phạt)
              </button>
              <button
                onClick={handleApproveAppeal}
                className="px-5 py-2.5 bg-techMintAccent hover:bg-techMintAccent/90 text-white font-bold rounded-lg transition-colors duration-150 text-sm"
              >
                CHẤP NHẬN KHIẾU NẠI (Đảo ngược phạt)
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
        {selectedCase && (
          <div className="space-y-5 mt-4 text-left max-h-[72vh] overflow-y-auto pr-2">
            
            {/* Header info */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-400 block font-semibold">TÂM ĐIỂM TRANH CHẤP</span>
              <span className="text-sm font-bold text-slate-800 block mt-0.5">{selectedCase.targetName}</span>
            </div>

            {/* Side-by-side comparison block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
              
              {/* Left Side: Original Claim / Penalty Reason */}
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">
                      BÊN NGUYÊN CÁO (Báo cáo/Đánh giá gốc)
                    </span>
                    <Tag color="error">Cáo buộc</Tag>
                  </div>
                  <span className="text-sm font-bold text-slate-800 block mb-1">
                    {selectedCase.originalAuthorName}
                  </span>
                  <p className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-150 leading-relaxed font-medium">
                    {selectedCase.originalComment}
                  </p>
                </div>
                <div className="mt-4 text-xs text-slate-400 italic">
                  * Lý do hệ thống áp dụng hạn chế / gỡ bài viết lúc đầu.
                </div>
              </div>

              {/* Right Side: Appellant Appeal & New Evidence */}
              <div className="bg-blue-50/20 p-4 rounded-xl border border-blue-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                      BÊN BỊ CÁO (Yêu cầu kháng nghị)
                    </span>
                    <Tag color="processing">Kháng nghị</Tag>
                  </div>
                  <span className="text-sm font-bold text-slate-800 block mb-1">
                    {selectedCase.appellantName} ({selectedCase.appellantRole === "RENTER" ? "Người thuê" : "Chủ nhà"})
                  </span>
                  <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-blue-50 leading-relaxed font-medium mb-3">
                    {selectedCase.appealReason}
                  </p>

                  {/* Evidence media */}
                  {selectedCase.appealEvidenceUrl && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-slate-400 block">BẰNG CHỨNG GIẢI TRÌNH ĐÍNH KÈM:</span>
                      <div className="relative rounded-lg overflow-hidden border border-slate-200 w-full max-w-[280px] bg-slate-100">
                        <img
                          src={selectedCase.appealEvidenceUrl}
                          alt="Appeal evidence"
                          className="w-full h-auto object-contain max-h-40"
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-slate-900/60 py-1 text-center text-[10px] text-white backdrop-blur-sm font-semibold">
                          Click để phóng to ảnh
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-4 text-xs text-slate-400 italic">
                  * Bằng chứng mới do bên kháng nghị cung cấp làm cơ sở đảo ngược quyết định.
                </div>
              </div>

            </div>

            {/* Resolved state information */}
            {selectedCase.status !== "PENDING" && (
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 space-y-2">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                  KẾT QUẢ GIẢI QUYẾT CỦA HỆ THỐNG
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-slate-500 block">Quyết định phán quyết</span>
                    <Tag color={selectedCase.status === "APPROVED" ? "green" : "red"} className="mt-1 font-bold">
                      {selectedCase.status === "APPROVED" ? "CHẤP NHẬN KHIẾU NẠI (ĐẢO NGƯỢC PHẠT)" : "BÁC BỎ KHIẾU NẠI (GIỮ NGUYÊN PHẠT)"}
                    </Tag>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Thời gian xử lý</span>
                    <span className="text-sm font-semibold text-slate-800 block mt-1">{selectedCase.resolvedAt}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-emerald-100/50">
                  <span className="text-xs text-slate-500 block">Ghi chú giải quyết của Admin</span>
                  <p className="text-sm font-medium text-slate-700 mt-1">{selectedCase.resolutionNote}</p>
                </div>
              </div>
            )}

            {/* Admin input for pending status */}
            {selectedCase.status === "PENDING" && (
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <label className="text-xs font-semibold text-onBackgroundLight/50 block">
                  Ghi chú kết quả xử lý và phản hồi gửi đến các bên (Bắt buộc)
                </label>
                <Input.TextArea
                  rows={3}
                  placeholder="Nhập lý do chi tiết chấp nhận hoặc bác bỏ khiếu nại..."
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
