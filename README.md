# EzRoom Admin Dashboard - Hướng Dẫn Chạy Dự Án Local

Dự án Web Admin Quản trị hệ thống EzRoom được xây dựng bằng **ReactJS + Vite + Tailwind CSS** và thư viện UI **Ant Design**. Giao diện đã được nâng cấp đồng bộ toàn diện với dự án ứng dụng EzRoom Android dựa trên tệp đặc tả kỹ thuật `android_app_spec.md`.

---

## Tính Năng Quản Trị Cốt Lõi (Android Aligned)

Hệ thống Web Admin cung cấp 4 phân hệ chính giúp quản lý dòng tiền và dữ liệu từ ứng dụng Android gửi lên:

1. **Bảng Điều Khiển (Dashboard):**
   - Thống kê tổng số thành viên và tỷ lệ duyệt danh tính eKYC của Chủ nhà.
   - Thống kê số lượng cơ sở lưu trú phân tách rõ ràng giữa **Dãy trọ / Tòa nhà (Complex)** và **Phòng đơn lẻ (Standalone)**.
   - Biểu đồ phân tích doanh thu đối soát hoa hồng 5% theo từng tháng.

2. **Duyệt & Quản Lý Phòng Trọ (Room Moderation & Management):**
   - **Chờ kiểm duyệt:** Phê duyệt phòng lẻ hoặc phòng trực thuộc dãy trọ/tòa nhà. Khi kiểm duyệt phòng trong Dãy trọ/Tòa nhà, giao diện hỗ trợ hiển thị **Danh sách phòng chờ duyệt cùng Tòa nhà** để Admin có thể duyệt nhanh hoặc đối soát song song.
   - **Đồng bộ dữ liệu kỹ thuật Android (v1.0):** Hiển thị bộ sưu tập ảnh thực tế phân loại theo danh mục (*Mặt tiền, Phòng ngủ, WC*), bảng phân rã diện tích chi tiết các phòng chức năng, và **Bản đồ trực quan (Google Maps Pin)** ghim vị trí dựa trên tọa độ GPS (Lat/Lng).
   - **Đang hiển thị / Đã duyệt:** Quản lý danh sách phòng đang hiển thị trực tiếp trên app Android. Hỗ trợ thao tác **Tạm ẩn phòng** (chuyển trạng thái `HIDDEN`) hoặc **Khóa phòng trọ** (xóa khỏi hệ thống).
   - **Báo cáo vi phạm:** Xem các lượt khiếu nại thực tế từ khách thuê và đưa ra quyết định khóa phòng vi phạm.

3. **Đối Soát Tài Chính & Hoa Hồng (Financial Audit):**
   - Xem chi tiết từng hóa đơn giao dịch (`Invoice`): Tiền phòng, tiền điện (chỉ số cũ &rarr; chỉ số mới), tiền nước, và chi phí phát sinh khác.
   - Áp dụng chuẩn công thức hệ thống: **Trích xuất 5% hoa hồng chỉ dựa trên Tiền phòng thuê gốc** (không tính trên điện, nước, cọc, đền bù).
   - Minh bạch hóa doanh thu thực nhận chuyển cho Chủ nhà (`Doanh thu = Tổng hóa đơn - 5% tiền phòng`).

4. **Quản Lý Tài Khoản Thành Viên (User Management):**
   - Theo dõi danh sách tài khoản Chủ nhà (`HOST`) và Người thuê (`RENTER`).
   - **Tối ưu hóa hiển thị (Row-level Click Toggle):** Bảng tài khoản được thu gọn. Khi nhấp vào **bất kỳ ô nào trên hàng người dùng**, chi tiết Email và Số điện thoại liên hệ sẽ trượt xuống hiển thị trực quan.
   - **Nhãn chỉ số vi phạm rút gọn:** Các trạng thái vi phạm được rút gọn thành **An toàn**, **Cảnh báo**, **Rủi ro cao** đi kèm một bảng **Chú giải chỉ số** đặt ở góc trên bên phải thanh công cụ.
   - **Quy tắc eKYC:** Trạng thái xác minh danh tính eKYC hiển thị là **"Không yêu cầu"** đối với Người thuê và bắt buộc đối với Chủ nhà.
   - Hỗ trợ khóa / mở khóa tài khoản vi phạm kèm lý do chi tiết.

---

## Yêu Cầu Hệ Thống

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt các phần mềm sau:

- **Node.js** (Khuyến nghị phiên bản LTS mới nhất từ `v18.x` trở lên)
- **npm** (Thường đi kèm khi cài đặt Node.js) hoặc **Yarn** / **pnpm**

---

## Các Bước Cài Đặt và Chạy Dự Án

### Bước 1: Clone dự án

Tải mã nguồn về máy cục bộ của bạn:

```bash
git clone https://github.com/dwadwada123/EzRoom-Admin.git
cd ezroom-admin
```

### Bước 2: Cài đặt các thư viện phụ thuộc

Do thư mục `node_modules` đã được cấu hình ẩn trong tệp `.gitignore`, bạn cần phục hồi các thư viện:

```bash
npm install
```

### Bước 3: Khởi chạy môi trường phát triển (Local Server)

Khởi chạy máy chủ phát triển cục bộ:

```bash
npm run dev
```

Terminal sẽ hiển thị địa chỉ local (thường là `http://localhost:5173`). Bạn hãy mở trình duyệt và truy cập vào địa chỉ này.

---

## Thông Tin Tài Khoản Thử Nghiệm

Khi truy cập giao diện lần đầu, hệ thống sẽ yêu cầu đăng nhập. Bạn sử dụng một trong hai tài khoản mẫu dưới đây:

1. **Tài khoản chính:**
   - **Tài khoản:** `admin@ezroom.com`
   - **Mật khẩu:** `123456`

2. **Tài khoản dự phòng:**
   - **Tài khoản:** `admin`
   - **Mật khẩu:** `admin123`

---

## Các Lệnh Hỗ Trợ Khác

- **Biên dịch sản phẩm (Production Build):**
  Tạo mã nguồn tối ưu hóa trong thư mục `/dist` để sẵn sàng deploy:
  ```bash
  npm run build
  ```

- **Kiểm tra lỗi tĩnh (ESLint):**
  Kiểm tra và chuẩn hóa cú pháp viết mã ReactJS:
  ```bash
  npm run lint
  ```

- **Xem trước bản Build (Vite Preview):**
  Chạy thử sản phẩm sau khi đã tối ưu biên dịch ngay tại local:
  ```bash
  npm run preview
  ```

---

## Tổng Quan Cấu Trúc Dự Án

```text
ezroom-admin/
├── src/
│   ├── components/      # Các component dùng chung (Sidebar, Header,...)
│   ├── pages/           # Giao diện quản trị (Dashboard, Moderation, User, Transactions,...)
│   ├── App.jsx          # Router chính phối hợp layout và kiểm tra token
│   ├── index.css        # Khai báo cấu hình CSS và nâng cấp Ant Design
│   └── main.jsx         # Điểm khởi tạo gốc của ReactJS
├── android_app_spec.md  # Tài liệu đặc tả kỹ thuật liên kết Android & Admin [NEW]
├── tailwind.config.js   # Cấu hình hệ thống thiết kế thương hiệu EzRoom
└── package.json         # Danh mục thư viện và script vận hành dự án
```
