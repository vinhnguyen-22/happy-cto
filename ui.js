/**
 * UI & MODAL CONTROLLER
 * Điều khiển hộp thoại người dẫn chuyện, các form gửi lời chúc, xem lời chúc,
 * sổ lưu bút toàn thể và đại cảnh mừng sinh nhật CTO.
 */

class UIManager {
  constructor() {
    this.currentDialogueQueue = [];
    this.currentSentence = null;
    this.typingTimer = null;
    this.selectedImageData = null;
    this.studioSelectedImageData = null;
    this.studioSelectedBadge = '🎂';
    this.selectedCardTheme = 'zen';
    this.selectedCardBadge = '🎂';
    this.selectedCardImageData = null;
    this.activeRealmForWish = 1;
    this.init();
  }

  init() {
    this.bindIntroEvents();
    this.bindHeaderEvents();
    this.bindTeaBarEvents();
    this.bindDialogueEvents();
    this.bindWishModalEvents();
    this.bindViewWishModalEvents();
    this.bindGrandFinaleEvents();
    this.bindBackupEvents();
    this.bindHelpEvents();
    this.bindBackdropEvents();
    this.bindGlobalShortcuts();
    this.initPresetAvatars();
    this.initCardPresetAvatars();
  }

  // --- 1. MÀN HÌNH CHÀO (MỞ CỔNG GỖ) ---
  bindIntroEvents() {
    const btnEnter = document.getElementById('btn-enter-realm');
    const btnGuestbook = document.getElementById('btn-enter-guestbook');
    const introOverlay = document.getElementById('intro-overlay');

    const handleEnterGame = (openGuestbook = false) => {
      // Khởi động Audio Engine & Unlock Media Videos
      window.gameAudio.init();
      window.gameAudio.playDoorOpen();
      window.gameAudio.startBGM();
      if (window.gameSprites) {
        window.gameSprites.unlockAllVideos();
      }

      // Mở 2 cánh cửa gỗ
      introOverlay.classList.add('open');

      // Sau 0.8s thì mờ dần và kích hoạt Game Engine
      setTimeout(() => {
        introOverlay.classList.add('fade-out');
        if (!window.gameEngine) {
          window.gameEngine = new GameEngine();
        }
        if (openGuestbook) {
          this.openGrandFinaleModal('cards');
        }
      }, 700);
    };

    if (btnEnter) {
      btnEnter.addEventListener('click', () => handleEnterGame(false));
      btnEnter.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleEnterGame(false);
        }
      });
    }

    if (btnGuestbook) {
      btnGuestbook.addEventListener('click', () => handleEnterGame(true));
      btnGuestbook.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleEnterGame(true);
        }
      });
    }

    // Hỗ trợ tự động mở cổng nếu có query param (?mode=game hoặc ?tab=cards)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'game' || window.location.hash === '#game') {
      setTimeout(() => {
        handleEnterGame(false);
      }, 400);
    } else if (urlParams.get('tab') === 'cards' || urlParams.get('mode') === 'cards') {
      setTimeout(() => {
        handleEnterGame(true);
      }, 400);
    }
  }

  // --- 2. THANH TIÊU ĐỀ TRÊN CÙNG (HUD) ---
  bindHeaderEvents() {
    const btnReturn = document.getElementById('btn-return-hub');
    const btnAudio = document.getElementById('btn-audio-toggle');
    const btnWishStudio = document.getElementById('btn-open-wish-studio');
    const btnViewTree = document.getElementById('btn-view-tree');
    const btnBackup = document.getElementById('btn-backup-data');
    const btnAspect = document.getElementById('btn-aspect-toggle');
    const btnFullscreen = document.getElementById('btn-fullscreen-toggle');
    const btnHelp = document.getElementById('btn-help-guide');

    if (btnWishStudio) {
      btnWishStudio.addEventListener('click', () => {
        window.gameAudio.playClick();
        this.openWishStudio();
      });
    }

    if (btnAspect) {
      btnAspect.addEventListener('click', () => {
        window.gameAudio.playClick();
        if (window.gameEngine) {
          const mode = window.gameEngine.toggleAspectMode();
          btnAspect.innerHTML = (mode === '16:9') 
            ? '<svg class="zen-btn-icon"><use href="#zen-aspect-169"></use></svg> <span>Khung: 16:9</span>' 
            : '<svg class="zen-btn-icon"><use href="#zen-fullscreen-enter"></use></svg> <span>Khung: Toàn Màn</span>';
        }
      });
    }

    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', () => {
        window.gameAudio.playClick();
        if (!document.fullscreenElement) {
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(err => console.warn(err));
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen().catch(err => console.warn(err));
          }
        }
      });

      document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
          btnFullscreen.innerHTML = '<svg class="zen-btn-icon"><use href="#zen-fullscreen-exit"></use></svg> <span>Thu Nhỏ</span>';
        } else {
          btnFullscreen.innerHTML = '<svg class="zen-btn-icon"><use href="#zen-fullscreen-enter"></use></svg> <span>Toàn Màn Hình</span>';
        }
      });
    }

    if (btnHelp) {
      btnHelp.addEventListener('click', () => {
        window.gameAudio.playClick();
        this.openHelpModal();
      });
    }

    btnReturn.addEventListener('click', () => {
      window.gameAudio.playClick();
      if (window.gameEngine) {
        window.gameEngine.switchRealm(0);
      }
    });

    btnAudio.addEventListener('click', () => {
      const isPlaying = window.gameAudio.toggleMute();
      btnAudio.innerHTML = isPlaying 
        ? '<svg class="zen-btn-icon"><use href="#zen-bell-on"></use></svg> <span>Nhạc Mario: BẬT</span>' 
        : '<svg class="zen-btn-icon"><use href="#zen-bell-off"></use></svg> <span>Nhạc Mario: TẮT</span>';
    });

    if (btnViewTree) {
      btnViewTree.addEventListener('click', () => {
        window.gameAudio.playClick();
        this.openGrandFinaleModal('cards');
      });
    }

    btnBackup.addEventListener('click', () => {
      window.gameAudio.playClick();
      this.openBackupModal();
    });
  }

  updateRealmInfo(realmInfo) {
    const titleEl = document.getElementById('realm-title-text');
    const subEl = document.getElementById('realm-sub-text');
    const btnReturn = document.getElementById('btn-return-hub');

    if (realmInfo.id === 0) {
      titleEl.textContent = "TRÀ ĐIỆN NHẤT TÂM";
      subEl.textContent = "Cội Nguồn Hệ Sinh Thái Số";
      btnReturn.style.display = 'none';
    } else {
      titleEl.textContent = `${realmInfo.name.toUpperCase()}`;
      subEl.textContent = `${realmInfo.department} • ${realmInfo.element}`;
      btnReturn.style.display = 'inline-block';
    }

    // Đổi active trên thanh chọn 6 hộp trà phía dưới
    document.querySelectorAll('.tea-card-btn').forEach(btn => {
      btn.classList.toggle('active', Number(btn.dataset.realm) === realmInfo.id);
    });
  }

  // --- 3. THANH 6 HỘP TRÀ DỌC (SIDEBAR ĐIỀU HƯỚNG) ---
  bindTeaBarEvents() {
    const toggleBtn = document.getElementById('btn-toggle-tea-bar');
    const teaBar = document.getElementById('tea-boxes-bar');
    if (toggleBtn && teaBar) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        teaBar.classList.toggle('collapsed');
        const isCollapsed = teaBar.classList.contains('collapsed');
        toggleBtn.textContent = isCollapsed ? '▶' : '◀';
        toggleBtn.title = isCollapsed ? 'Mở rộng thanh hộp trà' : 'Thu gọn thanh hộp trà';
        if (window.gameAudio && window.gameAudio.playClick) {
          window.gameAudio.playClick();
        }
      });
    }

    document.querySelectorAll('.tea-card-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.gameAudio.playClick();
        const realmId = Number(btn.dataset.realm);
        if (window.gameEngine) {
          if (window.gameEngine.currentRealmId === 0) {
            // Trong Trà Điện Nhất Tâm: Nhân vật BƯỚC TỚI hộp trà đó rồi mới mở cõi!
            window.gameEngine.walkToRealmBox(realmId);
          } else {
            window.gameEngine.switchRealm(realmId);
          }
        }
      });
    });
  }

  // --- 4. HỘP THOẠI DIALOGUE (STARDEW STYLE) ---
  bindDialogueEvents() {
    const box = document.getElementById('dialogue-box');
    const btnNext = document.getElementById('dialogue-next-btn');
    const btnClose = document.getElementById('dialogue-close-btn');
    const btnSkip = document.getElementById('dialogue-skip-btn');

    btnNext.addEventListener('click', () => {
      window.gameAudio.playClick();
      this.advanceDialogue();
    });

    btnClose.addEventListener('click', () => {
      window.gameAudio.playClick();
      box.classList.add('hidden');
      if (this.typingTimer) clearInterval(this.typingTimer);
    });

    if (btnSkip) {
      btnSkip.addEventListener('click', () => {
        window.gameAudio.playClick();
        this.currentDialogueQueue = [];
        if (this.typingTimer) {
          clearInterval(this.typingTimer);
          this.typingTimer = null;
        }
        box.classList.add('hidden');
      });
    }
  }

  showRealmDialogue(realmId) {
    const realmData = REALMS_DATA[realmId];
    if (!realmData || !realmData.narratorSpeech) return;

    this.currentDialogueQueue = [...realmData.narratorSpeech];
    const box = document.getElementById('dialogue-box');
    box.classList.remove('hidden');
    this.advanceDialogue();
  }

  advanceDialogue() {
    const textEl = document.getElementById('dialogue-text');
    const btnNext = document.getElementById('dialogue-next-btn');
    const box = document.getElementById('dialogue-box');

    // Nếu câu thoại đang chạy hiệu ứng gõ chữ -> Nhấn E / Click sẽ hiển thị ngay trọn vẹn câu
    if (this.typingTimer && this.currentSentence) {
      clearInterval(this.typingTimer);
      this.typingTimer = null;
      textEl.textContent = this.currentSentence;
      return;
    }

    if (this.currentDialogueQueue.length === 0) {
      box.classList.add('hidden');
      this.currentSentence = null;
      return;
    }

    const currentSentence = this.currentDialogueQueue.shift();
    this.currentSentence = currentSentence;
    btnNext.innerHTML = (this.currentDialogueQueue.length > 0) 
      ? '<span>Tiếp tục [E]</span> <svg class="zen-btn-icon"><use href="#zen-next"></use></svg>' 
      : '<span>Lĩnh Hội [E]</span> <svg class="zen-btn-icon"><use href="#zen-check"></use></svg>';

    // Hiệu ứng gõ chữ từng ký tự (Typewriter effect)
    textEl.textContent = "";
    let charIndex = 0;
    this.typingTimer = setInterval(() => {
      textEl.textContent += currentSentence.charAt(charIndex);
      charIndex++;
      if (charIndex >= currentSentence.length) {
        clearInterval(this.typingTimer);
        this.typingTimer = null;
      }
    }, 22);
  }

  // --- 5. MODAL GỬI LỜI CHÚC & ĐÍNH KÈM HÌNH ẢNH ---
  bindWishModalEvents() {
    const modal = document.getElementById('modal-wish');
    const btnClose = document.getElementById('btn-close-wish-modal');
    const btnCancel = document.getElementById('btn-cancel-wish');
    const form = document.getElementById('form-wish');
    const uploadZone = document.getElementById('image-upload-zone');
    const fileInput = document.getElementById('wish-image-file');
    const btnRemoveImg = document.getElementById('btn-remove-image');

    btnClose.addEventListener('click', () => modal.classList.remove('active'));
    btnCancel.addEventListener('click', () => modal.classList.remove('active'));

    uploadZone.addEventListener('click', (e) => {
      if (e.target !== btnRemoveImg) {
        fileInput.click();
      }
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        this.handleImageFile(file);
      }
    });

    btnRemoveImg.addEventListener('click', (e) => {
      e.stopPropagation();
      this.clearSelectedImage();
    });

    // Submit lưu lời chúc
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const author = document.getElementById('wish-author').value;
      const dept = document.getElementById('wish-department').value;
      const msg = document.getElementById('wish-message').value;

      const newWish = window.wishStorage.addWish({
        realmId: this.activeRealmForWish,
        author: author,
        department: dept,
        message: msg,
        image: this.selectedImageData || PRESET_AVATARS[0].data
      });

      window.gameAudio.playWishSaved();
      modal.classList.remove('active');
      form.reset();
      this.clearSelectedImage();

      // Cập nhật lại các điểm tương tác trên cõi hiện tại
      if (window.gameEngine) {
        window.gameEngine.refreshCurrentInteractables();
      }

      alert(`🍃 Lời chúc của ${author} đã được lưu thành công lên cõi trà! Cảm ơn bạn!`);
    });
  }

  handleImageFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Tối ưu hóa kích thước ảnh (resize max 500px) để lưu LocalStorage gọn nhẹ
        const canvas = document.createElement('canvas');
        const maxDim = 500;
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
        const optimizedData = canvas.toDataURL('image/jpeg', 0.8);
        this.setSelectedImage(optimizedData);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  setSelectedImage(dataUrl) {
    this.selectedImageData = dataUrl;
    document.getElementById('upload-prompt').style.display = 'none';
    const previewContainer = document.getElementById('preview-container');
    const previewImg = document.getElementById('image-preview');
    previewImg.src = dataUrl;
    previewContainer.style.display = 'flex';
  }

  clearSelectedImage() {
    this.selectedImageData = null;
    document.getElementById('upload-prompt').style.display = 'flex';
    document.getElementById('preview-container').style.display = 'none';
    document.getElementById('wish-image-file').value = '';
    document.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('selected'));
  }

  initPresetAvatars() {
    const container = document.getElementById('preset-avatars');
    if (!container) return;
    container.innerHTML = "";
    PRESET_AVATARS.forEach((p, idx) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'preset-chip';
      chip.innerHTML = `<img src="${p.data}" style="width:20px;height:20px;object-fit:contain;vertical-align:middle;margin-right:4px;image-rendering:pixelated;"><span>${p.name}</span>`;
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        this.setSelectedImage(p.data);
      });
      container.appendChild(chip);
    });
  }

  openAddWishModal(realmId) {
    // Mở màn Ghi Lời Chúc Riêng phong cách Trà Quán & Super Mario
    this.openWishStudio(realmId);
  }

  // --- 6. MODAL XEM CHI TIẾT LỜI CHÚC ---
  bindViewWishModalEvents() {
    const modal = document.getElementById('modal-view-wish');
    const btnClose = document.getElementById('btn-close-view-modal');
    const btnOk = document.getElementById('btn-view-ok');
    const btnDelete = document.getElementById('btn-delete-this-wish');

    let currentWishId = null;

    btnClose.addEventListener('click', () => modal.classList.remove('active'));
    btnOk.addEventListener('click', () => modal.classList.remove('active'));

    const btnCopy = document.getElementById('btn-copy-wish');
    if (btnCopy) {
      btnCopy.addEventListener('click', () => {
        window.gameAudio.playClick();
        const author = document.getElementById('view-author-name').textContent;
        const dept = document.getElementById('view-author-dept').textContent;
        const content = document.getElementById('view-wish-content').textContent;
        const copyText = `${author} (${dept}): ${content}`;
        navigator.clipboard.writeText(copyText).then(() => {
          btnCopy.innerHTML = '<svg class="zen-btn-icon"><use href="#zen-check"></use></svg> <span>Đã Chép!</span>';
          setTimeout(() => {
            btnCopy.innerHTML = '<svg class="zen-btn-icon"><use href="#zen-copy"></use></svg> <span>Sao Chép</span>';
          }, 1500);
        }).catch(err => {
          console.warn('Clipboard write error', err);
        });
      });
    }

    if (btnDelete) {
      btnDelete.addEventListener('click', () => {
        if (currentWishId && confirm("Bạn có chắc muốn xóa lời chúc này không?")) {
          window.wishStorage.deleteWish(currentWishId);
          modal.classList.remove('active');
          if (window.gameEngine) {
            window.gameEngine.refreshCurrentInteractables();
          }
        }
      });
    }

    this.openViewWishModal = (wish) => {
      if (!wish) return;
      currentWishId = wish.id;
      const realmData = (typeof REALMS_DATA !== 'undefined' && REALMS_DATA[wish.realmId]) 
        ? REALMS_DATA[wish.realmId] 
        : { name: 'Cõi Trà', department: 'Đồng Đội', color: '#d4af37' };

      const leafIconEl = document.getElementById('view-leaf-icon');
      if (leafIconEl) {
        if (realmData.assetIcon) {
          leafIconEl.innerHTML = `<img src="${realmData.assetIcon}" class="modal-badge-img" alt="${realmData.name}">`;
        } else {
          leafIconEl.innerHTML = '<svg class="zen-badge-icon"><use href="#zen-tea-leaf"></use></svg>';
        }
      }

      const authorEl = document.getElementById('view-author-name');
      if (authorEl) authorEl.textContent = wish.author || 'Đồng Đội';

      const deptEl = document.getElementById('view-author-dept');
      if (deptEl) deptEl.textContent = `${wish.department || 'Ban Công Nghệ'} • ${realmData.name}`;

      const dateEl = document.getElementById('view-wish-date');
      if (dateEl) dateEl.textContent = `Ngày gửi: ${wish.date || '20/10/2026'}`;

      const contentEl = document.getElementById('view-wish-content');
      if (contentEl) contentEl.textContent = `"${wish.message || ''}"`;

      const imgWrapper = document.getElementById('view-image-wrapper');
      const imgEl = document.getElementById('view-wish-image');
      if (imgWrapper && imgEl) {
        if (wish.image) {
          imgEl.src = wish.image;
          imgWrapper.style.display = 'block';
        } else {
          imgWrapper.style.display = 'none';
        }
      }

      const targetModal = modal || document.getElementById('modal-view-wish');
      if (targetModal) {
        targetModal.dataset.openedAt = String(Date.now());
        targetModal.classList.add('active');
      }
    };
  }

  // --- 7. ĐẠI CẢNH SỔ LƯU BÚT SINH NHẬT & CÂY TRÀ TRI THỨC ---
  bindGrandFinaleEvents() {
    const modal = document.getElementById('modal-grand-finale');
    if (!modal) return;
    const btnClose = document.getElementById('btn-close-grand-modal');
    const btnFireworks = document.getElementById('btn-fireworks');
    const btnFireworksWall = document.getElementById('btn-fireworks-wall');
    const filterDept = document.getElementById('book-filter-dept');
    const btnCloseFooter = document.getElementById('btn-close-grand-footer');
    const btnQuickCreate = document.getElementById('btn-quick-goto-create');

    if (btnClose) btnClose.addEventListener('click', () => modal.classList.remove('active'));
    if (btnCloseFooter) btnCloseFooter.addEventListener('click', () => modal.classList.remove('active'));

    const triggerFireworks = () => {
      window.gameAudio.playFanfare();
      if (window.gameEngine) {
        window.gameEngine.spawnFireworks();
      }
      this.spawnConfetti();
    };

    if (btnFireworks) {
      btnFireworks.addEventListener('click', () => {
        triggerFireworks();
        modal.classList.remove('active');
      });
    }

    if (btnFireworksWall) {
      btnFireworksWall.addEventListener('click', () => {
        triggerFireworks();
      });
    }

    // Nút chuyển nhanh sang Tab Soạn Thiệp từ Tab Show Thiệp
    if (btnQuickCreate) {
      btnQuickCreate.addEventListener('click', () => {
        window.gameAudio.playClick();
        this.switchGrandFinaleTab('create');
      });
    }

    // Chuyển Tabs (cards / create / tree / message)
    document.querySelectorAll('.grand-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.gameAudio.playClick();
        const tab = btn.dataset.tab;
        this.switchGrandFinaleTab(tab);
      });
    });

    if (filterDept) {
      filterDept.addEventListener('change', (e) => {
        this.renderScrapbook(e.target.value);
      });
    }

    // Khởi tạo các sự kiện trong Xưởng Tạo Thiệp Tích Hợp (Tab 2)
    this.bindIntegratedCardStudio();
  }

  switchGrandFinaleTab(tab = 'cards') {
    document.querySelectorAll('.grand-tab-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tab);
    });
    document.querySelectorAll('.grand-tab-panel').forEach(p => {
      p.classList.toggle('active', p.id === `tab-panel-${tab}`);
    });

    if (tab === 'cards') {
      const filter = document.getElementById('book-filter-dept');
      this.renderScrapbook(filter ? filter.value : 'all');
    } else if (tab === 'create') {
      this.updateIntegratedCardPreview();
    }
  }

  openGrandFinaleModal(defaultTab = 'cards', realmId = null) {
    const modal = document.getElementById('modal-grand-finale');
    if (!modal) return;

    modal.dataset.openedAt = String(Date.now());
    const allWishes = window.wishStorage ? window.wishStorage.getAllWishes() : [];
    const countEl = document.getElementById('total-wishes-count');
    if (countEl) countEl.textContent = allWishes.length;

    if (realmId !== null && realmId !== undefined) {
      const realmSelect = document.getElementById('card-realm');
      if (realmSelect) {
        realmSelect.value = String(realmId);
      }
    }

    this.switchGrandFinaleTab(defaultTab);
    modal.classList.add('active');
  }

  renderScrapbook(filterDept = "all") {
    const container = document.getElementById('scrapbook-container');
    if (!container || !window.wishStorage) return;
    container.innerHTML = "";

    let wishes = window.wishStorage.getAllWishes();
    if (filterDept !== "all") {
      wishes = wishes.filter(w => {
        const realmData = REALMS_DATA[w.realmId];
        return (w.department && w.department.toLowerCase().includes(filterDept.toLowerCase())) ||
               (realmData && realmData.department && realmData.department.toLowerCase().includes(filterDept.toLowerCase())) ||
               (realmData && realmData.name && realmData.name.toLowerCase().includes(filterDept.toLowerCase()));
      });
    }

    if (wishes.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px 20px; color: #8d5b2d;">
          <p style="font-size: 16px; font-weight: 700; margin-bottom: 8px;">Chưa có thiệp chúc nào trong cõi này.</p>
          <p style="font-size: 13px; color: #5c3b1d;">Hãy bấm tab "✍️ Soạn & Tạo Thiệp Mới" để là người đầu tiên gửi lời chúc nhé! ✨</p>
        </div>`;
      return;
    }

    const sorted = [...wishes].reverse();

    sorted.forEach(wish => {
      const card = document.createElement('div');
      card.className = 'scrapbook-card';
      const realmData = REALMS_DATA[wish.realmId] || REALMS_DATA[1];
      const badgeIcon = wish.badge || '🎂';
      const author = wish.author || 'Đồng Đội';
      const dept = wish.department || realmData.department;
      const message = wish.message || '';

      card.innerHTML = `
        <div class="sb-top">
          <span class="sb-author">
            <span style="font-size: 18px; margin-right: 4px;">${badgeIcon}</span>
            ${author}
          </span>
          <span class="sb-dept">${dept}</span>
        </div>
        <div class="sb-text">"${message}"</div>
        ${wish.image ? `<img class="sb-thumb" src="${wish.image}" alt="Ảnh kỷ niệm">` : ''}
        <div class="sb-footer">
          <span class="sb-pill" style="color: ${realmData.color || '#784212'}">◈ ${realmData.name}</span>
          <span class="sb-view-btn">Chi tiết 🔍</span>
        </div>
      `;

      card.addEventListener('click', () => {
        window.gameAudio.playClick();
        this.openViewWishModal(wish);
      });

      container.appendChild(card);
    });
  }

  // --- 8. SAO LƯU DỮ LIỆU EXPORT / IMPORT ---
  bindBackupEvents() {
    const modal = document.getElementById('modal-backup');
    const btnClose = document.getElementById('btn-close-backup-modal');
    const btnExport = document.getElementById('btn-export-json');
    const btnTriggerImport = document.getElementById('btn-trigger-import');
    const fileImport = document.getElementById('import-json-file');
    const btnReset = document.getElementById('btn-reset-default');

    const btnCloseFooter = document.getElementById('btn-close-backup-footer');

    btnClose.addEventListener('click', () => modal.classList.remove('active'));
    if (btnCloseFooter) btnCloseFooter.addEventListener('click', () => modal.classList.remove('active'));

    // Xuất JSON
    btnExport.addEventListener('click', () => {
      const jsonStr = window.wishStorage.exportJson();
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `loi_chuc_sinh_nhat_cto_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });

    // Nhập JSON
    btnTriggerImport.addEventListener('click', () => fileImport.click());

    fileImport.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = window.wishStorage.importJson(event.target.result);
        if (result.success) {
          alert(`Đã nhập thành công ${result.count} lời chúc!`);
          modal.classList.remove('active');
          if (window.gameEngine) window.gameEngine.refreshCurrentInteractables();
        } else {
          alert("Lỗi khi nhập file JSON: " + result.error);
        }
      };
      reader.readAsText(file);
    });

    // Khôi phục mặc định
    btnReset.addEventListener('click', () => {
      if (confirm("Khôi phục về danh sách lời chúc mẫu ban đầu?")) {
        window.wishStorage.resetToDefault();
        modal.classList.remove('active');
        if (window.gameEngine) window.gameEngine.refreshCurrentInteractables();
        alert("Đã khôi phục dữ liệu mẫu thành công!");
      }
    });
  }

  openBackupModal() {
    document.getElementById('modal-backup').classList.add('active');
  }

  // --- 9. HƯỚNG DẪN TRẢI NGHIỆM & BỐI CẢNH ---
  bindHelpEvents() {
    const modal = document.getElementById('modal-help');
    const btnClose = document.getElementById('btn-close-help-modal');
    const btnCloseFooter = document.getElementById('btn-close-help-footer');

    if (btnClose) btnClose.addEventListener('click', () => modal.classList.remove('active'));
    if (btnCloseFooter) btnCloseFooter.addEventListener('click', () => modal.classList.remove('active'));
  }

  openHelpModal() {
    const modal = document.getElementById('modal-help');
    if (modal) modal.classList.add('active');
  }

  // --- XƯỞNG SOẠN & TẠO THIỆP SINH NHẬT TÍCH HỢP (TAB 2 TRONG SỔ LƯU BÚT) ---
  bindIntegratedCardStudio() {
    // 1. Theme selection (Zen / Mario / Cyber)
    document.querySelectorAll('.theme-options .theme-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.gameAudio) window.gameAudio.playJump();
        document.querySelectorAll('.theme-options .theme-opt-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedCardTheme = btn.dataset.theme || 'zen';
        this.updateIntegratedCardPreview();
      });
    });

    // 2. Badge selection
    document.querySelectorAll('#studio-badge-picker .ws-badge-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        if (window.gameAudio) window.gameAudio.playCoin();
        document.querySelectorAll('#studio-badge-picker .ws-badge-opt').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        this.selectedCardBadge = opt.dataset.icon || '🎂';
        this.updateIntegratedCardPreview();
      });
    });

    // 3. Quick template chips
    document.querySelectorAll('#tab-panel-create .ws-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        if (window.gameAudio) window.gameAudio.playPowerup();
        const msgTextarea = document.getElementById('card-message');
        if (msgTextarea) {
          msgTextarea.value = chip.dataset.text || '';
          this.updateIntegratedCardPreview();
          msgTextarea.focus();
        }
      });
    });

    // 4. Live sync inputs
    const authorInput = document.getElementById('card-author');
    const realmSelect = document.getElementById('card-realm');
    const msgTextarea = document.getElementById('card-message');

    if (authorInput) authorInput.addEventListener('input', () => this.updateIntegratedCardPreview());
    if (realmSelect) realmSelect.addEventListener('change', () => this.updateIntegratedCardPreview());
    if (msgTextarea) msgTextarea.addEventListener('input', () => this.updateIntegratedCardPreview());

    // 5. Image upload zone
    const uploadZone = document.getElementById('card-upload-zone');
    const fileInput = document.getElementById('card-image-file');
    const btnRemoveImg = document.getElementById('card-btn-remove-image');

    if (uploadZone && fileInput) {
      uploadZone.addEventListener('click', (e) => {
        if (e.target !== btnRemoveImg && !e.target.closest('#card-btn-remove-image')) {
          fileInput.click();
        }
      });

      fileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          this.handleCardImageFile(file);
        }
      });
    }

    if (btnRemoveImg) {
      btnRemoveImg.addEventListener('click', (e) => {
        e.stopPropagation();
        this.clearCardSelectedImage();
      });
    }

    // 6. Submit form (Gửi thiệp vào Sổ Lưu Bút)
    const form = document.getElementById('integrated-card-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const author = authorInput ? authorInput.value.trim() : '';
        const realmId = realmSelect ? Number(realmSelect.value) : 1;
        const msg = msgTextarea ? msgTextarea.value.trim() : '';
        if (!author || !msg) {
          alert("Vui lòng nhập tên người gửi và nội dung lời chúc!");
          return;
        }

        const realmData = REALMS_DATA[realmId] || REALMS_DATA[1];

        window.wishStorage.addWish({
          realmId: realmId,
          author: author,
          department: realmData.department,
          badge: this.selectedCardBadge || '🎂',
          message: msg,
          image: this.selectedCardImageData || realmData.assetIcon || (typeof PRESET_AVATARS !== 'undefined' ? PRESET_AVATARS[0].data : '')
        });

        if (window.gameAudio) {
          window.gameAudio.playCoin();
          setTimeout(() => window.gameAudio.playFanfare(), 250);
        }

        if (window.gameEngine) {
          window.gameEngine.spawnFireworks();
          window.gameEngine.refreshCurrentInteractables();
        }
        this.spawnConfetti();

        // Reset form
        form.reset();
        this.clearCardSelectedImage();

        const countEl = document.getElementById('total-wishes-count');
        if (countEl && window.wishStorage) {
          countEl.textContent = window.wishStorage.getAllWishes().length;
        }

        // Tự động chuyển ngay sang Tab Show Thiệp để chiêm ngưỡng
        this.switchGrandFinaleTab('cards');
      });
    }

    // 7. Download PNG
    const btnDownload = document.getElementById('btn-download-card-png');
    if (btnDownload) {
      btnDownload.addEventListener('click', () => {
        this.exportCardImage();
      });
    }

    // 8. Reset form
    const btnReset = document.getElementById('btn-reset-card-form');
    if (btnReset && form) {
      btnReset.addEventListener('click', () => {
        if (confirm("Làm mới lại toàn bộ khung thiệp?")) {
          form.reset();
          this.clearCardSelectedImage();
          this.updateIntegratedCardPreview();
        }
      });
    }
  }

  updateIntegratedCardPreview() {
    const authorVal = (document.getElementById('card-author')?.value || '').trim();
    const realmVal = Number(document.getElementById('card-realm')?.value || 1);
    const msgVal = (document.getElementById('card-message')?.value || '').trim();

    const realmData = REALMS_DATA[realmVal] || REALMS_DATA[1];

    const liveFrame = document.getElementById('live-card-frame');
    if (liveFrame) {
      liveFrame.className = `live-card-frame theme-${this.selectedCardTheme || 'zen'}`;
    }

    const previewAuthor = document.getElementById('live-author');
    const previewDept = document.getElementById('live-dept');
    const previewText = document.getElementById('live-msg');
    const previewBadge = document.getElementById('live-badge');
    const previewDate = document.getElementById('live-date');
    const previewRealmTag = document.getElementById('live-realm-tag');
    const previewImgWrap = document.getElementById('live-img-wrap');
    const previewImg = document.getElementById('live-img');

    if (previewAuthor) previewAuthor.textContent = authorVal || "Tên Người Gửi / Đội Ngũ";
    if (previewDept) previewDept.textContent = `${realmData.name} • ${realmData.department}`;
    if (previewText) previewText.textContent = msgVal ? `"${msgVal}"` : `"Lời chúc của bạn sẽ xuất hiện sống động tại đây..."`;
    if (previewBadge) previewBadge.textContent = this.selectedCardBadge || '🎂';
    if (previewDate) previewDate.textContent = new Date().toLocaleDateString('vi-VN');
    if (previewRealmTag) previewRealmTag.textContent = realmData.name;

    if (previewImgWrap && previewImg) {
      if (this.selectedCardImageData) {
        previewImg.src = this.selectedCardImageData;
        previewImgWrap.style.display = 'block';
      } else {
        previewImgWrap.style.display = 'none';
      }
    }
  }

  handleCardImageFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 500;
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
        const optimized = canvas.toDataURL('image/jpeg', 0.8);
        this.setCardSelectedImage(optimized);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  setCardSelectedImage(dataUrl) {
    this.selectedCardImageData = dataUrl;
    const prompt = document.getElementById('card-upload-prompt');
    const container = document.getElementById('card-preview-container');
    const img = document.getElementById('card-image-preview');
    if (prompt) prompt.style.display = 'none';
    if (container && img) {
      img.src = dataUrl;
      container.style.display = 'flex';
    }
    this.updateIntegratedCardPreview();
  }

  clearCardSelectedImage() {
    this.selectedCardImageData = null;
    const prompt = document.getElementById('card-upload-prompt');
    const container = document.getElementById('card-preview-container');
    const fileInput = document.getElementById('card-image-file');
    if (prompt) prompt.style.display = 'flex';
    if (container) container.style.display = 'none';
    if (fileInput) fileInput.value = '';
    document.querySelectorAll('#card-preset-avatars .preset-avatar-btn').forEach(c => c.classList.remove('selected'));
    this.updateIntegratedCardPreview();
  }

  initCardPresetAvatars() {
    const container = document.getElementById('card-preset-avatars');
    if (!container || typeof PRESET_AVATARS === 'undefined') return;
    container.innerHTML = "";
    PRESET_AVATARS.forEach((p) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'preset-avatar-btn';
      chip.innerHTML = `<img src="${p.data}" alt="${p.name}"><span>${p.name}</span>`;
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.gameAudio) window.gameAudio.playClick();
        container.querySelectorAll('.preset-avatar-btn').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        this.setCardSelectedImage(p.data);
      });
      container.appendChild(chip);
    });
  }

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
    if (this.selectedCardTheme === 'mario') {
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
    } else if (this.selectedCardTheme === 'cyber') {
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
    ctx.fillStyle = (this.selectedCardTheme === 'zen') ? '#512e16' : '#ffd700';
    ctx.font = 'bold 34px "Cinzel", serif, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✦ ĐẠI LỄ MỪNG SINH NHẬT CTO 2026 ✦', 600, 120);

    // Huy hiệu & Tên người gửi
    ctx.font = '54px sans-serif';
    ctx.fillText(this.selectedCardBadge || '🎂', 600, 190);

    ctx.font = 'bold 36px "Noto Serif TC", serif, sans-serif';
    ctx.fillStyle = (this.selectedCardTheme === 'zen') ? '#3d1a04' : '#ffffff';
    ctx.fillText(author, 600, 245);

    ctx.font = '22px "Noto Serif TC", serif, sans-serif';
    ctx.fillStyle = (this.selectedCardTheme === 'zen') ? '#784212' : '#ffd700';
    ctx.fillText(`${realmData.name} • ${realmData.department}`, 600, 280);

    // Đường gạch ngang
    ctx.strokeStyle = (this.selectedCardTheme === 'zen') ? 'rgba(120, 66, 18, 0.4)' : 'rgba(255, 215, 0, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(200, 310);
    ctx.lineTo(1000, 310);
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. Lời chúc nhiều dòng (Word Wrap)
    ctx.font = 'italic 28px "Noto Serif TC", serif, sans-serif';
    ctx.fillStyle = (this.selectedCardTheme === 'zen') ? '#2b170c' : '#ffffff';
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
    ctx.fillStyle = (this.selectedCardTheme === 'zen') ? '#784212' : '#ffd700';
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

    const triggerDownload = () => {
      const link = document.createElement('a');
      link.download = `Thiep_Mung_Sinh_Nhat_CTO_${author.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    if (this.selectedCardImageData) {
      const img = new Image();
      img.onload = () => {
        const imgW = 200;
        const imgH = 130;
        const imgX = (1200 - imgW) / 2;
        const imgY = Math.min(startY + 20, 580);
        ctx.save();
        ctx.strokeStyle = (this.selectedCardTheme === 'zen') ? '#784212' : '#ffd700';
        ctx.lineWidth = 4;
        ctx.strokeRect(imgX, imgY, imgW, imgH);
        ctx.drawImage(img, imgX, imgY, imgW, imgH);
        ctx.restore();
        triggerDownload();
      };
      img.onerror = () => triggerDownload();
      img.src = this.selectedCardImageData;
    } else {
      triggerDownload();
    }
  }

  spawnConfetti() {
    const colors = ['#ffd700', '#e74c3c', '#0984e3', '#2ecc71', '#f1c40f', '#9b59b6'];
    for (let i = 0; i < 60; i++) {
      const conf = document.createElement('div');
      conf.className = 'confetti';
      conf.style.left = Math.random() * window.innerWidth + 'px';
      conf.style.top = '-20px';
      conf.style.width = 8 + Math.random() * 10 + 'px';
      conf.style.height = 8 + Math.random() * 10 + 'px';
      conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      conf.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      document.body.appendChild(conf);

      setTimeout(() => {
        conf.remove();
      }, 2500);
    }
  }

  openWishStudio(realmId = null) {
    this.openGrandFinaleModal('create', realmId);
  }

  // --- 10. ĐÓNG MODAL KHI CLICK RA NGOÀI (BACKDROP) ---
  bindBackdropEvents() {
    document.querySelectorAll('.custom-modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        // Chống đóng tức thì do synthetic click từ touch / gesture trong 250ms
        const openedAt = Number(modal.dataset.openedAt || 0);
        if (Date.now() - openedAt < 250) {
          return;
        }

        if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
          if (modal.id === 'modal-minigame' && window.miniGameManager) {
            window.miniGameManager.closeGame();
          } else {
            modal.classList.remove('active');
          }
        }
      });
    });
  }

  // --- 11. PHÍM TẮT TOÀN CỤC (ESC để đóng nhanh modal & dialogue) ---
  bindGlobalShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        const activeModals = document.querySelectorAll('.custom-modal.active');
        if (activeModals.length > 0) {
          activeModals.forEach(m => {
            if (m.id === 'modal-minigame' && window.miniGameManager) {
              window.miniGameManager.closeGame();
            } else {
              m.classList.remove('active');
            }
          });
          window.gameAudio.playClick();
          e.preventDefault();
          return;
        }

        const dialogueBox = document.getElementById('dialogue-box');
        if (dialogueBox && !dialogueBox.classList.contains('hidden')) {
          dialogueBox.classList.add('hidden');
          if (this.typingTimer) {
            clearInterval(this.typingTimer);
            this.typingTimer = null;
          }
          window.gameAudio.playClick();
          e.preventDefault();
        }
      }
    });
  }
}

// Khởi tạo UI Controller khi trang tải xong
// Scripts nằm cuối <body> nên DOMContentLoaded có thể đã fired → khởi tạo ngay
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', () => {
    window.uiManager = new UIManager();
  });
} else {
  window.uiManager = new UIManager();
}
