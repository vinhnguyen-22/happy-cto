/**
 * MINIGAMES ENGINE - LỤC TRÀ THỬ THÁCH
 * Thiết kế các trò chơi tương tác theo từng cõi trà mừng sinh nhật CTO:
 * - Cõi 1 (Network & Hạ tầng): Mạch Ngầm Cáp Quang (Fiber Linker - Ping < 1ms)
 * - Cõi 2 (Phát triển phần mềm): Vườn Ươm Mã Nguồn (Bug Slayer & Build 100%)
 * - Cõi 3 (Vận hành hệ thống): Cân Bằng Áp Suất Guồng Nước (Load Balancer - 99.999% Uptime)
 */

const MINIGAME_CONFIG = {
  1: {
    id: 1,
    title: "Mạch Ngầm Xuyên Đất",
    dept: "Network & Hạ Tầng",
    targetMetric: "Ping < 1ms • 0% Packet Loss",
    desc: "Xoay các đoạn cáp quang ngầm để luồng tín hiệu truyền thông suốt từ Data Center tới Trạm Cloud!",
    essenceName: "Tinh Hoa Cổ Mạch",
    essenceIcon: "🍂",
    color: "#e67e22"
  },
  2: {
    id: 2,
    title: "Vườn Ươm Mã Nguồn",
    dept: "Phát Triển Phần Mềm",
    targetMetric: "0 Bug • Build Success 100%",
    desc: "Di chuyển để hứng các module Frontend, Backend, Database. Nhấn SPACE hoặc CLICK vào con Bug để Hotfix!",
    essenceName: "Tinh Hoa Thiên Công",
    essenceIcon: "🍃",
    color: "#2ecc71"
  },
  3: {
    id: 3,
    title: "Cân Bằng Áp Suất Guồng Nước",
    dept: "Vận Hành Hệ Thống",
    targetMetric: "99.999% Uptime • Zero Downtime",
    desc: "Click vào các Van (hoặc phím 1, 2, 3) để điều phối dòng tải, giữ cả 3 Node trong Vùng An Toàn (30%-75%)!",
    essenceName: "Tinh Hoa Trường Lưu",
    essenceIcon: "🌸",
    color: "#f39c12"
  }
};

class MiniGameManager {
  constructor() {
    this.modal = null;
    this.canvas = null;
    this.ctx = null;
    this.currentRealmId = 1;
    this.isRunning = false;
    this.animationFrameId = null;
    this.gameWon = false;

    // Trạng thái thu thập tinh hoa (lưu localStorage)
    this.storageKey = 'happy_cto_minigame_essences';
    this.essences = this.loadEssences();

    // Dữ liệu riêng của game đang chạy
    this.gameState = null;
    this.inputState = {
      mouseX: 0,
      mouseY: 0,
      isMouseDown: false,
      keys: {}
    };

    // Trạng thái qua màn trong phiên chơi hiện tại (luôn thử thách khi vào cõi)
    this.sessionPassed = { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false };

    this.initDOM();
  }

