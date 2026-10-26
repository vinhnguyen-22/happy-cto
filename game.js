/**
 * GAME ENGINE & REALMS RENDERER
 * Quản lý vòng lặp trò chơi 60 FPS, điều khiển nhân vật, particle system
 * và kết nối toàn bộ bộ assets hình ảnh pixel art chính thức vào 6 cõi trà!
 */

class GameEngine {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.currentRealmId = 0; // 0 = Trà Điện Nhất Tâm, 1..6 = Sáu Cõi
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Nhân vật người chơi
    this.player = {
      x: this.width / 2,
      y: this.height / 2 + 100,
      targetX: this.width / 2,
      targetY: this.height / 2 + 100,
      speed: 3.2,
      dir: 'down',
      isMoving: false,
      frame: 0,
      animTimer: 0
    };

    // Phím bấm
    this.keys = {};

    // 6 Hộp trà trong Trà Điện Nhất Tâm
    this.teaBoxes = [];
    this.hoveredTeaBox = null;
    this.hoveredInteractable = null;

    // Hạt hiệu ứng môi trường
    this.particles = [];
    this.fireworks = [];
    this.ambientTime = 0;

    // Các điểm tương tác của cõi hiện tại
    this.currentInteractables = [];

    // Hành động tương tác đang chờ (Nhân vật PHẢI DI CHUYỂN ĐẾN GẦN rồi mới kích hoạt)
    this.pendingAction = null; // { type: 'realm', box: ... } hoặc { type: 'interactable', item: ... }
    this.nearbyInteractable = null; // Vật thể/hộp trà đang ở ngay gần nhân vật (bán kính < 75px)
    this.promptRect = null; // Vùng click/chạm trực tiếp của banner prompt [E]
    this.hoveredPrompt = false;

    // Chế độ khung hình: '16:9' chuẩn tỉ lệ video HD hoặc 'cover' toàn màn hình
    this.aspectMode = '16:9';
    this.dpr = 1;
    this.frameRect = { x: 0, y: 0, w: this.width, h: this.height };

    // Animation chuyển cảnh
    this.isTransitioning = false;
    this.transitionAlpha = 0;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.setupInputHandlers();
    this.setupRealm(0); // Bắt đầu tại Trà Điện Nhất Tâm

