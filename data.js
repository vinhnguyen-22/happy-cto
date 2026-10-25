/**
 * DATA & REALMS CONFIGURATION
 * Định nghĩa 6 cõi trà, kịch bản thuyết minh và hệ thống quản lý lời chúc sinh nhật CTO
 * Sử dụng đầy đủ assets hình ảnh pixel art chính thức
 */

const REALMS_DATA = {
  0: {
    id: 0,
    name: "Trà Điện Nhất Tâm",
    subName: "Cội Nguồn Hệ Sinh Thái Số",
    color: "#d4af37",
    interactableType: "Hộp Trà",
    narratorSpeech: [
      "Kính mời Quý khách bước vào Lục Trà Cảnh Giới.",
      "Sáu danh trà trước mặt tượng trưng cho sáu nghệ nhân đang ngày đêm vận hành hệ sinh thái công nghệ và dữ liệu của doanh nghiệp.",
      "Hãy nhấp chọn một hộp trà trên bàn hoặc điều khiển nhân vật bước tới để khai mở từng cảnh giới diệu kỳ!"
    ]
  },
  1: {
    id: 1,
    name: "Cổ Mạch Phổ Nhĩ",
    department: "Network & Hạ tầng",
    color: "#e67e22",
    element: "Gốc Rễ Vững Chắc",
    interactableName: "Lá Cây Đại Thụ",
    interactableIcon: "🍂",
    assetIcon: "assets/markers/marker_ancient_root_crystal.png",
    promptText: "Nhấn vào các phiến lá trên cây cổ thụ để gửi & đọc lời chúc!",
    narratorSpeech: [
      "Mọi công trình vĩ đại đều được xây trên nền móng vững chắc.",
      "Trong khu vườn trà này, Cổ Mạch Phổ Nhĩ chính là gốc rễ: Máy chủ, Mạng truyền dẫn, Trung tâm dữ liệu, Cloud, Hạ tầng kết nối.",
      "Người ta thường nhìn thấy sản phẩm, nhưng hiếm ai nhìn thấy những gì đang nâng đỡ sản phẩm.",
      "Đó chính là sứ mệnh thầm lặng của Phòng Network & Hạ tầng."
    ]
  },
  2: {
    id: 2,
    name: "Thiên Công Ngọc Lộ",
    department: "Phát triển phần mềm",
    color: "#2ecc71",
    element: "Thân Cây Kiến Trúc",
    interactableName: "Lá Mầm Số Hoá",
    interactableIcon: "🍃",
    assetIcon: "assets/markers/marker_digital_sprout.png",
    promptText: "Nhấn vào các mầm lá công nghệ để gửi & đọc lời chúc!",
    narratorSpeech: [
      "Nếu hạ tầng là đất, thì sáng tạo là mầm cây.",
      "Từng đường sáng kết nối với nhau: Ứng dụng xuất hiện, Dashboard xuất hiện, các quy trình vận hành hiện ra trực quan.",
      "Mọi sản phẩm từng chỉ là một ý tưởng. Mọi ý tưởng đều cần người biến nó thành hiện thực.",
      "Đó chính là tinh thần kiên định của Thiên Công Ngọc Lộ – Phòng Phát triển Phần mềm!"
    ]
  },
  3: {
    id: 3,
    name: "Trường Lưu Ban Trà",
    department: "Vận hành hệ thống",
    color: "#f39c12",
    element: "Mạch Nhựa Bất Tận",
    interactableName: "Đoá Hoa Bên Suối",
    interactableIcon: "🌸",
    assetIcon: "assets/markers/marker_amber_lotus_wheel.png",
    promptText: "Nhấn vào các đoá hoa sen bên dòng suối để gửi & đọc lời chúc!",
    narratorSpeech: [
      "Xây dựng khó. Nhưng duy trì còn khó hơn.",
      "Bánh xe nước quay đều: Không nhanh, không chậm, không bao giờ dừng lại.",
      "Khách hàng không biết hệ thống hoạt động tốt như thế nào. Họ chỉ biết khi nó ngừng hoạt động.",
      "Người vận hành thành công nhất là người khiến mọi thứ diễn ra bình thường!"
    ]
  },
  4: {
    id: 4,
    name: "Huyền Giáp Quan Âm",
    department: "An toàn thông tin",
    color: "#3498db",
    element: "Vỏ Bọc Kiên Cố",
    interactableName: "Khiên Giáp Ánh Sáng",
    interactableIcon: "🛡️",
    assetIcon: "assets/markers/marker_cyber_shield_rune.png",
    promptText: "Nhấn vào các tầng khiên chắn năng lượng để gửi & đọc lời chúc!",
    narratorSpeech: [
      "Giá trị càng lớn, trách nhiệm bảo vệ càng lớn.",
      "Bảo mật không phải là một cánh cửa đơn độc, mà là nhiều tầng phòng thủ kiên cố.",
      "Những đợt tấn công từ bên ngoài đều bị chặn đứng bởi các lớp lá chắn vô hình.",
      "Trong lúc doanh nghiệp phát triển, luôn có những người âm thầm canh giữ phía sau."
    ]
  },
  5: {
    id: 5,
    name: "Vân Hành Tiên Trà",
    department: "Triển khai sản phẩm dữ liệu",
    color: "#9b59b6",
    element: "Cành Lá Lan Toả",
    interactableName: "Cánh Hạc Trí Tuệ",
    interactableIcon: "🕊️",
    assetIcon: "assets/markers/marker_origami_crane_glow.png",
    promptText: "Nhấn vào các cánh hạc giấy bay lượn để gửi & đọc lời chúc!",
    narratorSpeech: [
      "Một sản phẩm tốt chưa chắc tạo ra giá trị. Giá trị chỉ xuất hiện khi sản phẩm được sử dụng.",
      "Trên cầu mây, dữ liệu kết nối tới từng đơn vị: Khối Đầu tư, Vận hành, Tài chính, Quản trị rủi ro.",
      "Triển khai chính là hành trình đưa tri thức đến đúng người vào đúng thời điểm.",
      "Mỗi khi một đơn vị nhận dữ liệu, một cánh hạc lại bừng sáng giữa bầu trời ngập tràn ánh hào quang!"
    ]
  },
  6: {
    id: 6,
    name: "Tuyết Tâm Mạt Trà",
    department: "Quản trị & Phân tích dữ liệu",
    color: "#e74c3c",
    element: "Búp Trà Tinh Hoa (Insight)",
    interactableName: "Lá Phong Đỏ Zen",
    interactableIcon: "🍁",
    assetIcon: "assets/markers/marker_zen_maple_cup.png",
    promptText: "Nhấn vào các lá phong đỏ bên cửa sổ tròn để gửi & đọc lời chúc!",
    narratorSpeech: [
      "Đây là nơi dữ liệu trở thành trí tuệ.",
      "Các điểm dữ liệu kết nối thành Thông tin -> Thông tin kết nối thành Xu hướng -> Xu hướng kết nối thành Dự báo -> INSIGHT!",
      "Dữ liệu cho biết điều gì đã xảy ra. Phân tích cho biết vì sao nó xảy ra. Trí tuệ cho biết chúng ta nên làm gì tiếp theo.",
      "Kính mời Quý khách nâng chén Mạt Trà thanh khiết nhất, chúc mừng sinh nhật vị Thuyền Trưởng!"
    ]
  }
};

