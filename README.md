# EzRoom Admin Web

Trang web quản trị dành cho Quản trị viên (Admin) của hệ thống EzRoom, được xây dựng bằng React 19, Vite, Tailwind CSS, Ant Design và Recharts.

## 1. Công nghệ sử dụng

- React 19 (Thư viện giao diện người dùng)
- Vite 8 (Công cụ đóng gói và phát triển frontend tối ưu)
- Tailwind CSS 3 (Khung định kiểu giao diện hiện đại)
- Ant Design 6 & @ant-design/icons (Bộ thành phần UI và biểu tượng quản trị chuyên nghiệp)
- Recharts 3 (Thư viện vẽ biểu đồ phân tích doanh thu và số liệu trực quan)
- Fetch API (Giao tiếp RESTful API thông qua module cấu hình tập trung `src/config/api.js`)

## 2. Yêu cầu hệ thống

- Node.js: Phiên bản 18.x hoặc mới hơn.
- Trình quản lý gói: npm hoặc yarn.
- Server Backend EzRoom đang hoạt động (mặc định tại cổng 3000).

## 3. Hướng dẫn cài đặt và khởi chạy

### Bước 1: Cài đặt dependencies
Mở terminal tại thư mục gốc của EzRoom-Admin và thực thi lệnh:
```bash
npm install
```

### Bước 2: Cấu hình biến môi trường
Tạo file `.env` từ file mẫu `.env.example`:
```bash
cp .env.example .env
```

Nếu server backend của bạn chạy ở một địa chỉ khác (ví dụ máy chủ từ xa hoặc cổng khác), hãy thay đổi giá trị của biến `VITE_API_URL` trong file `.env`:
```env
VITE_API_URL=http://localhost:3000
```
Lưu ý: Đối với môi trường phát triển cục bộ, nếu không khai báo `VITE_API_URL`, ứng dụng sẽ tự động trỏ về `http://localhost:3000`.

### Bước 3: Khởi chạy môi trường phát triển (Development)
```bash
npm run dev
```
Truy cập giao diện quản trị tại đường dẫn hiển thị trên terminal (mặc định: `http://localhost:5173`).

### Bước 4: Đóng gói sản phẩm (Build Production)
```bash
npm run build
```
Thư mục `dist/` sẽ được tạo ra chứa mã nguồn tối ưu hóa, sẵn sàng để triển khai lên các dịch vụ lưu trữ như Vercel, Netlify hoặc máy chủ Nginx/Apache.

## 4. Các phân hệ chức năng chính của Quản trị viên

- Bảng điều khiển (Dashboard): Thống kê tổng doanh thu nền tảng, số phòng đang hoạt động, số người dùng và biểu đồ phân tích biến động theo tuần/tháng bằng Recharts.
- Duyệt định danh eKYC: Xem xét hồ sơ xác thực danh tính của Chủ nhà (ảnh CCCD mặt trước, mặt sau và chân dung selfie), thực hiện phê duyệt hoặc từ chối kèm lý do.
- Kiểm duyệt phòng: Rà soát danh sách tin đăng phòng trọ mới, khóa hoặc gỡ bỏ các bài đăng có dấu hiệu vi phạm quy định nền tảng.
- Lịch sử giao dịch: Theo dõi toàn bộ dòng tiền bao gồm thanh toán tiền cọc Escrow, thanh toán hóa đơn hàng tháng và các giao dịch giải ngân cho chủ trọ.
- Quản lý hợp đồng: Giám sát danh sách hợp đồng điện tử trong hệ thống và trạng thái giải ngân tiền cọc.
- Giải quyết khiếu nại: Tiếp nhận và xử lý các đơn kháng cáo bài đăng từ chủ nhà, đơn khiếu nại hợp đồng và báo cáo vi phạm đánh giá.
- Quản lý tiện ích: Thêm mới, chỉnh sửa và quản lý danh mục các tiện ích dùng chung trong phòng trọ.
- Quản lý tài khoản: Quản lý danh sách người dùng trong hệ thống (Người thuê, Chủ nhà), hỗ trợ khóa hoặc mở khóa tài khoản.

## 5. Hướng dẫn kết nối và kiểm thử API

1. Khởi động server Backend tại `http://localhost:3000`.
2. Kiểm tra file `src/config/api.js` để đảm bảo API Base URL đang được cấu hình đồng bộ với Backend.
3. Đăng nhập hệ thống quản trị với tài khoản Admin mặc định đã được thiết lập trong Backend.
