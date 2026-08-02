import { useState, useEffect } from "react";
import { Tabs, Table, Modal, Input, Badge, Tag, message, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import API_BASE_URL from "../config/api";

function DisputeResolution() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [resolutionNote, setResolutionNote] = useState("");

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const headers = { "Authorization": `Bearer ${token}` };

        const [disputesRes, reportsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/admin/disputes`, { headers }),
          fetch(`${API_BASE_URL}/api/admin/reports`, { headers })
        ]);

        if (disputesRes.status === 401 || reportsRes.status === 401) {
          localStorage.removeItem("adminToken");
          window.location.reload();
          return;
        }

        const disputesData = await disputesRes.json();
        const reportsData = await reportsRes.json();

        let allCases = [];

        if (Array.isArray(disputesData)) {
          const mappedDisputes = disputesData.map(c => ({
            id: c._id || c.id,
            type: c.type || "CONTRACT_DISPUTE",
            targetName: c.type === 'LISTING_DISPUTE' ? `Kháng cáo khóa/gỡ phòng: ${c.roomName}` : `Tranh chấp hợp đồng thuê: ${c.roomName}`,
            status: c.status === 'PENDING' ? 'PENDING' : 'APPROVED',
            rawStatus: c.status,
            createdAt: c.dateCreated || "Gần đây",
            appellantName: c.type === 'LISTING_DISPUTE' ? (c.hostName || "Chủ nhà") : c.renterName,
            appellantRole: c.type === 'LISTING_DISPUTE' ? "HOST" : "RENTER",
            appealReason: c.disputeReason || (c.type === 'LISTING_DISPUTE' ? "Chủ nhà gửi kháng cáo yêu cầu xem xét lại quyết định gỡ phòng trọ." : "Người thuê yêu cầu hoàn cọc do phòng không đúng thực tế khi nhận bàn giao phòng."),
            proofImages: Array.isArray(c.proofImages) ? c.proofImages : [],
            appealEvidenceUrl: (Array.isArray(c.proofImages) && c.proofImages.length > 0) ? c.proofImages[0] : null,
            originalAuthorName: c.type === 'LISTING_DISPUTE' ? "Quản trị viên (Hệ thống gỡ phòng)" : `${c.hostName || "Chủ trọ"} (Chủ nhà)`,
            originalComment: c.type === 'LISTING_DISPUTE' ? "Phòng trọ bị gỡ do có báo cáo vi phạm chính sách hiển thị hoặc thông tin ảo." : "Yêu cầu giải ngân tiền cọc do người thuê hủy hợp đồng hoặc không đến ở đúng hẹn.",
            depositAmount: c.depositAmount || 0,
            refundBankName: c.refundInfo?.bankName || "Vietcombank",
            refundAccountNumber: c.refundInfo?.accountNumber || "1234567890",
            refundAccountOwner: c.refundInfo?.accountOwner || c.renterName,
            resolvedAt: c.resolvedAt || c.disburseDate || "",
            resolutionNote: c.resolutionNote || ""
          }));
          allCases.push(...mappedDisputes);
        }

        if (Array.isArray(reportsData)) {
          const mappedReports = reportsData.map(r => ({
            id: r._id || r.id,
            type: "REVIEW_DISPUTE",
            targetName: `Báo cáo đánh giá (${r.reviewType === 'ROOM' ? 'Phòng trọ' : 'Người thuê'})`,
            targetRoomTitle: r.targetRoomTitle || "",
            status: r.status === 'PENDING' ? 'PENDING' : 'APPROVED',
            rawStatus: r.status,
            createdAt: r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN') : "Gần đây",
            appellantName: r.reporterName || "Bên báo cáo",
            appellantRole: r.reporterRole || (r.reporterName?.includes("Chủ") ? "HOST" : "RENTER"),
            appealReason: r.reason || "Báo cáo bài đánh giá vi phạm tiêu chuẩn cộng đồng.",
            proofImages: r.proofImages || [],
            appealEvidenceUrl: r.proofImages?.[0] || "",
            originalAuthorName: "Đánh giá bị báo cáo",
            originalComment: r.targetReviewContent || "Bài đánh giá bị báo cáo vi phạm.",
            resolvedAt: r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN') : "",
            resolutionNote: r.adminNote || ""
          }));
          allCases.push(...mappedReports);
        }

        setCases(allCases);
      } catch (err) {
        console.error("Lỗi lấy danh sách tranh chấp / khiếu nại:", err);
        message.error("Lỗi lấy danh sách tranh chấp!");
      } finally {
        setLoading(false);
      }
    };

    fetchDisputes();
  }, [refreshTrigger]);

  const handleOpenModal = (disputeCase) => {
    setSelectedCase(disputeCase);
    setResolutionNote(disputeCase.resolutionNote || "");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCase(null);
    setResolutionNote("");
    setIsModalOpen(false);
  };

  const handleResolve = async (action) => {
    if (!selectedCase) return;
    if (!resolutionNote.trim()) {
      message.error("Vui lòng nhập lý do giải quyết!");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");

      if (selectedCase.type === "REVIEW_DISPUTE") {
        const reportAction = action === "APPROVED" ? "DELETE_REVIEW" : "DISMISS";
        const res = await fetch(`${API_BASE_URL}/api/admin/reports/${selectedCase.id}/resolve`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ action: reportAction, adminNote: resolutionNote })
        });
        const data = await res.json();
        if (data.success) {
          if (reportAction === "DELETE_REVIEW") {
            message.success("Đã gỡ bài đánh giá vi phạm thành công!");
          } else {
            message.success("Đã bác bỏ báo cáo và giữ nguyên đánh giá!");
          }
          handleCloseModal();
          setRefreshTrigger(prev => prev + 1);
        } else {
          message.error("Lỗi giải quyết báo cáo đánh giá!");
        }
      } else {
        const res = await fetch(`${API_BASE_URL}/api/admin/disputes/${selectedCase.id}/resolve`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ status: action, resolutionNote })
        });
        const data = await res.json();
        if (data.success) {
          if (selectedCase.type === 'LISTING_DISPUTE') {
            if (action === 'APPROVED') {
              message.success("Đã chấp nhận kháng cáo: Khôi phục bài đăng phòng trọ thành công!");
            } else {
              message.success("Đã từ chối kháng cáo: Giữ nguyên quyết định gỡ bài đăng phòng trọ!");
            }
          } else {
            if (action === 'APPROVED') {
              message.success("Đã phê duyệt hoàn cọc: Thực hiện hoàn trả tiền cọc thành công về tài khoản Người thuê!");
            } else {
              message.success("Đã bác bỏ hoàn cọc: Giải ngân tiền đặt cọc thành công cho Chủ nhà!");
            }
          }
          handleCloseModal();
          setRefreshTrigger(prev => prev + 1);
        } else {
          message.error("Lỗi giải quyết tranh chấp!");
        }
      }
    } catch (err) {
      console.error("Lỗi giải quyết tranh chấp:", err);
      message.error("Lỗi kết nối máy chủ!");
    }
  };

  const handleApproveAppeal = () => handleResolve("APPROVED");
  const handleRejectAppeal = () => handleResolve("REJECTED");

  // Filter cases
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
      render: (_, record) => {
        if (record.type === "REVIEW_DISPUTE") {
          return <Tag color="cyan">Khiếu nại Đánh giá</Tag>;
        } else if (record.type === "CONTRACT_DISPUTE") {
          return <Tag color="orange">Tranh chấp Hợp đồng</Tag>;
        } else {
          return <Tag color="magenta">Khiếu nại Khóa phòng</Tag>;
        }
      },
    },
    {
      title: "Bên kháng nghị",
      dataIndex: "appellantName",
      key: "appellantName",
    },
    {
      title: "Nội dung đối thoại",
      key: "reasonSummary",
      render: (_, record) => (
        <span className="font-medium text-slate-500 max-w-xs truncate inline-block">
          {record.appealReason}
        </span>
      ),
    },
    {
      title: "Thời điểm gửi",
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
      render: (_, record) => {
        if (record.type === "REVIEW_DISPUTE") {
          return <Tag color="cyan">Khiếu nại Đánh giá</Tag>;
        } else if (record.type === "CONTRACT_DISPUTE") {
          return <Tag color="orange">Tranh chấp Hợp đồng</Tag>;
        } else {
          return <Tag color="magenta">Khiếu nại Khóa phòng</Tag>;
        }
      },
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
          loading={loading}
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
          loading={loading}
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
    <div className="double-bezel-outer animate-fade-in">
      <div className="double-bezel-inner p-6 bg-white/95 backdrop-blur-md">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-onBackgroundLight tracking-wider uppercase">
            GIẢI QUYẾT KHIẾU NẠI & TRANH CHẤP HAI CHIỀU
          </h3>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Xem xét thông tin đối thoại hai chiều: lý do báo cáo ban đầu đối chiếu song song với minh chứng giải trình từ bên kháng cáo
          </p>
        </div>

        {/* Filter toolbar */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]">
          <div className="flex-grow text-left">
            <Input
              prefix={<SearchOutlined className="text-slate-300" />}
              placeholder="Tìm theo mã vụ việc, bên kháng nghị hoặc nội dung tranh chấp..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                { value: "LISTING_DISPUTE", label: "Khiếu nại Khóa phòng trọ" },
                { value: "CONTRACT_DISPUTE", label: "Tranh chấp Hợp đồng & Tiền cọc" }
              ]}
              className="w-full"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultActiveKey="pendingTab" items={tabItems} className="custom-tabs" />

        {/* Resolution modal */}
        <Modal
          title={
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-onBackgroundLight tracking-wider uppercase">
                ĐỐI CHIẾU TRANH CHẤP HAI CHIỀU: {selectedCase?.id}
              </span>
              <Tag color={selectedCase?.type === "REVIEW_DISPUTE" ? "processing" : selectedCase?.type === "CONTRACT_DISPUTE" ? "warning" : "error"}>
                {selectedCase?.type === "REVIEW_DISPUTE" ? "Review Appeal" : selectedCase?.type === "CONTRACT_DISPUTE" ? "Escrow Dispute" : "Takedown Appeal"}
              </Tag>
            </div>
          }
          open={isModalOpen}
          onCancel={handleCloseModal}
          width={850}
          footer={
            selectedCase?.status === "PENDING" ? (
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={handleRejectAppeal}
                  className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-500 ease-premium text-xs font-bold tracking-widest uppercase active:scale-95 shadow-[0_2px_8px_rgba(239,68,68,0.15)]"
                >
                  {selectedCase?.type === "CONTRACT_DISPUTE" ? "Giải ngân cho Chủ nhà" : selectedCase?.type === "REVIEW_DISPUTE" ? "Bác bỏ báo cáo (Giữ đánh giá)" : "Bác bỏ kháng cáo (Giữ gỡ phòng)"}
                </button>
                <button
                  onClick={handleApproveAppeal}
                  className="px-5 py-2.5 bg-techMintAccent hover:bg-techMintAccent/90 text-white font-bold rounded-xl transition-all duration-500 ease-premium text-xs tracking-widest uppercase active:scale-95 shadow-[0_2px_8px_rgba(16,185,129,0.15)]"
                >
                  {selectedCase?.type === "CONTRACT_DISPUTE" ? "Hoàn cọc cho Người thuê" : selectedCase?.type === "REVIEW_DISPUTE" ? "Duyệt gỡ bài đánh giá vi phạm" : "Chấp nhận kháng cáo (Khôi phục phòng)"}
                </button>
              </div>
            ) : (
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all duration-500 ease-premium text-xs font-bold tracking-widest uppercase active:scale-95 border border-slate-200"
                >
                  Đóng
                </button>
              </div>
            )
          }
        >
          {selectedCase && (
            <div className="space-y-5 mt-4 text-left max-h-[72vh] overflow-y-auto pr-2">
              
              {/* Header info */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">TÂM ĐIỂM TRANH CHẤP</span>
                <span className="text-xs font-bold text-slate-700 block mt-1">{selectedCase.targetName}</span>
                {selectedCase.targetRoomTitle && (
                  <span className="text-xs font-semibold text-blue-600 block mt-1">
                    🏠 Thuộc phòng trọ: {selectedCase.targetRoomTitle}
                  </span>
                )}
              </div>

              {/* Escrow details */}
              {selectedCase.type === "CONTRACT_DISPUTE" && (
                <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 space-y-2">
                  <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">THÔNG TIN GIAO DỊCH ESCROW & HOÀN CỌC</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-semibold text-slate-700">
                    <div>Số tiền đặt cọc đóng băng: <span className="text-orange-600 font-bold">{new Intl.NumberFormat("vi-VN").format(selectedCase.depositAmount || 3200000)} đ</span></div>
                    <div>Tài khoản hoàn cọc (Renter): <span className="text-slate-900 font-bold">{selectedCase.refundAccountOwner} - {selectedCase.refundAccountNumber} ({selectedCase.refundBankName})</span></div>
                  </div>
                </div>
              )}

              {/* Comparison block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                
                {/* Original claim */}
                <div className="double-bezel-outer p-1 bg-slate-100/50 flex flex-col">
                  <div className="double-bezel-inner p-4 bg-white/95 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest">
                          BÊN NGUYÊN CÁO (Cáo buộc)
                        </span>
                        <Tag color="error">Cáo buộc</Tag>
                      </div>
                      <span className="text-xs font-bold text-slate-700 block mb-2">
                        {selectedCase.originalAuthorName}
                      </span>
                      <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed font-semibold">
                        {selectedCase.originalComment}
                      </p>
                    </div>
                    <div className="mt-4 text-[10px] text-slate-400 font-semibold italic">
                      * Lý do hệ thống áp dụng hạn chế / khóa phòng trọ lúc đầu.
                    </div>
                  </div>
                </div>

                {/* Appeal & Evidence */}
                <div className="double-bezel-outer p-1 bg-slate-100/50 flex flex-col">
                  <div className="double-bezel-inner p-4 bg-white/95 flex-grow flex flex-col justify-between group">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">
                          BÊN KHÁNG NGHỊ
                        </span>
                        <Tag color="processing">Kháng nghị</Tag>
                      </div>
                      <span className="text-xs font-bold text-slate-700 block mb-2">
                        {selectedCase.appellantName} ({selectedCase.appellantRole === "RENTER" ? "Người thuê" : "Chủ nhà"})
                      </span>
                      <p className="text-xs text-slate-600 bg-blue-50/20 p-3 rounded-xl border border-blue-100/50 leading-relaxed font-semibold mb-3">
                        {selectedCase.appealReason}
                      </p>

                      {/* Evidence media */}
                      {selectedCase.proofImages && selectedCase.proofImages.length > 0 ? (
                        <div className="space-y-1.5">
                          <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">
                            BẰNG CHỨNG GIẢI TRÌNH ({selectedCase.proofImages.length} ảnh):
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {selectedCase.proofImages.map((imgUrl, idx) => (
                              <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-100 w-full max-w-[280px] bg-slate-50 shadow-sm">
                                <img
                                  src={imgUrl}
                                  alt={`Bằng chứng ${idx + 1}`}
                                  className="w-full h-auto object-contain max-h-40 transition-transform duration-700 ease-premium hover:scale-105"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          Bên gửi kháng cáo không đính kèm ảnh minh chứng.
                        </div>
                      )}
                    </div>
                    <div className="mt-4 text-[10px] text-slate-400 font-semibold italic">
                      * Bằng chứng mới do bên kháng nghị cung cấp làm cơ sở đảo ngược quyết định.
                    </div>
                  </div>
                </div>

              </div>

              {/* Resolved info */}
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

              {/* Admin note input */}
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
    </div>
  );
}

export default DisputeResolution;
