# 🍵 LỤC TRÀ CẢNH GIỚI – HÀNH TRÌNH TỪ DỮ LIỆU ĐẾN TRÍ TUỆ
> **Web Game Chúc Mừng Sinh Nhật CTO Phong Cách Stardew Valley & Trà Đạo Tri Thức**

---

## 📖 Ý Tưởng & Kịch Bản Trải Nghiệm

Một trải nghiệm web game ấm áp, kết hợp giữa **Pixel Art phong cách Stardew Valley** và **Triết lý Trà Đạo Đông Phương** gắn liền với **Hệ sinh thái Công nghệ & Dữ liệu**:

> *"Công nghệ cũng giống như trà. Muốn có một chén trà ngon phải đi qua gieo trồng, chăm sóc, bảo vệ, chế tác và thưởng thức. Muốn tạo nên tri thức doanh nghiệp cũng phải đi qua một hành trình tương tự."*

### 🌿 Sáu Danh Trà & Sáu Nghệ Nhân Vận Hành Hệ Sinh Thái:
1. **Cổ Mạch Phổ Nhĩ** → **Network & Hạ tầng**: Gốc rễ ngầm vững chãi (Máy chủ, cáp quang, cloud, DC).
2. **Thiên Công Ngọc Lộ** → **Phát triển phần mềm**: Thân cây vươn cao, biến từng ý tưởng thành sản phẩm thực tế.
3. **Trường Lưu Ban Trà** → **Vận hành hệ thống**: Mạch nhựa luân chuyển, guồng nước không bao giờ ngừng nghỉ.
4. **Huyền Giáp Quan Âm** → **An toàn thông tin**: Lớp vỏ bọc phòng thủ đa tầng kiên cố, âm thầm canh giữ.
5. **Vân Hành Tiên Trà** → **Triển khai sản phẩm dữ liệu**: Cành lá sum suê, đưa tri thức tới các khối nghiệp vụ.
6. **Tuyết Tâm Mạt Trà** → **Quản trị & Phân tích dữ liệu**: Búp trà tinh hoa kết tinh thành **INSIGHT**.

---

## 🎮 Cách Khởi Chạy & Trải Nghiệm Demo

### Cách 1: Mở Trực Tiếp (Không Cần Cài Đặt Gì)
- Truy cập thư mục `D:\Scratch\happy_cto`
- Nhấp đúp chuột vào file **`index.html`** để mở ngay bằng bất kỳ trình duyệt nào (Chrome, Edge, Safari, Firefox).

### Cách 2: Chạy Qua Web Server (Khuyên Dùng)
Mở terminal tại thư mục này và chạy:
```bash
# Bằng Python:
python -m http.server 3000

# Hoặc bằng Node / npx:
npx serve -l 3000 .
```
Sau đó truy cập: `http://localhost:3000`

---

## ✨ Các Tính Năng Độc Đáo Được Tích Hợp

1. **Hiệu Ứng Mở Cửa & Trà Tiên Dẫn Chuyện:**
   - 2 cánh cửa gỗ trượt mở đón người chơi vào Trà Điện Nhất Tâm.
   - Hộp thoại phong cách Stardew Valley với chân dung Trà Tiên và hiệu ứng chữ chạy typewriter.
2. **Điều Khiển Nhân Vật Pixel (Cozy Walk):**
   - Phím `W, A, S, D` hoặc `Mũi Tên` để đi lại 4 hướng (có hoạt ảnh bước chân).
   - Hoặc click chuột / chạm màn hình bất kỳ đâu để nhân vật tự bước tới đó.
   - Hỗ trợ D-Pad ảo trên điện thoại di động.
3. **Treo Lời Chúc Kèm Ảnh Kỷ Niệm:**
   - Tại mỗi cảnh, người chơi có thể click vào các lá cây, đóa hoa, khiên giáp, cánh hạc để xem lời chúc của đồng đội.
   - Nhấn nút **`+`** để nhập tên, chọn phòng ban, viết lời chúc và **upload ảnh từ máy tính/điện thoại** hoặc chọn nhanh avatar kỷ niệm.
   - Tự động tối ưu dung lượng ảnh và lưu bền vững vào `localStorage`.
4. **Âm Thanh Trà Đạo Zen Lo-Fi (Web Audio API Synthesizer):**
   - Tạo giai điệu đàn tranh ngũ cung êm dịu, tiếng suối chảy, tiếng rót trà, tiếng chuông gió và tiếng pháo hoa chúc mừng mà không phụ thuộc file MP3 ngoài.
5. **Đại Cảnh Cây Trà Tri Thức & Sổ Lưu Bút:**
   - Nhấn nút **"🌳 Cây Tri Thức & Lưu Bút"** trên thanh HUD để xem:
     + Sơ đồ tổng hợp Cây Trà 6 tầng ý nghĩa.
     + **Sổ Lưu Bút Toàn Thể (Scrapbook):** Lọc theo phòng ban, xem toàn bộ lời chúc và ảnh kỷ niệm dạng thiệp sinh nhật.
     + Thư tri ân trang trọng gửi riêng tới CTO.
     + **Bắn Pháo Hoa Mừng Sinh Nhật (🎆):** Pháo hoa nở rực trời cùng hiệu ứng âm thanh tưng bừng!
6. **Sao Lưu & Xuất / Nhập Dữ Liệu (Export / Import):**
   - Nút **"💾 Quản Lý Lời Chúc"** cho phép tải file `danh_sach_loi_chuc.json` về máy.
   - Ban tổ chức có thể thu thập lời chúc từ mọi người, gộp lại thành 1 file rồi Import vào để CTO mở lên là thấy đầy ắp tình cảm của tất cả anh em!

---

## 🚀 Hướng Dẫn Triển Khai Cho Cả Công Ty Truy Cập

Bạn có thể đưa toàn bộ thư mục này lên các nền tảng miễn phí trong 1 phút:
1. **GitHub Pages:** Đẩy code lên GitHub repository -> Vào *Settings* -> *Pages* -> Chọn branch `main` -> *Save*.
2. **Vercel / Netlify:** Kéo thả thư mục `happy_cto` vào trang chủ [Vercel](https://vercel.com) hoặc [Netlify Drop](https://app.netlify.com/drop) là có ngay đường link `https://happy-birthday-cto.vercel.app` để gửi tặng CTO!
