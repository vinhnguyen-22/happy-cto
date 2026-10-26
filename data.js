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
    leadName: "Trà Tiên Dẫn Chuyện",
    leadRole: "Người Dẫn Chuyện",
    leadSpeakerName: "Trà Tiên",
    leadSpeakerRole: "Người Dẫn Chuyện",
    leadPortrait: "assets/01_Characters/portrait_tea_master.png",
    narratorSpeech: [
      "Kính chào Anh Kiên – vị Thuyền Trưởng, người Anh cả đáng kính của Khối Công nghệ thông tin!",
      "Kính mời Anh bước vào Lục Trà Cảnh Giới – không gian tôn vinh hành trình phụng sự và những thành tựu công nghệ xuất sắc của Anh.",
      "Sáu danh trà trước mặt đại diện cho các phân hệ công nghệ & dữ liệu, nơi toàn thể các Trưởng phòng và anh em gửi trọn tình cảm tri ân chúc mừng sinh nhật Anh!",
      "Hãy nhấp chọn một hộp trà trên bàn hoặc điều khiển nhân vật bước tới để khám phá từng cảnh giới diệu kỳ!"
    ]
  },
  1: {
    id: 1,
    name: "Cổ Mạch Phổ Nhĩ",
    department: "Quản lý hạ tầng (IT.INF)",
    color: "#e67e22",
    element: "Gốc Rễ Vững Chắc",
    interactableName: "Lá Cây Đại Thụ",
    interactableIcon: "🍂",
    assetIcon: "assets/markers/marker_ancient_root_crystal.png",
    leadName: "Lê Hà Quốc Bảo - Trưởng phòng Quản lý hạ tầng",
    leadRole: "Trưởng phòng Quản lý hạ tầng",
    leadSpeakerName: "Lê Hà Quốc Bảo",
    leadSpeakerRole: "Quản lý hạ tầng (IT.INF)",
    leadShortName: "Lê Hà Quốc Bảo",
    leadPortrait: "assets/01_Characters/portrait_lead_bao.png",
    leadSprite: "assets/01_Characters/lead_bao_hatang_attt.png",
    leadPos: { x: 0.15, y: 0.74 },
    promptText: "Nhấn vào các phiến lá trên cây cổ thụ để gửi & đọc lời chúc!",
    narratorSpeech: [
      "Em chào Anh Kiên! Chào mừng Anh đến với cõi Cổ Mạch Phổ Nhĩ – cội nguồn nền móng của hệ sinh thái công nghệ.",
      "Đội ngũ Quản lý Hạ tầng chúng em luôn giữ cho toàn bộ máy chủ, Data Center, Cloud và đường truyền mạng vận hành ổn định 99.999% để Anh luôn an tâm chỉ đạo.",
      "Người ta thường nhìn thấy các ứng dụng rực rỡ, nhưng chính gốc rễ hạ tầng thầm lặng này là điểm tựa để Anh tự tin triển khai mọi chiến lược lớn.",
      "Em Quốc Bảo cùng toàn thể anh em Khối Hạ tầng kính chúc Anh Kiên tuổi mới dồi dào sức khỏe, luôn là ngọn hải đăng vững chãi của chúng em!"
    ]
  },
  2: {
    id: 2,
    name: "Thiên Công Ngọc Lộ",
    department: "Phát triển phần mềm (IT.DEV)",
    color: "#2ecc71",
    element: "Thân Cây Kiến Trúc",
    interactableName: "Lá Mầm Số Hoá",
    interactableIcon: "🍃",
    assetIcon: "assets/markers/marker_digital_sprout.png",
    leadName: "Đinh Văn Thạnh - Trưởng phòng Phát triển phần mềm",
    leadRole: "Trưởng phòng Phát triển phần mềm",
    leadSpeakerName: "Đinh Văn Thạnh",
    leadSpeakerRole: "Phát triển phần mềm (IT.DEV)",
    leadShortName: "Đinh Văn Thạnh",
    leadPortrait: "assets/01_Characters/portrait_lead_thanh.png",
    leadSprite: "assets/01_Characters/lead_thanh_ptpm.png",
    leadPos: { x: 0.15, y: 0.74 },
    promptText: "Nhấn vào các mầm lá công nghệ để gửi & đọc lời chúc!",
    narratorSpeech: [
      "Em chào Anh Kiên! Chào mừng Anh đến với Thiên Công Ngọc Lộ – nơi những ý tưởng của Anh được hiện thực hóa thành từng dòng code chuẩn mực.",
      "Dưới sự định hướng kiến trúc sắc bén của Anh, các ứng dụng, dashboard và quy trình nghiệp vụ đã liên tục đâm chồi nảy lộc, tạo nên những sản phẩm số chất lượng.",
      "Mọi sản phẩm thành công đều bắt đầu từ tầm nhìn của Anh và sự tận tụy biến ý tưởng thành hiện thực của anh em DEV chúng em.",
      "Em Văn Thạnh cùng toàn thể anh em Phát triển Phần mềm kính chúc Anh Kiên sinh nhật ngập tràn niềm vui, sức sáng tạo vô tận và vạn sự hanh thông!"
    ]
  },
  3: {
    id: 3,
    name: "Trường Lưu Ban Trà",
    department: "Vận hành nền tảng (IT.SDO)",
    color: "#f39c12",
    element: "Mạch Nhựa Bất Tận",
    interactableName: "Đoá Hoa Bên Suối",
    interactableIcon: "🌸",
    assetIcon: "assets/markers/marker_amber_lotus_wheel.png",
    leadName: "Vũ Anh Kiệt & Lê Trung Kiên - Trưởng phòng Vận hành nền tảng",
    leadRole: "Trưởng phòng Vận hành nền tảng",
    leadSpeakerName: "Vũ Anh Kiệt & Lê Trung Kiên",
    leadSpeakerRole: "Vận hành nền tảng (IT.SDO)",
    leadShortName: "Vũ Anh Kiệt & Lê Trung Kiên",
    leadPortrait: "assets/01_Characters/portrait_lead_kiet.png",
    leadSprite: "assets/01_Characters/lead_kiet_lps.png",
    leadPos: { x: 0.14, y: 0.74 },
    leads: [
      {
        id: "kiet_sdo",
        name: "Vũ Anh Kiệt - Trưởng phòng Vận hành nền tảng",
        shortName: "Vũ Anh Kiệt",
        role: "Trưởng phòng Vận hành nền tảng",
        speakerName: "Vũ Anh Kiệt",
        speakerRole: "Vận hành nền tảng (IT.SDO)",
        portrait: "assets/01_Characters/portrait_lead_kiet.png",
        portraitKey: "lead_portrait_kiet",
        spriteKey: "lead_sprite_kiet",
        sprite: "assets/01_Characters/lead_kiet_lps.png",
        pos: { x: 0.14, y: 0.74 },
        speech: [
          "Em chào Anh Kiên! Tại phân hệ vận hành nền tảng, chúng em luôn kiên định giữ cho từng luồng giao dịch và tác vụ lõi chạy mượt mà 24/7.",
          "Xây dựng khó, nhưng duy trì ổn định còn đòi hỏi sự bền bỉ hơn nữa. Chúng em luôn tâm niệm giữ cho mọi thứ vận hành trơn tru nhất để Anh yên tâm.",
          "Em Kiệt kính chúc Anh Kiên sinh nhật thật nhiều niềm vui, tâm an trí sáng và luôn là chỗ dựa vững chãi cho đại gia đình công nghệ!"
        ]
      },
      {
        id: "kienle_sdo",
        name: "Lê Trung Kiên - Trưởng phòng Vận hành nền tảng",
        shortName: "Lê Trung Kiên",
        role: "Trưởng phòng Vận hành nền tảng",
        speakerName: "Lê Trung Kiên",
        speakerRole: "Vận hành nền tảng (IT.SDO)",
        portrait: "assets/01_Characters/portrait_lead_kienle.png",
        portraitKey: "lead_portrait_kienle",
        spriteKey: "lead_sprite_kienle",
        sprite: "assets/01_Characters/lead_kienle_scex.png",
        pos: { x: 0.28, y: 0.74 },
        speech: [
          "Em chào Anh Kiên! Tuy có cùng tên Kiên nhưng Anh luôn là người Anh cả, người thuyền trưởng mẫu mực mà em luôn kính trọng và học hỏi.",
          "Bánh xe nước quay đều không ngừng nghỉ, cũng như toàn bộ nền tảng hệ thống luôn được kiểm soát chặt chẽ từng giây.",
          "Em Trung Kiên kính chúc Anh Kiên tuổi mới dồi dào sinh lực, gia đình hạnh phúc viên mãn và cùng toàn khối gặt hái thêm nhiều chiến công mới!"
        ]
      }
    ],
    promptText: "Nhấn vào các đoá hoa sen bên dòng suối để gửi & đọc lời chúc!",
    narratorSpeech: [
      "Em chào Anh Kiên! Trường Lưu Ban Trà là biểu tượng cho dòng chảy vận hành nền tảng lõi thông suốt và bền bỉ.",
      "Bộ đôi Vận hành Nền tảng (IT.SDO) luôn kề vai sát cánh giữ cho huyết mạch hệ thống của Anh an toàn và ổn định 24/7.",
      "Người vận hành giỏi là người khiến mọi thứ diễn ra bình thường nhất, để Anh luôn an tâm chỉ huy toàn khối!"
    ]
  },
  4: {
    id: 4,
    name: "Huyền Giáp Quan Âm",
    department: "Quản lý hạ tầng & ATTT (IT.INF)",
    color: "#3498db",
    element: "Vỏ Bọc Kiên Cố",
    interactableName: "Khiên Giáp Ánh Sáng",
    interactableIcon: "🛡️",
    assetIcon: "assets/markers/marker_cyber_shield_rune.png",
    leadName: "Lê Hà Quốc Bảo - Trưởng phòng Quản lý hạ tầng",
    leadRole: "Trưởng phòng Quản lý hạ tầng",
    leadSpeakerName: "Lê Hà Quốc Bảo",
    leadSpeakerRole: "Quản lý hạ tầng & ATTT (IT.INF)",
    leadShortName: "Lê Hà Quốc Bảo",
    leadPortrait: "assets/01_Characters/portrait_lead_bao.png",
    leadSprite: "assets/01_Characters/lead_bao_hatang_attt.png",
    leadPos: { x: 0.15, y: 0.74 },
    promptText: "Nhấn vào các tầng khiên chắn năng lượng để gửi & đọc lời chúc!",
    narratorSpeech: [
      "Em chào Anh Kiên! Huyền Giáp Quan Âm tượng trưng cho tấm khiên bảo vệ kiên cố trước mọi thách thức an toàn thông tin.",
      "Bảo mật không phải là một cánh cửa đơn độc, mà là nhiều tầng phòng thủ kiên cố bảo vệ toàn vẹn tài sản dữ liệu của doanh nghiệp.",
      "Anh cứ an tâm đưa chiến hạm công nghệ vươn ra biển lớn, hậu phương bảo mật và hạ tầng kiên cố đã có chúng em vững vàng canh gác.",
      "Em Quốc Bảo kính chúc Anh Kiên sinh nhật an khang, trí tuệ mẫn tiệp và luôn tự hào về đội ngũ kề vai sát cánh cùng Anh!"
    ]
  },
  5: {
    id: 5,
    name: "Vân Hành Tiên Trà",
    department: "Giải pháp báo cáo (IT.DPI)",
    color: "#9b59b6",
    element: "Cành Lá Lan Toả",
    interactableName: "Cánh Hạc Trí Tuệ",
    interactableIcon: "🕊️",
    assetIcon: "assets/markers/marker_origami_crane_glow.png",
    leadName: "Vũ Thị Diệu Hiền - Trưởng phòng Giải pháp báo cáo",
    leadRole: "Trưởng phòng Giải pháp báo cáo",
    leadSpeakerName: "Vũ Thị Diệu Hiền",
    leadSpeakerRole: "Giải pháp báo cáo (IT.DPI)",
    leadShortName: "Vũ Thị Diệu Hiền",
    leadPortrait: "assets/01_Characters/portrait_lead_hien.png",
    leadSprite: "assets/01_Characters/lead_hien_trienkhai.png",
    leadPos: { x: 0.15, y: 0.74 },
    promptText: "Nhấn vào các cánh hạc giấy bay lượn để gửi & đọc lời chúc!",
    narratorSpeech: [
      "Em chào Anh Kiên! Chào mừng Anh đến với Vân Hành Tiên Trà – nơi những giải pháp báo cáo chắp cánh đưa giá trị dữ liệu tới từng đơn vị.",
      "Một sản phẩm dữ liệu chỉ thực sự tỏa sáng khi được ứng dụng hiệu quả. Nhờ sự định hướng và ủng hộ của Anh, các giải pháp báo cáo của chúng em ngày càng thông minh và trực quan.",
      "Từng cánh hạc Tiên Trà bay lượn là ngàn lời tri ân của chúng em gửi tới người Anh cả kính mến.",
      "Em Diệu Hiền kính chúc Anh Kiên tuổi mới thật nhiều sức khỏe, luôn tươi trẻ, tràn đầy năng lượng và dẫn lối cho chúng em chạm tới những cột mốc rực rỡ!"
    ]
  },
  6: {
    id: 6,
    name: "Tuyết Tâm Mạt Trà",
    department: "Quản lý & Phân tích DL (IT.DWH)",
    color: "#e74c3c",
    element: "Búp Trà Tinh Hoa (Insight)",
    interactableName: "Lá Phong Đỏ Zen",
    interactableIcon: "🍁",
    assetIcon: "assets/markers/marker_zen_maple_cup.png",
    leadName: "Nguyễn Mạnh Tuyên - Trưởng phòng Quản lý & Phân tích dữ liệu",
    leadRole: "Trưởng phòng Quản lý & Phân tích DL",
    leadSpeakerName: "Nguyễn Mạnh Tuyên",
    leadSpeakerRole: "Quản lý & Phân tích DL (IT.DWH)",
    leadShortName: "Nguyễn Mạnh Tuyên",
    leadPortrait: "assets/01_Characters/portrait_lead_tuyen.png",
    leadSprite: "assets/01_Characters/lead_tuyen_quantri.png",
    leadPos: { x: 0.15, y: 0.74 },
    promptText: "Nhấn vào các lá phong đỏ bên cửa sổ tròn để gửi & đọc lời chúc!",
    narratorSpeech: [
      "Em chào Anh Kiên! Tuyết Tâm Mạt Trà là cảnh giới đỉnh cao, nơi dữ liệu kết tinh thành trí tuệ và những Insight sắc bén.",
      "Từ dữ liệu thô đến thông tin, từ xu hướng đến quyết sách – hành trình này luôn được thắp sáng bởi tầm nhìn chiến lược của Anh.",
      "Chúng em luôn tự hào được đồng hành cùng vị CTO có tư duy dữ liệu sâu sắc và tâm hồn trà đạo thanh cao.",
      "Em Mạnh Tuyên kính mời Anh Kiên nâng chén Mạt Trà thanh khiết nhất, chúc mừng sinh nhật vị Thuyền Trưởng đáng kính của chúng em!"
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
  { name: "Chân Dung Anh Kiên (CTO)", data: "assets/01_Characters/portrait_cto_pixel.png" },
  { name: "Lê Hà Quốc Bảo (IT.INF-Head)", data: "assets/01_Characters/portrait_lead_bao.png" },
  { name: "Đinh Văn Thạnh (IT.DEV-Head)", data: "assets/01_Characters/portrait_lead_thanh.png" },
  { name: "Vũ Anh Kiệt (IT.SDO-Head)", data: "assets/01_Characters/portrait_lead_kiet.png" },
  { name: "Lê Trung Kiên (IT.SDO-Head)", data: "assets/01_Characters/portrait_lead_kienle.png" },
  { name: "Vũ Thị Diệu Hiền (IT.DPI-Head)", data: "assets/01_Characters/portrait_lead_hien.png" },
  { name: "Nguyễn Mạnh Tuyên (IT.DWH-Head)", data: "assets/01_Characters/portrait_lead_tuyen.png" },
  { name: "Nguyễn Tiến Lâm (Quyền Giám đốc Khối)", data: "assets/01_Characters/portrait_cto_pixel.png" },
  { name: "Trà Tiên Dẫn Chuyện", data: "assets/01_Characters/portrait_tea_master.png" }
];

// DỮ LIỆU LỜI CHÚC MẪU SỬ DỤNG ẢNH ASSETS CHÍNH THỨC
const DEFAULT_WISHES = [
  // Cảnh 1: Cổ Mạch Phổ Nhĩ (Quản lý hạ tầng - IT.INF)
  {
    id: "wish-infra-bao",
    realmId: 1,
    author: "Lê Hà Quốc Bảo (IT.INF-Head)",
    department: "Quản lý hạ tầng (IT.INF)",
    date: "20/10/2026",
    message: "Em kính chúc Anh Kiên sinh nhật ngập tràn niềm vui và sức khỏe! Toàn bộ anh em Quản lý Hạ tầng & ATTT cam kết luôn là lá chắn thép, giữ vững nền móng hệ thống vững chãi 99.999% để Anh an tâm chèo lái đại hải trình công nghệ!",
    image: "assets/01_Characters/portrait_lead_bao.png",
    posX: 0.28,
    posY: 0.42
  },
  {
    id: "wish-infra-1",
    realmId: 1,
    author: "Tuấn Anh (Lead Network & DC)",
    department: "Quản lý hạ tầng (IT.INF)",
    date: "20/10/2026",
    message: "Em chúc Anh Kiên sinh nhật bùng nổ năng lượng! Năm nay team cam kết Uptime 99.999%, băng thông thênh thang, cáp ngầm vững chãi nâng bước mọi dự án công nghệ của Anh vươn xa!",
    image: "assets/04_Interactive_Nodes/item_leaf_infra.png",
    posX: 0.35,
    posY: 0.32
  },
  {
    id: "wish-infra-2",
    realmId: 1,
    author: "Thanh Bình (Cloud Architect)",
    department: "Quản lý hạ tầng (IT.INF)",
    date: "20/10/2026",
    message: "Kính chúc Anh Kiên tuổi mới dồi dào sức khỏe, auto-scaling mượt mà, chi phí Cloud tối ưu kịch khung, gia đình luôn hạnh phúc và ấm áp!",
    image: "assets/05_Grand_Finale/birthday_tea_cake.png",
    posX: 0.72,
    posY: 0.36
  },
  {
    id: "wish-infra-3",
    realmId: 1,
    author: "Hải Đăng (DevOps Engineer)",
    department: "Quản lý hạ tầng (IT.INF)",
    date: "20/10/2026",
    message: "Happy Birthday Anh Kiên! Mong Anh luôn giữ nụ cười rạng rỡ mỗi khi ngắm dashboard xanh lè không một dấu chấm đỏ!",
    image: "assets/01_Characters/portrait_cto_pixel.png",
    posX: 0.52,
    posY: 0.20
  },
  {
    id: "wish-lam-hcm",
    realmId: 1,
    author: "Nguyễn Tiến Lâm (Quyền Giám đốc Khối - HCM)",
    department: "Khối Công nghệ thông tin (HCM)",
    date: "20/10/2026",
    message: "Em kính chúc Anh Kiên - người Anh cả kính mến và vị Thuyền Trưởng tuyệt vời của Khối CNTT sinh nhật thật nhiều sức khỏe, niềm vui và luôn vững bước trên hành trình bứt phá mới!",
    image: "assets/05_Grand_Finale/birthday_tea_cake.png",
    posX: 0.85,
    posY: 0.58
  },

  // Cảnh 2: Thiên Công Ngọc Lộ (Phát triển phần mềm - IT.DEV)
  {
    id: "wish-dev-thanh",
    realmId: 2,
    author: "Đinh Văn Thạnh (IT.DEV-Head)",
    department: "Phát triển phần mềm (IT.DEV)",
    date: "20/10/2026",
    message: "Em Thạnh cùng toàn thể anh em Phát triển Phần mềm kính chúc Anh Kiên tuổi mới dồi dào năng lượng! Cảm ơn Anh đã luôn là người Anh cả chỉ dẫn kiến trúc, đồng hành và truyền lửa để team vượt qua mọi mùa Go-Live!",
    image: "assets/01_Characters/portrait_lead_thanh.png",
    posX: 0.28,
    posY: 0.42
  },
  {
    id: "wish-dev-1",
    realmId: 2,
    author: "Quốc Huy & Team Frontend",
    department: "Phát triển phần mềm (IT.DEV)",
    date: "20/10/2026",
    message: "Em chúc Anh Kiên sinh nhật vui vẻ! Chúc các dòng code của công ty dưới sự dẫn dắt của Anh luôn sạch đẹp không một bug, build mượt như lụa, UI/UX đỉnh nóc kịch trần!",
    image: "assets/04_Interactive_Nodes/item_sprout_dev.png",
    posX: 0.35,
    posY: 0.34
  },
  {
    id: "wish-dev-2",
    realmId: 2,
    author: "Minh Trang (Lead Backend)",
    department: "Phát triển phần mềm (IT.DEV)",
    date: "20/10/2026",
    message: "Em chúc Anh Kiên thêm tuổi mới thêm nhiều đột phá mới! Cảm ơn Anh đã luôn định hướng kiến trúc Microservices sáng suốt, dìu dắt anh em vượt qua bao bài toán hóc búa!",
    image: "assets/05_Grand_Finale/birthday_tea_cake.png",
    posX: 0.75,
    posY: 0.42
  },
  {
    id: "wish-dev-3",
    realmId: 2,
    author: "Hoàng Nam (Mobile App Team)",
    department: "Phát triển phần mềm (IT.DEV)",
    date: "20/10/2026",
    message: "Sinh nhật vui vẻ nha Anh Kiên ơi! Team em xin tặng Anh tính năng deploy không cần rollback suốt cả năm tới!",
    image: "assets/01_Characters/portrait_cto_pixel.png",
    posX: 0.54,
    posY: 0.22
  },

  // Cảnh 3: Trường Lưu Ban Trà (Vận hành nền tảng - IT.SDO)
  {
    id: "wish-ops-kiet",
    realmId: 3,
    author: "Vũ Anh Kiệt (IT.SDO-Head)",
    department: "Vận hành nền tảng (IT.SDO)",
    date: "20/10/2026",
    message: "Em Kiệt kính chúc Anh Kiên tuổi mới vạn sự bình an, tâm an trí sáng! Team Vận hành Nền tảng cam kết giữ cho dòng chảy hệ sinh thái luôn thông suốt 24/7/365 để Anh an tâm dẫn lối!",
    image: "assets/01_Characters/portrait_lead_kiet.png",
    posX: 0.18,
    posY: 0.38
  },
  {
    id: "wish-ops-kienle",
    realmId: 3,
    author: "Lê Trung Kiên (IT.SDO-Head)",
    department: "Vận hành nền tảng (IT.SDO)",
    date: "20/10/2026",
    message: "Tuy cùng tên Kiên nhưng Anh luôn là người Anh cả và người Thuyền Trưởng mà em hết mực kính trọng và học hỏi. Em Kiên kính chúc Anh sinh nhật vui vẻ, hạnh phúc viên mãn và cùng khối IT gặt hái thêm nhiều đỉnh cao mới!",
    image: "assets/01_Characters/portrait_lead_kienle.png",
    posX: 0.34,
    posY: 0.40
  },
  {
    id: "wish-ops-1",
    realmId: 3,
    author: "Trọng Nghĩa (Platform Ops)",
    department: "Vận hành nền tảng (IT.SDO)",
    date: "20/10/2026",
    message: "Bánh xe nước quay đều không ngừng nghỉ, cũng như lòng nhiệt huyết của anh em Ops luôn sát cánh bên Anh Kiên. Chúc Anh sinh nhật luôn an tâm ngủ ngon mỗi đêm!",
    image: "assets/04_Interactive_Nodes/item_lotus_ops.png",
    posX: 0.46,
    posY: 0.34
  },
  {
    id: "wish-ops-2",
    realmId: 3,
    author: "Kim Ngân (NOC / Monitoring)",
    department: "Vận hành nền tảng (IT.SDO)",
    date: "20/10/2026",
    message: "Em chúc Anh Kiên tuổi mới vạn sự an khang, alert luôn im ắng trong giờ nghỉ, mọi giao dịch trơn tru 100%!",
    image: "assets/05_Grand_Finale/birthday_tea_cake.png",
    posX: 0.74,
    posY: 0.52
  },

  // Cảnh 4: Huyền Giáp Quan Âm (Quản lý hạ tầng & ATTT - IT.INF)
  {
    id: "wish-sec-1",
    realmId: 4,
    author: "Duy Khánh (CISO / Security Team)",
    department: "Quản lý hạ tầng & ATTT",
    date: "20/10/2026",
    message: "Chúc Mừng Sinh Nhật Anh Kiên! Huyền Giáp Quan Âm xin gửi tấm khiên kiên cố nhất: Không Zero-day nào xuyên thủng, bảo vệ toàn vẹn tài sản dữ liệu của doanh nghiệp dưới sự chỉ đạo của Anh!",
    image: "assets/04_Interactive_Nodes/item_shield_sec.png",
    posX: 0.36,
    posY: 0.32
  },
  {
    id: "wish-sec-2",
    realmId: 4,
    author: "Thùy Linh (SecOps & Compliance)",
    department: "Quản lý hạ tầng & ATTT",
    date: "20/10/2026",
    message: "Em chúc Anh Kiên tuổi mới an khang thịnh vượng, bảo mật vững vàng, luôn là điểm tựa tinh thần thép cho toàn thể anh em IT!",
    image: "assets/01_Characters/portrait_cto_pixel.png",
    posX: 0.75,
    posY: 0.44
  },

  // Cảnh 5: Vân Hành Tiên Trà (Giải pháp báo cáo - IT.DPI)
  {
    id: "wish-dpi-hien",
    realmId: 5,
    author: "Vũ Thị Diệu Hiền (IT.DPI-Head)",
    department: "Giải pháp báo cáo (IT.DPI)",
    date: "20/10/2026",
    message: "Em Diệu Hiền kính chúc Anh Kiên sinh nhật rực rỡ, luôn dồi dào sức khỏe và ngập tràn cảm hứng! Cảm ơn Anh đã luôn định hướng và chắp cánh để các giải pháp báo cáo dữ liệu ngày càng thông minh, lan tỏa giá trị tới mọi khối phòng ban!",
    image: "assets/01_Characters/portrait_lead_hien.png",
    posX: 0.28,
    posY: 0.42
  },
  {
    id: "wish-deliv-1",
    realmId: 5,
    author: "Văn Đức (Data Delivery Lead)",
    department: "Giải pháp báo cáo (IT.DPI)",
    date: "20/10/2026",
    message: "Ngàn cánh hạc mang theo lòng biết ơn sâu sắc của chúng em tới Anh Kiên! Nhờ tầm nhìn của Anh mà các sản phẩm dữ liệu đã cập bến thành công tới từng Khối phòng ban. Em chúc Anh sinh nhật rực rỡ!",
    image: "assets/04_Interactive_Nodes/item_crane_deliv.png",
    posX: 0.36,
    posY: 0.32
  },
  {
    id: "wish-deliv-2",
    realmId: 5,
    author: "Phương Thảo (Product Owner - Data)",
    department: "Giải pháp báo cáo (IT.DPI)",
    date: "20/10/2026",
    message: "Happy Birthday Anh Kiên! Em chúc các sản phẩm dữ liệu của khối mình ngày càng lan tỏa giá trị, bay cao bay xa như cánh hạc Tiên Trà!",
    image: "assets/05_Grand_Finale/birthday_tea_cake.png",
    posX: 0.70,
    posY: 0.38
  },

  // Cảnh 6: Tuyết Tâm Mạt Trà (Quản trị & Phân tích dữ liệu - IT.DWH)
  {
    id: "wish-dwh-tuyen",
    realmId: 6,
    author: "Nguyễn Mạnh Tuyên (IT.DWH-Head)",
    department: "Quản trị & Phân tích DL (IT.DWH)",
    date: "20/10/2026",
    message: "Em Mạnh Tuyên kính chúc Anh Kiên tuổi mới dồi dào sinh lực, luôn sở hữu những Insight sắc bén và tư duy chiến lược sâu rộng! Toàn thể anh em DWH tự hào vì được đồng hành và học hỏi từ Anh mỗi ngày!",
    image: "assets/01_Characters/portrait_lead_tuyen.png",
    posX: 0.28,
    posY: 0.42
  },
  {
    id: "wish-data-1",
    realmId: 6,
    author: "Hoàng Anh (Lead Data Scientist)",
    department: "Quản trị & Phân tích DL (IT.DWH)",
    date: "20/10/2026",
    message: "Từ Data -> Information -> Insight -> Action! Em chúc Anh Kiên luôn có những Insight sắc bén và tâm hồn thanh tịnh như chén Matcha ban mai!",
    image: "assets/04_Interactive_Nodes/item_maple_data.png",
    posX: 0.78,
    posY: 0.40
  },
  {
    id: "wish-data-2",
    realmId: 6,
    author: "Mai Phương (BI & Data Governance)",
    department: "Quản trị & Phân tích DL (IT.DWH)",
    date: "20/10/2026",
    message: "Em chúc Thuyền Trưởng Anh Kiên sinh nhật ấm áp! Chiếc lá phong đỏ này mang theo tình cảm của toàn thể anh em Data gửi trọn về Anh!",
    image: "assets/01_Characters/portrait_cto_pixel.png",
    posX: 0.36,
    posY: 0.32
  }
];

class WishStorageManager {
  constructor() {
    this.STORAGE_KEY = "LUC_TRA_CTO_BIRTHDAY_WISHES_2026_V7";
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
      // Di chuyển các lời chúc tự tạo từ phiên bản V4..V6 nếu có
      const prevKeys = ["LUC_TRA_CTO_BIRTHDAY_WISHES_2026_V6", "LUC_TRA_CTO_BIRTHDAY_WISHES_2026_V5", "LUC_TRA_CTO_BIRTHDAY_WISHES_2026_V4"];
      for (const k of prevKeys) {
        const prevRaw = localStorage.getItem(k);
        if (prevRaw) {
          const prevParsed = JSON.parse(prevRaw);
          if (Array.isArray(prevParsed)) {
            const userCustomWishes = prevParsed.filter(w => !w.id.startsWith("wish-infra-") && !w.id.startsWith("wish-dev-") && !w.id.startsWith("wish-ops-") && !w.id.startsWith("wish-sec-") && !w.id.startsWith("wish-deliv-") && !w.id.startsWith("wish-data-") && !w.id.startsWith("wish-lam-") && !w.id.startsWith("wish-dpi-") && !w.id.startsWith("wish-dwh-"));
            const merged = [...DEFAULT_WISHES, ...userCustomWishes];
            this.saveWishes(merged);
            return merged;
          }
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
      department: wishData.department || realmData.department,
      badge: wishData.badge || '🎂',
      date: new Date().toLocaleDateString('vi-VN'),
      message: wishData.message.trim(),
      image: wishData.image || 'assets/01_Characters/portrait_cto_pixel.png',
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
