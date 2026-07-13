import { useState } from "react";
import { Table, Select, Tag, Button, Input, Modal, message, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";

// Users dataset state
const initialUsers = [
  {
    id: "u1",
    fullName: "Lê Văn Tám",
    email: "levantam@gmail.com",
    phone: "0901 234 567",
    role: "HOST",
    status: "ACTIVE",
    isEkycVerified: true,
    recentViolations: 0,
    totalViolations: 1
  },
  {
    id: "u2",
    fullName: "Nguyễn Thị Hoa",
    email: "hoanguyen@yahoo.com",
    phone: "0938 888 999",
    role: "RENTER",
    status: "ACTIVE",
    isEkycVerified: false,
    creditScore: 4.5
  },
  {
    id: "u3",
    fullName: "Trần Minh Hoàng",
    email: "tmhoang@outlook.com",
    phone: "0977 123 456",
    role: "HOST",
    status: "LOCKED",
    lockReason: "Đăng tải thông tin phòng trọ giả mạo",
    isEkycVerified: true,
    recentViolations: 3,
    totalViolations: 4
  },
  {
    id: "u4",
    fullName: "Phạm Thúy Hằng",
    email: "thuyhang@gmail.com",
    phone: "0912 987 654",
    role: "RENTER",
    status: "ACTIVE",
    isEkycVerified: true,
    creditScore: 4.9
  },
  {
    id: "u5",
    fullName: "Vũ Quốc Anh",
    email: "quocanh.vu@gmail.com",
    phone: "0989 333 444",
    role: "HOST",
    status: "ACTIVE",
    isEkycVerified: false,
    recentViolations: 1,
    totalViolations: 2
  }
];

function UserManagement() {
  const [users, setUsers] = useState(initialUsers);

  // Search and multiple filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [ekycFilter, setEkycFilter] = useState("ALL");
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  // Toggle expand row key helper on row click (excluding buttons clicks)
  const handleRowClick = (record, event) => {
    if (event.target.closest("button")) return;
    setExpandedRowKeys((prevKeys) =>
      prevKeys.includes(record.id)
        ? prevKeys.filter((key) => key !== record.id)
        : [...prevKeys, record.id]
    );
  };

  // Lock confirmation modal handlers
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [userToLock, setUserToLock] = useState(null);
  const [lockReason, setLockReason] = useState("");

  // Unlock confirmation dialog states
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [userToUnlock, setUserToUnlock] = useState(null);

  // Open lock modal
  const handleOpenLockModal = (record) => {
    setUserToLock(record);
    setLockReason("");
    setIsLockModalOpen(true);
  };

  // Close lock modal
  const handleCloseLockModal = () => {
    setUserToLock(null);
    setLockReason("");
    setIsLockModalOpen(false);
  };

  // Confirm lock execution
  const handleConfirmLock = () => {
    if (!userToLock) return;
    if (!lockReason.trim()) {
      message.error("Vui lòng nhập lý do khóa tài khoản!");
      return;
    }

    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.id === userToLock.id ? { ...u, status: "LOCKED", lockReason: lockReason } : u
      )
    );

    message.success(`Đã khóa tài khoản thành công với lý do: ${lockReason}`);
    handleCloseLockModal();
  };

  // Open unlock modal
  const handleOpenUnlockModal = (record) => {
    setUserToUnlock(record);
    setIsUnlockModalOpen(true);
  };

  // Close unlock modal
  const handleCloseUnlockModal = () => {
    setUserToUnlock(null);
    setIsUnlockModalOpen(false);
  };

  // Execute account restoration logic
  const handleConfirmUnlock = () => {
    if (!userToUnlock) return;

    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.id === userToUnlock.id ? { ...u, status: "ACTIVE", lockReason: undefined } : u
      )
    );

    message.success("Đã mở khóa tài khoản thành công!");
    handleCloseUnlockModal();
  };

  // Multi-conditional filtering logic
  const filteredUsers = users.filter((user) => {
    const matchRole = selectedRoleFilter === "ALL" || user.role === selectedRoleFilter;
    const matchStatus = statusFilter === "ALL" || user.status === statusFilter;
    const matchEkyc =
      ekycFilter === "ALL" ||
      (ekycFilter === "VERIFIED" && user.isEkycVerified) ||
      (ekycFilter === "UNVERIFIED" && !user.isEkycVerified);
    const matchSearch =
      !searchQuery.trim() ||
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchQuery.toLowerCase());

    return matchRole && matchStatus && matchEkyc && matchSearch;
  });

  // Table columns definition
  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => <span className="font-semibold text-onBackgroundLight">{text}</span>,
    },
    {
      title: "Vai trò hệ thống",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        if (role === "HOST") {
          return <Tag color="#0284C7">Chủ nhà</Tag>;
        }
        return <Tag color="#10B981">Người thuê</Tag>;
      },
    },
    {
      title: "Xác thực eKYC",
      dataIndex: "isEkycVerified",
      key: "isEkycVerified",
      render: (verified, record) => {
        if (record.role === "RENTER") {
          return <span className="text-slate-400 text-xs font-medium">Không yêu cầu</span>;
        }
        return verified ? (
          <Tag color="#10B981">Đã xác minh</Tag>
        ) : (
          <Tag color="#FF4D4F">Chưa xác minh</Tag>
        );
      },
    },
    {
      title: "Đánh giá / Chỉ số vi phạm",
      key: "violationsOrCredit",
      render: (_, record) => {
        if (record.role === "HOST") {
          const recent = record.recentViolations || 0;
          if (recent === 0) {
            return <Tag color="green">An toàn</Tag>;
          }
          if (recent === 1) {
            return <Tag color="orange">Cảnh báo</Tag>;
          }
          return (
            <Space direction="vertical" size={1} className="text-left">
              <Tag color="red">Rủi ro cao</Tag>
              <span className="text-[9px] text-red-500 font-bold italic uppercase tracking-wider">Đề xuất khóa</span>
            </Space>
          );
        }
        
        const score = record.creditScore || 0;
        return (
          <div className="flex flex-col text-left">
            <span className={`font-semibold ${score >= 4.0 ? "text-emerald-600" : score >= 3.0 ? "text-amber-500" : "text-red-500"}`}>
              {score.toFixed(1)} / 5.0
            </span>
            <span className="text-[10px] text-onBackgroundLight/40 font-medium">Điểm uy tín</span>
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        if (status === "ACTIVE") {
          return <Tag color="#10B981">Hoạt động</Tag>;
        }
        return (
          <Space direction="vertical" size={1} className="text-left">
            <Tag color="error">Đã khóa</Tag>
            {record.lockReason && (
              <span className="text-xs text-red-500 font-medium">Lý do: {record.lockReason}</span>
            )}
          </Space>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {record.status === "ACTIVE" ? (
            <Button
              type="primary"
              danger
              onClick={() => handleOpenLockModal(record)}
              size="small"
              className="rounded-xl border-none font-semibold shadow-[0_2px_8px_rgba(239,68,68,0.15)] hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Khóa
            </Button>
          ) : (
            <Button
              onClick={() => handleOpenUnlockModal(record)}
              size="small"
              className="rounded-xl font-semibold border-techMintAccent text-techMintAccent hover:bg-techMintAccent/5 hover:text-techMintAccent/80 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Mở khóa
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    // UserManagement layout wrapper
    <div className="double-bezel-outer animate-fade-in">
      <div className="double-bezel-inner p-6 bg-white/95 backdrop-blur-md">
        {/* Toolbar & Filter Controllers */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="text-left">
              <h3 className="text-sm font-bold text-onBackgroundLight tracking-wider uppercase">
                QUẢN LÝ TÀI KHOẢN NGƯỜI DÙNG
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                Tra cứu danh sách thành viên toàn hệ thống và thực thi khóa/mở khóa quyền truy cập tài khoản
              </p>
            </div>

            {/* Safety Index Legend */}
            <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500 font-bold bg-slate-50/50 px-4 py-2.5 rounded-xl border border-slate-100/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]">
              <span className="text-slate-400 uppercase tracking-wider mr-1">CHÚ GIẢI CHỈ SỐ:</span>
              <span className="flex items-center gap-1.5"><Tag color="green" className="m-0">An toàn</Tag> 0 vi phạm/30 ngày</span>
              <span className="flex items-center gap-1.5"><Tag color="orange" className="m-0">Cảnh báo</Tag> 1 vi phạm/30 ngày</span>
              <span className="flex items-center gap-1.5"><Tag color="red" className="m-0">Rủi ro cao</Tag> &gt;= 2 vi phạm/30 ngày</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]">
            {/* Search bar input */}
            <div className="flex-grow text-left">
              <Input
                prefix={<SearchOutlined className="text-slate-300" />}
                placeholder="Tìm theo tên, email hoặc SĐT..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                allowClear
              />
            </div>

            {/* Role select list */}
            <div className="w-full md:w-48 text-left">
              <Select
                value={selectedRoleFilter}
                onChange={(value) => setSelectedRoleFilter(value)}
                options={[
                  { value: "ALL", label: "Tất cả vai trò" },
                  { value: "HOST", label: "Chủ nhà (Host)" },
                  { value: "RENTER", label: "Người thuê (Renter)" }
                ]}
                className="w-full"
              />
            </div>

            {/* eKYC status filter */}
            <div className="w-full md:w-48 text-left">
              <Select
                value={ekycFilter}
                onChange={(value) => setEkycFilter(value)}
                options={[
                  { value: "ALL", label: "Tất cả eKYC" },
                  { value: "VERIFIED", label: "Đã xác minh eKYC" },
                  { value: "UNVERIFIED", label: "Chưa xác minh eKYC" }
                ]}
                className="w-full"
              />
            </div>

            {/* Status select list */}
            <div className="w-full md:w-48 text-left">
              <Select
                value={statusFilter}
                onChange={(value) => setStatusFilter(value)}
                options={[
                  { value: "ALL", label: "Tất cả trạng thái" },
                  { value: "ACTIVE", label: "Hoạt động" },
                  { value: "LOCKED", label: "Đã khóa" }
                ]}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Users table */}
        <div className="overflow-x-auto animate-fade-in">
          <Table
            dataSource={filteredUsers}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            expandable={{
              expandedRowKeys,
              onExpand: (expanded, record) => {
                setExpandedRowKeys((prevKeys) =>
                  expanded
                    ? [...prevKeys, record.id]
                    : prevKeys.filter((key) => key !== record.id)
                );
              },
              expandedRowRender: (record) => (
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex flex-col sm:flex-row gap-6 text-xs text-left animate-fade-in shadow-inner">
                  <div>
                    <span className="text-slate-400 block font-bold uppercase tracking-wider text-[10px]">Email tài khoản</span>
                    <span className="font-semibold text-slate-700 block mt-1">{record.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold uppercase tracking-wider text-[10px]">Số điện thoại liên hệ</span>
                    <span className="font-semibold text-slate-700 block mt-1">{record.phone}</span>
                  </div>
                </div>
              ),
              rowExpandable: () => true,
            }}
            onRow={(record) => ({
              onClick: (event) => handleRowClick(record, event),
              className: "cursor-pointer select-none"
            })}
            className="custom-premium-table"
          />
        </div>

        {/* Lock confirmation modal dialog */}
        <Modal
          title={<span className="text-sm font-bold text-red-500 tracking-wider uppercase">XÁC NHẬN KHÓA TÀI KHOẢN</span>}
          open={isLockModalOpen}
        onCancel={handleCloseLockModal}
        onOk={handleConfirmLock}
        okText="Khóa tài khoản"
        cancelText="Hủy"
        okButtonProps={{ className: "bg-red-500 hover:bg-red-600 border-none" }}
      >
        {userToLock && (
          <div className="space-y-4 py-4 text-left">
            <p className="text-sm text-onBackgroundLight/80">
              Bạn có chắc chắn muốn khóa tài khoản của <strong>{userToLock.fullName}</strong> ({userToLock.email})?
            </p>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-onBackgroundLight/50 block">
                Lý do khóa tài khoản
              </label>
              <Input.TextArea
                rows={3}
                placeholder="Nhập lý do khóa chi tiết..."
                value={lockReason}
                onChange={(e) => setLockReason(e.target.value)}
                className="rounded-lg"
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Unlock confirmation modal dialog */}
      <Modal
        title={<span className="text-lg font-bold text-techMintAccent">XÁC NHẬN MỞ KHÓA TÀI KHOẢN</span>}
        open={isUnlockModalOpen}
        onCancel={handleCloseUnlockModal}
        onOk={handleConfirmUnlock}
        okText="Mở khóa tài khoản"
        cancelText="Hủy"
        okButtonProps={{ className: "bg-techMintAccent hover:bg-techMintAccent/90 border-none" }}
      >
        {userToUnlock && (
          <div className="py-4 text-left">
            <p className="text-sm text-onBackgroundLight/80">
              Bạn có chắc chắn muốn mở khóa và khôi phục quyền truy cập hệ thống cho thành viên <strong>{userToUnlock.fullName}</strong> ({userToUnlock.email}) không?
            </p>
          </div>
        )}
      </Modal>
      </div>
    </div>
  );
}

export default UserManagement;