// CÁC AVATAR / ẢNH MẪU KỶ NIỆM SỬ DỤNG BỘ ASSETS MỚI
const PRESET_AVATARS = [
  { name: "Thẻ Cầu Phúc", data: "assets/ui/item_wish_tag_gold.png" },
  { name: "Bộ Ấm Trà", data: "assets/02_Tea_Temple_Hub/tea_ceremony_set.png" },
  { name: "Cổ Mạch", data: "assets/markers/marker_ancient_root_crystal.png" },
  { name: "Ngọc Lộ", data: "assets/markers/marker_digital_sprout.png" },
  { name: "Ban Trà", data: "assets/markers/marker_amber_lotus_wheel.png" },
  { name: "Quan Âm", data: "assets/markers/marker_cyber_shield_rune.png" },
  { name: "Tiên Trà", data: "assets/markers/marker_origami_crane_glow.png" },
  { name: "Mạt Trà", data: "assets/markers/marker_zen_maple_cup.png" },
  { name: "Bánh Kem Trà", data: "assets/05_Grand_Finale/birthday_tea_cake.png" },
  { name: "Chân Dung CTO", data: "assets/01_Characters/portrait_cto_pixel.png" },
  { name: "Trà Tiên", data: "assets/01_Characters/portrait_tea_master.png" }
];

