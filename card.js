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
    this.defaultCtoPortrait = 'assets/01_Characters/portrait_cto_pixel.png';
    this.init();
  }

  init() {
    this.initBgCanvas();
    this.initAudio();
    this.bindBadgeEvents();
    this.bindImageUpload();
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

    const sliderAudio = document.getElementById('bgm-volume-slider');
    const volIconSvg = document.getElementById('card-vol-icon-svg');

    const updateVolIcon = (vol, isMuted) => {
      if (!volIconSvg) return;
      if (isMuted || vol <= 0) {
        volIconSvg.innerHTML = `
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        `;
      } else if (vol <= 0.5) {
        volIconSvg.innerHTML = `
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        `;
      } else {
        volIconSvg.innerHTML = `
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
        `;
      }
    };

    btnAudio.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!window.gameAudio.initialized) {
        window.gameAudio.init();
      }
      const isUnmuted = window.gameAudio.toggleMute();
      if (sliderAudio) {
        if (!isUnmuted) {
          sliderAudio.dataset.prevVal = sliderAudio.value;
          sliderAudio.value = 0;
        } else {
          const restored = Number(sliderAudio.dataset.prevVal || 55);
          sliderAudio.value = restored > 0 ? restored : 55;
          window.gameAudio.setBGMVolume(sliderAudio.value / 100);
        }
      }
      updateVolIcon(window.gameAudio.bgmVolume, !isUnmuted);
    });

    if (sliderAudio) {
      sliderAudio.value = Math.round((window.gameAudio.bgmVolume || 0.55) * 100);
      sliderAudio.addEventListener('input', (e) => {
        const val = Number(e.target.value) / 100;
        if (window.gameAudio.isMuted && val > 0) {
          window.gameAudio.toggleMute();
        }
        window.gameAudio.setBGMVolume(val);
        if (val === 0 && !window.gameAudio.isMuted) {
          window.gameAudio.toggleMute();
        }
        updateVolIcon(val, val === 0 || window.gameAudio.isMuted);
      });
    }
  }

  // --- 3. CHỌN HUY HIỆU SINH NHẬT ---
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
    this.updateLiveCard();
  }

  initPresetAvatars() {
    // Không cần chọn avatar nhanh nữa - tự động lấy ảnh Chân Dung CTO mặc định
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
    const previewDate = document.getElementById('live-date');
    if (previewDate) previewDate.textContent = new Date().toLocaleDateString('vi-VN');
    if (previewMsg) {
      previewMsg.textContent = msgVal
        ? `"${msgVal}"`
        : `"Chúc Sếp tuổi mới luôn tràn đầy năng lượng, dẫn dắt khối công nghệ vươn tới những đỉnh cao mới!"`;
    }

    if (previewImgWrap && previewImg) {
      const activeImg = this.selectedImageData || this.defaultCtoPortrait;
      if (activeImg) {
        previewImg.src = activeImg;
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
      image: this.selectedImageData || this.defaultCtoPortrait
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

  // Xuất thiệp ra ảnh PNG Full HD (3:4 cho theme Zen lộng lẫy, 16:9 cho theme Mario/Cyber)
  exportCardImage() {
    if (window.gameAudio) window.gameAudio.playWishSaved();

    const author = (document.getElementById('card-author')?.value || 'Đồng Đội Khối Công Nghệ').trim();
    const realmId = Number(document.getElementById('card-realm')?.value || 1);
    const msg = (document.getElementById('card-message')?.value || 'Chúc mừng sinh nhật CTO!').trim();
    const realmData = REALMS_DATA[realmId] || REALMS_DATA[1];
    const badge = this.selectedBadge || '🎂';

    // 1. THEME TRÀ ĐẠO ZEN: Sử dụng khung tranh hoàng kim bg_card_zen.webp tỉ lệ 3:4 độ phân giải cao 960x1280
    if (this.selectedTheme === 'zen') {
      const canvas = document.createElement('canvas');
      canvas.width = 960;
      canvas.height = 1280;
      const ctx = canvas.getContext('2d');

      const renderZenContent = (bgImg) => {
        // Vẽ khung tranh gỗ hoa sen cổ phong
        if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
          ctx.drawImage(bgImg, 0, 0, 960, 1280);
        } else {
          const zenGrad = ctx.createLinearGradient(0, 0, 960, 1280);
          zenGrad.addColorStop(0, '#fce4b8');
          zenGrad.addColorStop(0.5, '#f4d39c');
          zenGrad.addColorStop(1, '#e6ba68');
          ctx.fillStyle = zenGrad;
          ctx.fillRect(0, 0, 960, 1280);
          ctx.lineWidth = 14;
          ctx.strokeStyle = '#784212';
          ctx.strokeRect(10, 10, 940, 1260);
        }

        // Tiêu đề đầu thiệp
        ctx.textAlign = 'center';
        ctx.fillStyle = '#8c531b';
        ctx.font = 'bold 22px "Cinzel", serif, sans-serif';
        ctx.fillText('✦ LỤC TRÀ TRI THỨC • MỪNG SINH NHẬT CTO ✦', 480, 160);

        // Huy hiệu sinh nhật
        ctx.font = '54px sans-serif';
        ctx.fillText(badge, 480, 225);

        // Tên người gửi
        ctx.font = 'bold 36px "Noto Serif TC", serif, sans-serif';
        ctx.fillStyle = '#361907';
        ctx.fillText(author, 480, 280);

        // Cõi trà & Phòng ban
        ctx.font = '600 20px "Noto Serif TC", serif, sans-serif';
        ctx.fillStyle = '#7c4714';
        ctx.fillText(`${realmData.name} • ${realmData.department}`, 480, 318);

        // Đường gạch ngăn cách cổ phong
        ctx.strokeStyle = 'rgba(120, 66, 18, 0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.moveTo(180, 350);
        ctx.lineTo(780, 350);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#b8860b';
        ctx.font = '16px sans-serif';
        ctx.fillText('◈', 480, 356);

        // Lời chúc nhiều dòng (Word wrap)
        ctx.font = 'italic 25px "Noto Serif TC", serif, sans-serif';
        ctx.fillStyle = '#220f04';
        ctx.textAlign = 'center';

        const maxLineW = 660;
        const words = `"${msg}"`.split(' ');
        let line = '';
        let currentY = 415;
        const lineHeight = 42;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxLineW && n > 0) {
            ctx.fillText(line.trim(), 480, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line.trim(), 480, currentY);
        currentY += lineHeight;

        const downloadFinal = () => {
          // Footer: Ngày gửi
          ctx.textAlign = 'left';
          ctx.font = '19px "Noto Serif TC", sans-serif';
          ctx.fillStyle = '#6b3d11';
          ctx.fillText(`Ngày gửi: ${new Date().toLocaleDateString('vi-VN')}`, 140, 1140);

          // Footer: Tên Cõi Trà
          ctx.font = 'bold 18px "Noto Serif TC", sans-serif';
          ctx.fillStyle = '#4a2707';
          ctx.fillText(`◈ ${realmData.name}`, 140, 1175);

          // Footer: Con dấu mộc đỏ 'Chúc' (Vermilion Seal)
          ctx.save();
          ctx.strokeStyle = '#c0392b';
          ctx.fillStyle = '#c0392b';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(810, 1145, 36, 0, Math.PI * 2);
          ctx.stroke();
          ctx.textAlign = 'center';
          ctx.font = 'bold 34px "Noto Serif TC", serif';
          ctx.fillText('祝', 810, 1157);
          ctx.restore();

          const link = document.createElement('a');
          link.download = `Thiep_Zen_Mung_Sinh_Nhat_CTO_${author.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        };

        // Nếu có ảnh đính kèm hoặc dùng ảnh Chân Dung CTO mặc định
        const photoToDraw = this.selectedImageData || this.defaultCtoPortrait;
        if (photoToDraw) {
          const attachedImg = new Image();
          attachedImg.onload = () => {
            const photoW = 420;
            const photoH = Math.min(260, Math.floor((photoW / attachedImg.naturalWidth) * attachedImg.naturalHeight));
            const photoX = (960 - photoW) / 2;
            const photoY = Math.min(currentY + 20, 820);

            ctx.save();
            ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
            ctx.shadowBlur = 14;
            ctx.shadowOffsetY = 6;
            ctx.fillStyle = '#fff';
            ctx.fillRect(photoX - 4, photoY - 4, photoW + 8, photoH + 8);
            ctx.drawImage(attachedImg, photoX, photoY, photoW, photoH);
            ctx.strokeStyle = '#b8860b';
            ctx.lineWidth = 3;
            ctx.strokeRect(photoX - 4, photoY - 4, photoW + 8, photoH + 8);
            ctx.restore();

            downloadFinal();
          };
          attachedImg.onerror = () => downloadFinal();
          attachedImg.src = photoToDraw;
        } else {
          downloadFinal();
        }
      };

      const zenBg = new Image();
      zenBg.onload = () => renderZenContent(zenBg);
      zenBg.onerror = () => renderZenContent(null);
      zenBg.src = 'assets/bg_card_zen.webp';
      return;
    }

    // 2. THEME MARIO & CYBER: Khung ngang 1200x800
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    if (this.selectedTheme === 'mario') {
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 800);
      skyGrad.addColorStop(0, '#5c94fc');
      skyGrad.addColorStop(0.65, '#8ab4f8');
      skyGrad.addColorStop(0.65, '#e74c3c');
      skyGrad.addColorStop(1, '#c0392b');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, 1200, 800);

      ctx.lineWidth = 16;
      ctx.strokeStyle = '#000';
      ctx.strokeRect(8, 8, 1184, 784);
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#ffd700';
      ctx.strokeRect(20, 20, 1160, 760);
    } else {
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
    }

    // Tiêu đề thiệp
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 34px "Cinzel", serif, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✦ ĐẠI LỄ MỪNG SINH NHẬT CTO 2026 ✦', 600, 120);

    // Huy hiệu & Tên người gửi
    ctx.font = '54px sans-serif';
    ctx.fillText(badge, 600, 190);

    ctx.font = 'bold 36px "Noto Serif TC", serif, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(author, 600, 245);

    ctx.font = '22px "Noto Serif TC", serif, sans-serif';
    ctx.fillStyle = '#ffd700';
    ctx.fillText(`${realmData.name} • ${realmData.department}`, 600, 280);

    // Đường gạch ngang
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(200, 310);
    ctx.lineTo(1000, 310);
    ctx.stroke();
    ctx.setLineDash([]);

    // Lời chúc nhiều dòng (Word Wrap)
    ctx.font = 'italic 28px "Noto Serif TC", serif, sans-serif';
    ctx.fillStyle = '#ffffff';
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

    // Dấu mộc đỏ & Ngày tháng
    ctx.textAlign = 'left';
    ctx.font = '20px "Noto Serif TC", sans-serif';
    ctx.fillStyle = '#ffd700';
    ctx.fillText(`Ngày gửi: ${new Date().toLocaleDateString('vi-VN')}`, 100, 740);

    ctx.strokeStyle = '#c0392b';
    ctx.fillStyle = '#c0392b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(1100, 720, 36, 0, Math.PI * 2);
    ctx.stroke();
    ctx.textAlign = 'center';
    ctx.font = 'bold 34px "Noto Serif TC", serif';
    ctx.fillText('祝', 1100, 732);

    const triggerDownload = () => {
      const link = document.createElement('a');
      link.download = `Thiep_Mung_Sinh_Nhat_CTO_${author.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    const photoToDraw = this.selectedImageData || this.defaultCtoPortrait;
    if (photoToDraw) {
      const img = new Image();
      img.onload = () => {
        const imgW = 200;
        const imgH = 130;
        const imgX = (1200 - imgW) / 2;
        const imgY = Math.min(startY + 20, 580);
        ctx.save();
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 4;
        ctx.strokeRect(imgX, imgY, imgW, imgH);
        ctx.drawImage(img, imgX, imgY, imgW, imgH);
        ctx.restore();
        triggerDownload();
      };
      img.onerror = () => triggerDownload();
      img.src = photoToDraw;
    } else {
      triggerDownload();
    }
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

    const btnCloseVm = document.getElementById('btn-close-vm');
    if (btnCloseVm) btnCloseVm.addEventListener('click', () => modal.classList.remove('active'));

    const btnPrintWallCard = document.getElementById('btn-print-wall-card');
    if (btnPrintWallCard) {
      btnPrintWallCard.addEventListener('click', () => {
        if (this.currentViewingWish) {
          if (window.gameAudio) window.gameAudio.playClick();
          this.printWishCard(this.currentViewingWish);
        }
      });
    }

    const btnDownloadWallCard = document.getElementById('btn-download-wall-card');
    if (btnDownloadWallCard) {
      btnDownloadWallCard.addEventListener('click', () => {
        if (this.currentViewingWish) {
          if (window.gameAudio) window.gameAudio.playClick();
          this.downloadWishCard(this.currentViewingWish);
        }
      });
    }

    const btnDownloadPng = document.getElementById('btn-download-png');
    if (btnDownloadPng) {
      btnDownloadPng.addEventListener('click', () => {
        if (window.gameAudio) window.gameAudio.playClick();
        this.downloadCurrentFormCard();
      });
    }

    const btnDownloadLiveCard = document.getElementById('btn-download-live-card');
    if (btnDownloadLiveCard) {
      btnDownloadLiveCard.addEventListener('click', () => {
        if (window.gameAudio) window.gameAudio.playClick();
        this.downloadCurrentFormCard();
      });
    }
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
      const cardImg = wish.image || 'assets/01_Characters/portrait_cto_pixel.png';

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
          <div class="w-item-thumb"><img src="${cardImg}" alt="Kỷ niệm"></div>
        </div>
        <div class="w-item-footer">
          <span class="w-item-pill" style="border-color:${realmData.color}">${realmData.name}</span>
          <div style="display: flex; gap: 6px; align-items: center;">
            <button type="button" class="w-item-dl-btn" title="Tải thiệp này về máy" style="background: rgba(120,66,18,0.18); border: 1px solid rgba(120,66,18,0.45); border-radius: 4px; padding: 2px 7px; font-size: 11px; cursor: pointer; color: #4a2707; font-weight: 700; display: inline-flex; align-items: center; gap: 2px;">
              <span>Tải Thiệp</span>
            </button>
            <span class="w-item-hint">Xem chi tiết ✦</span>
          </div>
        </div>
      `;

      const dlBtn = card.querySelector('.w-item-dl-btn');
      if (dlBtn) {
        dlBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (window.gameAudio) window.gameAudio.playClick();
          this.downloadWishCard(wish);
        });
      }

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

    this.currentViewingWish = wish;
    modal.classList.add('active');
  }

  // Vẽ thiệp chúc mừng lên Canvas 960x1280 với nền Hoàng Kim Zen bg_card_zen.webp
  renderWishCardToCanvas(wish, callback) {
    if (!wish) return;
    const realmData = (typeof REALMS_DATA !== 'undefined' && REALMS_DATA[wish.realmId])
      ? REALMS_DATA[wish.realmId]
      : { name: 'Trà Điện Nhất Tâm', department: 'Ban Lãnh Đạo & Khối Bạn' };
    const author = (wish.author || 'Đồng Đội Khối Công Nghệ').trim();
    const dept = wish.department || realmData.department;
    const msg = (wish.message || 'Chúc mừng sinh nhật CTO!').trim();
    const badge = wish.badge || '🎂';
    const date = wish.date || new Date().toLocaleDateString('vi-VN');
    const photoToDraw = wish.image || this.defaultCtoPortrait;

    const canvas = document.createElement('canvas');
    canvas.width = 960;
    canvas.height = 1280;
    const ctx = canvas.getContext('2d');

    const renderZenCard = (bgImg) => {
      if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
        ctx.drawImage(bgImg, 0, 0, 960, 1280);
      } else {
        const zenGrad = ctx.createLinearGradient(0, 0, 960, 1280);
        zenGrad.addColorStop(0, '#fce4b8');
        zenGrad.addColorStop(0.5, '#f4d39c');
        zenGrad.addColorStop(1, '#e6ba68');
        ctx.fillStyle = zenGrad;
        ctx.fillRect(0, 0, 960, 1280);
        ctx.lineWidth = 14;
        ctx.strokeStyle = '#784212';
        ctx.strokeRect(10, 10, 940, 1260);
      }

      ctx.textAlign = 'center';
      ctx.fillStyle = '#8c531b';
      ctx.font = 'bold 22px "Cinzel", serif, sans-serif';
      ctx.fillText('✦ LỤC TRÀ TRI THỨC • MỪNG SINH NHẬT CTO ✦', 480, 160);

      ctx.font = '54px sans-serif';
      ctx.fillText(badge, 480, 225);

      ctx.font = 'bold 36px "Noto Serif TC", serif, sans-serif';
      ctx.fillStyle = '#361907';
      ctx.fillText(author, 480, 280);

      ctx.font = '600 20px "Noto Serif TC", serif, sans-serif';
      ctx.fillStyle = '#7c4714';
      ctx.fillText(`${realmData.name} • ${dept}`, 480, 318);

      ctx.strokeStyle = 'rgba(120, 66, 18, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(180, 350);
      ctx.lineTo(780, 350);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#b8860b';
      ctx.font = '16px sans-serif';
      ctx.fillText('◈', 480, 356);

      ctx.font = 'italic 25px "Noto Serif TC", serif, sans-serif';
      ctx.fillStyle = '#220f04';
      ctx.textAlign = 'center';

      const maxLineW = 660;
      const words = `"${msg}"`.split(' ');
      let line = '';
      let currentY = 415;
      const lineHeight = 42;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxLineW && n > 0) {
          ctx.fillText(line.trim(), 480, currentY);
          line = words[n] + ' ';
          currentY += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), 480, currentY);
      currentY += lineHeight;

      const finishDrawing = () => {
        ctx.textAlign = 'left';
        ctx.font = '19px "Noto Serif TC", sans-serif';
        ctx.fillStyle = '#6b3d11';
        ctx.fillText(`Ngày gửi: ${date}`, 140, 1140);

        ctx.font = 'bold 18px "Noto Serif TC", sans-serif';
        ctx.fillStyle = '#4a2707';
        ctx.fillText(`◈ ${realmData.name}`, 140, 1175);

        ctx.save();
        ctx.strokeStyle = '#c0392b';
        ctx.fillStyle = '#c0392b';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(810, 1145, 36, 0, Math.PI * 2);
        ctx.stroke();
        ctx.textAlign = 'center';
        ctx.font = 'bold 34px "Noto Serif TC", serif';
        ctx.fillText('祝', 810, 1157);
        ctx.restore();

        if (callback) callback(canvas);
      };

      if (photoToDraw) {
        const attachedImg = new Image();
        attachedImg.onload = () => {
          const nw = attachedImg.naturalWidth || 1;
          const nh = attachedImg.naturalHeight || 1;
          const imgRatio = nw / nh;

          // Vùng hiển thị ảnh tối đa (không vượt quá lề hoa sen hai bên và khoảng cách footer)
          const maxBoxW = 420;
          const availTop = currentY + 24;
          const availBottom = 1080;
          const availH = Math.max(220, availBottom - availTop);
          const maxBoxH = Math.min(440, availH);

          let photoW = maxBoxW;
          let photoH = Math.round(photoW / imgRatio);

          if (photoH > maxBoxH) {
            photoH = maxBoxH;
            photoW = Math.round(photoH * imgRatio);
          }

          if (photoW > maxBoxW) {
            photoW = maxBoxW;
            photoH = Math.round(photoW / imgRatio);
          }

          const photoX = Math.round((960 - photoW) / 2);
          const photoY = Math.round(availTop + (availH - photoH) / 2);

          ctx.save();
          ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
          ctx.shadowBlur = 16;
          ctx.shadowOffsetY = 8;
          ctx.fillStyle = '#fff';
          ctx.fillRect(photoX - 6, photoY - 6, photoW + 12, photoH + 12);
          ctx.drawImage(attachedImg, photoX, photoY, photoW, photoH);
          ctx.strokeStyle = '#b8860b';
          ctx.lineWidth = 3.5;
          ctx.strokeRect(photoX - 6, photoY - 6, photoW + 12, photoH + 12);

          // Viền chỉ vàng mảnh trang trí bên trong
          ctx.strokeStyle = 'rgba(255, 215, 0, 0.55)';
          ctx.lineWidth = 1;
          ctx.strokeRect(photoX - 2, photoY - 2, photoW + 4, photoH + 4);
          ctx.restore();

          finishDrawing();
        };
        attachedImg.onerror = () => finishDrawing();
        attachedImg.src = photoToDraw;
      } else {
        finishDrawing();
      }
    };

    const zenBg = new Image();
    zenBg.onload = () => renderZenCard(zenBg);
    zenBg.onerror = () => renderZenCard(null);
    zenBg.src = 'assets/bg_card_zen.webp';
  }

  // Tải thiệp chúc mừng chất lượng cao về máy tính / điện thoại
  downloadWishCard(wish) {
    if (!wish) return;
    if (window.gameAudio) window.gameAudio.playWishSaved();

    const author = (wish.author || 'Đồng Đội Khối Công Nghệ').trim();
    const safeAuthor = author.replace(/[^a-zA-Z0-9\u00C0-\u024F\u1EA0-\u1EF9]/g, '_');
    const filename = `Thiep_Sinh_Nhat_CTO_${safeAuthor}.png`;

    this.renderWishCardToCanvas(wish, (canvas) => {
      try {
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 4000);
          } else {
            const dataUrl = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
        }, 'image/png');
      } catch (e) {
        const dataUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    });
  }

  // Tải thiệp đang soạn thảo trên Form / Live Preview
  downloadCurrentFormCard() {
    const author = (document.getElementById('card-author')?.value || 'Đồng Đội Khối Công Nghệ').trim();
    const realmId = Number(document.getElementById('card-realm')?.value || 1);
    const msg = (document.getElementById('card-message')?.value || 'Chúc mừng sinh nhật CTO!').trim();
    const realmData = REALMS_DATA[realmId] || REALMS_DATA[1];
    const badge = this.selectedBadge || '🎂';
    const photoToDraw = this.attachedImageData || this.defaultCtoPortrait;

    const tempWish = {
      author,
      department: realmData.department,
      realmId,
      message: msg,
      badge,
      image: photoToDraw,
      date: new Date().toLocaleDateString('vi-VN')
    };

    this.downloadWishCard(tempWish);
  }

  // In thiệp chúc mừng chất lượng cao với nền bg_card_zen.webp
  printWishCard(wish) {
    if (!wish) return;
    const author = (wish.author || 'Đồng Đội Khối Công Nghệ').trim();

    this.renderWishCardToCanvas(wish, (canvas) => {
      const dataUrl = canvas.toDataURL('image/png');
      const safeAuthor = author.replace(/[^a-zA-Z0-9\u00C0-\u024F\u1EA0-\u1EF9]/g, '_');

      const printWin = window.open('', '_blank');
      if (printWin) {
        printWin.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Thiệp Chúc Mừng Sinh Nhật CTO - ${author}</title>
            <style>
              @page { size: auto; margin: 8mm; }
              body { margin: 0; padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background: #1a0f07; font-family: sans-serif; }
              .card-print-img { max-width: 90vw; max-height: 92vh; width: auto; height: auto; box-shadow: 0 8px 30px rgba(0,0,0,0.8); border-radius: 12px; }
              .print-actions { margin-top: 14px; display: flex; gap: 12px; }
              .btn { padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; border: none; font-size: 14px; }
              .btn-print { background: #d4af37; color: #1e0d03; }
              .btn-download { background: #3b2515; color: #ffd700; border: 1px solid #ffd700; }
              @media print {
                body { background: transparent; padding: 0; }
                .card-print-img { max-width: 100%; max-height: 100%; box-shadow: none; border-radius: 0; }
                .print-actions { display: none !important; }
              }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" class="card-print-img" alt="Thiệp Chúc Mừng Sinh Nhật CTO">
            <div class="print-actions">
              <button class="btn btn-print" onclick="window.print()">Bấm Để In Thiệp</button>
              <a class="btn btn-download" href="${dataUrl}" download="Thiep_Sinh_Nhat_CTO_${safeAuthor}.png" style="text-decoration:none;">Tải Ảnh Thiệp (PNG)</a>
            </div>
            <script>
              setTimeout(() => { window.print(); }, 400);
            <\/script>
          </body>
          </html>
        `);
        printWin.document.close();
      } else {
        this.downloadWishCard(wish);
      }
    });
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
