/**
 * SPRITES & ASSETS MANAGER
 * Tích hợp toàn bộ bộ ảnh assets pixel art chính thức vào game:
 * - Nhân vật người chơi 4 hướng từ player_spritesheet.png (CTO-inspired)
 * - Chân dung Trà Tiên & Chân dung CTO pixel
 * - Background Trà Điện & 6 Cõi Trà danh trà
 * - Bàn trà cổ và 6 Hộp danh trà
 * - 6 Vật thể tương tác (lá, mầm, hoa sen, khiên, hạc giấy, lá phong)
 * - Cây Trà Tri Thức Hợp Nhất & Banner sinh nhật
 */

class SpriteManager {
  constructor() {
    this.images = {};
    this.loadedCount = 0;
    this.totalAssets = 0;
    this.playerFrames = {
      down: [],
      up: [],
      left: [],
      right: []
    };

    // Khởi tạo sprite dự phòng (fallback) trước
    this.initFallbackPlayerSprites();
    this.initNarratorPortrait();

    // Khởi tạo video nền động cho 6 Cõi Trà
    this.realmVideos = {};
    this.initRealmVideos();

    // Tải toàn bộ assets chính thức
    this.loadAllAssets();
  }

  // Khởi tạo và liên kết 7 video nền động cho Trà Điện Hub và 6 Cõi Trà
  initRealmVideos() {
    const videoFiles = {
      0: 'assets/02_Tea_Temple_Hub/bg_hub_tea_temple.mp4',
      1: 'assets/03_Six_Tea_Realms/bg_realm1_pho_nhi.mp4',
      2: 'assets/03_Six_Tea_Realms/bg_realm2_ngoc_lo.mp4',
      3: 'assets/03_Six_Tea_Realms/bg_realm3_ban_tra.mp4',
      4: 'assets/03_Six_Tea_Realms/bg_realm4_quan_am.mp4',
      5: 'assets/03_Six_Tea_Realms/bg_realm5_tien_tra.mp4',
      6: 'assets/03_Six_Tea_Realms/bg_realm6_mat_tra.mp4'
    };

    for (let id = 0; id <= 6; id++) {
      let vid = document.getElementById(`vid_realm${id}`);
      if (!vid) {
        vid = document.createElement('video');
        vid.src = videoFiles[id];
        vid.loop = true;
        vid.muted = true;
        vid.playsInline = true;
        vid.setAttribute('playsinline', '');
        vid.setAttribute('webkit-playsinline', '');
        vid.setAttribute('muted', '');
        vid.preload = 'auto';
      }
      this.realmVideos[id] = vid;
    }
  }

  // Phát video của cõi hiện tại, tạm dừng các video cõi khác để tiết kiệm CPU/GPU
  playRealmVideo(realmId) {
    if (!this.realmVideos) return;
    for (let id = 0; id <= 6; id++) {
      const vid = this.realmVideos[id];
      if (!vid) continue;
      if (Number(id) === Number(realmId)) {
        try {
          if (vid.paused) {
            vid.currentTime = 0;
            const playPromise = vid.play();
            if (playPromise !== undefined) {
              playPromise.catch(e => {
                // Bỏ qua cảnh báo autoplay policy khi chưa có tương tác
              });
            }
          }
        } catch (e) {}
      } else {
        try {
          vid.pause();
        } catch (e) {}
      }
    }
  }

  // Mở khóa toàn bộ video khi người dùng click vào cổng chào
  unlockAllVideos() {
    if (!this.realmVideos) return;
    for (let id = 0; id <= 6; id++) {
      const vid = this.realmVideos[id];
      if (vid) {
        vid.load();
      }
    }
  }