// DỮ LIỆU LỜI CHÚC MẪU SỬ DỤNG ẢNH ASSETS CHÍNH THỨC
const DEFAULT_WISHES = [
  // Cảnh 1: Cổ Mạch Phổ Nhĩ (Network & Hạ tầng)
  {
    id: "wish-infra-1",
    realmId: 1,
    author: "Tuấn Anh (Lead Network & DC)",
    department: "Hạ tầng & Network",
    date: "20/10/2026",
    message: "Chúc Anh sinh nhật bùng nổ năng lượng! Năm nay team cam kết Uptime 99.999%, băng thông thênh thang, cáp ngầm vững chãi nâng bước mọi dự án công nghệ của Anh vươn xa!",
    image: "assets/04_Interactive_Nodes/item_leaf_infra.png",
    posX: 0.28,
    posY: 0.38
  },
  {
    id: "wish-infra-2",
    realmId: 1,
    author: "Thanh Bình (Cloud Architect)",
    department: "Hạ tầng & Network",
    date: "20/10/2026",
    message: "Kính chúc Sếp tuổi mới sức khỏe dồi dào, auto-scaling mượt mà, chi phí Cloud tối ưu kịch khung, gia đình luôn hạnh phúc và ấm áp!",
    image: "assets/05_Grand_Finale/birthday_tea_cake.png",
    posX: 0.68,
    posY: 0.32
  },
  {
    id: "wish-infra-3",
    realmId: 1,
    author: "Hải Đăng (DevOps Engineer)",
    department: "Hạ tầng & Network",
    date: "20/10/2026",
    message: "Happy Birthday CTO! Mong anh luôn giữ nụ cười tươi mỗi khi ngắm dashboard xanh lè không một dấu chấm đỏ!",
    image: "assets/01_Characters/portrait_cto_pixel.png",
    posX: 0.48,
    posY: 0.22
  },

  // Cảnh 2: Thiên Công Ngọc Lộ (Phát triển phần mềm)
  {
    id: "wish-dev-1",
    realmId: 2,
    author: "Quốc Huy & Team Frontend",
    department: "Phát triển phần mềm",
    date: "20/10/2026",
    message: "Chúc Sếp sinh nhật vui vẻ! Chúc các dòng code của công ty dưới sự dẫn dắt của Sếp luôn sạch đẹp không một bug, build mượt như lụa, UI/UX đỉnh nóc kịch trần!",
    image: "assets/04_Interactive_Nodes/item_sprout_dev.png",
    posX: 0.32,
    posY: 0.35
  },
  {
    id: "wish-dev-2",
    realmId: 2,
    author: "Minh Trang (Lead Backend)",
    department: "Phát triển phần mềm",
    date: "20/10/2026",
    message: "Chúc anh thêm tuổi mới thêm nhiều đột phá mới! Cảm ơn anh đã luôn định hướng kiến trúc Microservices sáng suốt, dìu dắt anh em vượt qua bao mùa Go-Live căng thẳng!",
    image: "assets/05_Grand_Finale/birthday_tea_cake.png",
    posX: 0.70,
    posY: 0.36
  },
  {
    id: "wish-dev-3",
    realmId: 2,
    author: "Hoàng Nam (Mobile App Team)",
    department: "Phát triển phần mềm",
    date: "20/10/2026",
    message: "Sinh nhật vui vẻ nha Sếp ơi! Team em xin tặng Sếp tính năng deploy không cần rollback suốt cả năm tới!",
    image: "assets/01_Characters/portrait_cto_pixel.png",
    posX: 0.52,
    posY: 0.25
  },

  // Cảnh 3: Trường Lưu Ban Trà (Vận hành hệ thống)
  {
    id: "wish-ops-1",
    realmId: 3,
    author: "Trọng Nghĩa (Head of Operations)",
    department: "Vận hành hệ thống",
    date: "20/10/2026",
    message: "Bánh xe nước quay đều không ngừng nghỉ, cũng như lòng nhiệt huyết của anh em Ops luôn sát cánh bên Anh. Chúc CTO sinh nhật luôn an tâm ngủ ngon mỗi đêm!",
    image: "assets/04_Interactive_Nodes/item_lotus_ops.png",
    posX: 0.26,
    posY: 0.62
  },
  {
    id: "wish-ops-2",
    realmId: 3,
    author: "Kim Ngân (NOC / Monitoring)",
    department: "Vận hành hệ thống",
    date: "20/10/2026",
    message: "Chúc anh tuổi mới vạn sự bình an, alert luôn im ắng trong giờ nghỉ, mọi giao dịch trơn tru 100%!",
    image: "assets/05_Grand_Finale/birthday_tea_cake.png",
    posX: 0.74,
    posY: 0.64
  },

  // Cảnh 4: Huyền Giáp Quan Âm (An toàn thông tin)
  {
    id: "wish-sec-1",
    realmId: 4,
    author: "Duy Khánh (CISO / Security Team)",
    department: "An toàn thông tin",
    date: "20/10/2026",
    message: "Chúc Mừng Sinh Nhật CTO! Huyền Giáp Quan Âm xin gửi tấm khiên kiên cố nhất: Không Zero-day nào xuyên thủng, bảo vệ toàn vẹn tài sản dữ liệu của doanh nghiệp dưới bàn tay lãnh đạo của Anh!",
    image: "assets/04_Interactive_Nodes/item_shield_sec.png",
    posX: 0.35,
    posY: 0.45
  },
  {
    id: "wish-sec-2",
    realmId: 4,
    author: "Thùy Linh (SecOps & Compliance)",
    department: "An toàn thông tin",
    date: "20/10/2026",
    message: "Chúc Sếp tuổi mới an khang thịnh vượng, bảo mật vững vàng, luôn là điểm tựa tinh thần thép cho cả khối IT!",
    image: "assets/01_Characters/portrait_cto_pixel.png",
    posX: 0.65,
    posY: 0.45
  },

  // Cảnh 5: Vân Hành Tiên Trà (Triển khai sản phẩm dữ liệu)
  {
    id: "wish-deliv-1",
    realmId: 5,
    author: "Văn Đức (Data Delivery Lead)",
    department: "Triển khai dữ liệu",
    date: "20/10/2026",
    message: "Ngàn cánh hạc mang theo lòng biết ơn sâu sắc tới Anh! Nhờ tầm nhìn của Sếp mà các sản phẩm dữ liệu đã cập bến thành công tới từng Khối Đầu tư, Vận hành, Tài chính. Chúc Sếp sinh nhật rực rỡ!",
    image: "assets/04_Interactive_Nodes/item_crane_deliv.png",
    posX: 0.30,
    posY: 0.40
  },
  {
    id: "wish-deliv-2",
    realmId: 5,
    author: "Phương Thảo (Product Owner - Data)",
    department: "Triển khai dữ liệu",
    date: "20/10/2026",
    message: "Happy Birthday Sếp! Chúc các sản phẩm Data của công ty ngày càng lan tỏa giá trị, bay cao bay xa như cánh hạc Tiên Trà!",
    image: "assets/05_Grand_Finale/birthday_tea_cake.png",
    posX: 0.70,
    posY: 0.40
  },

  // Cảnh 6: Tuyết Tâm Mạt Trà (Quản trị & Phân tích dữ liệu)
  {
    id: "wish-data-1",
    realmId: 6,
    author: "Hoàng Anh (Lead Data Scientist)",
    department: "Quản trị & Phân tích",
    date: "20/10/2026",
    message: "Từ Data -> Information -> Insight -> Action! Chúc Anh luôn có những Insight sắc bén như lưỡi gươm và tâm hồn thanh tịnh như chén Matcha ban mai!",
    image: "assets/04_Interactive_Nodes/item_maple_data.png",
    posX: 0.38,
    posY: 0.42
  },
  {
    id: "wish-data-2",
    realmId: 6,
    author: "Mai Phương (BI & Data Governance)",
    department: "Quản trị & Phân tích",
    date: "20/10/2026",
    message: "Chúc Thuyền Trưởng sinh nhật ấm áp! Chiếc lá phong đỏ này mang theo tình cảm của toàn thể anh em Data gửi trọn về Sếp!",
    image: "assets/01_Characters/portrait_cto_pixel.png",
    posX: 0.62,
    posY: 0.42
  }
];

