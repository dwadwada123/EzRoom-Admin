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
    status: "ACTIVE"
  },
  {
    id: "u2",
    fullName: "Nguyễn Thị Hoa",
    email: "hoanguyen@yahoo.com",
    phone: "0938 888 999",
    role: "RENTER",
    status: "ACTIVE"
  },
  {
    id: "u3",
    fullName: "Trần Minh Hoàng",
    email: "tmhoang@outlook.com",
    phone: "0977 123 456",
    role: "HOST",
    status: "LOCKED",
    lockReason: "Đăng tải thông tin phòng trọ giả mạo"
  },
  {
    id: "u4",
    fullName: "Phạm Thúy Hằng",
    email: "thuyhang@gmail.com",
    phone: "0912 987 654",
    role: "RENTER",
    status: "ACTIVE"
  },
  {
    id: "u5",
    fullName: "Vũ Quốc Anh",
    email: "quocanh.vu@gmail.com",
    phone: "0989 333 444",
    role: "HOST",
    status: "ACTIVE"
  }
];

function UserManagement() {
  const [users, setUsers] = useState(initialUsers);

  // Search and multiple filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

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
    const matchSearch =
      !searchQuery.trim() ||
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchQuery.toLowerCase());

    return matchRole && matchStatus && matchSearch;
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
          return <Tag color="#FF6F43">Chủ nhà</Tag>;
        }
        return <Tag color="#00BFA5">Người thuê</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        if (status === "ACTIVE") {
          return <Tag color="success">Hoạt động</Tag>;
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
              className="rounded-md"
            >
              Khóa
            </Button>
          ) : (
            <Button
              onClick={() => handleOpenUnlockModal(record)}
              size="small"
              className="rounded-md"
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
    <div className="bg-surfaceLight rounded-xl p-6 shadow-sm border border-onBackgroundLight/5">
      {/* Toolbar & Filter Controllers */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-onBackgroundLight">
              QUẢN LÝ TÀI KHOẢN NGƯỜI DÙNG
            </h3>
            <p className="text-sm text-onBackgroundLight/40">
              Tra cứu danh sách thành viên toàn hệ thống và thực thi khóa/mở khóa quyền truy cập tài khoản
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search bar input */}
          <div className="flex flex-col gap-1.5 text-left">
            <span className="text-xs font-semibold text-onBackgroundLight/50">TÌM KIẾM THÀNH VIÊN</span>
            <Input
              prefix={<SearchOutlined className="text-onBackgroundLight/30" />}
              placeholder="Tìm theo tên, email hoặc SĐT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-lg"
              allowClear
            />
          </div>

          {/* Role select list */}
          <div className="flex flex-col gap-1.5 text-left">
            <span className="text-xs font-semibold text-onBackgroundLight/50">VAI TRÒ THÀNH VIÊN</span>
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

          {/* Status select list */}
          <div className="flex flex-col gap-1.5 text-left">
            <span className="text-xs font-semibold text-onBackgroundLight/50">TRẠNG THÁI TÀI KHOẢN</span>
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
        title={<span className="text-lg font-bold text-tealAccent">XÁC NHẬN MỞ KHÓA TÀI KHOẢN</span>}
        open={isUnlockModalOpen}
        onCancel={handleCloseUnlockModal}
        onOk={handleConfirmUnlock}
        okText="Mở khóa tài khoản"
        cancelText="Hủy"
        okButtonProps={{ className: "bg-tealAccent hover:bg-tealAccent/90 border-none" }}
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