  // Tải toàn bộ ảnh assets từ thư mục assets/
  loadAllAssets() {
    const assetList = {
      // 01_Characters
      tea_master: 'assets/01_Characters/portrait_tea_master.png',
      cto_portrait: 'assets/01_Characters/portrait_cto_pixel.png',
      player_sheet: 'assets/01_Characters/player_spritesheet.png',

      // 02_Tea_Temple_Hub
      door_left: 'assets/02_Tea_Temple_Hub/door_left.png',
      door_right: 'assets/02_Tea_Temple_Hub/door_right.png',
      bg_tea_temple: 'assets/02_Tea_Temple_Hub/bg_tea_temple.png',
      table_ancient_tea: 'assets/02_Tea_Temple_Hub/table_ancient_tea.png',
      box_tea_1: 'assets/02_Tea_Temple_Hub/box_tea_1.png',
      box_tea_2: 'assets/02_Tea_Temple_Hub/box_tea_2.png',
      box_tea_3: 'assets/02_Tea_Temple_Hub/box_tea_3.png',
      box_tea_4: 'assets/02_Tea_Temple_Hub/box_tea_4.png',
      box_tea_5: 'assets/02_Tea_Temple_Hub/box_tea_5.png',
      box_tea_6: 'assets/02_Tea_Temple_Hub/box_tea_6.png',

      // 03_Six_Tea_Realms
      bg_realm1: 'assets/03_Six_Tea_Realms/bg_realm1_pho_nhi.png',
      bg_realm2: 'assets/03_Six_Tea_Realms/bg_realm2_ngoc_lo.png',
      bg_realm3: 'assets/03_Six_Tea_Realms/bg_realm3_ban_tra.png',
      bg_realm4: 'assets/03_Six_Tea_Realms/bg_realm4_quan_am.png',
      bg_realm5: 'assets/03_Six_Tea_Realms/bg_realm5_tien_tra.png',
      bg_realm6: 'assets/03_Six_Tea_Realms/bg_realm6_mat_tra.png',

      // 04_Interactive_Nodes & Markers
      item_node_1: 'assets/04_Interactive_Nodes/item_leaf_infra.png',
      item_node_2: 'assets/04_Interactive_Nodes/item_sprout_dev.png',
      item_node_3: 'assets/04_Interactive_Nodes/item_lotus_ops.png',
      item_node_4: 'assets/04_Interactive_Nodes/item_shield_sec.png',
      item_node_5: 'assets/04_Interactive_Nodes/item_crane_deliv.png',
      item_node_6: 'assets/04_Interactive_Nodes/item_maple_data.png',

      marker_1: 'assets/markers/marker_ancient_root_crystal.png',
      marker_2: 'assets/markers/marker_digital_sprout.png',
      marker_3: 'assets/markers/marker_amber_lotus_wheel.png',
      marker_4: 'assets/markers/marker_cyber_shield_rune.png',
      marker_5: 'assets/markers/marker_origami_crane_glow.png',
      marker_6: 'assets/markers/marker_zen_maple_cup.png',

      // Central Hub Tea Set & UI Icons
      tea_ceremony_set: 'assets/02_Tea_Temple_Hub/tea_ceremony_set.png',
      wish_tag_gold: 'assets/ui/item_wish_tag_gold.png',
      cursor_tea_leaf: 'assets/ui/cursor_tea_leaf.png',

      // Floating Particles
      particle_tea_leaf: 'assets/particles/particle_tea_leaf.png',
      particle_maple_leaf: 'assets/particles/particle_maple_leaf.png',
      particle_gold_sparkle: 'assets/particles/particle_gold_sparkle.png',
      particle_data_bit: 'assets/particles/particle_data_bit.png',

      // 05_Grand_Finale
      tree_grand_unified: 'assets/05_Grand_Finale/tree_grand_unified.png',
      birthday_tea_cake: 'assets/05_Grand_Finale/birthday_tea_cake.png',
      banner_happy_birthday: 'assets/05_Grand_Finale/banner_happy_birthday.png'
    };

    const keys = Object.keys(assetList);
    this.totalAssets = keys.length;

    keys.forEach(key => {
      const img = new Image();
      img.src = assetList[key];
      img.onload = () => {
        this.images[key] = img;
        this.loadedCount++;

        // Khi spritesheet nhân vật tải xong -> Cắt khung hình 4 hướng x 4 frame
        if (key === 'player_sheet') {
          this.slicePlayerSpriteSheet(img);
        }

        // Khi chân dung Trà Tiên tải xong -> Vẽ lên canvas chân dung
        if (key === 'tea_master') {
          this.drawNarratorPortraitImage(img);
        }
      };
      img.onerror = () => {
        console.warn(`Asset ${assetList[key]} not loaded, using fallback.`);
      };
    });
  }