    // Khởi chạy vòng lặp Game Loop
    requestAnimationFrame(time => this.gameLoop(time));
  }

  // Chuyển đổi giữa Khung hình 16:9 chuẩn (độ nét video cao nhất) và Toàn màn hình
  toggleAspectMode() {
    this.aspectMode = (this.aspectMode === '16:9') ? 'cover' : '16:9';
    this.resize();
    return this.aspectMode;
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Render canvas ở độ phân giải thực tế của màn hình (High-DPI / Retina)
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    // Tính toán khung hình 16:9 chuẩn độ phân giải video (1920x1080)
    if (this.aspectMode === '16:9') {
      const targetRatio = 16 / 9;
      const screenRatio = this.width / this.height;

      let fw, fh, fx, fy;
      if (screenRatio > targetRatio) {
        // Màn hình rộng (Ultrawide hoặc Desktop) -> Giữ chiều cao, co chiều ngang
        fh = this.height;
        fw = Math.round(fh * targetRatio);
        fx = Math.round((this.width - fw) / 2);
        fy = 0;
      } else {
        // Màn hình cao (Laptop 16:10, Tablet, Mobile) -> Giữ chiều ngang, co chiều cao
        fw = this.width;
        fh = Math.round(fw / targetRatio);
        fx = 0;
        fy = Math.round((this.height - fh) / 2);
      }
      this.frameRect = { x: fx, y: fy, w: fw, h: fh };
    } else {
      this.frameRect = { x: 0, y: 0, w: this.width, h: this.height };
    }

    this.updateTeaBoxesPositions();
    this.refreshCurrentInteractables();
  }

  // Thiết lập vị trí 6 hộp trà thành vòng tròn quanh bàn trà trong khung hình
  updateTeaBoxesPositions() {
    const cx = this.frameRect.x + this.frameRect.w / 2;
    const cy = this.frameRect.y + this.frameRect.h / 2 - 15;
    const radius = Math.min(this.frameRect.w, this.frameRect.h) * 0.25;

    this.teaBoxes = [
      { id: 1, name: "Cổ Mạch Phổ Nhĩ", dept: "Quản lý hạ tầng (IT.INF)", color: "#e67e22", angle: -Math.PI / 2 },
      { id: 2, name: "Thiên Công Ngọc Lộ", dept: "Phát triển phần mềm (IT.DEV)", color: "#2ecc71", angle: -Math.PI / 6 },
      { id: 3, name: "Trường Lưu Ban Trà", dept: "Vận hành nền tảng (IT.SDO)", color: "#f39c12", angle: Math.PI / 6 },
      { id: 4, name: "Huyền Giáp Quan Âm", dept: "Quản lý hạ tầng & ATTT", color: "#3498db", angle: Math.PI / 2 },
      { id: 5, name: "Vân Hành Tiên Trà", dept: "Giải pháp báo cáo (IT.DPI)", color: "#9b59b6", angle: 5 * Math.PI / 6 },
      { id: 6, name: "Tuyết Tâm Mạt Trà", dept: "Quản trị & Phân tích DL", color: "#e74c3c", angle: -5 * Math.PI / 6 }
    ].map(box => ({
      ...box,
      x: cx + Math.cos(box.angle) * radius,
      y: cy + Math.sin(box.angle) * (radius * 0.72)
    }));
  }

  // --- QUẢN LÝ PHÍM & CHUỘT / TOUCH ---
  setupInputHandlers() {
    window.addEventListener('keydown', e => {
      // Bỏ qua phím khi đang nhập liệu trong form (input, textarea, select)
      if (e.target && (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.isContentEditable)) {
        return;
      }

      const key = (e.key || '').toLowerCase();
      const code = (e.code || '').toLowerCase();
      const keyCode = e.keyCode || e.which || 0;

      this.keys[key] = true;
      if (code) this.keys[code] = true;

      // Hỗ trợ phím di chuyển (WASD + Mũi tên) kể cả khi gõ tiếng Việt UniKey / EVKey
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', 'ư', 'ơ', 'â', 'ă', 'đ'].includes(key) ||
          ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'keyw', 'keya', 'keys', 'keyd'].includes(code)) {
        e.preventDefault();
      }

      // Phím tương tác: E, Space, Enter hoặc F khi đứng gần vật thể (hỗ trợ cả bộ gõ tiếng Việt UniKey, EVKey, CapsLock)
      const isInteractKey = (
        key === 'e' || key === 'ê' || key === 'é' || key === 'è' || key === 'ẻ' || key === 'ẽ' || key === 'ẹ' ||
        code === 'keye' || keyCode === 69 ||
        key === ' ' || code === 'space' || keyCode === 32 ||
        key === 'enter' || code === 'enter' || code === 'numpadenter' || keyCode === 13 ||
        key === 'f' || code === 'keyf' || keyCode === 70
      );

      if (isInteractKey) {
        const dialogueBox = document.getElementById('dialogue-box');
        const hasDialogue = dialogueBox && !dialogueBox.classList.contains('hidden');

        if (this.nearbyInteractable || hasDialogue) {
          e.preventDefault();
        }
        this.handleInteractKey();
      }
    });

    window.addEventListener('keyup', e => {
      if (e.target && (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.isContentEditable)) {
        return;
      }
      const key = (e.key || '').toLowerCase();
      const code = (e.code || '').toLowerCase();
      this.keys[key] = false;
      if (code) this.keys[code] = false;
    });

    // Helper chuẩn hóa tọa độ click/touch theo tỉ lệ kích thước canvas thực tế
    const getCanvasCoords = (clientX, clientY) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.width / (rect.width || 1);
      const scaleY = this.height / (rect.height || 1);
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
      };
    };

    let lastTouchTime = 0;

    // Click di chuyển hoặc tương tác
    this.canvas.addEventListener('click', e => {
      // Bỏ qua synthetic click phát sinh ngay sau touch
      if (Date.now() - lastTouchTime < 400) return;
      const coords = getCanvasCoords(e.clientX, e.clientY);
      this.handleClickAt(coords.x, coords.y);
    });

    // Touch / Tap hỗ trợ cảm ứng màn hình
    this.canvas.addEventListener('touchstart', e => {
      if (e.touches && e.touches.length > 0) {
        lastTouchTime = Date.now();
        const touch = e.touches[0];
        const coords = getCanvasCoords(touch.clientX, touch.clientY);
        this.handleClickAt(coords.x, coords.y);
      }
    }, { passive: true });

    // Hover để đổi con trỏ chuột
    this.canvas.addEventListener('mousemove', e => {
      const coords = getCanvasCoords(e.clientX, e.clientY);
      this.checkHover(coords.x, coords.y);
    });

    // Virtual Dpad cho Mobile
    document.querySelectorAll('.dpad-btn').forEach(btn => {
      const dir = btn.dataset.dir;
      const keyMap = { up: 'arrowup', down: 'arrowdown', left: 'arrowleft', right: 'arrowright' };
      btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.keys[keyMap[dir]] = true;
      });
      btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.keys[keyMap[dir]] = false;
      });
      btn.addEventListener('click', (e) => {
        e.preventDefault();
      });
    });

    // Nút tương tác nhanh trên Mobile / Tablet
    const virtualActionBtn = document.getElementById('virtual-action-btn');
    if (virtualActionBtn) {
      const triggerAction = (e) => {
        e.preventDefault();
        window.gameAudio.playClick();
        this.handleInteractKey();
      };
      virtualActionBtn.addEventListener('click', triggerAction);
      virtualActionBtn.addEventListener('touchstart', triggerAction, { passive: false });
    }
  }

  checkHover(x, y) {
    // 1. Kiểm tra hover vào prompt banner [E] đang nổi
    if (this.promptRect &&
        x >= this.promptRect.x && x <= this.promptRect.x + this.promptRect.w &&
        y >= this.promptRect.y && y <= this.promptRect.y + this.promptRect.h) {
      this.hoveredPrompt = true;
      this.canvas.style.cursor = 'pointer';
      return;
    }
    this.hoveredPrompt = false;

    if (this.currentRealmId === 0) {
      this.hoveredTeaBox = this.teaBoxes.find(b => {
        const dist = Math.hypot(b.x - x, b.y - y);
        const inLabel = Math.abs(x - b.x) <= 65 && y >= b.y - 65 && y <= b.y + 35;
        return dist < 55 || inLabel;
      }) || null;
      this.hoveredInteractable = null;
      this.canvas.style.cursor = this.hoveredTeaBox ? 'pointer' : 'crosshair';
    } else {
      this.hoveredTeaBox = null;
      this.hoveredInteractable = this.currentInteractables.find(item => {
        const dist = Math.hypot(item.screenX - x, item.screenY - y);
        const inBadge = Math.abs(x - item.screenX) <= 85 && y >= item.screenY + 15 && y <= item.screenY + 65;
        const inTop = Math.abs(x - item.screenX) <= 120 && y >= item.screenY - 65 && y <= item.screenY - 25;
        return dist < (item.radius || 46) || inBadge || inTop;
      }) || null;
      this.canvas.style.cursor = this.hoveredInteractable ? 'pointer' : 'crosshair';
    }
  }

  // Xử lý Click: Tương tác tức thì nếu bấm vào Prompt [E] hoặc khi đã đứng gần, di chuyển nếu ở xa!
  handleClickAt(x, y) {
    if (this.isTransitioning) return;

    // 0. ƯU TIÊN 1: Click trực tiếp vào Banner phím [E] đang hiển thị
    if (this.promptRect &&
        x >= this.promptRect.x - 25 && x <= this.promptRect.x + this.promptRect.w + 25 &&
        y >= this.promptRect.y - 18 && y <= this.promptRect.y + this.promptRect.h + 18) {
      this.executeAction(this.promptRect.action);
      return;
    }

    // 0.1 ƯU TIÊN 2: Nếu nhân vật ĐÃ ĐỨNG CẠNH vật thể (nearbyInteractable)
    // Người dùng bấm vào bất cứ phần nào: vật thể, vòng sáng, thẻ tên, hoặc chính nhân vật
    if (this.nearbyInteractable) {
      let targetX = 0, targetY = 0;
      if (this.nearbyInteractable.type === 'realm') {
        targetX = this.nearbyInteractable.box.x;
        targetY = this.nearbyInteractable.box.y;
      } else if (this.nearbyInteractable.type === 'interactable') {
        targetX = this.nearbyInteractable.item.screenX;
        targetY = this.nearbyInteractable.item.screenY;
      }
      const distToNearby = Math.hypot(targetX - x, targetY - y);
      const inBoxX = Math.abs(x - targetX) <= 140;
      const inBoxY = y >= targetY - 95 && y <= targetY + 85;

      // Click vào chính nhân vật đang đứng cạnh vật thể cũng kích hoạt tương tác
      const distToPlayer = Math.hypot(this.player.x - x, this.player.y - y);
      const inPlayerBox = Math.abs(x - this.player.x) <= 55 && y >= this.player.y - 110 && y <= this.player.y + 25;

      if (distToNearby <= 85 || (inBoxX && inBoxY) || distToPlayer <= 55 || inPlayerBox) {
        this.executeAction(this.nearbyInteractable);
        return;
      }
    }

    if (this.currentRealmId === 0) {
      // 1. Kiểm tra click vào Bàn Trà Cổ & Bộ Ấm Chén trung tâm
      const cx = this.frameRect.x + this.frameRect.w / 2;
      const cy = this.frameRect.y + this.frameRect.h / 2 - 15;
      const distToCenter = Math.hypot(cx - x, cy - y);
      if (distToCenter <= 85) {
        this.player.targetX = cx;
        this.player.targetY = cy + 45;
        this.player.x = cx;
        this.player.y = cy + 45;
        this.pendingAction = null;
        this.executeAction({ type: 'central_table' });
        return;
      }

      // 2. Kiểm tra click vào 1 trong 6 Hộp Trà
      const clickedBox = this.teaBoxes.find(b => {
        const dist = Math.hypot(b.x - x, b.y - y);
        const inLabel = Math.abs(x - b.x) <= 85 && y >= b.y - 75 && y <= b.y + 45;
        return dist < 68 || inLabel;
      });
      if (clickedBox) {
        this.player.targetX = clickedBox.x;
        this.player.targetY = clickedBox.y + 35;
        this.player.x = clickedBox.x;
        this.player.y = clickedBox.y + 35;
        this.pendingAction = null;
        this.executeAction({ type: 'realm', box: clickedBox });
        return;
      }
    } else {
      // 2. Trong 6 Cõi Trà: Kiểm tra click vào Vật thể tương tác / Nút thêm lời chúc
      const clickedItem = this.currentInteractables.find(item => {
        const dist = Math.hypot(item.screenX - x, item.screenY - y);
        const inItemBox = Math.abs(x - item.screenX) <= 90 && y >= item.screenY - 85 && y <= item.screenY + 80;
        return dist < (item.radius ? item.radius + 15 : 60) || inItemBox;
      });
      if (clickedItem) {
        this.player.targetX = clickedItem.screenX;
        this.player.targetY = clickedItem.screenY + 35;
        this.player.x = clickedItem.screenX;
        this.player.y = clickedItem.screenY + 35;
        this.pendingAction = null;
        this.executeAction({ type: 'interactable', item: clickedItem });
        return;
      }
    }

    // 3. Click vào sàn trống tự do: Hủy hành động chờ và chỉ di chuyển nhân vật tới điểm chỉ định
    this.pendingAction = null;
    const minX = this.frameRect.x + 30;
    const maxX = this.frameRect.x + this.frameRect.w - 30;
    const minY = this.frameRect.y + 75;
    const maxY = this.frameRect.y + this.frameRect.h - 75;
    this.player.targetX = Math.max(minX, Math.min(maxX, x));
    this.player.targetY = Math.max(minY, Math.min(maxY, y));
  }

  // Thực thi hành động tương tác khi đã đến đích
  executeAction(action) {
    if (!action) return;

    if (action.type === 'realm') {
      window.gameAudio.playClick();
      window.gameAudio.playBell();
      this.switchRealm(action.box.id);
    } else if (action.type === 'central_table') {
      window.gameAudio.playClick();
      window.gameAudio.playBell();
      if (window.uiManager) {
        window.uiManager.openGrandFinaleModal();
      }
    } else if (action.type === 'interactable') {
      window.gameAudio.playClick();
      if (action.item.isLeadNPC) {
        if (action.item.leadInfo) {
          if (window.uiManager && window.uiManager.showLeadDialogue) {
            window.uiManager.showLeadDialogue(action.item.leadInfo);
          } else if (window.uiManager) {
            window.uiManager.showRealmDialogue(this.currentRealmId);
          }
        } else if (window.uiManager) {
          window.uiManager.showRealmDialogue(this.currentRealmId);
        }
      } else if (action.item.isChallengeAltar) {
        if (window.miniGameManager) {
          window.miniGameManager.openGame(action.item.realmId);
        }
      } else if (action.item.isNextRealmDoor) {
        window.gameAudio.playDoorOpen();
        window.gameAudio.playFanfare();
        if (action.item.nextRealmId === 0) {
          // Đã vượt qua cả 6 cõi trà -> Cửa dẫn về Trà Điện Nhất Tâm và khai mở Đại Cảnh Sinh Nhật
          this.switchRealm(0);
          setTimeout(() => {
            if (window.uiManager) window.uiManager.openGrandFinaleModal();
          }, 700);
        } else {
          this.switchRealm(action.item.nextRealmId, 'left');
        }
      } else if (action.item.isAddButton) {
        if (window.uiManager && window.uiManager.openWishStudio) {
          window.uiManager.openWishStudio(this.currentRealmId);
        } else if (window.uiManager) {
          window.uiManager.openAddWishModal(this.currentRealmId);
        }
      } else if (action.item.wish) {
        window.uiManager.openViewWishModal(action.item.wish);
      }
    }
  }

  // Kiểm tra nhân vật có đang đứng cạnh / chạm vào mục tiêu không (tính theo toàn bộ hình thể nhân vật 116x174 px - oai phong bằng NPC)
  isPlayerNearTarget(targetX, targetY, targetRadius = 46) {
    const pcx = this.player.x;
    const pcy = this.player.y - 70; // Tâm thân người chơi

    const distCenter = Math.hypot(pcx - targetX, pcy - targetY);
    const distFeet = Math.hypot(this.player.x - targetX, this.player.y - targetY);

    // Khoảng cách từ mép bounding box sprite nhân vật đến tâm vật thể
    const dx = Math.max(0, Math.abs(this.player.x - targetX) - 58);
    const dy = (targetY < this.player.y - 150)
      ? (this.player.y - 150 - targetY)
      : (targetY > this.player.y + 16 ? targetY - (this.player.y + 16) : 0);
    const distBox = Math.hypot(dx, dy);

    // Tiếp xúc khi tâm thân trong 155px, chân trong 145px, hoặc mép sprite chạm mép vật thể
    return (distCenter <= 155 || distFeet <= 145 || distBox <= (targetRadius + 55));
  }

  // Tương tác bằng phím bấm (E / Enter / Space) khi đứng gần vật thể hoặc để đọc tiếp thoại
  handleInteractKey() {
    if (this.isTransitioning) return;

    // 1. Cập nhật lại ngay tức thì trạng thái gần vật thể
    if (!this.nearbyInteractable) {
      this.updateNearbyInteractable();
    }

    // 2. ƯU TIÊN SỐ 1: Nếu người chơi đang đứng gần vật thể / hộp trà -> MỞ VẬT THỂ NGAY!
    // Đồng thời tự động đóng hộp thoại dẫn chuyện nếu đang mở để hiển thị modal rõ ràng
    if (this.nearbyInteractable) {
      const dialogueBox = document.getElementById('dialogue-box');
      if (dialogueBox && !dialogueBox.classList.contains('hidden')) {
        dialogueBox.classList.add('hidden');
        if (window.uiManager && window.uiManager.typingTimer) {
          clearInterval(window.uiManager.typingTimer);
          window.uiManager.typingTimer = null;
        }
      }
      this.executeAction(this.nearbyInteractable);
      return;
    }

    // 3. ƯU TIÊN SỐ 2: Nếu KHÔNG đứng gần vật thể nào mà đang có hộp thoại người dẫn chuyện -> Đọc tiếp hoặc đóng thoại
    const dialogueBox = document.getElementById('dialogue-box');
    if (dialogueBox && !dialogueBox.classList.contains('hidden')) {
      if (window.uiManager) {
        window.gameAudio.playClick();
        window.uiManager.advanceDialogue();
      }
      return;
    }
  }

  // Đi bộ đến Hộp Trà từ thanh công cụ bên dưới
  walkToRealmBox(realmId) {
    if (this.isTransitioning) return;
    const targetBox = this.teaBoxes.find(b => b.id === realmId);
    if (!targetBox) return;

    const dist = Math.hypot(this.player.x - targetBox.x, this.player.y - targetBox.y);
    if (dist <= 65) {
      this.executeAction({ type: 'realm', box: targetBox });
    } else {
      const angle = Math.atan2(this.player.y - targetBox.y, this.player.x - targetBox.x);
      const minX = this.frameRect.x + 35;
      const maxX = this.frameRect.x + this.frameRect.w - 35;
      const minY = this.frameRect.y + 80;
      const maxY = this.frameRect.y + this.frameRect.h - 80;
      this.player.targetX = Math.max(minX, Math.min(maxX, targetBox.x + Math.cos(angle) * 42));
      this.player.targetY = Math.max(minY, Math.min(maxY, targetBox.y + Math.sin(angle) * 42));
      this.pendingAction = { type: 'realm', box: targetBox };
      window.gameAudio.playStep();
    }
  }

  // --- THIẾT LẬP VÀ CHUYỂN CẢNH ---
  switchRealm(realmId, spawnSide = null) {
    if (this.isTransitioning || this.currentRealmId === realmId) return;
    this.isTransitioning = true;
    this.transitionAlpha = 0;

    window.gameAudio.playDoorOpen();

    let fadingOut = true;
    const fadeInterval = setInterval(() => {
      if (fadingOut) {
        this.transitionAlpha += 0.08;
        if (this.transitionAlpha >= 1) {
          this.transitionAlpha = 1;
          fadingOut = false;
          this.setupRealm(realmId, spawnSide);
        }
      } else {
        this.transitionAlpha -= 0.08;
        if (this.transitionAlpha <= 0) {
          this.transitionAlpha = 0;
          this.isTransitioning = false;
          clearInterval(fadeInterval);
        }
      }
    }, 25);
  }

  setupRealm(realmId, spawnSide = null) {
    this.currentRealmId = realmId;
    this.pendingAction = null;
    this.nearbyInteractable = null;
    this.particles = [];

    // Vị trí xuất hiện của nhân vật (nếu bước qua cửa từ cõi trước thì xuất hiện từ bên trái)
    if (realmId !== 0 && spawnSide === 'left') {
      this.player.x = this.frameRect.x + this.frameRect.w * 0.16;
      this.player.y = this.frameRect.y + this.frameRect.h * 0.58;
    } else {
      this.player.x = this.frameRect.x + this.frameRect.w / 2;
      this.player.y = this.frameRect.y + this.frameRect.h / 2 + (realmId === 0 ? 35 : 55);
    }
    this.player.targetX = this.player.x;
    this.player.targetY = this.player.y;

    // Kích hoạt video nền động tương ứng cho cõi này (và dừng các cõi khác)
    if (window.gameSprites) {
      window.gameSprites.playRealmVideo(realmId);
    }

    const realmInfo = REALMS_DATA[realmId];
    window.uiManager.updateRealmInfo(realmInfo);

    if (window.miniGameManager) {
      window.miniGameManager.updateHUD();
    }

    this.refreshCurrentInteractables();
    this.initRealmParticles(realmId);

    // Nút Thử Thách trên HUD: hiển thị cho cả 6 cõi trà
    const isChallengeRealm = (realmId >= 1 && realmId <= 6);
    const challengeBtn = document.getElementById('btn-realm-challenge');
    if (challengeBtn) {
      challengeBtn.style.display = isChallengeRealm ? 'inline-flex' : 'none';
    }

    window.uiManager.showRealmDialogue(realmId);
  }

  refreshCurrentInteractables() {
    if (this.currentRealmId === 0) {
      this.currentInteractables = [];
      return;
    }

    const wishes = window.wishStorage.getWishesByRealm(this.currentRealmId);
    const realmData = REALMS_DATA[this.currentRealmId];
    const items = [];

    // Trưởng Phòng NPC của cõi hiện tại (Đứng trực tiếp trong màn chơi để chào đón người chơi)
    if (this.currentRealmId >= 1 && this.currentRealmId <= 6 && realmData) {
      if (realmData.leads && Array.isArray(realmData.leads)) {
        // Cõi có nhiều Trưởng phòng cùng xuất hiện (Cõi 3: Anh Kiệt LPS & Anh Kiên Lê SCEX)
        realmData.leads.forEach(ld => {
          const lPos = ld.pos || { x: 0.22, y: 0.65 };
          const npcX = this.frameRect.x + this.frameRect.w * lPos.x;
          const npcY = this.frameRect.y + this.frameRect.h * lPos.y;
          items.push({
            id: `lead-npc-${ld.id || ld.shortName}`,
            isLeadNPC: true,
            realmId: this.currentRealmId,
            leadInfo: ld,
            leadName: ld.name,
            leadShortName: ld.shortName,
            leadRole: ld.role || "Trưởng Phòng",
            leadSpriteKey: ld.spriteKey,
            leadPortraitKey: ld.portraitKey,
            screenX: npcX,
            screenY: npcY,
            radius: 68,
            name: ld.shortName || ld.name,
            color: realmData.color,
            icon: "👤"
          });
        });
      } else if (realmData.leadName) {
        // Cõi có 1 Trưởng phòng đại diện (Cõi 1: Anh Bảo, Cõi 2: Anh Thạnh, Cõi 4: Anh Bảo, Cõi 5: Chị Hiền, Cõi 6: Anh Tuyên)
        const lPos = realmData.leadPos || { x: 0.15, y: 0.74 };
        const npcX = this.frameRect.x + this.frameRect.w * lPos.x;
        const npcY = this.frameRect.y + this.frameRect.h * lPos.y;
        items.push({
          id: `lead-npc-${this.currentRealmId}`,
          isLeadNPC: true,
          realmId: this.currentRealmId,
          leadName: realmData.leadName,
          leadShortName: realmData.leadName.split('-')[0].trim(),
          leadRole: realmData.leadRole || "Trưởng Phòng",
          leadSpriteKey: (this.currentRealmId === 1 || this.currentRealmId === 4) ? 'lead_sprite_bao' : `lead_sprite_${this.currentRealmId}`,
          leadPortraitKey: (this.currentRealmId === 1 || this.currentRealmId === 4) ? 'lead_portrait_bao' : `lead_portrait_${this.currentRealmId}`,
          screenX: npcX,
          screenY: npcY,
          radius: 68,
          name: realmData.leadName,
          color: realmData.color,
          icon: "👤"
        });
      }
    }

    // Đài Thử Thách Mini-Game cho tất cả 6 cõi trà (1 -> 6)
    if (this.currentRealmId >= 1 && this.currentRealmId <= 6) {
      const isDone = window.miniGameManager ? window.miniGameManager.isCompleted(this.currentRealmId) : false;
      const altarColor = isDone ? "#2ecc71" : realmData.color;
      items.push({
        id: `challenge-altar-${this.currentRealmId}`,
        isChallengeAltar: true,
        realmId: this.currentRealmId,
        isCompleted: isDone,
        screenX: this.frameRect.x + this.frameRect.w * 0.5,
        screenY: this.frameRect.y + this.frameRect.h * 0.26,
        radius: 46,
        name: isDone ? "Nhiệm Vụ: Đã Hoàn Thành ✓" : "Nhiệm Vụ: Thử Thách Cõi Trà",
        color: altarColor,
        icon: isDone ? "🏆" : "🎮"
      });
    }

    // Các điểm lời chúc hiện có (được neo chuẩn theo khung hình 16:9)
    wishes.forEach((wish) => {
      const screenX = this.frameRect.x + this.frameRect.w * wish.posX;
      const screenY = this.frameRect.y + this.frameRect.h * wish.posY;
      items.push({
        id: wish.id,
        wish: wish,
        screenX: screenX,
        screenY: screenY,
        radius: 44,
        name: wish.author,
        color: realmData.color,
        icon: realmData.interactableIcon,
        isAddButton: false
      });
    });



    // CỔNG CHUYỂN CÕI (CỬA QUA MÀN TIẾP THEO)
    // Sau khi làm xong nhiệm vụ cõi này, cửa mở để bước sang màn khác
    const nextRealmId = (this.currentRealmId === 6) ? 0 : this.currentRealmId + 1;
    const nextRealmData = REALMS_DATA[nextRealmId] || { name: "Trà Điện Nhất Tâm", color: "#ffd700" };
    const isTaskDone = window.miniGameManager ? window.miniGameManager.isCompleted(this.currentRealmId) : false;
    const challengeCfg = (typeof MINIGAME_CONFIG !== 'undefined' && MINIGAME_CONFIG[this.currentRealmId])
      ? MINIGAME_CONFIG[this.currentRealmId]
      : { title: "Thử Thách Cõi Trà" };

    items.push({
      id: `door-next-realm-${this.currentRealmId}`,
      isNextRealmDoor: true,
      isLocked: false,
      realmId: this.currentRealmId,
      nextRealmId: nextRealmId,
      nextRealmName: nextRealmData.name,
      challengeTitle: challengeCfg.title,
      screenX: this.frameRect.x + this.frameRect.w * 0.88,
      screenY: this.frameRect.y + this.frameRect.h * 0.56,
      radius: 68,
      name: `Cổng Qua Cõi: ${nextRealmData.name}`,
      color: "#ffd700",
      icon: "🚪"
    });

    this.currentInteractables = items;
  }

  walkToNextRealmDoor() {
    const door = this.currentInteractables.find(it => it.isNextRealmDoor);
    if (door) {
      this.player.targetX = door.screenX;
      this.player.targetY = door.screenY + 45;
    }
  }

  initRealmParticles(realmId) {
    this.particles = [];
    const count = 38;
    const realmParticleTypes = {
      0: ['particle_tea_leaf', 'particle_gold_sparkle'],
      1: ['particle_data_bit', 'particle_gold_sparkle'],
      2: ['particle_tea_leaf', 'particle_data_bit'],
      3: ['particle_maple_leaf', 'particle_gold_sparkle'],
      4: ['particle_data_bit', 'particle_gold_sparkle'],
      5: ['particle_tea_leaf', 'particle_gold_sparkle'],
      6: ['particle_maple_leaf', 'particle_data_bit', 'particle_gold_sparkle']
    };

    const types = realmParticleTypes[realmId] || ['particle_gold_sparkle'];

    for (let i = 0; i < count; i++) {
      const typeKey = types[i % types.length];
      this.particles.push({
        type: typeKey,
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 1.1,
        vy: 0.45 + Math.random() * 0.9,
        size: 14 + Math.floor(Math.random() * 8), // 14-22px
        alpha: 0.35 + Math.random() * 0.55,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.035,
        wobbleSpeed: 0.002 + Math.random() * 0.003,
        wobbleOffset: Math.random() * Math.PI * 2
      });
    }
  }

  // --- CẬP NHẬT TRẠNG THÁI (UPDATE) ---
  update(time) {
    this.ambientTime = time;

    let moveX = 0;
    let moveY = 0;

    if (this.keys['w'] || this.keys['keyw'] || this.keys['arrowup'] || this.keys['ư'] || this.keys['ơ']) { moveY -= 1; this.player.dir = 'up'; }
    if (this.keys['s'] || this.keys['keys'] || this.keys['arrowdown']) { moveY += 1; this.player.dir = 'down'; }
    if (this.keys['a'] || this.keys['keya'] || this.keys['arrowleft'] || this.keys['â'] || this.keys['ă']) { moveX -= 1; this.player.dir = 'left'; }
    if (this.keys['d'] || this.keys['keyd'] || this.keys['arrowright'] || this.keys['đ']) { moveX += 1; this.player.dir = 'right'; }

    if (moveX !== 0 || moveY !== 0) {
      // Khi người dùng tự điều khiển bằng bàn phím -> Hủy hành động tự động bước tới
      this.pendingAction = null;

      // Tự động khép hộp thoại dẫn chuyện khi người chơi bắt đầu di chuyển để màn hình thông thoáng
      const dialogueBox = document.getElementById('dialogue-box');
      if (dialogueBox && !dialogueBox.classList.contains('hidden')) {
        dialogueBox.classList.add('hidden');
        if (window.uiManager && window.uiManager.typingTimer) {
          clearInterval(window.uiManager.typingTimer);
          window.uiManager.typingTimer = null;
        }
      }

      const len = Math.hypot(moveX, moveY);
      this.player.x += (moveX / len) * this.player.speed;
      this.player.y += (moveY / len) * this.player.speed;
      this.player.targetX = this.player.x;
      this.player.targetY = this.player.y;
      this.player.isMoving = true;
    } else {
      const dx = this.player.targetX - this.player.x;
      const dy = this.player.targetY - this.player.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 4) {
        this.player.isMoving = true;
        this.player.x += (dx / dist) * this.player.speed;
        this.player.y += (dy / dist) * this.player.speed;

        if (Math.abs(dx) > Math.abs(dy)) {
          this.player.dir = dx > 0 ? 'right' : 'left';
        } else {
          this.player.dir = dy > 0 ? 'down' : 'up';
        }
      } else {
        this.player.isMoving = false;
      }
    }

    const minPX = this.frameRect.x + 40;
    const maxPX = this.frameRect.x + this.frameRect.w - 40;
    const minPY = this.frameRect.y + 110;
    const maxPY = this.frameRect.y + this.frameRect.h - 55;
    this.player.x = Math.max(minPX, Math.min(maxPX, this.player.x));
    this.player.y = Math.max(minPY, Math.min(maxPY, this.player.y));

    // --- KIỂM TRA HÀNH ĐỘNG ĐANG CHỜ (ĐẾN GẦN ITEMS MỚI CHUYỂN CẢNH / TƯƠNG TÁC) ---
    if (this.pendingAction) {
      let objX = 0, objY = 0, objRadius = 46;
      if (this.pendingAction.type === 'realm') {
        objX = this.pendingAction.box.x;
        objY = this.pendingAction.box.y;
        objRadius = 48;
      } else if (this.pendingAction.type === 'central_table') {
        objX = this.frameRect.x + this.frameRect.w / 2;
        objY = this.frameRect.y + this.frameRect.h / 2 - 15;
        objRadius = 68;
      } else if (this.pendingAction.type === 'interactable') {
        objX = this.pendingAction.item.screenX;
        objY = this.pendingAction.item.screenY;
        objRadius = this.pendingAction.item.radius || 46;
      }

      const isNear = this.isPlayerNearTarget(objX, objY, objRadius);
      const distToTarget = Math.hypot(this.player.targetX - this.player.x, this.player.targetY - this.player.y);

      // Khi nhân vật đã đến đủ gần HOẶC đã bước tới sát đích (distToTarget <= 6px) -> Dừng bước và kích hoạt tương tác ngay!
      if (isNear || distToTarget <= 6) {
        this.player.isMoving = false;
        this.player.targetX = this.player.x;
        this.player.targetY = this.player.y;
        const action = this.pendingAction;
        this.pendingAction = null;
        this.executeAction(action);
      }
    }

    // --- CẬP NHẬT VẬT THỂ Ở GẦN ĐỂ HIỂN THỊ GỢI Ý PHÍM [E] HOẶC CHẠM ---
    this.updateNearbyInteractable();

    // Animation 4 frame theo player_spritesheet.png
    if (this.player.isMoving) {
      this.player.animTimer += 1;
      if (this.player.animTimer % 7 === 0) {
        this.player.frame = (this.player.frame + 1) % 4;
        if (this.player.frame !== 0 && Math.random() > 0.5) {
          window.gameAudio.playStep();
        }
      }
    } else {
      this.player.frame = 0;
    }

    // Hạt môi trường lơ lửng
    this.particles.forEach(p => {
      p.x += p.vx + Math.sin(time * p.wobbleSpeed + p.wobbleOffset) * 0.45;
      p.y += p.vy;
      p.rot += p.vRot;
      if (p.y > this.height + 20) { p.y = -20; p.x = Math.random() * this.width; }
      if (p.x < -20) p.x = this.width + 20;
      if (p.x > this.width + 20) p.x = -20;
    });

    // Pháo hoa
    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      const fw = this.fireworks[i];
      fw.life -= 0.02;
      fw.x += fw.vx;
      fw.y += fw.vy;
      fw.vy += 0.05;
      if (fw.life <= 0) {
        this.fireworks.splice(i, 1);
      }
    }
  }

  // Cập nhật xem nhân vật có đang đứng gần / chạm vào vật thể nào không
  updateNearbyInteractable() {
    this.nearbyInteractable = null;
    if (this.isTransitioning) {
      this.updateVirtualActionBtn();
      return;
    }

    if (this.currentRealmId === 0) {
      let bestTarget = null;
      let minDistance = Infinity;

      for (const box of this.teaBoxes) {
        if (this.isPlayerNearTarget(box.x, box.y, 48)) {
          const d = Math.hypot(this.player.x - box.x, (this.player.y - 42) - box.y);
          if (d < minDistance) {
            minDistance = d;
            bestTarget = { type: 'realm', box: box };
          }
        }
      }

      // Kiểm tra Bàn Trà Cổ & Bộ Ấm Chén ngay trên background giữa phòng
      const cx = this.frameRect.x + this.frameRect.w / 2;
      const cy = this.frameRect.y + this.frameRect.h / 2 - 15;
      if (this.isPlayerNearTarget(cx, cy, 68)) {
        const d = Math.hypot(this.player.x - cx, (this.player.y - 42) - cy);
        if (d < minDistance) {
          minDistance = d;
          bestTarget = { type: 'central_table', name: 'Bàn Trà Nhất Tâm', cx, cy };
        }
      }

      this.nearbyInteractable = bestTarget;
    } else {
      let bestItem = null;
      let minDistance = Infinity;

      for (const item of this.currentInteractables) {
        const itemR = item.radius || 46;
        if (this.isPlayerNearTarget(item.screenX, item.screenY, itemR)) {
          const d = Math.hypot(this.player.x - item.screenX, (this.player.y - 42) - item.screenY);
          if (d < minDistance) {
            minDistance = d;
            bestItem = item;
          }
        }
      }

      if (bestItem) {
        this.nearbyInteractable = { type: 'interactable', item: bestItem };
      }
    }

    this.updateVirtualActionBtn();
  }

  updateVirtualActionBtn() {
    const vBtn = document.getElementById('virtual-action-btn');
    if (!vBtn) return;
    if (this.nearbyInteractable && !this.pendingAction) {
      vBtn.classList.add('active');
      const label = vBtn.querySelector('.v-btn-label');
      if (label) {
        if (this.nearbyInteractable.type === 'realm') {
          label.textContent = "VÀO CÕI";
        } else if (this.nearbyInteractable.type === 'central_table') {
          label.textContent = "THƯỞNG TRÀ";
        } else if (this.nearbyInteractable.item && this.nearbyInteractable.item.isNextRealmDoor) {
          label.textContent = "BƯỚC QUA";
        } else if (this.nearbyInteractable.item && this.nearbyInteractable.item.isChallengeAltar) {
          label.textContent = "THỬ THÁCH";
        } else if (this.nearbyInteractable.item && this.nearbyInteractable.item.isAddButton) {
          label.textContent = "GHI CHÚC";
        } else {
          label.textContent = "LĨNH HỘI";
        }
      }
    } else {
      vBtn.classList.remove('active');
    }
  }

  // Bắn chùm pháo hoa chúc mừng
  spawnFireworks() {
    window.gameAudio.playFirework();
    const colors = ["#ffd700", "#ff4757", "#2ed573", "#1e90ff", "#ffa502", "#e056fd"];
    for (let burst = 0; burst < 3; burst++) {
      const cx = this.width * (0.2 + Math.random() * 0.6);
      const cy = this.height * (0.2 + Math.random() * 0.4);
      const burstColor = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = 2 + Math.random() * 6;
        this.fireworks.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          color: burstColor,
          size: 2 + Math.random() * 4,
          life: 1.0
        });
      }
    }
  }

  // --- VẼ TOÀN BỘ KHÔNG GIAN (RENDER) ---
  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    switch (this.currentRealmId) {
      case 0: this.renderRealm0(); break;
      case 1: this.renderRealm1(); break;
      case 2: this.renderRealm2(); break;
      case 3: this.renderRealm3(); break;
      case 4: this.renderRealm4(); break;
      case 5: this.renderRealm5(); break;
      case 6: this.renderRealm6(); break;
    }

    // Vẽ điểm đến mục tiêu đang di chuyển tới (Waypoint target indicator)
    this.renderPendingActionMarker();

    // Vẽ các điểm tương tác (Lá, hoa, khiên, hạc...)
    this.renderInteractables();

    // Vẽ hạt môi trường lơ lửng (lá trà, lá phong, hạt dữ liệu, bụi vàng kim)
    this.renderParticles();

    // Vẽ nhân vật người chơi
    this.renderPlayer();

    // Vẽ khung gợi ý phím [E] / chạm khi đứng gần vật thể
    this.renderNearbyPrompt();

    // Vẽ pháo hoa
    this.renderFireworks();

    // Viền khung hình Cinematic 16:9 sắc nét (khi màn hình không đúng tỉ lệ 16:9)
    this.renderCinematicBorders();

    // Chuyển cảnh
    if (this.transitionAlpha > 0) {
      this.ctx.fillStyle = `rgba(16, 13, 10, ${this.transitionAlpha})`;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
  }

  // Vẽ điểm chỉ dẫn đích đến khi nhân vật đang tự động bước tới
  renderPendingActionMarker() {
    if (!this.pendingAction) return;

    let tx = 0, ty = 0, color = "#ffd700";
    if (this.pendingAction.type === 'realm') {
      tx = this.pendingAction.box.x;
      ty = this.pendingAction.box.y;
      color = this.pendingAction.box.color || "#ffd700";
    } else if (this.pendingAction.type === 'interactable') {
      tx = this.pendingAction.item.screenX;
      ty = this.pendingAction.item.screenY;
      color = this.pendingAction.item.color || "#ffd700";
    }

    const pulse = Math.sin(this.ambientTime * 0.008) * 4;
    const r = 38 + pulse;

    this.ctx.save();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2.5;
    this.ctx.setLineDash([6, 6]);
    this.ctx.lineDashOffset = -this.ambientTime * 0.03;
    this.ctx.beginPath();
    this.ctx.ellipse(tx, ty + 12, r, r * 0.5, 0, 0, Math.PI * 2);
    this.ctx.stroke();

    // Tia sáng chỉ đường mờ nhẹ từ chân nhân vật tới đích
    this.ctx.strokeStyle = "rgba(255, 215, 0, 0.28)";
    this.ctx.lineWidth = 1.5;
    this.ctx.setLineDash([4, 6]);
    this.ctx.beginPath();
    this.ctx.moveTo(this.player.x, this.player.y);
    this.ctx.lineTo(tx, ty);
    this.ctx.stroke();

    this.ctx.restore();
  }

  // Vẽ khung gợi ý phím [E] / chạm khi đứng gần vật thể (Có thể click / chạm trực tiếp)
  renderNearbyPrompt() {
    if (!this.nearbyInteractable || this.pendingAction) {
      this.promptRect = null;
      return;
    }

    let px = 0, py = 0, label = "";
    if (this.nearbyInteractable.type === 'realm') {
      const box = this.nearbyInteractable.box;
      px = box.x;
      py = box.y - 48;
      label = `[E] Mở ${box.name}`;
    } else if (this.nearbyInteractable.type === 'central_table') {
      px = this.nearbyInteractable.cx;
      py = this.nearbyInteractable.cy - 52;
      label = `[E] Thưởng Trà & Xem Sổ Lưu Bút 🍵`;
    } else if (this.nearbyInteractable.type === 'interactable') {
      const item = this.nearbyInteractable.item;
      px = item.screenX;
      py = item.screenY - 50;
      if (item.isLeadNPC) {
        const shortName = item.leadShortName || (item.leadName || "").split('-')[0].trim();
        label = `[E] Trò Chuyện (${shortName}) 💬`;
        py = item.screenY - 178; // Đặt banner phía trên bảng tên của Trưởng Phòng (cao 175px)
      } else if (item.isChallengeAltar) {
        label = item.isCompleted ? "[E] Thử Thách (Đã Đạt 🏆)" : "[E] Khai Mở Thử Thách Cõi Trà 🎮";
      } else {
        label = item.isAddButton ? "[E] Khắc Ghi Lời Chúc" : `[E] Lĩnh Hội Lời Chúc (${item.name})`;
      }
    }

    const floatY = Math.sin(this.ambientTime * 0.006) * 3;
    const drawY = Math.max(this.frameRect.y + 22, py + floatY);

    this.ctx.font = "bold 12px 'Noto Serif TC', serif";
    const textW = this.ctx.measureText(label).width;
    const padW = textW + 28;
    const padH = 26;

    // Lưu lại vị trí để click / tap trực tiếp lên banner
    this.promptRect = {
      x: px - padW / 2,
      y: drawY - padH / 2,
      w: padW,
      h: padH,
      action: this.nearbyInteractable
    };

    // Khung thẻ gỗ đào có viền vàng kim (phát sáng khi hover)
    this.ctx.save();
    this.ctx.fillStyle = this.hoveredPrompt ? "rgba(42, 22, 10, 0.98)" : "rgba(24, 12, 6, 0.94)";
    this.ctx.strokeStyle = this.hoveredPrompt ? "#ffd700" : "#b8860b";
    this.ctx.lineWidth = this.hoveredPrompt ? 2.4 : 1.8;
    this.ctx.beginPath();
    if (this.ctx.roundRect) {
      this.ctx.roundRect(px - padW / 2, drawY - padH / 2, padW, padH, 5);
    } else {
      this.ctx.rect(px - padW / 2, drawY - padH / 2, padW, padH);
    }
    this.ctx.fill();
    this.ctx.stroke();

    // Viền trong vàng sáng
    this.ctx.strokeStyle = this.hoveredPrompt ? "rgba(255, 235, 120, 0.9)" : "rgba(255, 215, 0, 0.5)";
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(px - padW / 2 + 2, drawY - padH / 2 + 2, padW - 4, padH - 4);

    this.ctx.fillStyle = this.hoveredPrompt ? "#ffffff" : "#ffd700";
    this.ctx.textAlign = "center";
    this.ctx.fillText(label, px, drawY + 4);
    this.ctx.restore();
  }

  // 0. TRÀ ĐIỆN NHẤT TÂM
  renderRealm0() {
    const hasBg = window.gameSprites.drawRealmBackground(this.ctx, 0, this.width, this.height, this.frameRect);
    if (!hasBg) {
      window.gameSprites.drawTatamiFloor(this.ctx, this.width, this.height);
    }

    const cx = this.frameRect.x + this.frameRect.w / 2;
    const cy = this.frameRect.y + this.frameRect.h / 2 - 15;

    // Bàn trà cổ
    const hasTable = window.gameSprites.drawAncientTeaTable(this.ctx, cx, cy);
    if (!hasTable) {
      const tableRadius = Math.min(this.frameRect.w, this.frameRect.h) * 0.16;
      window.gameSprites.drawCentralTeaTable(this.ctx, cx, cy, tableRadius);
    }

    // Vẽ 6 hộp danh trà
    this.teaBoxes.forEach(box => {
      const isHovered = (this.hoveredTeaBox && this.hoveredTeaBox.id === box.id);
      window.gameSprites.drawTeaBox(this.ctx, box, isHovered, this.ambientTime);
    });
  }

  // 1. CỔ MẠCH PHỔ NHĨ - Network & Hạ tầng
  renderRealm1() {
    window.gameSprites.drawRealmBackground(this.ctx, 1, this.width, this.height, this.frameRect);
  }

  // 2. THIÊN CÔNG NGỌC LỘ - Phát triển phần mềm
  renderRealm2() {
    window.gameSprites.drawRealmBackground(this.ctx, 2, this.width, this.height, this.frameRect);
  }

  // 3. TRƯỜNG LƯU BAN TRÀ - Vận hành hệ thống
  renderRealm3() {
    window.gameSprites.drawRealmBackground(this.ctx, 3, this.width, this.height, this.frameRect);
  }

  // 4. HUYỀN GIÁP QUAN ÂM - An toàn thông tin
  renderRealm4() {
    window.gameSprites.drawRealmBackground(this.ctx, 4, this.width, this.height, this.frameRect);
  }

  // 5. VÂN HÀNH TIÊN TRÀ - Triển khai sản phẩm dữ liệu
  renderRealm5() {
    window.gameSprites.drawRealmBackground(this.ctx, 5, this.width, this.height, this.frameRect);
  }

  // 6. TUYẾT TÂM MẠT TRÀ - Quản trị & Phân tích dữ liệu
  renderRealm6() {
    window.gameSprites.drawRealmBackground(this.ctx, 6, this.width, this.height, this.frameRect);
  }

  // Vẽ viền khung tranh gỗ cổ Cinematic 16:9 cao cấp khi màn hình không phải 16:9
  renderCinematicBorders() {
    if (this.aspectMode !== '16:9' || !this.frameRect) return;

    this.ctx.fillStyle = "#100a06";

    // Cột bên trái
    if (this.frameRect.x > 0) {
      this.ctx.fillRect(0, 0, this.frameRect.x, this.height);
      this.ctx.strokeStyle = "#8d5b2d";
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(this.frameRect.x, 0);
      this.ctx.lineTo(this.frameRect.x, this.height);
      this.ctx.stroke();

      this.ctx.strokeStyle = "#d4af37";
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(this.frameRect.x - 3, 0);
      this.ctx.lineTo(this.frameRect.x - 3, this.height);
      this.ctx.stroke();
    }

    // Cột bên phải
    const rx = this.frameRect.x + this.frameRect.w;
    if (rx < this.width) {
      this.ctx.fillRect(rx, 0, this.width - rx, this.height);
      this.ctx.strokeStyle = "#8d5b2d";
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(rx, 0);
      this.ctx.lineTo(rx, this.height);
      this.ctx.stroke();

      this.ctx.strokeStyle = "#d4af37";
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(rx + 3, 0);
      this.ctx.lineTo(rx + 3, this.height);
      this.ctx.stroke();
    }

    // Dải trên
    if (this.frameRect.y > 0) {
      this.ctx.fillRect(0, 0, this.width, this.frameRect.y);
      this.ctx.strokeStyle = "#8d5b2d";
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(0, this.frameRect.y);
      this.ctx.lineTo(this.width, this.frameRect.y);
      this.ctx.stroke();

      this.ctx.strokeStyle = "#d4af37";
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(0, this.frameRect.y - 3);
      this.ctx.lineTo(this.width, this.frameRect.y - 3);
      this.ctx.stroke();
    }

    // Dải dưới
    const by = this.frameRect.y + this.frameRect.h;
    if (by < this.height) {
      this.ctx.fillRect(0, by, this.width, this.height - by);
      this.ctx.strokeStyle = "#8d5b2d";
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(0, by);
      this.ctx.lineTo(this.width, by);
      this.ctx.stroke();

      this.ctx.strokeStyle = "#d4af37";
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(0, by + 3);
      this.ctx.lineTo(this.width, by + 3);
      this.ctx.stroke();
    }
  }

  // Vẽ cây dữ liệu fallback
  drawDataTree(cx, cy, branchColor, leafColor) {
    this.ctx.fillStyle = "#4a2f18";
    this.ctx.beginPath();
    this.ctx.moveTo(cx - 30, cy + 120);
    this.ctx.quadraticCurveTo(cx - 15, cy + 30, cx - 20, cy - 30);
    this.ctx.lineTo(cx + 20, cy - 30);
    this.ctx.quadraticCurveTo(cx + 15, cy + 30, cx + 30, cy + 120);
    this.ctx.fill();

    this.ctx.strokeStyle = branchColor;
    this.ctx.lineWidth = 5;
    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy - 20);
    this.ctx.lineTo(cx - 120, cy - 80);
    this.ctx.moveTo(cx, cy - 20);
    this.ctx.lineTo(cx + 120, cy - 80);
    this.ctx.moveTo(cx, cy - 30);
    this.ctx.lineTo(cx, cy - 120);
    this.ctx.stroke();

    const pulse = Math.sin(this.ambientTime * 0.003) * 6;
    const leafClusters = [
      { x: cx - 120, y: cy - 90, r: 45 },
      { x: cx + 120, y: cy - 90, r: 45 },
      { x: cx, y: cy - 130, r: 55 },
      { x: cx - 60, y: cy - 110, r: 40 },
      { x: cx + 60, y: cy - 110, r: 40 }
    ];

    leafClusters.forEach(c => {
      const grad = this.ctx.createRadialGradient(c.x, c.y, 5, c.x, c.y, c.r + pulse);
      grad.addColorStop(0, leafColor);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(c.x, c.y, c.r + pulse, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  // Vẽ các điểm tương tác (dùng ảnh assets pixel 64x64)
  renderInteractables() {
    // 1. Vẽ các vật phẩm môi trường, đài thử thách, cửa chuyển cõi, lời chúc TRƯỚC
    this.currentInteractables.forEach(item => {
      if (item.isLeadNPC) return; // NPC sẽ được vẽ ở Lớp 2 phía trên để không bị che
      const isHovered = (this.hoveredInteractable && this.hoveredInteractable.id === item.id);

      if (item.isChallengeAltar) {
        this.renderChallengeAltar(item, isHovered);
      } else if (item.isNextRealmDoor) {
        this.renderNextRealmDoor(item, isHovered);
      } else if (item.isAddButton) {
        // Thẻ Bài Cầu Chúc Dát Vàng (Asian Wooden Wish Plaque / Ema)
        const floatBob = Math.sin(this.ambientTime * 0.005) * 4;
        const cx = item.screenX;
        const cy = item.screenY + floatBob;
        const pSize = isHovered ? 68 : 58;

        this.ctx.save();

        // 1. Vầng hào quang ánh vàng hoàng kim lấp lánh xung quanh
        const glowR = isHovered ? 46 : 38;
        const glow = this.ctx.createRadialGradient(cx, cy, 8, cx, cy, glowR + 18);
        glow.addColorStop(0, "rgba(255, 215, 0, 0.75)");
        glow.addColorStop(0.5, "rgba(212, 175, 55, 0.25)");
        glow.addColorStop(1, "transparent");
        this.ctx.fillStyle = glow;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, glowR + 18, 0, Math.PI * 2);
        this.ctx.fill();

        // 2. Thẻ bài gỗ: Dùng ảnh asset pixel art item_wish_tag_gold.png nếu có
        const tagImg = window.gameSprites ? window.gameSprites.images.wish_tag_gold : null;
        if (tagImg && tagImg.complete && tagImg.naturalWidth > 0) {
          this.ctx.imageSmoothingEnabled = false;
          this.ctx.drawImage(tagImg, cx - pSize / 2, cy - pSize / 2, pSize, pSize);
          this.ctx.imageSmoothingEnabled = true;
        } else {
          // Fallback vector Ema
          const pW = isHovered ? 52 : 46;
          const pH = isHovered ? 66 : 58;
          const roofH = 14;

          this.ctx.strokeStyle = "#c0392b";
          this.ctx.lineWidth = 3;
          this.ctx.beginPath();
          this.ctx.moveTo(cx, cy - pH / 2 - 12);
          this.ctx.lineTo(cx, cy - pH / 2);
          this.ctx.stroke();

          this.ctx.fillStyle = "#e74c3c";
          this.ctx.beginPath();
          this.ctx.arc(cx, cy - pH / 2 - 6, 4, 0, Math.PI * 2);
          this.ctx.fill();

          this.ctx.beginPath();
          this.ctx.moveTo(cx, cy - pH / 2);
          this.ctx.lineTo(cx + pW / 2, cy - pH / 2 + roofH);
          this.ctx.lineTo(cx + pW / 2, cy + pH / 2);
          this.ctx.lineTo(cx - pW / 2, cy + pH / 2);
          this.ctx.lineTo(cx - pW / 2, cy - pH / 2 + roofH);
          this.ctx.closePath();

          const woodGrad = this.ctx.createLinearGradient(cx - pW / 2, cy - pH / 2, cx + pW / 2, cy + pH / 2);
          woodGrad.addColorStop(0, isHovered ? "#6e3b1c" : "#4a2612");
          woodGrad.addColorStop(1, isHovered ? "#3c1e0b" : "#241106");
          this.ctx.fillStyle = woodGrad;
          this.ctx.fill();

          this.ctx.strokeStyle = isHovered ? "#ffd700" : "#d4af37";
          this.ctx.lineWidth = isHovered ? 3 : 2;
          this.ctx.stroke();

          this.ctx.font = "bold 24px 'Noto Serif TC', serif";
          this.ctx.fillStyle = isHovered ? "#ffffff" : "#ffd700";
          this.ctx.textAlign = "center";
          this.ctx.shadowColor = "#000";
          this.ctx.shadowBlur = 4;
          this.ctx.fillText("祝", cx, cy + 10);
          this.ctx.shadowBlur = 0;
        }

        // 3. Nhãn tên dưới chân: "Khắc Ghi Lời Chúc"
        this.ctx.font = "bold 12.5px 'Noto Serif TC', serif";
        const tagText = "Khắc Ghi Lời Chúc";
        const badgeW = this.ctx.measureText(tagText).width + 24;
        const badgeH = 26;
        const badgeY = cy + pSize / 2 + 6;

        this.ctx.fillStyle = isHovered ? "rgba(50, 26, 12, 0.96)" : "rgba(24, 12, 6, 0.94)";
        this.ctx.strokeStyle = isHovered ? "#ffd700" : "#b8860b";
        this.ctx.lineWidth = 1.6;
        this.ctx.beginPath();
        if (this.ctx.roundRect) {
          this.ctx.roundRect(cx - badgeW / 2, badgeY, badgeW, badgeH, 5);
        } else {
          this.ctx.rect(cx - badgeW / 2, badgeY, badgeW, badgeH);
        }
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillStyle = isHovered ? "#ffd700" : "#f5eedf";
        this.ctx.fillText(tagText, cx, badgeY + 17);
        this.ctx.restore();
      } else {
        // Vẽ vật thể tương tác pixel từ assets/04_Interactive_Nodes
        window.gameSprites.drawInteractiveNode(this.ctx, item, isHovered, this.ambientTime);
      }
    });

    // 2. Vẽ các Trưởng Phòng NPC (Lớp hiển thị phía trên để TUYỆT ĐỐI KHÔNG BỊ VẬT PHẨM CHE)
    const npcs = this.currentInteractables.filter(it => it.isLeadNPC);
    npcs.forEach(item => {
      const isHovered = (this.hoveredInteractable && this.hoveredInteractable.id === item.id);
      if (window.gameSprites && window.gameSprites.drawLeadNPCSprite) {
        window.gameSprites.drawLeadNPCSprite(this.ctx, item, isHovered, this.ambientTime);
      }
    });
  }

  // Vẽ Đài Thử Thách Cõi Trà (Challenge Altar)
  renderChallengeAltar(item, isHovered) {
    const cx = item.screenX;
    const cy = item.screenY;
    const pulse = Math.sin(this.ambientTime * 0.005) * 5;
    const isDone = item.isCompleted;

    this.ctx.save();

    // 1. Đài đá / đài gỗ bát giác làm đế
    const baseW = isHovered ? 84 : 76;
    const baseH = 26;
    const baseGrad = this.ctx.createLinearGradient(cx - baseW / 2, cy + 10, cx + baseW / 2, cy + 10 + baseH);
    baseGrad.addColorStop(0, "#4a2c16");
    baseGrad.addColorStop(1, "#26150a");
    this.ctx.fillStyle = baseGrad;
    this.ctx.strokeStyle = isDone ? "#2ecc71" : "#ffd700";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.ellipse(cx, cy + 18, baseW / 2, baseH / 2, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // 2. Vầng sáng hào quang tỏa lên
    const glowR = isHovered ? 52 : 44;
    const glow = this.ctx.createRadialGradient(cx, cy, 6, cx, cy, glowR + pulse);
    glow.addColorStop(0, isDone ? "rgba(46, 204, 113, 0.7)" : "rgba(255, 215, 0, 0.7)");
    glow.addColorStop(0.5, isDone ? "rgba(39, 174, 96, 0.25)" : "rgba(230, 126, 34, 0.25)");
    glow.addColorStop(1, "transparent");
    this.ctx.fillStyle = glow;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, glowR + pulse, 0, Math.PI * 2);
    this.ctx.fill();

    // 3. Viên ngọc tinh hoa / Cúp lơ lửng xoay nhẹ
    const floatY = cy - 8 + pulse * 0.6;
    const crystalR = isHovered ? 26 : 22;

    this.ctx.fillStyle = isDone ? "#2ecc71" : (item.color || "#ffd700");
    this.ctx.strokeStyle = "#ffffff";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(cx, floatY, crystalR, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Biểu tượng icon bên trong
    this.ctx.font = isHovered ? "24px sans-serif" : "20px sans-serif";
    this.ctx.textAlign = "center";
    this.ctx.fillText(item.icon, cx, floatY + 7);

    // 4. Bảng tên đài thử thách
    this.ctx.font = "bold 12.5px 'Noto Serif TC', serif";
    const tagText = isDone ? "✓ Thử Thách: Đã Đạt" : "✦ Khai Mở Thử Thách ✦";
    const tagW = this.ctx.measureText(tagText).width + 20;
    const tagH = 24;
    const tagY = cy + 34;

    this.ctx.fillStyle = isDone ? "rgba(20, 60, 30, 0.95)" : "rgba(36, 18, 8, 0.95)";
    this.ctx.strokeStyle = isDone ? "#2ecc71" : "#ffd700";
    this.ctx.lineWidth = 1.5;
    if (this.ctx.roundRect) {
      this.ctx.roundRect(cx - tagW / 2, tagY, tagW, tagH, 5);
    } else {
      this.ctx.rect(cx - tagW / 2, tagY, tagW, tagH);
    }
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.fillStyle = isDone ? "#2ecc71" : "#ffd700";
    this.ctx.fillText(tagText, cx, tagY + 16);

    this.ctx.restore();
  }

  // Vẽ Cánh Cửa Chuyển Cõi (Next Realm Door - Trà Môn Cổ Kính)
  renderNextRealmDoor(item, isHovered) {
    const cx = item.screenX;
    const cy = item.screenY;
    const isLocked = item.isLocked;

    this.ctx.save();

    // 1. Kích thước cổng phù hợp với nhân vật (72x108 px) và tỉ lệ khung hình
    const baseW = Math.max(116, Math.min(152, Math.round(this.frameRect.w * 0.138)));
    const gateW = isHovered ? Math.round(baseW * 1.06) : baseW;
    const gateH = gateW; // Ảnh cổng vuông 1024x1024
    const groundY = cy + gateH * 0.44;

    // 2. Vầng hào quang dưới chân cổng và luồng sáng huyền ảo
    const portalR = gateW * 0.46;
    const baseGrad = this.ctx.createRadialGradient(cx, groundY, 8, cx, groundY, portalR + 25);
    if (isLocked) {
      baseGrad.addColorStop(0, "rgba(80, 50, 40, 0.6)");
      baseGrad.addColorStop(1, "transparent");
    } else {
      baseGrad.addColorStop(0, "rgba(255, 215, 0, 0.72)");
      baseGrad.addColorStop(0.5, "rgba(230, 126, 34, 0.32)");
      baseGrad.addColorStop(1, "transparent");
    }
    this.ctx.fillStyle = baseGrad;
    this.ctx.beginPath();
    this.ctx.ellipse(cx, groundY, portalR + 20, 20, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // 3. Vẽ cổng pixel art chính thức
    const gateImg = window.gameSprites ? window.gameSprites.images.gate_portal_zen : null;
    if (gateImg && gateImg.complete && gateImg.naturalWidth > 0) {
      this.ctx.imageSmoothingEnabled = false; // Giữ pixel art sắc nét

      // Hiệu ứng phát quang vàng kim ấm áp khi hover
      if (isHovered) {
        this.ctx.shadowColor = "rgba(255, 215, 0, 0.9)";
        this.ctx.shadowBlur = 18;
      } else {
        this.ctx.shadowColor = "rgba(255, 180, 50, 0.45)";
        this.ctx.shadowBlur = 10;
      }

      this.ctx.drawImage(
        gateImg,
        cx - gateW / 2,
        cy - gateH / 2,
        gateW,
        gateH
      );
      this.ctx.shadowBlur = 0;

      // Hạt tinh hoa trà / đốm sáng lấp lánh nhẹ nhàng quanh cổng
      if (!isLocked) {
        const sparkleCount = 4;
        for (let i = 0; i < sparkleCount; i++) {
          const angle = (this.ambientTime * 0.0025 + (i * Math.PI * 2) / sparkleCount);
          const dist = (gateW * 0.18) + Math.sin(this.ambientTime * 0.004 + i) * 6;
          const sx = cx + Math.cos(angle) * dist * 0.65;
          const sy = cy + 4 + Math.sin(angle) * dist;
          const spAlpha = 0.4 + Math.sin(this.ambientTime * 0.006 + i * 2) * 0.35;
          this.ctx.fillStyle = `rgba(255, 240, 160, ${spAlpha})`;
          this.ctx.beginPath();
          this.ctx.arc(sx, sy, 2, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
    } else {
      // Fallback khi ảnh đang tải
      const postW = 8;
      const topY = cy - gateH / 2;
      this.ctx.fillStyle = "#783f12";
      this.ctx.fillRect(cx - gateW / 2, topY + 8, postW, gateH);
      this.ctx.fillRect(cx + gateW / 2 - postW, topY + 8, postW, gateH);
    }

    // 4. Biển chỉ dẫn dưới chân cổng
    const labelText = isLocked ? "Cửa Khóa 🔒" : `Qua Cõi: ${item.nextRealmName} ➔`;
    this.ctx.font = "bold 11px 'Noto Serif TC', serif";
    const tagW = this.ctx.measureText(labelText).width + 22;
    const tagH = 26;
    const tagY = cy + gateH / 2 + 10;

    this.ctx.fillStyle = isHovered ? "rgba(40, 20, 10, 0.98)" : "rgba(20, 10, 5, 0.92)";
    this.ctx.strokeStyle = isLocked ? "#7f8c8d" : (isHovered ? "#ffffff" : "#ffd700");
    this.ctx.lineWidth = isHovered ? 2 : 1.2;
    this.ctx.beginPath();
    if (this.ctx.roundRect) {
      this.ctx.roundRect(cx - tagW / 2, tagY, tagW, tagH, 6);
    } else {
      this.ctx.rect(cx - tagW / 2, tagY, tagW, tagH);
    }
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.fillStyle = isLocked ? "#bdc3c7" : "#ffd700";
    this.ctx.textAlign = "center";
    this.ctx.fillText(labelText, cx, tagY + 17);

    this.ctx.restore();
  }

  // Vẽ nhân vật người chơi phóng to (116x174 px - oai phong, ngang tầm các Trưởng Phòng NPC)
  renderPlayer() {
    const frames = window.gameSprites.playerFrames[this.player.dir];
    if (frames && frames.length > 0) {
      const frameImg = frames[this.player.frame % frames.length];
      if (frameImg) {
        const pW = 120;
        const pH = 180;

        // Bóng đổ chân thực dưới chân nhân vật (mở rộng theo vóc dáng to lớn của nhân vật)
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.42)";
        this.ctx.beginPath();
        this.ctx.ellipse(this.player.x, this.player.y, 36, 12, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Vẽ sprite pixel phóng to sắc nét không mờ
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.drawImage(frameImg, this.player.x - pW / 2, this.player.y - pH + 14, pW, pH);
        this.ctx.imageSmoothingEnabled = true; // Khôi phục làm mịn cao cho khung cảnh/video
      }
    }
  }

  // Vẽ các hạt hiệu ứng bay lơ lửng trong không gian (lá trà, lá phong, hạt dữ liệu, bụi vàng kim)
  renderParticles() {
    if (!this.particles || this.particles.length === 0) return;
    this.ctx.save();
    this.particles.forEach(p => {
      const img = window.gameSprites ? window.gameSprites.images[p.type] : null;
      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rot);

      if (img && img.complete && img.naturalWidth > 0) {
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.drawImage(img, -p.size / 2, -p.size / 2, p.size, p.size);
      } else {
        this.ctx.fillStyle = "#ffd700";
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size * 0.25, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    });
    this.ctx.restore();
  }

  // Vẽ pháo hoa sinh nhật
  renderFireworks() {
    this.fireworks.forEach(fw => {
      this.ctx.fillStyle = fw.color;
      this.ctx.globalAlpha = fw.life;
      this.ctx.beginPath();
      this.ctx.arc(fw.x, fw.y, fw.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
    this.ctx.globalAlpha = 1.0;
  }

  // Vòng lặp trò chơi 60 FPS
  gameLoop(time) {
    this.update(time);
    this.render();
    requestAnimationFrame(t => this.gameLoop(t));
  }
}

// Khởi tạo GameEngine toàn cục
window.gameEngine = null;