  loadEssences() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {}
    return { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false };
  }

  saveEssences() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.essences));
    } catch (e) {}
  }

  isCompleted(realmId) {
    return !!this.essences[realmId];
  }

  isPassed(realmId) {
    return !!this.sessionPassed[realmId];
  }

  initDOM() {
    // Chờ DOM load
    const setup = () => {
      this.modal = document.getElementById('modal-minigame');
      this.canvas = document.getElementById('minigameCanvas');
      if (this.canvas) {
        this.ctx = this.canvas.getContext('2d');
      }

      const btnClose = document.getElementById('btn-close-minigame');
      const btnSkip = document.getElementById('btn-skip-minigame');
      const btnRestart = document.getElementById('btn-restart-minigame');
      const btnContinue = document.getElementById('btn-continue-realm');
      const btnChallengeHUD = document.getElementById('btn-realm-challenge');

      if (btnClose) btnClose.addEventListener('click', () => this.closeGame());
      if (btnSkip) btnSkip.addEventListener('click', () => this.skipGame());
      if (btnRestart) btnRestart.addEventListener('click', () => this.restartGame());
      if (btnContinue) btnContinue.addEventListener('click', () => this.closeGame());

      if (btnChallengeHUD) {
        btnChallengeHUD.addEventListener('click', () => {
          if (window.gameEngine && [1, 2, 3].includes(window.gameEngine.currentRealmId)) {
            this.openGame(window.gameEngine.currentRealmId);
          }
        });
      }

      // Xử lý Input trên canvas mini-game
      if (this.canvas) {
        this.canvas.addEventListener('mousemove', (e) => {
          const rect = this.canvas.getBoundingClientRect();
          const scaleX = this.canvas.width / rect.width;
          const scaleY = this.canvas.height / rect.height;
          this.inputState.mouseX = (e.clientX - rect.left) * scaleX;
          this.inputState.mouseY = (e.clientY - rect.top) * scaleY;
          this.handleMouseMove(this.inputState.mouseX, this.inputState.mouseY);
        });

        this.canvas.addEventListener('mousedown', (e) => {
          this.inputState.isMouseDown = true;
          const rect = this.canvas.getBoundingClientRect();
          const scaleX = this.canvas.width / rect.width;
          const scaleY = this.canvas.height / rect.height;
          const x = (e.clientX - rect.left) * scaleX;
          const y = (e.clientY - rect.top) * scaleY;
          this.handleClick(x, y);
        });

        this.canvas.addEventListener('mouseup', () => {
          this.inputState.isMouseDown = false;
        });

        // Touch cho mobile
        this.canvas.addEventListener('touchmove', (e) => {
          e.preventDefault();
          if (e.touches.length > 0) {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            const x = (e.touches[0].clientX - rect.left) * scaleX;
            const y = (e.touches[0].clientY - rect.top) * scaleY;
            this.inputState.mouseX = x;
            this.inputState.mouseY = y;
            this.handleMouseMove(x, y);
          }
        }, { passive: false });

        this.canvas.addEventListener('touchstart', (e) => {
          if (e.touches.length > 0) {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            const x = (e.touches[0].clientX - rect.left) * scaleX;
            const y = (e.touches[0].clientY - rect.top) * scaleY;
            this.inputState.mouseX = x;
            this.inputState.mouseY = y;
            this.handleClick(x, y);
          }
        }, { passive: true });
      }

      window.addEventListener('keydown', (e) => {
        if (!this.isRunning) return;
        this.inputState.keys[e.key.toLowerCase()] = true;
        this.handleKeyDown(e.key.toLowerCase(), e);
      });

      window.addEventListener('keyup', (e) => {
        if (!this.isRunning) return;
        this.inputState.keys[e.key.toLowerCase()] = false;
      });

      this.updateHUD();
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setup);
    } else {
      setup();
    }
  }

  // Cập nhật trạng thái hiển thị trên thanh HUD
  updateHUD() {
    const list = document.getElementById('hud-essences-list');
    if (list) {
      for (let r = 1; r <= 6; r++) {
        const slot = list.querySelector(`[data-realm="${r}"]`);
        if (slot) {
          slot.classList.toggle('unlocked', !!this.essences[r]);
        }
      }
    }

    const btnChallengeHUD = document.getElementById('btn-realm-challenge');
    const challengeText = document.getElementById('btn-challenge-text');
    if (btnChallengeHUD && window.gameEngine) {
      const realmId = window.gameEngine.currentRealmId;
      if ([1, 2, 3].includes(realmId)) {
        btnChallengeHUD.style.display = 'inline-flex';
        const isDone = this.isCompleted(realmId);
        if (challengeText) {
          challengeText.textContent = isDone ? `✓ Thử Thách Cõi ${realmId}` : `🎮 Thử Thách Cõi ${realmId}`;
        }
        btnChallengeHUD.classList.toggle('completed', isDone);
      } else {
        btnChallengeHUD.style.display = 'none';
      }
    }
  }

  shakeGateHint() {
    const hint = document.getElementById('minigame-gate-hint');
    if (hint) {
      hint.classList.remove('shake');
      void hint.offsetWidth;
      hint.classList.add('shake');
    }
    if (window.gameAudio) {
      window.gameAudio.playClick();
    }
  }

  // Mở cửa sổ Mini-game
  openGame(realmId) {
    if (!MINIGAME_CONFIG[realmId]) return;
    this.currentRealmId = realmId;
    const config = MINIGAME_CONFIG[realmId];

    if (!this.modal) {
      this.modal = document.getElementById('modal-minigame');
    }
    if (!this.canvas) {
      this.canvas = document.getElementById('minigameCanvas');
      if (this.canvas) this.ctx = this.canvas.getContext('2d');
    }
    if (!this.modal) return;

    if (window.gameAudio) {
      window.gameAudio.playClick();
      window.gameAudio.playBell();
    }

    // Cập nhật thông tin Header Modal
    const titleEl = document.getElementById('minigame-title');
    const descEl = document.getElementById('minigame-desc');
    const iconBadge = document.getElementById('minigame-icon-badge');
    const instEl = document.getElementById('minigame-instruction');

    if (titleEl) titleEl.textContent = `Thử Thách: ${config.title}`;
    if (descEl) descEl.textContent = `${config.dept} • Mục tiêu: ${config.targetMetric}`;
    if (iconBadge) iconBadge.textContent = config.essenceIcon;
    if (instEl) instEl.textContent = config.desc;

    // Thiết lập trạng thái khóa cổng (Chưa qua màn -> Chưa được đóng!)
    const btnClose = document.getElementById('btn-close-minigame');
    const btnContinue = document.getElementById('btn-continue-realm');
    const gateHint = document.getElementById('minigame-gate-hint');
    const gateMsg = document.getElementById('minigame-gate-msg');

    if (btnClose) btnClose.style.display = 'none';
    if (btnContinue) btnContinue.style.display = 'none';
    if (gateHint) gateHint.classList.remove('unlocked');
    if (gateMsg) gateMsg.textContent = "Vượt qua thử thách để mở cổng bước vào cõi trà!";

    this.modal.classList.add('active');
    this.isRunning = true;
    this.gameWon = false;

    // Khởi tạo trạng thái game tương ứng
    this.initGame(realmId);

    // Bắt đầu vòng lặp render
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    let lastTime = performance.now();
    const loop = (currentTime) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      if (this.isRunning) {
        this.update(dt);
        this.render();
        this.animationFrameId = requestAnimationFrame(loop);
      }
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  closeGame(force = false) {
    // CHẶN ĐÓNG KHI CHƯA QUA MÀN!
    if (!force && !this.gameWon) {
      this.shakeGateHint();
      return;
    }

    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.modal) {
      this.modal.classList.remove('active');
    }
    if (window.gameEngine) {
      window.gameEngine.refreshCurrentInteractables();
    }
    this.updateHUD();

    // Khi người chơi đã qua màn và bước vào cõi trà -> Bắt đầu lời thoại dẫn chuyện của Trà Tiên
    if (this.gameWon && window.uiManager) {
      setTimeout(() => {
        window.uiManager.showRealmDialogue(this.currentRealmId);
      }, 300);
    }
  }

  restartGame() {
    this.openGame(this.currentRealmId);
  }

  skipGame() {
    this.completeGame(this.currentRealmId, true);
  }

  // Hoàn thành mini-game & trao thưởng
  completeGame(realmId, isSkip = false) {
    if (this.gameWon) return;
    this.gameWon = true;
    this.sessionPassed[realmId] = true;
    this.essences[realmId] = true;
    this.saveEssences();
    this.updateHUD();

    const config = MINIGAME_CONFIG[realmId];

    // Mở khóa nút đóng & hiện nút Tiếp Tục Bước Vào Cõi Trà
    const btnClose = document.getElementById('btn-close-minigame');
    const btnContinue = document.getElementById('btn-continue-realm');
    const gateHint = document.getElementById('minigame-gate-hint');
    const gateMsg = document.getElementById('minigame-gate-msg');

    if (btnClose) btnClose.style.display = 'inline-flex';
    if (btnContinue) btnContinue.style.display = 'inline-flex';
    if (gateHint) gateHint.classList.add('unlocked');
    if (gateMsg) gateMsg.textContent = "🎉 ĐÃ VƯỢT QUA MÀN! Cổng cõi trà đã mở.";

    // Phát âm thanh và pháo hoa ăn mừng
    if (window.gameAudio) {
      window.gameAudio.playWishSaved();
      window.gameAudio.playBell(1046.50);
    }
    if (window.gameEngine) {
      window.gameEngine.spawnFireworks();
      window.gameEngine.refreshCurrentInteractables();
    }

    // Cập nhật thanh trạng thái
    const statusEl = document.getElementById('minigame-status-bar');
    if (statusEl) {
      statusEl.innerHTML = `
        <div class="minigame-win-banner">
          <span class="win-icon">🏆</span>
          <span class="win-text">THỬ THÁCH HOÀN THÀNH! LĨNH HỘI <strong>${config.essenceName} (${config.essenceIcon})</strong></span>
        </div>
      `;
    }
  }

  // =========================================================
  // ROUTER KHỞI TẠO, CẬP NHẬT & RENDER
  // =========================================================
  initGame(realmId) {
    switch (realmId) {
      case 1: this.initGame1_FiberLinker(); break;
      case 2: this.initGame2_BugSlayer(); break;
      case 3: this.initGame3_LoadBalancer(); break;
    }
  }

  update(dt) {
    switch (this.currentRealmId) {
      case 1: this.updateGame1(dt); break;
      case 2: this.updateGame2(dt); break;
      case 3: this.updateGame3(dt); break;
    }
  }

  render() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    switch (this.currentRealmId) {
      case 1: this.renderGame1(); break;
      case 2: this.renderGame2(); break;
      case 3: this.renderGame3(); break;
    }

    // Nếu đã chiến thắng, vẽ lớp hào quang ăn mừng
    if (this.gameWon) {
      this.renderVictoryOverlay();
    }
  }

  handleClick(x, y) {
    if (this.gameWon) return;
    switch (this.currentRealmId) {
      case 1: this.handleClickGame1(x, y); break;
      case 2: this.handleClickGame2(x, y); break;
      case 3: this.handleClickGame3(x, y); break;
    }
  }

  handleMouseMove(x, y) {
    switch (this.currentRealmId) {
      case 2:
        if (this.gameState && this.gameState.player) {
          this.gameState.player.targetX = Math.max(40, Math.min(this.canvas.width - 40, x));
        }
        break;
    }
  }

  handleKeyDown(key, e) {
    if (this.gameWon) return;
    switch (this.currentRealmId) {
      case 2:
        if (key === ' ' || key === 'enter') {
          e.preventDefault();
          this.triggerHotfixGame2();
        }
        break;
      case 3:
        if (['1', '2', '3'].includes(key)) {
          this.balanceValveGame3(parseInt(key) - 1);
        }
        break;
    }
  }

  // =========================================================================
  // MINI-GAME 1: MẠCH NGẦM XUYÊN ĐẤT (FIBER ROUTE LINKER - NETWORK & HẠ TẦNG)
  // =========================================================================
  initGame1_FiberLinker() {
    const cols = 4;
    const rows = 3;
    const cellSize = 88;
    const startX = (this.canvas.width - cols * cellSize) / 2;
    const startY = (this.canvas.height - rows * cellSize) / 2 + 10;

    // Định nghĩa các ô cáp:
    // type: 'straight' (0: ngang, 1: dọc),
    //       'corner'   (0: top-right, 1: right-bottom, 2: bottom-left, 3: left-top),
    //       't-junction' (0: T chỉ lên, 1: T chỉ phải, 2: T chỉ xuống, 3: T chỉ trái),
    //       'cross'
    // Cổng vào DC: Bên trái ô (0, 1)
    // Cổng ra Cloud: Bên phải ô (3, 1)
    const predefinedGrid = [
      // Row 0
      [ { type: 'corner', targetRot: 1 }, { type: 'straight', targetRot: 0 }, { type: 'corner', targetRot: 2 }, { type: 'corner', targetRot: 1 } ],
      // Row 1 (Đường dẫn chính nối từ (0,1) sang (3,1))
      [ { type: 'straight', targetRot: 0 }, { type: 't-junction', targetRot: 0 }, { type: 'straight', targetRot: 0 }, { type: 'straight', targetRot: 0 } ],
      // Row 2
      [ { type: 'corner', targetRot: 0 }, { type: 'straight', targetRot: 0 }, { type: 'corner', targetRot: 3 }, { type: 'corner', targetRot: 0 } ]
    ];

    const grid = [];
    for (let r = 0; r < rows; r++) {
      grid[r] = [];
      for (let c = 0; c < cols; c++) {
        const def = predefinedGrid[r][c];
        // Xáo trộn góc quay ngẫu nhiên khác góc giải chuẩn
        let randomRot = (def.targetRot + 1 + Math.floor(Math.random() * 3)) % 4;
        grid[r][c] = {
          col: c,
          row: r,
          type: def.type,
          rot: randomRot,
          targetRot: def.targetRot,
          active: false,
          pulseTimer: Math.random() * Math.PI * 2
        };
      }
    }

    this.gameState = {
      cols,
      rows,
      cellSize,
      startX,
      startY,
      grid,
      ping: 280,
      lightParticles: [],
      connectedPath: false
    };

    this.checkGame1Connections();
    this.updateGame1Status();
  }

  // Tính các cổng mở của từng ô cáp theo góc quay (top, right, bottom, left)
  getTileOpenings(type, rot) {
    let base = [false, false, false, false]; // [T, R, B, L]
    if (type === 'straight') {
      base = [false, true, false, true]; // Ngang mặc định
    } else if (type === 'corner') {
      base = [true, true, false, false]; // Top-Right mặc định
    } else if (type === 't-junction') {
      base = [true, true, false, true]; // T hướng lên (T, R, L)
    } else if (type === 'cross') {
      base = [true, true, true, true];
    }

    // Xoay các cổng theo số lần 90 độ
    const rotated = [false, false, false, false];
    for (let i = 0; i < 4; i++) {
      if (base[i]) {
        rotated[(i + rot) % 4] = true;
      }
    }
    return rotated;
  }

  // Thuật toán kiểm tra thông tuyến từ Data Center (Trái (0, 1)) tới Cloud (Phải (3, 1))
  checkGame1Connections() {
    const { cols, rows, grid } = this.gameState;

    // Reset trạng thái active
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        grid[r][c].active = false;
      }
    }

    // BFS từ cổng trái của ô (0, 1)
    const queue = [];
    const visited = new Set();

    // Ô (0, 1) phải có cổng mở bên Trái (Left = index 3) mới nhận tín hiệu từ DC
    const startTile = grid[1][0];
    const startOpenings = this.getTileOpenings(startTile.type, startTile.rot);
    if (startOpenings[3]) { // Cổng Left mở
      startTile.active = true;
      queue.push({ c: 0, r: 1 });
      visited.add(`0,1`);
    }

    const dirOffsets = [
      { dc: 0, dr: -1, fromIndex: 0, toIndex: 2 }, // Đi Lên (Top) -> Ô trên phải mở Bottom
      { dc: 1, dr: 0, fromIndex: 1, toIndex: 3 },  // Đi Phải (Right) -> Ô phải mở Left
      { dc: 0, dr: 1, fromIndex: 2, toIndex: 0 },  // Đi Xuống (Bottom) -> Ô dưới mở Top
      { dc: -1, dr: 0, fromIndex: 3, toIndex: 1 }  // Đi Trái (Left) -> Ô trái mở Right
    ];

    let reachedCloud = false;

    while (queue.length > 0) {
      const cur = queue.shift();
      const curTile = grid[cur.r][cur.c];
      const curOpenings = this.getTileOpenings(curTile.type, curTile.rot);

      // Nếu ô (3, 1) có tín hiệu và mở cổng Phải (Right = index 1) -> Đã chạm Cloud!
      if (cur.c === 3 && cur.r === 1 && curOpenings[1]) {
        reachedCloud = true;
      }

      for (const d of dirOffsets) {
        if (curOpenings[d.fromIndex]) {
          const nc = cur.c + d.dc;
          const nr = cur.r + d.dr;
          if (nc >= 0 && nc < cols && nr >= 0 && nr < rows) {
            const nextKey = `${nc},${nr}`;
            if (!visited.has(nextKey)) {
              const nextTile = grid[nr][nc];
              const nextOpenings = this.getTileOpenings(nextTile.type, nextTile.rot);
              // Kiểm tra xem ô tiếp theo có cổng mở tương ứng để ghép không
              if (nextOpenings[d.toIndex]) {
                nextTile.active = true;
                visited.add(nextKey);
                queue.push({ c: nc, r: nr });
              }
            }
          }
        }
      }
    }

    this.gameState.connectedPath = reachedCloud;

    if (reachedCloud && !this.gameWon) {
      this.gameState.ping = 0.8;
      this.completeGame(1);
    } else if (!reachedCloud) {
      // Giảm ping tùy theo số ô kết nối được
      this.gameState.ping = Math.max(15, Math.round(280 - visited.size * 25));
    }

    this.updateGame1Status();
  }

  handleClickGame1(x, y) {
    const { startX, startY, cellSize, cols, rows, grid } = this.gameState;
    const col = Math.floor((x - startX) / cellSize);
    const row = Math.floor((y - startY) / cellSize);

    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      const tile = grid[row][col];
      tile.rot = (tile.rot + 1) % 4;

      if (window.gameAudio) {
        window.gameAudio.playClick();
      }

      this.checkGame1Connections();
    }
  }

  updateGame1(dt) {
    const { grid, cols, rows, lightParticles, startX, startY, cellSize } = this.gameState;

    // Tạo các hạt xung quang chạy dọc theo cáp active
    if (Math.random() > 0.4) {
      const activeTiles = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (grid[r][c].active) activeTiles.push(grid[r][c]);
        }
      }
      if (activeTiles.length > 0) {
        const t = activeTiles[Math.floor(Math.random() * activeTiles.length)];
        const cx = startX + t.col * cellSize + cellSize / 2;
        const cy = startY + t.row * cellSize + cellSize / 2;
        lightParticles.push({
          x: cx + (Math.random() - 0.5) * 30,
          y: cy + (Math.random() - 0.5) * 30,
          vx: (Math.random() - 0.5) * 25,
          vy: (Math.random() - 0.5) * 25,
          life: 0.6,
          maxLife: 0.6,
          color: this.gameState.connectedPath ? "#ffd700" : "#ff9f43"
        });
      }
    }

    for (let i = lightParticles.length - 1; i >= 0; i--) {
      const p = lightParticles[i];
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.life <= 0) lightParticles.splice(i, 1);
    }
  }

  updateGame1Status() {
    const statusEl = document.getElementById('minigame-status-bar');
    if (!statusEl || this.gameWon) return;

    const ping = this.gameState.ping;
    const statusText = this.gameState.connectedPath
      ? `<span class="stat-badge green">● KẾT NỐI HOÀN HẢO (100% Uptime)</span>`
      : `<span class="stat-badge orange">● Đang thông luồng cáp...</span>`;

    statusEl.innerHTML = `
      <div class="stat-item">
        <span class="stat-label">Hạ Tầng:</span>
        <span class="stat-val">DC Phổ Nhĩ ➔ Cloud</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Độ Trễ (Latency):</span>
        <span class="stat-val ${ping < 10 ? 'highlight-green' : ''}"><strong>${ping} ms</strong></span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Trạng Thái:</span>
        ${statusText}
      </div>
    `;
  }

  renderGame1() {
    const { startX, startY, cellSize, cols, rows, grid, lightParticles, connectedPath } = this.gameState;

    // 1. Nền lưới công nghệ / mạch vi mạch
    this.ctx.fillStyle = "#160e08";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Grid lines mờ
    this.ctx.strokeStyle = "rgba(212, 175, 55, 0.08)";
    this.ctx.lineWidth = 1;
    for (let x = 0; x < this.canvas.width; x += 22) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.canvas.height; y += 22) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }

    // 2. Vẽ Cổng Vào Data Center (bên trái)
    const dcY = startY + 1 * cellSize + cellSize / 2;
    this.renderNodeEndpoint(startX - 36, dcY, "🏢 Data Center", true, "#e67e22");

    // 3. Vẽ Cổng Ra Cloud (bên phải)
    const cloudX = startX + cols * cellSize + 36;
    this.renderNodeEndpoint(cloudX, dcY, "☁️ Cloud Infra", connectedPath, connectedPath ? "#2ecc71" : "#555");

    // Dây nối từ DC vào ô (0, 1)
    this.ctx.strokeStyle = "#e67e22";
    this.ctx.lineWidth = 8;
    this.ctx.beginPath();
    this.ctx.moveTo(startX - 20, dcY);
    this.ctx.lineTo(startX, dcY);
    this.ctx.stroke();

    // Dây nối từ ô (3, 1) sang Cloud
    this.ctx.strokeStyle = connectedPath ? "#2ecc71" : "#3e2723";
    this.ctx.beginPath();
    this.ctx.moveTo(startX + cols * cellSize, dcY);
    this.ctx.lineTo(cloudX - 16, dcY);
    this.ctx.stroke();

    // 4. Vẽ các ô Cáp Quang
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tile = grid[r][c];
        const tx = startX + c * cellSize;
        const ty = startY + r * cellSize;
        this.renderCableTile(tile, tx, ty, cellSize);
      }
    }

    // 5. Vẽ hạt xung ánh sáng
    lightParticles.forEach(p => {
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  renderNodeEndpoint(x, y, label, active, color) {
    this.ctx.save();
    // Vầng sáng
    if (active) {
      const grad = this.ctx.createRadialGradient(x, y, 5, x, y, 32);
      grad.addColorStop(0, color);
      grad.addColorStop(1, "transparent");
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(x, y, 32, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Trụ node
    this.ctx.fillStyle = "#2c170b";
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2.5;
    this.ctx.beginPath();
    this.ctx.arc(x, y, 22, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Icon / Label
    this.ctx.font = "bold 11px 'Cinzel', serif";
    this.ctx.fillStyle = active ? "#ffd700" : "#a88448";
    this.ctx.textAlign = "center";
    this.ctx.fillText(label, x, y + 36);
    this.ctx.restore();
  }

  renderCableTile(tile, tx, ty, size) {
    const cx = tx + size / 2;
    const cy = ty + size / 2;
    const pad = 4;

    this.ctx.save();
    // Nền ô gạch mạch điện
    this.ctx.fillStyle = tile.active ? "rgba(44, 25, 14, 0.95)" : "rgba(25, 14, 8, 0.9)";
    this.ctx.strokeStyle = tile.active ? "rgba(230, 126, 34, 0.7)" : "#4a2c16";
    this.ctx.lineWidth = 1.5;
    if (this.ctx.roundRect) {
      this.ctx.roundRect(tx + pad, ty + pad, size - pad * 2, size - pad * 2, 6);
    } else {
      this.ctx.rect(tx + pad, ty + pad, size - pad * 2, size - pad * 2);
    }
    this.ctx.fill();
    this.ctx.stroke();

    // Cáp quang
    const openings = this.getTileOpenings(tile.type, tile.rot);
    const wireColor = tile.active ? (this.gameState.connectedPath ? "#2ecc71" : "#ffd700") : "#5d3e23";
    const glowColor = tile.active ? (this.gameState.connectedPath ? "rgba(46, 204, 113, 0.5)" : "rgba(255, 215, 0, 0.4)") : "transparent";

    // Glow ngoài
    if (tile.active) {
      this.ctx.strokeStyle = glowColor;
      this.ctx.lineWidth = 16;
      this.ctx.lineCap = "round";
      this.drawCableLines(cx, cy, size, openings);
    }

    // Lõi cáp
    this.ctx.strokeStyle = wireColor;
    this.ctx.lineWidth = 8;
    this.ctx.lineCap = "round";
    this.drawCableLines(cx, cy, size, openings);

    // Mối nối ở tâm
    this.ctx.fillStyle = wireColor;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, 7, 0, Math.PI * 2);
    this.ctx.fill();

    // Mũi tên xoay nhẹ ở góc ô để người chơi biết có thể click xoay
    this.ctx.fillStyle = "rgba(255, 215, 0, 0.3)";
    this.ctx.font = "10px sans-serif";
    this.ctx.textAlign = "right";
    this.ctx.fillText("↻", tx + size - 8, ty + 16);

    this.ctx.restore();
  }

  drawCableLines(cx, cy, size, openings) {
    const half = size / 2 - 4;
    this.ctx.beginPath();
    if (openings[0]) { // Top
      this.ctx.moveTo(cx, cy);
      this.ctx.lineTo(cx, cy - half);
    }
    if (openings[1]) { // Right
      this.ctx.moveTo(cx, cy);
      this.ctx.lineTo(cx + half, cy);
    }
    if (openings[2]) { // Bottom
      this.ctx.moveTo(cx, cy);
      this.ctx.lineTo(cx, cy + half);
    }
    if (openings[3]) { // Left
      this.ctx.moveTo(cx, cy);
      this.ctx.lineTo(cx - half, cy);
    }
    this.ctx.stroke();
  }

  // =========================================================================
  // MINI-GAME 2: VƯỜN ƯƠM MÃ NGUỒN (BUG SLAYER & BUILD 100% - SOFTWARE DEV)
  // =========================================================================
  initGame2_BugSlayer() {
    this.gameState = {
      buildProgress: 0,
      bugCount: 0,
      player: {
        x: this.canvas.width / 2,
        y: this.canvas.height - 45,
        targetX: this.canvas.width / 2,
        width: 70,
        height: 24,
        speed: 400
      },
      items: [],
      particles: [],
      spawnTimer: 0,
      terminalLogs: [
        "> git checkout -b release/cto-birthday",
        "> npm run build:start",
        "> Hứng các khối Feature xanh & Diệt bọ đỏ Bug!"
      ]
    };

    this.updateGame2Status();
  }

  triggerHotfixGame2() {
    const { items, particles, player } = this.gameState;
    // Tìm con bug gần nhất để tiêu diệt
    const bugs = items.filter(it => it.type === 'bug');
    if (bugs.length > 0) {
      bugs.sort((a, b) => b.y - a.y);
      const targetBug = bugs[0];
      targetBug.dead = true;

      if (window.gameAudio) {
        window.gameAudio.playBell(1200);
      }

      // Nổ tia sáng
      for (let i = 0; i < 15; i++) {
        particles.push({
          x: targetBug.x,
          y: targetBug.y,
          vx: (Math.random() - 0.5) * 180,
          vy: (Math.random() - 0.5) * 180,
          life: 0.5,
          color: "#ffd700",
          text: i === 0 ? "HOTFIX OK!" : null
        });
      }

      this.gameState.buildProgress = Math.min(100, this.gameState.buildProgress + 10);
      this.addTerminalLog(`> [HOTFIX APPLIED] Resolved Bug at 0x${Math.floor(Math.random()*9999).toString(16).toUpperCase()}`);
      this.updateGame2Status();

      if (this.gameState.buildProgress >= 100) {
        this.completeGame(2);
      }
    }
  }

  handleClickGame2(x, y) {
    const { items, particles } = this.gameState;
    // Kiểm tra xem click trúng con Bug nào không
    const clickedBug = items.find(it => it.type === 'bug' && Math.hypot(it.x - x, it.y - y) < 28);
    if (clickedBug) {
      clickedBug.dead = true;
      if (window.gameAudio) window.gameAudio.playBell(1200);

      for (let i = 0; i < 12; i++) {
        particles.push({
          x: clickedBug.x,
          y: clickedBug.y,
          vx: (Math.random() - 0.5) * 160,
          vy: (Math.random() - 0.5) * 160,
          life: 0.5,
          color: "#2ecc71",
          text: i === 0 ? "BUG KILLED!" : null
        });
      }

      this.gameState.buildProgress = Math.min(100, this.gameState.buildProgress + 10);
      this.addTerminalLog("> [CLICK KILL] 1 Bug Slayed! +10% Build");
      this.updateGame2Status();

      if (this.gameState.buildProgress >= 100) {
        this.completeGame(2);
      }
    }
  }

  addTerminalLog(text) {
    this.gameState.terminalLogs.push(text);
    if (this.gameState.terminalLogs.length > 4) {
      this.gameState.terminalLogs.shift();
    }
  }

  updateGame2(dt) {
    const { player, items, particles } = this.gameState;

    // Di chuyển nhân vật mượt
    const dx = player.targetX - player.x;
    player.x += dx * Math.min(1, dt * 12);

    // Di chuyển bằng phím
    if (this.inputState.keys['arrowleft'] || this.inputState.keys['a']) {
      player.x = Math.max(35, player.x - player.speed * dt);
      player.targetX = player.x;
    }
    if (this.inputState.keys['arrowright'] || this.inputState.keys['d']) {
      player.x = Math.min(this.canvas.width - 35, player.x + player.speed * dt);
      player.targetX = player.x;
    }

    // Sinh vật phẩm rơi xuống
    this.gameState.spawnTimer += dt;
    if (this.gameState.spawnTimer > 0.85) {
      this.gameState.spawnTimer = 0;
      const rand = Math.random();
      let type = 'fe';
      let label = 'React UI';
      let color = '#3498db';

      if (rand < 0.28) {
        type = 'fe';
        label = 'Frontend';
        color = '#3498db';
      } else if (rand < 0.56) {
        type = 'be';
        label = 'Backend API';
        color = '#2ecc71';
      } else if (rand < 0.78) {
        type = 'db';
        label = 'Database';
        color = '#f1c40f';
      } else {
        type = 'bug';
        label = '🐞 BUG';
        color = '#e74c3c';
      }

      items.push({
        x: 40 + Math.random() * (this.canvas.width - 80),
        y: -20,
        vy: 110 + Math.random() * 60,
        type,
        label,
        color,
        dead: false
      });
    }

    // Cập nhật vị trí items & va chạm với giỏ
    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i];
      it.y += it.vy * dt;

      // Kiểm tra hứng trúng
      const distY = Math.abs(it.y - player.y);
      const distX = Math.abs(it.x - player.x);

      if (distY < 20 && distX < player.width / 2 + 12 && !it.dead) {
        it.dead = true;
        if (it.type === 'bug') {
          // Trúng bug -> Bị trừ nhẹ điểm
          this.gameState.buildProgress = Math.max(0, this.gameState.buildProgress - 8);
          this.gameState.bugCount += 1;
          this.addTerminalLog("> [WARNING] Bug reached main branch! -8% Build");
          if (window.gameAudio) window.gameAudio.playClick();
        } else {
          // Hứng trúng module tốt -> Tăng điểm
          this.gameState.buildProgress = Math.min(100, this.gameState.buildProgress + 15);
          this.addTerminalLog(`> [MERGE OK] ${it.label} merged into main! +15%`);
          if (window.gameAudio) window.gameAudio.playBell(880);
        }

        this.updateGame2Status();

        if (this.gameState.buildProgress >= 100) {
          this.completeGame(2);
        }
      }

      if (it.y > this.canvas.height + 25 || it.dead) {
        items.splice(i, 1);
      }
    }

    // Cập nhật hạt
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.life <= 0) particles.splice(i, 1);
    }
  }

  updateGame2Status() {
    const statusEl = document.getElementById('minigame-status-bar');
    if (!statusEl || this.gameWon) return;

    const prog = this.gameState.buildProgress;
    statusEl.innerHTML = `
      <div class="stat-item flex-2">
        <span class="stat-label">Tiến Độ Build CI/CD:</span>
        <div class="build-progress-bar">
          <div class="build-fill" style="width: ${prog}%"></div>
          <span class="build-percent">${prog}%</span>
        </div>
      </div>
      <div class="stat-item">
        <span class="stat-label">Trạng Thái:</span>
        <span class="stat-val ${prog >= 100 ? 'highlight-green' : ''}">${prog >= 100 ? 'BUILD PASSED!' : 'Đang Biên Dịch...'}</span>
      </div>
    `;
  }

  renderGame2() {
    const { player, items, particles, terminalLogs, buildProgress } = this.gameState;

    // Nền tối phong cách IDE / Terminal
    this.ctx.fillStyle = "#121417";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Dải Terminal trên đỉnh
    this.ctx.fillStyle = "rgba(20, 24, 30, 0.85)";
    this.ctx.fillRect(10, 10, this.canvas.width - 20, 68);
    this.ctx.strokeStyle = "#27ae60";
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(10, 10, this.canvas.width - 20, 68);

    this.ctx.font = "11px 'Courier New', monospace";
    this.ctx.fillStyle = "#2ecc71";
    this.ctx.textAlign = "left";
    terminalLogs.forEach((log, idx) => {
      this.ctx.fillText(log, 20, 28 + idx * 16);
    });

    // Vẽ các items rơi
    items.forEach(it => {
      this.ctx.save();
      if (it.type === 'bug') {
        // Con bug đỏ nhấp nháy
        this.ctx.fillStyle = it.color;
        this.ctx.beginPath();
        this.ctx.arc(it.x, it.y, 14, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = "#fff";
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();

        this.ctx.font = "bold 13px sans-serif";
        this.ctx.fillStyle = "#fff";
        this.ctx.textAlign = "center";
        this.ctx.fillText("🐞", it.x, it.y + 5);
      } else {
        // Hộp Module
        this.ctx.fillStyle = it.color;
        if (this.ctx.roundRect) {
          this.ctx.roundRect(it.x - 34, it.y - 12, 68, 24, 4);
        } else {
          this.ctx.rect(it.x - 34, it.y - 12, 68, 24);
        }
        this.ctx.fill();
        this.ctx.strokeStyle = "#fff";
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        this.ctx.font = "bold 11px sans-serif";
        this.ctx.fillStyle = "#fff";
        this.ctx.textAlign = "center";
        this.ctx.fillText(it.label, it.x, it.y + 4);
      }
      this.ctx.restore();
    });

    // Vẽ bệ đỡ Developer Platform
    this.ctx.save();
    const pw = player.width;
    const ph = player.height;
    const px = player.x - pw / 2;
    const py = player.y - ph / 2;

    this.ctx.fillStyle = "#2ecc71";
    this.ctx.shadowColor = "rgba(46, 204, 113, 0.6)";
    this.ctx.shadowBlur = 12;
    if (this.ctx.roundRect) {
      this.ctx.roundRect(px, py, pw, ph, 6);
    } else {
      this.ctx.rect(px, py, pw, ph);
    }
    this.ctx.fill();
    this.ctx.strokeStyle = "#ffd700";
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    this.ctx.font = "bold 11px 'Cinzel', serif";
    this.ctx.fillStyle = "#121417";
    this.ctx.textAlign = "center";
    this.ctx.fillText("💻 Dev Dock", player.x, player.y + 4);
    this.ctx.restore();

    // Hạt hiệu ứng
    particles.forEach(p => {
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      this.ctx.fill();

      if (p.text) {
        this.ctx.font = "bold 12px sans-serif";
        this.ctx.fillStyle = p.color;
        this.ctx.fillText(p.text, p.x, p.y - 10);
      }
    });
  }

  // =========================================================================
  // MINI-GAME 3: CÂN BẰNG ÁP SUẤT GUỒNG NƯỚC (LOAD BALANCER - OPS & DEVOPS)
  // =========================================================================
  initGame3_LoadBalancer() {
    this.gameState = {
      nodes: [
        { id: 1, name: "Node A (Web)", level: 50, safeMin: 25, safeMax: 75, targetLevel: 50 },
        { id: 2, name: "Node B (API)", level: 45, safeMin: 25, safeMax: 75, targetLevel: 45 },
        { id: 3, name: "Node C (Task)", level: 55, safeMin: 25, safeMax: 75, targetLevel: 55 }
      ],
      remainingTime: 12.0, // 12 giây giữ vững hệ thống
      surgeTimer: 2.0,
      uptime: 99.900,
      wheelAngle: 0,
      burstLog: "Hệ thống đang tiếp nhận traffic giờ cao điểm..."
    };

    this.updateGame3Status();
  }

  balanceValveGame3(sourceIdx) {
    const { nodes } = this.gameState;
    if (sourceIdx < 0 || sourceIdx >= nodes.length) return;

    if (window.gameAudio) {
      window.gameAudio.playClick();
      window.gameAudio.playTeaPour();
    }

    const drainAmount = 24;
    nodes[sourceIdx].level = Math.max(10, nodes[sourceIdx].level - drainAmount);

    // Chia đều lượng tải sang 2 node còn lại
    const share = drainAmount / 2;
    for (let i = 0; i < nodes.length; i++) {
      if (i !== sourceIdx) {
        nodes[i].level = Math.min(95, nodes[i].level + share);
      }
    }

    this.gameState.burstLog = `> Van ${nodes[sourceIdx].name} xả tải sang các cụm lân cận!`;
    this.updateGame3Status();
  }

  handleClickGame3(x, y) {
    const tankWidth = 90;
    const spacing = 160;
    const startX = (this.canvas.width - 2 * spacing) / 2;
    const btnY = 310;

    for (let i = 0; i < 3; i++) {
      const tx = startX + i * spacing;
      // Click vào nút điều tiết hoặc thân bồn
      if (Math.abs(x - tx) < 55 && y > 100 && y < btnY + 40) {
        this.balanceValveGame3(i);
        break;
      }
    }
  }

  updateGame3(dt) {
    const { nodes } = this.gameState;

    this.gameState.wheelAngle += dt * 2.5;
    this.gameState.remainingTime -= dt;

    // Sinh đợt traffic đột biến (Flash Sale / Spike)
    this.gameState.surgeTimer -= dt;
    if (this.gameState.surgeTimer <= 0) {
      this.gameState.surgeTimer = 2.2 + Math.random() * 1.5;
      const targetNode = nodes[Math.floor(Math.random() * nodes.length)];
      const surgeVal = 18 + Math.random() * 16;
      targetNode.level = Math.min(98, targetNode.level + surgeVal);
      this.gameState.burstLog = `⚠️ [TRAFFIC SPIKE] Lưu lượng ập vào ${targetNode.name}!`;

      if (window.gameAudio) {
        window.gameAudio.playClick();
      }
    }

    // Các node tự tăng nhẹ mức nước do dòng chảy liên tục
    nodes.forEach(n => {
      n.level += dt * 3.5;
      if (n.level > 100) n.level = 100;
      if (n.level < 0) n.level = 0;
    });

    // Kiểm tra an toàn: nếu cả 3 node đều trong vùng an toàn (25 - 80) -> Tăng Uptime
    const allSafe = nodes.every(n => n.level >= 25 && n.level <= 80);
    if (allSafe) {
      this.gameState.uptime = Math.min(99.999, this.gameState.uptime + dt * 0.015);
    } else {
      this.gameState.uptime = Math.max(99.000, this.gameState.uptime - dt * 0.05);
    }

    this.updateGame3Status();

    // Hết giờ mà không sập -> Chiến thắng!
    if (this.gameState.remainingTime <= 0) {
      this.completeGame(3);
    }
  }

  updateGame3Status() {
    const statusEl = document.getElementById('minigame-status-bar');
    if (!statusEl || this.gameWon) return;

    const time = Math.max(0, this.gameState.remainingTime).toFixed(1);
    const uptime = this.gameState.uptime.toFixed(3);

    statusEl.innerHTML = `
      <div class="stat-item">
        <span class="stat-label">Thời Gian Duy Trì:</span>
        <span class="stat-val highlight-green"><strong>${time} s</strong></span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Chỉ Số SLA Uptime:</span>
        <span class="stat-val gold"><strong>${uptime}%</strong></span>
      </div>
      <div class="stat-item flex-2">
        <span class="stat-label">Nhật Ký Tải:</span>
        <span class="stat-val font-mono">${this.gameState.burstLog}</span>
      </div>
    `;
  }

  renderGame3() {
    const { nodes, wheelAngle } = this.gameState;

    // Nền suối nước xanh phong cách Zen
    this.ctx.fillStyle = "#0e1a1a";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Vẽ Bánh xe nước quay ở góc trên
    this.renderWaterWheel(80, 70, 42, wheelAngle);

    // Vẽ 3 Trụ Nước / Server Nodes
    const spacing = 160;
    const startX = (this.canvas.width - 2 * spacing) / 2;
    const tankH = 170;
    const tankW = 60;
    const topY = 110;

    nodes.forEach((n, idx) => {
      const tx = startX + idx * spacing;
      this.renderWaterTank(n, tx, topY, tankW, tankH, idx);
    });
  }

  renderWaterWheel(cx, cy, radius, angle) {
    this.ctx.save();
    this.ctx.translate(cx, cy);
    this.ctx.rotate(angle);

    // Vành gỗ
    this.ctx.strokeStyle = "#8d5b2d";
    this.ctx.lineWidth = 5;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
    this.ctx.stroke();

    // 8 Nan hoa
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
      this.ctx.stroke();
    }

    // Tâm
    this.ctx.fillStyle = "#ffd700";
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 7, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();

    this.ctx.font = "bold 10.5px 'Cinzel', serif";
    this.ctx.fillStyle = "#a88448";
    this.ctx.textAlign = "center";
    this.ctx.fillText("Guồng Nước 24/7", cx, cy + radius + 16);
  }

  renderWaterTank(node, cx, topY, w, h, idx) {
    this.ctx.save();
    const isOverload = node.level > 80;
    const isStarved = node.level < 25;
    const isSafe = !isOverload && !isStarved;

    // 1. Thân bồn nước kính
    this.ctx.fillStyle = "rgba(10, 24, 28, 0.85)";
    this.ctx.strokeStyle = isOverload ? "#e74c3c" : (isSafe ? "#2ecc71" : "#e67e22");
    this.ctx.lineWidth = 2.5;
    if (this.ctx.roundRect) {
      this.ctx.roundRect(cx - w / 2, topY, w, h, 8);
    } else {
      this.ctx.rect(cx - w / 2, topY, w, h);
    }
    this.ctx.fill();
    this.ctx.stroke();

    // 2. Vạch an toàn (Safe Zone 25% - 75%)
    const safeTop = topY + h * (1 - 0.75);
    const safeBottom = topY + h * (1 - 0.25);
    this.ctx.fillStyle = "rgba(46, 204, 113, 0.12)";
    this.ctx.fillRect(cx - w / 2 + 2, safeTop, w - 4, safeBottom - safeTop);

    this.ctx.strokeStyle = "rgba(46, 204, 113, 0.4)";
    this.ctx.setLineDash([3, 3]);
    this.ctx.beginPath();
    this.ctx.moveTo(cx - w / 2, safeTop);
    this.ctx.lineTo(cx + w / 2, safeTop);
    this.ctx.moveTo(cx - w / 2, safeBottom);
    this.ctx.lineTo(cx + w / 2, safeBottom);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // 3. Mực nước động
    const waterHeight = (h * node.level) / 100;
    const waterY = topY + h - waterHeight;
    const waterGrad = this.ctx.createLinearGradient(0, waterY, 0, topY + h);
    if (isOverload) {
      waterGrad.addColorStop(0, "rgba(231, 76, 60, 0.85)");
      waterGrad.addColorStop(1, "rgba(192, 57, 43, 0.95)");
    } else {
      waterGrad.addColorStop(0, "rgba(26, 188, 156, 0.8)");
      waterGrad.addColorStop(1, "rgba(22, 160, 133, 0.95)");
    }

    this.ctx.fillStyle = waterGrad;
    this.ctx.beginPath();
    this.ctx.rect(cx - w / 2 + 2, waterY, w - 4, waterHeight - 2);
    this.ctx.fill();

    // 4. Tiêu đề Node & Phần trăm tải
    this.ctx.font = "bold 12px 'Noto Serif TC', serif";
    this.ctx.fillStyle = "#ffd700";
    this.ctx.textAlign = "center";
    this.ctx.fillText(node.name, cx, topY - 10);

    this.ctx.font = "bold 13px sans-serif";
    this.ctx.fillStyle = isOverload ? "#ff7675" : (isSafe ? "#2ecc71" : "#ffa502");
    this.ctx.fillText(`${Math.round(node.level)}%`, cx, waterY - 8);

    // 5. Nút gạt / Van điều tiết bên dưới
    const btnY = topY + h + 18;
    this.ctx.fillStyle = "linear-gradient(180deg, #3d2312 0%, #1f1007 100%)";
    this.ctx.fillStyle = "#4a2f18";
    this.ctx.strokeStyle = "#ffd700";
    this.ctx.lineWidth = 1.5;
    if (this.ctx.roundRect) {
      this.ctx.roundRect(cx - 46, btnY, 92, 30, 6);
    } else {
      this.ctx.rect(cx - 46, btnY, 92, 30);
    }
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.font = "bold 11px 'Cinzel', serif";
    this.ctx.fillStyle = "#ffd700";
    this.ctx.fillText(`[${idx + 1}] Xả Van`, cx, btnY + 19);

    this.ctx.restore();
  }

  // =========================================================================
  // HIỆU ỨNG CHIẾN THẮNG CHUNG CHO CẢ 3 MINI-GAMES
  // =========================================================================
  renderVictoryOverlay() {
    this.ctx.save();
    // Vầng hào quang mạ vàng
    const grad = this.ctx.createRadialGradient(
      this.canvas.width / 2, this.canvas.height / 2, 40,
      this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 2
    );
    grad.addColorStop(0, "rgba(255, 215, 0, 0.15)");
    grad.addColorStop(1, "transparent");
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.restore();
  }
}

// Khởi tạo MiniGameManager toàn cục
window.miniGameManager = new MiniGameManager();