  // Cắt player_spritesheet.png (128x192, 4 cột x 4 hàng, 32x48 mỗi frame)
  slicePlayerSpriteSheet(sheetImg) {
    const frameW = 32;
    const frameH = 48;
    const directions = ['down', 'up', 'left', 'right'];

    directions.forEach((dir, rowIndex) => {
      this.playerFrames[dir] = [];
      for (let colIndex = 0; colIndex < 4; colIndex++) {
        const frameCanvas = document.createElement('canvas');
        frameCanvas.width = frameW;
        frameCanvas.height = frameH;
        const ctx = frameCanvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        ctx.drawImage(
          sheetImg,
          colIndex * frameW, rowIndex * frameH, frameW, frameH,
          0, 0, frameW, frameH
        );

        this.playerFrames[dir].push(frameCanvas);
      }
    });
  }

  // Khởi tạo sprite dự phòng khi chưa tải xong ảnh
  initFallbackPlayerSprites() {
    ['down', 'up', 'left', 'right'].forEach(dir => {
      this.playerFrames[dir] = [];
      for (let frame = 0; frame < 4; frame++) {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 48;
        const ctx = canvas.getContext('2d');
        this.drawFallbackPixelCharacter(ctx, dir, frame);
        this.playerFrames[dir].push(canvas);
      }
    });
  }

