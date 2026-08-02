import { useState, useEffect } from "react";
import { Table, Select, Tag, Button, Input, Modal, message, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import API_BASE_URL from "../config/api";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [ekycFilter, setEkycFilter] = useState("ALL");
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.status === 401) { localStorage.removeItem("adminToken"); window.location.reload(); return; }
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : (Array.isArray(data?.users) ? data.users : []));
      } catch (err) {
        console.error("Lỗi lấy danh sách tài khoản:", err);
        message.error("Lỗi lấy danh sách tài khoản!");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [refreshTrigger]);

  // Toggle row expand
  const handleRowClick = (record, event) => {
    if (event.target.closest("button")) return;
    const key = record._id || record.id;
    setExpandedRowKeys((prevKeys) =>
      prevKeys.includes(key)
        ? prevKeys.filter((k) => k !== key)
        : [...prevKeys, key]
    );
  };

  // Lock modal state
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [userToLock, setUserToLock] = useState(null);
  const [lockReason, setLockReason] = useState("");

  // Unlock modal state
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

  // Execute lock
  const handleConfirmLock = async () => {
    if (!userToLock) return;
    if (!lockReason.trim()) {
      message.error("Vui lòng nhập lý do khóa tài khoản!");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${userToLock._id || userToLock.id}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: "LOCKED", lockReason })
      });
      const data = await res.json();
      if (data.success) {
        message.success(`Đã khóa tài khoản thành công với lý do: ${lockReason}`);
        handleCloseLockModal();
        setRefreshTrigger(prev => prev + 1);
      } else {
        message.error("Lỗi cập nhật trạng thái khoản!");
      }
    } catch (err) {
      console.error("Lỗi khóa tài khoản:", err);
      message.error("Lỗi kết nối máy chủ!");
    }
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

  // Execute unlock
  const handleConfirmUnlock = async () => {
    if (!userToUnlock) return;

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${userToUnlock._id || userToUnlock.id}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: "ACTIVE", lockReason: "" })
      });
      const data = await res.json();
      if (data.success) {
        message.success("Đã mở khóa tài khoản thành công!");
        handleCloseUnlockModal();
        setRefreshTrigger(prev => prev + 1);
      } else {
        message.error("Lỗi mở khóa tài khoản!");
      }
    } catch (err) {
      console.error("Lỗi mở khóa tài khoản:", err);
      message.error("Lỗi kết nối máy chủ!");
    }
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchRole = selectedRoleFilter === "ALL" || user.role === selectedRoleFilter;
    const matchStatus = statusFilter === "ALL" || user.status === statusFilter;
    const matchEkyc =
      ekycFilter === "ALL" ||
      (ekycFilter === "VERIFIED" && user.isEkycVerified) ||
      (ekycFilter === "UNVERIFIED" && !user.isEkycVerified);
    
    const nameStr = user.name || user.fullName || "";
    const emailStr = user.email || "";
    const phoneStr = user.phone || "";

    const matchSearch =
      !searchQuery.trim() ||
      nameStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emailStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phoneStr.toLowerCase().includes(searchQuery.toLowerCase());

    return matchRole && matchStatus && matchEkyc && matchSearch;
  });

  // Table columns
  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      render: (text, record) => <span className="font-semibold text-onBackgroundLight">{text || record.fullName}</span>,
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
          const recent = record.violations || record.recentViolations || 0;
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
        
        // Renter credit score
        const score = record.creditScore !== undefined && record.creditScore !== null ? Number(record.creditScore) : null;
        const reviewCount = record.reviewCount || 0;

        if (score === null || reviewCount === 0) {
          return <Tag color="default">Chưa có đánh giá</Tag>;
        }

        return (
          <div className="flex flex-col text-left">
            <span className={`font-semibold ${score >= 4.0 ? "text-emerald-600" : score >= 3.0 ? "text-amber-500" : "text-red-500"}`}>
              {score.toFixed(1)} / 5.0
            </span>
            <span className="text-[10px] text-onBackgroundLight/40 font-medium">({reviewCount} đánh giá)</span>
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        if (status === "ACTIVE" || !status) {
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
          {record.status === "ACTIVE" || !record.status ? (
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
    // User management container
    <div className="double-bezel-outer animate-fade-in">
      <div className="double-bezel-inner p-6 bg-white/95 backdrop-blur-md">
        {/* Toolbar */}
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

            {/* Safety index */}
            <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500 font-bold bg-slate-50/50 px-4 py-2.5 rounded-xl border border-slate-100/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]">
              <span className="text-slate-400 uppercase tracking-wider mr-1">CHÚ GIẢI CHỈ SỐ:</span>
              <span className="flex items-center gap-1.5"><Tag color="green" className="m-0">An toàn</Tag> 0 vi phạm/30 ngày</span>
              <span className="flex items-center gap-1.5"><Tag color="orange" className="m-0">Cảnh báo</Tag> 1 vi phạm/30 ngày</span>
              <span className="flex items-center gap-1.5"><Tag color="red" className="m-0">Rủi ro cao</Tag> &gt;= 2 vi phạm/30 ngày</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]">
            {/* Search input */}
            <div className="flex-grow text-left">
              <Input
                prefix={<SearchOutlined className="text-slate-300" />}
                placeholder="Tìm theo tên, email hoặc SĐT..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                allowClear
              />
            </div>

            {/* Role filter */}
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

            {/* eKYC filter */}
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

            {/* Status filter */}
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
            loading={loading}
            dataSource={filteredUsers}
            columns={columns}
            rowKey={(record) => record._id || record.id}
            pagination={{ pageSize: 5 }}
            expandable={{
              expandedRowKeys,
              onExpand: (expanded, record) => {
                const key = record._id || record.id;
                setExpandedRowKeys((prevKeys) =>
                  expanded
                    ? [...prevKeys, key]
                    : prevKeys.filter((k) => k !== key)
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

        {/* Lock modal */}
        <Modal
          title={<span className="text-sm font-bold text-red-500 tracking-wider uppercase">XÁC NHẬN KHÓA TÀI KHOẢN</span>}
          open={isLockModalOpen}
          onOk={handleConfirmLock}
          onCancel={handleCloseLockModal}
          okText="Khóa tài khoản"
          cancelText="Hủy"
          okButtonProps={{ danger: true, className: "rounded-xl font-bold" }}
          cancelButtonProps={{ className: "rounded-xl font-bold" }}
          className="premium-modal"
        >
          <div className="space-y-4 py-4 text-left">
            <p className="text-xs text-slate-500">
              Bạn đang chuẩn bị khóa tài khoản của <strong>{userToLock ? (userToLock.name || userToLock.fullName) : ""}</strong>. Người dùng sẽ bị mất quyền đăng nhập và các quyền thao tác trên ứng dụng di động ngay lập tức.
            </p>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lý do khóa (bắt buộc)</span>
              <Input.TextArea
                rows={3}
                placeholder="Nhập lý do khóa chi tiết..."
                value={lockReason}
                onChange={(e) => setLockReason(e.target.value)}
                className="rounded-xl mt-1"
              />
            </div>
          </div>
        </Modal>

        {/* Unlock modal */}
        <Modal
          title={<span className="text-sm font-bold text-techMintAccent tracking-wider uppercase">XÁC NHẬN MỞ KHÓA TÀI KHOẢN</span>}
          open={isUnlockModalOpen}
          onOk={handleConfirmUnlock}
          onCancel={handleCloseUnlockModal}
          okText="Mở khóa ngay"
          cancelText="Hủy"
          okButtonProps={{ className: "bg-techMintAccent border-none hover:bg-techMintAccent/90 rounded-xl font-bold" }}
          cancelButtonProps={{ className: "rounded-xl font-bold" }}
          className="premium-modal"
        >
          <div className="py-4 text-left">
            <p className="text-xs text-slate-500">
              Xác nhận khôi phục hoạt động cho tài khoản của <strong>{userToUnlock ? (userToUnlock.name || userToUnlock.fullName) : ""}</strong>? Các chỉ số cảnh báo vi phạm trước đó vẫn được giữ lại để tiếp tục giám sát.
            </p>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default UserManagement;
