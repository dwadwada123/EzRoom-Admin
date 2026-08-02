import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import API_BASE_URL from "../config/api";


// Login component
function Login({ onLoginSuccess }) {
  // Submit handler
  const onFinish = async (values) => {
    const { username, password } = values;
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        message.success("Đăng nhập hệ thống thành công!");
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        message.error(data.error || "Tài khoản hoặc mật khẩu không chính xác!");
      }
    } catch (error) {
      console.error("Login failed:", error);
      message.error("Lỗi kết nối tới máy chủ!");
    }
  };

  return (
    // Layout container
    <div className="w-screen h-screen premium-mesh-bg flex items-center justify-center p-4">
      {/* Login card */}
      <div className="double-bezel-outer w-full max-w-md animate-fade-in">
        <div className="double-bezel-inner p-8 text-center bg-white/95 backdrop-blur-md">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-techBluePrimary tracking-wider uppercase drop-shadow-[0_2px_6px_rgba(2,132,199,0.08)]">
              EzRoom Admin
            </h2>
            <p className="text-xs text-slate-400 mt-2 font-semibold tracking-wide uppercase">
              Hệ thống quản lý nền tảng cho thuê trọ
            </p>
          </div>

          {/* Login form */}
          <Form
            name="login_form"
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            className="text-left font-medium"
          >
            <Form.Item
              label={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tài khoản / Email</span>}
              name="username"
              rules={[{ required: true, message: "Vui lòng nhập tài khoản hoặc email!" }]}
            >
              <Input
                prefix={<UserOutlined className="text-slate-300" />}
                placeholder="Nhập tên đăng nhập..."
                className="py-2.5"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mật khẩu</span>}
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-slate-300" />}
                placeholder="Nhập mật khẩu..."
                className="py-2.5"
              />
            </Form.Item>

            <Form.Item className="mt-8 mb-0">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-11 font-bold text-xs tracking-widest uppercase bg-techBluePrimary hover:bg-techBluePrimary/90 border-none flex items-center justify-center shadow-[0_4px_12px_rgba(2,132,199,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 ease-premium"
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
