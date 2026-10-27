# 🍵 LỤC TRÀ CẢNH GIỚI – HÀNH TRÌNH TỪ DỮ LIỆU ĐẾN TRÍ TUỆ
> **Web Game & Xưởng Thiệp Chúc Mừng Sinh Nhật CTO Phong Cách Stardew Valley & Trà Đạo Tri Thức**

---

## 📖 Ý Tưởng & Kịch Bản Trải Nghiệm

Một trải nghiệm web game ấm áp, kết hợp giữa **Pixel Art phong cách Stardew Valley** và **Triết lý Trà Đạo Đông Phương** gắn liền với **Hệ sinh thái Công nghệ & Dữ liệu**:

> *"Công nghệ cũng giống như trà. Muốn có một chén trà ngon phải đi qua gieo trồng, chăm sóc, bảo vệ, chế tác và thưởng thức. Muốn tạo nên tri thức doanh nghiệp cũng phải đi qua một hành trình tương tự."*

### 🌿 Sáu Danh Trà & Sáu Nghệ Nhân Vận Hành Hệ Sinh Thái:
1. **Cổ Mạch Phổ Nhĩ** → **Network & Hạ tầng (IT.INF)**: Gốc rễ ngầm vững chãi (Máy chủ, cáp quang, cloud, DC).
2. **Thiên Công Ngọc Lộ** → **Phát triển phần mềm (IT.DEV)**: Thân cây vươn cao, biến từng ý tưởng thành sản phẩm thực tế.
3. **Trường Lưu Ban Trà** → **Vận hành hệ thống (IT.SDO)**: Mạch nhựa luân chuyển, guồng nước không bao giờ ngừng nghỉ.
4. **Huyền Giáp Quan Âm** → **An toàn thông tin (IT.INF)**: Lớp vỏ bọc phòng thủ đa tầng kiên cố, âm thầm canh giữ.
5. **Vân Hành Tiên Trà** → **Triển khai sản phẩm dữ liệu (IT.DPI)**: Cành lá sum suê, đưa tri thức tới các khối nghiệp vụ.
6. **Tuyết Tâm Mạt Trà** → **Quản trị & Phân tích dữ liệu (IT.DWH)**: Búp trà tinh hoa kết tinh thành **INSIGHT**.

---

## 📁 Cấu Trúc Dự Án (Clean Code Architecture)

Toàn bộ project đã được tái cơ cấu chuẩn mực theo mô hình module hóa rõ ràng, tách bạch giữa giao diện, phong cách, logic và tài nguyên:

```
happy_cto/
├── assets/                     # Kho tài nguyên hình ảnh, video & âm thanh
│   ├── 01_Characters/          # Sprite nhân vật & chân dung lãnh đạo / NPC
│   ├── 02_Tea_Temple_Hub/      # Cảnh Trà Điện, cửa gỗ trượt, bàn trà & video nền
│   ├── 03_Six_Tea_Realms/      # Background 6 cõi trà (PNG 1080p & video MP4 loop)
│   ├── 04_Interactive_Nodes/   # Các biểu tượng tương tác (lá, mầm, hoa, khiên...)
│   ├── 05_Grand_Finale/        # Cây Trà Tri Thức, bánh kem trà & pháo hoa
│   ├── audio/                  # Nhạc nền chính thức (audio_bg.mp3)
│   ├── markers/                # Con dấu & ấn ký năng lượng cõi trà
│   ├── particles/              # Hạt hiệu ứng (lá trà, lá phong, bụi vàng kim...)
│   └── ui/                     # Con trỏ lá trà, thẻ bài cầu phúc...
├── css/                        # Bảng định kiểu giao diện phân tầng
│   ├── style.css               # Giao diện chính game RPG, HUD, modal & cõi trà
│   └── card.css                # Giao diện Studio Thiết kế Thiệp chuyên biệt
├── js/                         # Logic JavaScript hướng đối tượng (OOP Modules)
│   ├── audio.js                # Quản lý nhạc nền audio_bg.mp3 & bộ tạo âm SFX Web Audio
│   ├── data.js                 # Cấu hình 6 cõi trà, NPC và cơ sở dữ liệu lời chúc
│   ├── sprites.js              # Sprite sheet loader, video nền và canvas renderer
│   ├── minigames.js            # Engine mini-game tương tác cho 6 cõi trà
│   ├── game.js                 # Vòng lặp game 60 FPS, vật lý di chuyển, particle & prompt
│   ├── ui.js                   # Điều khiển hộp thoại typewriter, modal, form & scrapbook
│   └── card.js                 # Điều khiển xưởng tạo thiệp, live preview & xuất ảnh PNG
├── archive/                    # Lưu trữ gói tài nguyên gốc (zip)
├── index.html                  # Cổng vào trải nghiệm RPG Lục Trà Cảnh Giới
├── card.html                   # Xưởng Tạo Thiệp Sinh Nhật CTO chuyên dụng
├── favicon.ico                 # Favicon biểu tượng chén trà
├── package.json                # Cấu hình kịch bản chạy và kiểm tra cú pháp
└── README.md                   # Tài liệu hướng dẫn dự án
```

