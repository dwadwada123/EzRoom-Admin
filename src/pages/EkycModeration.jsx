import { useState } from "react";
import { Table, Modal, Input, message } from "antd";

// eKYC database mock
const initialEkycData = [
  {
    id: "1",
    hostName: "Nguyễn Văn Hùng",
    phone: "0912 345 678",
    dateSubmitted: "07/06/2026",
    status: "PENDING",
    idFrontUrl: "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=400",
    idBackUrl: "https://images.unsplash.com/photo-1554774853-720e96af7061?auto=format&fit=crop&q=80&w=400",
    selfieUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "2",
    hostName: "Lê Thị Mai",
    phone: "0988 777 666",
    dateSubmitted: "06/06/2026",
    status: "PENDING",
    idFrontUrl: "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=400",
    idBackUrl: "https://images.unsplash.com/photo-1554774853-720e96af7061?auto=format&fit=crop&q=80&w=400",
    selfieUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "3",
    hostName: "Phạm Minh Tuấn",
    phone: "0905 111 222",
    dateSubmitted: "05/06/2026",
    status: "VERIFIED",
    idFrontUrl: "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=400",
    idBackUrl: "https://images.unsplash.com/photo-1554774853-720e96af7061?auto=format&fit=crop&q=80&w=400",
    selfieUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "4",
    hostName: "Hoàng Thu Thảo",
    phone: "0934 555 444",
    dateSubmitted: "04/06/2026",
    status: "REJECTED",
    idFrontUrl: "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=400",
    idBackUrl: "https://images.unsplash.com/photo-1554774853-720e96af7061?auto=format&fit=crop&q=80&w=400",
    selfieUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
  },
];

// EkycModeration page component
function EkycModeration() {
  const [data, setData] = useState(initialEkycData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Rejection feedback state
  const [rejectionReason, setRejectionReason] = useState("");

  // Open modal handler
  const handleOpenModal = (record) => {
    setSelectedRecord(record);
    setRejectionReason("");
    setIsModalOpen(true);
  };

  // Close modal handler
  const handleCloseModal = () => {
    setSelectedRecord(null);
    setIsModalOpen(false);
  };

  // Approve handler
  const handleApprove = () => {
    if (!selectedRecord) return;
    setData((prevData) =>
      prevData.map((item) =>
        item.id === selectedRecord.id ? { ...item, status: "VERIFIED" } : item
      )
    );
    handleCloseModal();
  };

  // Reject handler
  const handleReject = () => {
    if (!selectedRecord) return;
    if (!rejectionReason.trim()) {
      message.error("Vui lòng nhập lý do từ chối phê duyệt!");
      return;
    }
    setData((prevData) =>
      prevData.map((item) =>
        item.id === selectedRecord.id
          ? { ...item, status: "REJECTED", rejectionReason: rejectionReason }
          : item
      )
    );
    setRejectionReason("");
    message.success("Từ chối phê duyệt hồ sơ thành công");
    handleCloseModal();
  };

  // Get status tag UI representation
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

  // Table columns definition
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
    // Ekyc layout container
    <div className="double-bezel-outer animate-fade-in">
      <div className="double-bezel-inner p-6 bg-white/95 backdrop-blur-md">
        {/* Title section */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-onBackgroundLight tracking-wider uppercase">
            DANH SÁCH HỒ SƠ CHỜ DUYỆT ĐỊNH DANH (eKYC)
          </h3>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Hệ thống đối chiếu thông tin chứng minh nhân dân/CCCD và ảnh selfie chân dung của chủ trọ
          </p>
        </div>

        {/* Verification table */}
        <div className="overflow-x-auto">
          <Table
            dataSource={data}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            className="custom-premium-table"
          />
        </div>

        {/* Document verification modal */}
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
              
              {/* Card 1: Front ID */}
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
                    Mặt trước CCCD
                  </span>
                </div>
              </div>

              {/* Card 2: Back ID */}
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

              {/* Card 3: Selfie */}
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