class WishStorageManager {
  constructor() {
    this.STORAGE_KEY = "LUC_TRA_CTO_BIRTHDAY_WISHES_2026_V2";
    this.wishes = this.loadWishes();
  }

  loadWishes() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Error reading localStorage, using defaults", e);
    }
    this.saveWishes(DEFAULT_WISHES);
    return JSON.parse(JSON.stringify(DEFAULT_WISHES));
  }

  saveWishes(wishesList) {
    this.wishes = wishesList;
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.wishes));
    } catch (e) {
      console.error("Storage full or quota exceeded", e);
    }
  }

  getWishesByRealm(realmId) {
    return this.wishes.filter(w => w.realmId === Number(realmId));
  }

  getAllWishes() {
    return this.wishes;
  }

  addWish(wishData) {
    const realmData = REALMS_DATA[wishData.realmId] || REALMS_DATA[1];
    const newWish = {
      id: "wish-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      realmId: Number(wishData.realmId),
      author: wishData.author.trim(),
      department: wishData.department,
      date: new Date().toLocaleDateString('vi-VN'),
      message: wishData.message.trim(),
      image: wishData.image || realmData.assetIcon || PRESET_AVATARS[0].data,
      posX: wishData.posX !== undefined ? wishData.posX : 0.28 + Math.random() * 0.44,
      posY: wishData.posY !== undefined ? wishData.posY : 0.22 + Math.random() * 0.46
    };
    this.wishes.push(newWish);
    this.saveWishes(this.wishes);
    return newWish;
  }

  deleteWish(wishId) {
    this.wishes = this.wishes.filter(w => w.id !== wishId);
    this.saveWishes(this.wishes);
  }

  resetToDefault() {
    this.saveWishes(JSON.parse(JSON.stringify(DEFAULT_WISHES)));
    return this.wishes;
  }

  exportJson() {
    return JSON.stringify(this.wishes, null, 2);
  }

  importJson(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) {
        this.saveWishes(parsed);
        return { success: true, count: parsed.length };
      }
      return { success: false, error: "Định dạng JSON không hợp lệ" };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}

// Khởi tạo đối tượng quản lý lưu trữ toàn cục
window.wishStorage = new WishStorageManager();