---

## 🎮 Cách Khởi Chạy & Trải Nghiệm Demo

### Cách 1: Mở Trực Tiếp (Không Cần Cài Đặt Gì)
- Nhấp đúp chuột vào file **`index.html`** để trải nghiệm game RPG dạo quanh 6 cõi trà.
- Nhấp đúp chuột vào file **`card.html`** để mở ngay Studio thiết kế thiệp mừng sinh nhật.

### Cách 2: Chạy Qua Web Server (Khuyên Dùng)
Mở terminal tại thư mục này và chạy:
```bash
# Bằng npm:
npm start

# Hoặc bằng npx serve:
npm run serve
```
Sau đó truy cập: `http://localhost:3000`

### Kiểm Tra Cú Pháp Toàn Bộ Code (Syntax Check):
```bash
npm run check
```

---

## ✨ Các Tính Năng Độc Đáo Được Tích Hợp

1. **Hiệu Ứng Mở Cửa & Trà Tiên Dẫn Chuyện:**
   - 2 cánh cửa gỗ trượt mở đón người chơi vào Trà Điện Nhất Tâm.
   - Hộp thoại phong cách Stardew Valley với chân dung Trà Tiên và hiệu ứng chữ chạy typewriter.
2. **Điều Khiển Nhân Vật Pixel (Cozy Walk):**
   - Phím `W, A, S, D` hoặc `Mũi Tên` để đi lại 4 hướng (có hoạt ảnh bước chân mượt mà).
   - Hoặc click chuột / chạm màn hình bất kỳ đâu để nhân vật tự bước tới đó.
   - Hỗ trợ D-Pad ảo trên điện thoại di động.
3. **Thử Thách Công Nghệ (Minigames 6 Cõi):**
   - Mỗi cõi trà có một thử thách công nghệ đặc thù (Nối cáp quang ngầm, Hotfix diệt Bug, Cân bằng tải guồng nước, Bật khiên bảo mật...).
   - Thu thập đủ 6 viên **Lục Trà Tinh Hoa** để thắp sáng Cây Tri Thức Hợp Nhất!
4. **Xưởng Tạo Thiệp Sinh Nhật (Dedicated Card Studio):**
   - Hỗ trợ viết lời chúc, chọn cõi trà, đính kèm ảnh kỷ niệm cá nhân hoặc avatar biểu trưng.
   - Xuất file ảnh PNG độ nét cao hoặc in thiệp trực tiếp để gửi tặng CTO.
5. **Âm Thanh & Nhạc Nền Chính Thức (`assets/audio/audio_bg.mp3`):**
   - Tích hợp file nhạc nền chính thức lặp mượt mà, thanh trượt chỉnh âm lượng tiện dụng cùng hệ thống âm thanh hiệu ứng (SFX) retro giòn giã (click, nhảy, thu thập, chuông khánh, pháo hoa mừng sinh nhật).
6. **Đại Cảnh Cây Trà Tri Thức & Sổ Lưu Bút:**
   - Nhấn nút **"Xem Lưu Bút"** trên thanh HUD để xem:
     + Sơ đồ tổng hợp Cây Trà 6 tầng ý nghĩa.
     + **Sổ Lưu Bút Toàn Thể (Scrapbook):** Lọc theo phòng ban, xem toàn bộ lời chúc và ảnh kỷ niệm dạng thiệp sinh nhật.
     + Thư tri ân trang trọng gửi riêng tới CTO.
     + **Bắn Pháo Hoa Mừng Sinh Nhật (🎆):** Pháo hoa nở rực trời cùng hiệu ứng âm thanh tưng bừng!
7. **Sao Lưu & Xuất / Nhập Dữ Liệu (Export / Import):**
   - Cho phép tải file `danh_sach_loi_chuc.json` về máy.
   - Ban tổ chức có thể thu thập lời chúc từ mọi người, gộp lại thành 1 file rồi Import vào để CTO mở lên là thấy đầy ắp tình cảm của tất cả anh em!

---

## 🚀 Hướng Dẫn Triển Khai Cho Cả Công Ty Truy Cập

Bạn có thể đưa toàn bộ thư mục này lên các nền tảng miễn phí trong 1 phút:
1. **GitHub Pages:** Đẩy code lên GitHub repository -> Vào *Settings* -> *Pages* -> Chọn branch `main` -> *Save*.
2. **Vercel / Netlify:** Kéo thả thư mục `happy_cto` vào trang chủ [Vercel](https://vercel.com) hoặc [Netlify Drop](https://app.netlify.com/drop) là có ngay đường link `https://happy-birthday-cto.vercel.app` để gửi tặng CTO!
