# EzRoom Admin Dashboard - Hướng Dẫn Chạy Dự Án Local

Dự án Web Admin Quản trị hệ thống EzRoom được xây dựng bằng **ReactJS + Vite + Tailwind CSS** và thư viện UI **Ant Design**. Dưới đây là hướng dẫn chi tiết cách tải, cài đặt và vận hành dự án trên môi trường cục bộ (local).

---

## Yêu Cầu Hệ Thống

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt các phần mềm sau:

- **Node.js** (Khuyến nghị phiên bản LTS mới nhất từ `v18.x` trở lên)
- **npm** (Thường đi kèm khi cài đặt Node.js) hoặc **Yarn** / **pnpm**

---

## Các Bước Cài Đặt và Chạy Dự Án

### Bước 1: Clone dự án

Tải mã nguồn từ kho lưu trữ GitHub về máy cục bộ của bạn:

```bash
git clone https://github.com/dwadwada123/EzRoom-Admin.git
cd ezroom-admin
```

### Bước 2: Cài đặt các thư viện phụ thuộc

Do thư mục `node_modules` đã được cấu hình ẩn trong tệp `.gitignore` khi push lên GitHub, bạn cần chạy lệnh sau để tải và phục hồi các thư viện phụ thuộc:

```bash
npm install
```

### Bước 3: Khởi chạy môi trường phát triển

Sau khi cài đặt xong các thư viện phụ thuộc, hãy khởi chạy máy chủ phát triển cục bộ:

```bash
npm run dev
```

Sau khi chạy thành công, terminal sẽ hiển thị địa chỉ local (thường là `http://localhost:5173`). Hãy sao chép địa chỉ này dán vào trình duyệt để trải nghiệm giao diện.

---

## Thông Tin Tài Khoản Thử Nghiệm (Test Accounts)

Khi truy cập vào trang Web Admin lần đầu tiên, hệ thống bảo vệ Token sẽ yêu cầu đăng nhập. Bạn có thể sử dụng một trong hai tài khoản mẫu dưới đây để kiểm thử:

1. **Tài khoản kiểm thử chính:**
   - **Email / Tài khoản:** `admin@ezroom.com`
   - **Mật khẩu:** `123456`

2. **Tài khoản dự phòng:**
   - **Email / Tài khoản:** `admin`
   - **Mật khẩu:** `admin123`

---

## Các Lệnh Hỗ Trợ Khác

- **Biên dịch sản phẩm:**
  Tạo mã nguồn tối ưu hóa lưu trữ trong thư mục `/dist` để sẵn sàng deploy lên môi trường live:

  ```bash
  npm run build
  ```

- **Kiểm tra lỗi tĩnh:**
  Kiểm tra và chuẩn hóa cú pháp viết mã nguồn JavaScript/React theo quy tắc chung của dự án:

  ```bash
  npm run lint
  ```

- **Xem trước bản Build:**
  Chạy thử sản phẩm sau khi đã tối ưu biên dịch ngay tại môi trường cục bộ:
  ```bash
  npm run preview
  ```

---

## Tổng Quan Cấu Trúc Dự Án

```text
ezroom-admin/
├── src/
│   ├── components/      # Các component dùng chung (Sidebar, Header,...)
│   ├── pages/           # Giao diện chính của từng phân hệ (Dashboard, Login,...)
│   ├── App.jsx          # Cột sườn chính điều hợp và kiểm tra xác thực
│   ├── index.css        # Khai báo cấu hình lớp phủ chỉ thị Tailwind CSS
│   └── main.jsx         # Điểm khởi tạo gốc của ReactJS
├── tailwind.config.js   # Cấu hình bảng màu thương hiệu chuẩn của EzRoom
└── package.json         # Danh mục thư viện và script vận hành dự án
```
