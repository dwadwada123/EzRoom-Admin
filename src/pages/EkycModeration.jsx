import { useState, useEffect } from "react";
import { Table, Modal, Input, message } from "antd";
import API_BASE_URL from "../config/api";

// eKYC moderation component
function EkycModeration() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Rejection reason state
  const [rejectionReason, setRejectionReason] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchPendingEkyc = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`${API_BASE_URL}/api/admin/ekyc/pending`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.status === 401) { localStorage.removeItem("adminToken"); window.location.reload(); return; }
        const resData = await res.json();
        if (Array.isArray(resData)) {
          const mapped = resData.map(user => ({
            id: user._id || user.id,
            hostName: user.name,
            phone: user.phone,
            dateSubmitted: user.dateSubmittedEkyc || "Mới nộp",
            status: user.isEkycVerified ? "VERIFIED" : "PENDING",
            idCardNumber: user.idCardNumber,
            // AD-03: Do NOT use fake Unsplash fallbacks – show null so UI renders a clear placeholder
            idFrontUrl: user.idCardFrontUrl || null,
            idBackUrl: user.idCardBackUrl || null,
            selfieUrl: user.selfieUrl || null
          }));
          setData(mapped);
        }
      } catch (err) {
        console.error("Lỗi lấy danh sách hồ sơ eKYC:", err);
        message.error("Lỗi lấy danh sách hồ sơ eKYC!");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingEkyc();
  }, [refreshTrigger]);

  // Open modal
  const handleOpenModal = (record) => {
    setSelectedRecord(record);
    setRejectionReason("");
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedRecord(null);
    setIsModalOpen(false);
  };

  // Approve eKYC
  const handleApprove = async () => {
    if (!selectedRecord) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_BASE_URL}/api/admin/ekyc/${selectedRecord.id}/moderate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ action: "APPROVE" })
      });
      const resData = await res.json();
      if (resData.success) {
        message.success("Phê duyệt hồ sơ định danh eKYC thành công!");
        handleCloseModal();
        setRefreshTrigger(prev => prev + 1);
      } else {
        message.error("Lỗi phê duyệt hồ sơ!");
      }
    } catch (err) {
      console.error("Lỗi phê duyệt hồ sơ eKYC:", err);
      message.error("Lỗi kết nối máy chủ!");
    }
  };

  // Reject eKYC
  const handleReject = async () => {
    if (!selectedRecord) return;
    if (!rejectionReason.trim()) {
      message.error("Vui lòng nhập lý do từ chối phê duyệt!");
      return;
    }
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_BASE_URL}/api/admin/ekyc/${selectedRecord.id}/moderate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ action: "REJECT", note: rejectionReason })
      });
      const resData = await res.json();
      if (resData.success) {
        message.success("Từ chối phê duyệt hồ sơ thành công!");
        setRejectionReason("");
        handleCloseModal();
        setRefreshTrigger(prev => prev + 1);
      } else {
        message.error("Lỗi từ chối phê duyệt!");
      }
    } catch (err) {
      console.error("Lỗi từ chối phê duyệt hồ sơ eKYC:", err);
      message.error("Lỗi kết nối máy chủ!");
    }
  };

  // Status tag helper
  const getStatusTag = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-techBluePrimary/10 text-techBluePrimary">
            Chờ kiểm duyệt
          </span>
        );
      case "VERIFIED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-techMintAccent/10 text-techMintAccent">
            Đã xác thực
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-500">
            Bị từ chối
          </span>
        );
      default:
        return null;
    }
  };

  // Table columns
  const columns = [
    {
      title: "Chủ nhà",
      dataIndex: "hostName",
      key: "hostName",
      render: (text) => <span className="font-semibold text-onBackgroundLight">{text}</span>,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Ngày nộp đơn",
      dataIndex: "dateSubmitted",
      key: "dateSubmitted",
    },
    {
      title: "Trạng thái định danh",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Tác vụ",
      key: "action",
      render: (_, record) => (
        <button
          onClick={() => handleOpenModal(record)}
          className="text-techBluePrimary font-semibold hover:text-techBluePrimary/80 transition-all duration-300 text-sm hover:underline hover:scale-105 active:scale-95 inline-block"
        >
          Xem hồ sơ
        </button>
      ),
    },
  ];

  return (
    // Layout container
    <div className="double-bezel-outer animate-fade-in">
      <div className="double-bezel-inner p-6 bg-white/95 backdrop-blur-md">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-onBackgroundLight tracking-wider uppercase">
            DANH SÁCH HỒ SƠ CHỜ DUYỆT ĐỊNH DANH (eKYC)
          </h3>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Hệ thống đối chiếu thông tin chứng minh nhân dân/CCCD và ảnh selfie chân dung của chủ trọ
          </p>
        </div>

        {/* eKYC table */}
        <div className="overflow-x-auto">
          <Table
            loading={loading}
            dataSource={data}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            className="custom-premium-table"
          />
        </div>

        {/* Verification modal */}
        <Modal
          title={
            <span className="text-sm font-bold text-onBackgroundLight tracking-wider uppercase">
              CHI TIẾT HỒ SƠ: {selectedRecord?.hostName}
            </span>
          }
          open={isModalOpen}
          onCancel={handleCloseModal}
          width={900}
          footer={
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={handleReject}
                className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-500 ease-premium text-xs font-bold tracking-widest uppercase active:scale-95 shadow-[0_2px_8px_rgba(239,68,68,0.15)]"
              >
                Từ chối hồ sơ
              </button>
              <button
                onClick={handleApprove}
                className="px-5 py-2.5 bg-techMintAccent hover:bg-techMintAccent/90 text-white font-bold rounded-xl transition-all duration-500 ease-premium text-xs tracking-widest uppercase active:scale-95 shadow-[0_2px_8px_rgba(16,185,129,0.15)]"
              >
                Phê duyệt tài khoản
              </button>
            </div>
          }
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              
              {/* Front ID */}
              <div className="double-bezel-outer p-1.5 transition-all duration-500 ease-premium hover:shadow-lg hover:border-techBluePrimary/20 group">
                <div className="double-bezel-inner p-3 bg-slate-50/50 flex flex-col items-center">
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-150 mb-3 flex items-center justify-center">
                    <img
                      src={selectedRecord?.idFrontUrl}
                      alt="Mặt trước CCCD"
                      className="w-full h-full object-cover transition-transform duration-700 ease-premium group-hover:scale-108"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Mặt trước CCCD (Số: {selectedRecord?.idCardNumber})
                  </span>
                </div>
              </div>

              {/* Back ID */}
              <div className="double-bezel-outer p-1.5 transition-all duration-500 ease-premium hover:shadow-lg hover:border-techBluePrimary/20 group">
                <div className="double-bezel-inner p-3 bg-slate-50/50 flex flex-col items-center">
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-150 mb-3 flex items-center justify-center">
                    <img
                      src={selectedRecord?.idBackUrl}
                      alt="Mặt sau CCCD"
                      className="w-full h-full object-cover transition-transform duration-700 ease-premium group-hover:scale-108"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Mặt sau CCCD
                  </span>
                </div>
              </div>

              {/* Selfie */}
              <div className="double-bezel-outer p-1.5 transition-all duration-500 ease-premium hover:shadow-lg hover:border-techBluePrimary/20 group">
                <div className="double-bezel-inner p-3 bg-slate-50/50 flex flex-col items-center">
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-150 mb-3 flex items-center justify-center">
                    <img
                      src={selectedRecord?.selfieUrl}
                      alt="Ảnh selfie chân dung"
                      className="w-full h-full object-cover transition-transform duration-700 ease-premium group-hover:scale-108"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Ảnh selfie chân dung
                  </span>
                </div>
              </div>

            </div>

            {/* Rejection input field */}
            <div className="space-y-1.5 border-t border-slate-100 pt-4">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Lý do từ chối phê duyệt (Bắt buộc nếu bấm Từ chối)
              </label>
              <Input.TextArea
                rows={3}
                placeholder="Nhập lý do chi tiết từ chối phê duyệt định danh..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default EkycModeration;
