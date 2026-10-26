/**
 * XƯỞNG TẠO THIỆP SINH NHẬT CTO - CARD CREATOR CONTROLLER
 * Xử lý tạo thiệp riêng biệt, đổi giao diện (Mario / Zen / Cyber),
 * xuất ảnh thiệp PNG sắc nét và đồng bộ dữ liệu với Màn Đi Cảnh.
 */

class CardCreatorApp {
  constructor() {
    this.selectedTheme = 'zen';
    this.selectedBadge = '🎂';
    this.selectedImageData = null;
    this.init();
  }

  init() {
    this.initBgCanvas();
    this.initAudio();
    this.bindThemeEvents();
    this.bindBadgeEvents();
    this.bindTemplateChips();
    this.bindImageUpload();
    this.initPresetAvatars();
    this.bindFormLiveSync();
    this.bindActions();
    this.bindWallEvents();
    this.renderWall();
  }

  // --- 1. HIỆU ỨNG NỀN HẠT VÀNG & SAO BAY LẤP LÁNH ---
  initBgCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = 45;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: 1 + Math.random() * 2.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.3 - Math.random() * 0.6,
        alpha: 0.2 + Math.random() * 0.6,
        gold: Math.random() > 0.4
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < 0) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? `rgba(255, 215, 0, ${p.alpha})`
          : `rgba(255, 255, 255, ${p.alpha * 0.7})`;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };
    animate();
  }

  // --- 2. HỆ THỐNG ÂM THANH SUPER MARIO ---
  initAudio() {
    const btnAudio = document.getElementById('btn-audio-toggle');
    if (!btnAudio) return;

    const startSoundOnFirstClick = () => {
      if (window.gameAudio && !window.gameAudio.initialized) {
        window.gameAudio.init();
        window.gameAudio.startBGM();
      }
      document.removeEventListener('click', startSoundOnFirstClick);
    };
    document.addEventListener('click', startSoundOnFirstClick);

    btnAudio.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!window.gameAudio.initialized) {
        window.gameAudio.init();
      }
      const isPlaying = window.gameAudio.toggleMute();
      btnAudio.innerHTML = isPlaying
        ? '<span>🎵 Nhạc Nền: BẬT</span>'
        : '<span>🔇 Nhạc Nền: TẮT</span>';
    });
  }

  // --- 3. ĐỔI PHONG CÁCH THIỆP (MARIO / ZEN / CYBER) ---
  bindThemeEvents() {
    document.querySelectorAll('.theme-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.gameAudio) window.gameAudio.playJump();
        document.querySelectorAll('.theme-opt-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedTheme = btn.dataset.theme;

        const liveFrame = document.getElementById('live-card-frame');
        liveFrame.className = `live-card-frame theme-${this.selectedTheme}`;
      });
    });
  }

  // --- 4. CHỌN HUY HIỆU SINH NHẬT ---
  bindBadgeEvents() {
    document.querySelectorAll('.badge-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.gameAudio) window.gameAudio.playCoin();
        document.querySelectorAll('.badge-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedBadge = btn.dataset.icon || '🎂';
        this.updateLiveCard();
      });
    });
  }

  // --- 5. GỢI Ý CÂU CHÚC NHANH (1-CLICK CHIPS) ---
  bindTemplateChips() {
    const msgInput = document.getElementById('card-message');
    document.querySelectorAll('.chip-btn').forEach(chip => {
      chip.addEventListener('click', () => {
        if (window.gameAudio) window.gameAudio.playPowerup();
        msgInput.value = chip.dataset.text || '';
        this.updateLiveCard();
        msgInput.focus();
      });
    });
  }

  // --- 6. TẢI ẢNH KỶ NIỆM & PRESETS ---
  bindImageUpload() {
    const uploadBox = document.getElementById('upload-box');
    const fileInput = document.getElementById('photo-file-input');
    const btnRemove = document.getElementById('btn-remove-photo');

    if (uploadBox && fileInput) {
      uploadBox.addEventListener('click', (e) => {
        if (e.target !== btnRemove && !e.target.closest('#btn-remove-photo')) {
          fileInput.click();
        }
      });

      fileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          this.processImageFile(file);
        }
      });
    }

    if (btnRemove) {
      btnRemove.addEventListener('click', (e) => {
        e.stopPropagation();
        this.clearSelectedImage();
      });
    }
  }

  processImageFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 600;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) { h = (h / w) * maxDim; w = maxDim; }
          else { w = (w / h) * maxDim; h = maxDim; }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        this.setSelectedImage(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  setSelectedImage(dataUrl) {
    this.selectedImageData = dataUrl;
    document.getElementById('upload-prompt').style.display = 'none';
    document.getElementById('upload-preview-wrap').style.display = 'flex';
    document.getElementById('upload-preview-img').src = dataUrl;
    this.updateLiveCard();
  }

  clearSelectedImage() {
    this.selectedImageData = null;
    document.getElementById('upload-prompt').style.display = 'flex';
    document.getElementById('upload-preview-wrap').style.display = 'none';
    document.getElementById('photo-file-input').value = '';
    document.querySelectorAll('.preset-avatar-btn').forEach(b => b.classList.remove('selected'));
    this.updateLiveCard();
  }

  initPresetAvatars() {
    const container = document.getElementById('preset-avatars-bar');
    if (!container || typeof PRESET_AVATARS === 'undefined') return;
    container.innerHTML = "";
    PRESET_AVATARS.forEach(p => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'preset-avatar-btn';
      btn.innerHTML = `<img src="${p.data}" alt="${p.name}"> <span>${p.name}</span>`;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.gameAudio) window.gameAudio.playClick();
        container.querySelectorAll('.preset-avatar-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.setSelectedImage(p.data);
      });
      container.appendChild(btn);
    });
  }

  // --- 7. ĐỒNG BỘ NỘI DUNG FORM TRỰC TIẾP LÊN THẺ BÀI ---
  bindFormLiveSync() {
    const authorInput = document.getElementById('card-author');
    const realmSelect = document.getElementById('card-realm');
    const msgInput = document.getElementById('card-message');

    if (authorInput) authorInput.addEventListener('input', () => this.updateLiveCard());
    if (realmSelect) realmSelect.addEventListener('change', () => this.updateLiveCard());
    if (msgInput) msgInput.addEventListener('input', () => this.updateLiveCard());

    this.updateLiveCard();
  }

  updateLiveCard() {
    const authorVal = (document.getElementById('card-author')?.value || '').trim();
    const realmId = Number(document.getElementById('card-realm')?.value || 1);
    const msgVal = (document.getElementById('card-message')?.value || '').trim();

    const realmData = REALMS_DATA[realmId] || REALMS_DATA[1];

    const previewAuthor = document.getElementById('live-author');
    const previewDept = document.getElementById('live-dept');
    const previewBadge = document.getElementById('live-badge');
    const previewMsg = document.getElementById('live-msg');
    const previewRealm = document.getElementById('live-realm-tag');
    const previewImgWrap = document.getElementById('live-img-wrap');
    const previewImg = document.getElementById('live-img');

    if (previewAuthor) previewAuthor.textContent = authorVal || "Tên Người Gửi / Đội Ngũ";
    if (previewDept) previewDept.textContent = `${realmData.name} (${realmData.department})`;
    if (previewBadge) previewBadge.textContent = this.selectedBadge;
    if (previewRealm) previewRealm.textContent = realmData.name;
    if (previewMsg) {
      previewMsg.textContent = msgVal
        ? `"${msgVal}"`
        : `"Chúc Sếp tuổi mới luôn tràn đầy năng lượng, dẫn dắt khối công nghệ vươn tới những đỉnh cao mới!"`;
    }

    if (previewImgWrap && previewImg) {
      if (this.selectedImageData) {
        previewImg.src = this.selectedImageData;
        previewImgWrap.style.display = 'block';
      } else {
        previewImgWrap.style.display = 'none';
      }
    }
  }

  // --- 8. CÁC NÚT HÀNH ĐỘNG: LƯU & XUẤT ẢNH THIỆP PNG ---
  bindActions() {
    const form = document.getElementById('card-creator-form');
    const btnDownload = document.getElementById('btn-download-png');
    const btnReset = document.getElementById('btn-reset-form');

    // Lưu & Treo Thiệp (Gửi Lời Chúc)
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitCard();
      });
    }

    // Tải ảnh thiệp PNG sắc nét
    if (btnDownload) {
      btnDownload.addEventListener('click', () => {
        this.exportCardImage();
      });
    }

    // Làm lại / Reset form
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm("Làm mới lại toàn bộ khung thiệp?")) {
          form.reset();
          this.clearSelectedImage();
          this.updateLiveCard();
        }
      });
    }
  }

  submitCard() {
    const author = (document.getElementById('card-author')?.value || '').trim();
    const realmId = Number(document.getElementById('card-realm')?.value || 1);
    const msg = (document.getElementById('card-message')?.value || '').trim();

    if (!author || !msg) {
      alert("Vui lòng nhập tên người gửi và lời chúc!");
      return;
    }

    const realmData = REALMS_DATA[realmId] || REALMS_DATA[1];

    const newWish = window.wishStorage.addWish({
      realmId: realmId,
      author: author,
      department: realmData.department,
      badge: this.selectedBadge,
      message: msg,
      image: this.selectedImageData || realmData.assetIcon || PRESET_AVATARS[0].data
    });

    // Mario SFX chúc mừng chiến thắng!
    if (window.gameAudio) {
      window.gameAudio.playCoin();
      setTimeout(() => window.gameAudio.playFanfare(), 250);
    }

    this.spawnConfetti();
    this.renderWall();

    // Reset Form
    document.getElementById('card-creator-form').reset();
    this.clearSelectedImage();
    this.updateLiveCard();

    // Cuộn mượt xuống Bức Tường Lời Chúc để chiêm ngưỡng
    const wallSec = document.getElementById('wall-section');
    if (wallSec) {
      wallSec.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Xuất thiệp ra ảnh PNG Full HD 1200x800 để gửi qua Slack/Zalo/Email
  exportCardImage() {
    if (window.gameAudio) window.gameAudio.playWishSaved();

    const author = (document.getElementById('card-author')?.value || 'Đồng Đội Khối Công Nghệ').trim();
    const realmId = Number(document.getElementById('card-realm')?.value || 1);
    const msg = (document.getElementById('card-message')?.value || 'Chúc mừng sinh nhật CTO!').trim();
    const realmData = REALMS_DATA[realmId] || REALMS_DATA[1];

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    // 1. Vẽ nền theo theme
    if (this.selectedTheme === 'mario') {
      // Sky blue
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 800);
      skyGrad.addColorStop(0, '#5c94fc');
      skyGrad.addColorStop(0.65, '#8ab4f8');
      skyGrad.addColorStop(0.65, '#e74c3c');
      skyGrad.addColorStop(1, '#c0392b');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, 1200, 800);

      // Pixel border
      ctx.lineWidth = 16;
      ctx.strokeStyle = '#000';
      ctx.strokeRect(8, 8, 1184, 784);
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#ffd700';
      ctx.strokeRect(20, 20, 1160, 760);
    } else if (this.selectedTheme === 'cyber') {
      const cybGrad = ctx.createLinearGradient(0, 0, 1200, 800);
      cybGrad.addColorStop(0, '#0b132b');
      cybGrad.addColorStop(0.5, '#1c2541');
      cybGrad.addColorStop(1, '#0b132b');
      ctx.fillStyle = cybGrad;
      ctx.fillRect(0, 0, 1200, 800);

      ctx.lineWidth = 8;
      ctx.strokeStyle = '#48cae4';
      ctx.strokeRect(16, 16, 1168, 768);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffd700';
      ctx.strokeRect(26, 26, 1148, 748);
    } else {
      // Zen Golden Wood
      const zenGrad = ctx.createLinearGradient(0, 0, 1200, 800);
      zenGrad.addColorStop(0, '#fce4b8');
      zenGrad.addColorStop(0.5, '#f4d39c');
      zenGrad.addColorStop(1, '#e6ba68');
      ctx.fillStyle = zenGrad;
      ctx.fillRect(0, 0, 1200, 800);

      ctx.lineWidth = 14;
      ctx.strokeStyle = '#784212';
      ctx.strokeRect(10, 10, 1180, 780);
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ffd700';
      ctx.strokeRect(24, 24, 1152, 752);

      // Red hanging cord
      ctx.fillStyle = '#c0392b';
      ctx.fillRect(594, 24, 12, 40);
      ctx.beginPath();
      ctx.arc(600, 68, 14, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Tiêu đề thiệp
    ctx.fillStyle = (this.selectedTheme === 'zen') ? '#512e16' : '#ffd700';
    ctx.font = 'bold 34px "Cinzel", serif, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✦ ĐẠI LỄ MỪNG SINH NHẬT CTO 2026 ✦', 600, 120);

    // Huy hiệu & Tên người gửi
    ctx.font = '54px sans-serif';
    ctx.fillText(this.selectedBadge, 600, 190);

    ctx.font = 'bold 36px "Noto Serif TC", serif, sans-serif';
    ctx.fillStyle = (this.selectedTheme === 'zen') ? '#3d1a04' : '#ffffff';
    ctx.fillText(author, 600, 245);

    ctx.font = '22px "Noto Serif TC", serif, sans-serif';
    ctx.fillStyle = (this.selectedTheme === 'zen') ? '#784212' : '#ffd700';
    ctx.fillText(`${realmData.name} • ${realmData.department}`, 600, 280);

    // Đường gạch ngang
    ctx.strokeStyle = (this.selectedTheme === 'zen') ? 'rgba(120, 66, 18, 0.4)' : 'rgba(255, 215, 0, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(200, 310);
    ctx.lineTo(1000, 310);
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. Lời chúc nhiều dòng (Word Wrap)
    ctx.font = 'italic 28px "Noto Serif TC", serif, sans-serif';
    ctx.fillStyle = (this.selectedTheme === 'zen') ? '#2b170c' : '#ffffff';
    ctx.textAlign = 'center';

    const maxLineW = 900;
    const words = `"${msg}"`.split(' ');
    let line = '';
    let startY = 370;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxLineW && n > 0) {
        ctx.fillText(line, 600, startY);
        line = words[n] + ' ';
        startY += 44;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 600, startY);

    // 4. Dấu mộc đỏ & Ngày tháng
    ctx.textAlign = 'left';
    ctx.font = '20px "Noto Serif TC", sans-serif';
    ctx.fillStyle = (this.selectedTheme === 'zen') ? '#784212' : '#ffd700';
    ctx.fillText(`Ngày gửi: ${new Date().toLocaleDateString('vi-VN')}`, 100, 740);

    // Con dấu đỏ 'Chúc'
    ctx.strokeStyle = '#c0392b';
    ctx.fillStyle = '#c0392b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(1100, 720, 36, 0, Math.PI * 2);
    ctx.stroke();
    ctx.textAlign = 'center';
    ctx.font = 'bold 34px "Noto Serif TC", serif';
    ctx.fillText('祝', 1100, 732);

    // 5. Tải file về
    const link = document.createElement('a');
    link.download = `Thiep_Mung_Sinh_Nhat_CTO_${author.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  // Hiệu ứng pháo hoa giấy Confetti rực rỡ
  spawnConfetti() {
    const colors = ['#ffd700', '#e74c3c', '#0984e3', '#2ecc71', '#f1c40f', '#9b59b6'];
    for (let i = 0; i < 70; i++) {
      const conf = document.createElement('div');
      conf.className = 'confetti';
      conf.style.left = Math.random() * window.innerWidth + 'px';
      conf.style.top = '-20px';
      conf.style.width = 8 + Math.random() * 10 + 'px';
      conf.style.height = 8 + Math.random() * 10 + 'px';
      conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      conf.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      conf.style.transition = `all ${1.8 + Math.random() * 1.5}s cubic-bezier(0.25, 1, 0.5, 1)`;

      document.body.appendChild(conf);

      setTimeout(() => {
        conf.style.transform = `translate(${(Math.random() - 0.5) * 300}px, ${window.innerHeight + 50}px) rotate(${Math.random() * 720}deg)`;
        conf.style.opacity = '0';
      }, 20);

      setTimeout(() => conf.remove(), 3500);
    }
  }

  // --- 9. BỨC TƯỜNG LỜI CHÚC (WISH WALL) ---
  bindWallEvents() {
    const filter = document.getElementById('wall-filter-dept');
    if (filter) {
      filter.addEventListener('change', (e) => {
        this.renderWall(e.target.value);
      });
    }

    const btnFirework = document.getElementById('btn-wall-fireworks');
    if (btnFirework) {
      btnFirework.addEventListener('click', () => {
        if (window.gameAudio) window.gameAudio.playFanfare();
        this.spawnConfetti();
      });
    }

    // Modal view chi tiết
    const modal = document.getElementById('view-modal');
    const btnClose = document.getElementById('view-close-btn');
    const backdrop = document.getElementById('view-backdrop');

    if (btnClose) btnClose.addEventListener('click', () => modal.classList.remove('active'));
    if (backdrop) backdrop.addEventListener('click', () => modal.classList.remove('active'));
  }

  renderWall(filterDept = 'all') {
    const grid = document.getElementById('wall-grid');
    const countEl = document.getElementById('wall-total-count');
    if (!grid || !window.wishStorage) return;

    grid.innerHTML = "";
    let wishes = window.wishStorage.getAllWishes();
    if (countEl) countEl.textContent = wishes.length;

    if (filterDept !== 'all') {
      wishes = wishes.filter(w => {
        const realmData = REALMS_DATA[w.realmId];
        return (w.department && w.department.toLowerCase().includes(filterDept.toLowerCase())) ||
               (realmData && realmData.department && realmData.department.toLowerCase().includes(filterDept.toLowerCase())) ||
               (realmData && realmData.name && realmData.name.toLowerCase().includes(filterDept.toLowerCase()));
      });
    }

    if (wishes.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #dcd0c0; font-size: 15px;">Chưa có lời chúc nào trong mục này. Hãy là người đầu tiên tạo thiệp nhé! ✨</div>`;
      return;
    }

    const sorted = [...wishes].reverse();

    sorted.forEach(wish => {
      const realmData = REALMS_DATA[wish.realmId] || REALMS_DATA[1];
      const card = document.createElement('div');
      card.className = 'wall-card-item';

      const badge = wish.badge || '🎂';
      const author = wish.author || 'Đồng Đội';
      const dept = wish.department || realmData.department;
      const date = wish.date || '20/10/2026';
      const msg = wish.message || '';

      card.innerHTML = `
        <div class="wall-card-rope"></div>
        <div>
          <div class="w-item-top">
            <span class="w-item-badge">${badge}</span>
            <div class="w-item-author-box">
              <span class="w-item-author">${author}</span>
              <span class="w-item-dept">${realmData.name} • ${dept}</span>
            </div>
            <span class="w-item-date">${date}</span>
          </div>
          <p class="w-item-msg">"${msg}"</p>
          ${wish.image ? `<div class="w-item-thumb"><img src="${wish.image}" alt="Kỷ niệm"></div>` : ''}
        </div>
        <div class="w-item-footer">
          <span class="w-item-pill" style="border-color:${realmData.color}">${realmData.name}</span>
          <span class="w-item-hint">Xem chi tiết 🔍</span>
        </div>
      `;

      card.addEventListener('click', () => {
        if (window.gameAudio) window.gameAudio.playClick();
        this.openViewModal(wish, realmData);
      });

      grid.appendChild(card);
    });
  }

  openViewModal(wish, realmData) {
    const modal = document.getElementById('view-modal');
    if (!modal) return;

    document.getElementById('vm-badge').textContent = wish.badge || '🎂';
    document.getElementById('vm-author').textContent = wish.author || 'Đồng Đội';
    document.getElementById('vm-dept').textContent = `${realmData.name} • ${wish.department || realmData.department}`;
    document.getElementById('vm-date').textContent = `Ngày gửi: ${wish.date || '20/10/2026'}`;
    document.getElementById('vm-message').textContent = `"${wish.message}"`;

    const imgWrap = document.getElementById('vm-image-wrap');
    const imgEl = document.getElementById('vm-image');
    if (imgWrap && imgEl) {
      if (wish.image) {
        imgEl.src = wish.image;
        imgWrap.style.display = 'block';
      } else {
        imgWrap.style.display = 'none';
      }
    }

    modal.classList.add('active');
  }
}

// Khởi chạy khi tài liệu sẵn sàng
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', () => {
    window.cardApp = new CardCreatorApp();
  });
} else {
  window.cardApp = new CardCreatorApp();
}