  // Vẽ nhân vật pixel dự phòng
  drawFallbackPixelCharacter(ctx, dir, frame) {
    ctx.imageSmoothingEnabled = false;
    const legOffset = (frame === 1) ? 2 : (frame === 3 ? -2 : 0);

    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.beginPath();
    ctx.ellipse(16, 44, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#3e2723";
    ctx.fillRect(11 + legOffset, 38, 4, 6);
    ctx.fillRect(17 - legOffset, 38, 4, 6);

    ctx.fillStyle = "#6d4c2a";
    ctx.fillRect(10, 22, 12, 16);
    ctx.fillStyle = "#d4af37";
    ctx.fillRect(10, 30, 12, 3);

    ctx.fillStyle = "#f5cfa2";
    ctx.fillRect(11, 10, 10, 12);
    ctx.fillStyle = "#2c1a0e";
    ctx.fillRect(10, 7, 12, 6);

    if (dir === 'down') {
      ctx.fillStyle = "#2c1a0e";
      ctx.fillRect(13, 14, 2, 2);
      ctx.fillRect(17, 14, 2, 2);
    }
  }

  // Vẽ ảnh Trà Tiên lên portrait canvas
  drawNarratorPortraitImage(img) {
    const canvas = document.getElementById('portraitCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 96, 96);
    ctx.drawImage(img, 0, 0, 96, 96);
  }

  initNarratorPortrait() {
    const canvas = document.getElementById('portraitCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#3e2723";
    ctx.fillRect(0, 0, 96, 96);
  }

  // --- HÀM VẼ BACKGROUND CÁC CẢNH BẰNG VIDEO NỀN ĐỘNG / ẢNH ASSETS CHÍNH THỨC ---

  drawRealmBackground(ctx, realmId, width, height, frameRect = null) {
    const destX = frameRect ? frameRect.x : 0;
    const destY = frameRect ? frameRect.y : 0;
    const destW = frameRect ? frameRect.w : width;
    const destH = frameRect ? frameRect.h : height;

    // 1. Ưu tiên phát Video hoạt họa sống động (Cõi 0..6) nếu video đã sẵn sàng
    const vid = this.realmVideos ? this.realmVideos[realmId] : null;
    if (vid && vid.readyState >= 2 && !vid.paused) {
      this.drawCover(ctx, vid, width, height, frameRect);

      // Thêm lớp phủ mờ nhẹ điện toán để tương phản cho nhân vật & lời chúc
      ctx.fillStyle = realmId === 0 ? "rgba(10, 8, 6, 0.10)" : "rgba(10, 8, 6, 0.18)";
      ctx.fillRect(destX, destY, destW, destH);
      return true;
    }

    // 2. Dự phòng: Vẽ ảnh nền PNG chính thức (Trà Điện Hub hoặc ảnh cõi tĩnh khi video đang load)
    let imgKey = null;
    if (realmId === 0) imgKey = 'bg_tea_temple';
    else if (realmId >= 1 && realmId <= 6) imgKey = `bg_realm${realmId}`;

    const bgImg = this.images[imgKey];
    if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
      this.drawCover(ctx, bgImg, width, height, frameRect);

      ctx.fillStyle = realmId === 0 ? "rgba(10, 8, 6, 0.15)" : "rgba(10, 8, 6, 0.22)";
      ctx.fillRect(destX, destY, destW, destH);
      return true;
    }
    return false; // Chưa tải xong thì trả về false để dùng vẽ fallback
  }

  // Vẽ hình ảnh hoặc khung hình video bao phủ toàn màn hình chuẩn tỉ lệ (object-fit: cover) với độ nét cao nhất
  drawCover(ctx, media, w, h, frameRect = null) {
    const mw = media.videoWidth || media.naturalWidth || 1920;
    const mh = media.videoHeight || media.naturalHeight || 1080;

    const destX = frameRect ? frameRect.x : 0;
    const destY = frameRect ? frameRect.y : 0;
    const destW = frameRect ? frameRect.w : w;
    const destH = frameRect ? frameRect.h : h;

    if (!mw || !mh) {
      ctx.drawImage(media, destX, destY, destW, destH);
      return;
    }

    // Luôn bật chế độ làm mịn chất lượng cao (high quality bicubic filtering) cho video/background
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const scale = Math.max(destW / mw, destH / mh);
    const sw = destW / scale;
    const sh = destH / scale;
    const sx = (mw - sw) / 2;
    const sy = (mh - sh) / 2;
    ctx.drawImage(media, sx, sy, sw, sh, destX, destY, destW, destH);
  }

  // Vẽ Bàn trà cổ
  drawAncientTeaTable(ctx, cx, cy) {
    const tableImg = this.images.table_ancient_tea;
    if (tableImg && tableImg.complete && tableImg.naturalWidth > 0) {
      const w = 280;
      const h = (w / tableImg.naturalWidth) * tableImg.naturalHeight;
      // Bóng bàn
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.beginPath();
      ctx.ellipse(cx, cy + 20, w * 0.45, h * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.drawImage(tableImg, cx - w / 2, cy - h / 2, w, h);

      // Bộ ấm chén trà hoàng gia (Tea Ceremony Set 128x128) ngự trên mặt bàn
      const teaSetImg = this.images.tea_ceremony_set;
      if (teaSetImg && teaSetImg.complete && teaSetImg.naturalWidth > 0) {
        const setSize = 135;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(teaSetImg, cx - setSize / 2, cy - setSize / 2 - 12, setSize, setSize);
        ctx.imageSmoothingEnabled = true;
      }
      return true;
    }
    return false;
  }

  // Vẽ 1 Hộp trà danh trà từ assets/02_Tea_Temple_Hub/box_tea_X.png
  drawTeaBox(ctx, box, isHovered = false, time = 0) {
    const { x, y, name, color, id } = box;
    const pulse = Math.sin(time * 0.003 + id) * 5;
    const boxImg = this.images[`box_tea_${id}`];

    // Đĩa đệm phát quang phía dưới hộp trà để không bị chìm
    ctx.fillStyle = "rgba(35, 20, 11, 0.8)";
    ctx.beginPath();
    ctx.ellipse(x, y + 16, 44, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = isHovered ? "#ffd700" : "#8d5b2d";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Hào quang tỏa sáng mạnh
    const glowRadius = isHovered ? 54 + pulse : 42 + pulse;
    const glow = ctx.createRadialGradient(x, y, 6, x, y, glowRadius);
    glow.addColorStop(0, color);
    glow.addColorStop(0.6, "rgba(255, 215, 0, 0.35)");
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    const size = isHovered ? 86 : 74;
    const drawY = y - size / 2 - pulse * 0.5;

    if (boxImg && boxImg.complete && boxImg.naturalWidth > 0) {
      ctx.drawImage(boxImg, x - size / 2, drawY, size, size);

      if (isHovered) {
        ctx.strokeStyle = "#ffd700";
        ctx.lineWidth = 2.5;
        ctx.strokeRect(x - size / 2, drawY, size, size);
      }
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(x - size / 2, drawY, size, size);
    }

    // Khung thẻ tên danh trà sang trọng
    ctx.font = isHovered ? "bold 13.5px 'Cinzel', serif" : "12px 'Cinzel', serif";
    const textWidth = ctx.measureText(name).width;
    const tagW = Math.max(120, textWidth + 24);
    const tagH = 26;
    const tagY = y + 36;

    ctx.fillStyle = isHovered ? "rgba(60, 36, 18, 0.95)" : "rgba(32, 18, 9, 0.9)";
    ctx.strokeStyle = isHovered ? "#ffd700" : "#a88448";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x - tagW / 2, tagY, tagW, tagH, 6);
    } else {
      ctx.rect(x - tagW / 2, tagY, tagW, tagH);
    }
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isHovered ? "#ffd700" : "#f4ebd9";
    ctx.textAlign = "center";
    ctx.shadowColor = "#000";
    ctx.shadowBlur = 4;
    ctx.fillText(name, x, tagY + 17);
    ctx.shadowBlur = 0;
  }

  // Vẽ Vật thể tương tác lưu lời chúc từ markers mới hoặc item_node_X
  drawInteractiveNode(ctx, item, isHovered = false, time = 0) {
    const { screenX, screenY, name, color, wish } = item;
    const realmId = wish ? wish.realmId : 1;
    const itemImg = this.images[`marker_${realmId}`] || this.images[`item_node_${realmId}`];
    const pulse = Math.sin(time * 0.004 + (screenX % 10)) * 5;

    // 1. Đĩa ngọc tròn bán trong suốt làm nền tương phản (chống chìm vào background)
    const plateR = isHovered ? 38 : 32;
    ctx.fillStyle = "rgba(18, 12, 8, 0.88)";
    ctx.beginPath();
    ctx.arc(screenX, screenY - pulse * 0.4, plateR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = isHovered ? "#ffd700" : color;
    ctx.lineWidth = isHovered ? 3 : 2;
    ctx.stroke();

    // 2. Hào quang tỏa sáng rực rỡ xung quanh
    const glowR = plateR + 18 + pulse;
    const glow = ctx.createRadialGradient(screenX, screenY - pulse * 0.4, plateR * 0.4, screenX, screenY - pulse * 0.4, glowR);
    glow.addColorStop(0, color);
    glow.addColorStop(0.5, "rgba(255, 215, 0, 0.35)");
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(screenX, screenY - pulse * 0.4, glowR, 0, Math.PI * 2);
    ctx.fill();

    // 3. Icon symbol phóng to rõ ràng (60px - 72px)
    const iconSize = isHovered ? 68 : 58;
    const drawY = screenY - pulse * 0.4 - iconSize / 2;

    if (itemImg && itemImg.complete && itemImg.naturalWidth > 0) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(itemImg, screenX - iconSize / 2, drawY, iconSize, iconSize);
      ctx.imageSmoothingEnabled = true;
    } else {
      ctx.font = isHovered ? "36px sans-serif" : "30px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(item.icon, screenX, screenY - pulse * 0.4 + 10);
    }

    // 4. Khung thẻ tên người gửi nổi bật rõ ràng
    ctx.font = isHovered ? "bold 13px 'Noto Serif TC', serif" : "11.5px 'Noto Serif TC', serif";
    const textW = ctx.measureText(name).width;
    const badgeW = textW + 20;
    const badgeH = 24;
    const badgeY = screenY + plateR + 4;

    ctx.fillStyle = isHovered ? "rgba(60, 36, 18, 0.95)" : "rgba(26, 15, 8, 0.9)";
    ctx.strokeStyle = isHovered ? "#ffd700" : "#a88448";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(screenX - badgeW / 2, badgeY, badgeW, badgeH, 5);
    } else {
      ctx.rect(screenX - badgeW / 2, badgeY, badgeW, badgeH);
    }
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isHovered ? "#ffd700" : "#ffffff";
    ctx.textAlign = "center";
    ctx.shadowColor = "#000";
    ctx.shadowBlur = 4;
    ctx.fillText(name, screenX, badgeY + 16);
    ctx.shadowBlur = 0;
  }
}

// Khởi tạo đối tượng sprites toàn cục
window.gameSprites = new SpriteManager();
