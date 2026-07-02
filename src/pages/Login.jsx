import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

// Login component
function Login({ onLoginSuccess }) {
  // Submit handler checking credentials
  const onFinish = (values) => {
    const { username, password } = values;
    if (
      (username === "admin" && password === "admin123") ||
      (username === "admin@ezroom.com" && password === "123456")
    ) {
      localStorage.setItem("adminToken", "ezroom_secret_token");
      message.success("Đăng nhập hệ thống thành công!");
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } else {
      message.error("Tài khoản hoặc mật khẩu không chính xác!");
    }
  };

  return (
    // Centered layout container
    <div className="w-screen h-screen bg-backgroundLight flex items-center justify-center p-4">
      {/* Login box card */}
      <div className="bg-surfaceLight/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md border border-onBackgroundLight/5 text-center">
        {/* Header logo section */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-techBluePrimary tracking-wide drop-shadow-[0_2px_8px_rgba(2,132,199,0.15)]">
            EzRoom Admin
          </h2>
          <p className="text-sm text-onBackgroundLight/50 mt-1.5 font-medium">
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
            label={<span className="text-xs font-semibold text-onBackgroundLight/60 uppercase tracking-wider">Tài khoản / Email</span>}
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập tài khoản hoặc email!" }]}
          >
            <Input
              prefix={<UserOutlined className="text-onBackgroundLight/30" />}
              placeholder="Nhập tên đăng nhập..."
              className="rounded-xl py-2"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-xs font-semibold text-onBackgroundLight/60 uppercase tracking-wider">Mật khẩu</span>}
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-onBackgroundLight/30" />}
              placeholder="Nhập mật khẩu..."
              className="rounded-xl py-2"
            />
          </Form.Item>

          <Form.Item className="mt-8 mb-0">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full py-5 rounded-xl font-bold text-sm bg-techBluePrimary hover:bg-techBluePrimary/90 border-none flex items-center justify-center shadow-[0_4px_14px_rgba(2,132,199,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              ĐĂNG NHẬP
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Login;
