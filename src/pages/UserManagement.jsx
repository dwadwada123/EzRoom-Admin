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
    creditScore: 4.8
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
    creditScore: 2.1
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
    creditScore: 3.8
  }
];

function UserManagement() {
  const [users, setUsers] = useState(initialUsers);

  // Search and multiple filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [ekycFilter, setEkycFilter] = useState("ALL");

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
      title: "Email tài khoản",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
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
      title: "Điểm uy tín",
      dataIndex: "creditScore",
      key: "creditScore",
      render: (score, record) => {
        if (record.role === "HOST") {
          return <span className="text-slate-400 text-xs font-medium">Không áp dụng</span>;
        }
        return (
          <span className={`font-semibold ${score >= 4.0 ? "text-emerald-600" : score >= 3.0 ? "text-amber-500" : "text-red-500"}`}>
            {score.toFixed(1)} / 5.0
          </span>
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
    <div className="bg-surfaceLight/80 backdrop-blur-md rounded-2xl p-6 border border-onBackgroundLight/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
      {/* Toolbar & Filter Controllers */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-onBackgroundLight tracking-wide">
              QUẢN LÝ TÀI KHOẢN NGƯỜI DÙNG
            </h3>
            <p className="text-sm text-onBackgroundLight/40">
              Tra cứu danh sách thành viên toàn hệ thống và thực thi khóa/mở khóa quyền truy cập tài khoản
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(15,23,42,0.02)]">
          {/* Search bar input */}
          <div className="flex-grow text-left">
            <Input
              prefix={<SearchOutlined className="text-onBackgroundLight/30" />}
              placeholder="Tìm theo tên, email hoặc SĐT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-xl"
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
      <div className="overflow-x-auto">
        <Table
          dataSource={filteredUsers}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          className="custom-premium-table"
        />
      </div>

      {/* Lock confirmation modal dialog */}
      <Modal
        title={<span className="text-lg font-bold text-red-500">XÁC NHẬN KHÓA TÀI KHOẢN</span>}
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
  );
}

export default UserManagement;
