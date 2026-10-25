/**
 * UI & MODAL CONTROLLER
 * Điều khiển hộp thoại người dẫn chuyện, các form gửi lời chúc, xem lời chúc,
 * sổ lưu bút toàn thể và đại cảnh mừng sinh nhật CTO.
 */

class UIManager {
  constructor() {
    this.currentDialogueQueue = [];
    this.typingTimer = null;
    this.selectedImageData = null;
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
  }

  // --- 1. MÀN HÌNH CHÀO (MỞ CỔNG GỖ) ---
  bindIntroEvents() {
    const btnEnter = document.getElementById('btn-enter-realm');
    const introOverlay = document.getElementById('intro-overlay');

    btnEnter.addEventListener('click', () => {
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
      }, 700);
    });
  }

  // --- 2. THANH TIÊU ĐỀ TRÊN CÙNG (HUD) ---
  bindHeaderEvents() {
    const btnReturn = document.getElementById('btn-return-hub');
    const btnAudio = document.getElementById('btn-audio-toggle');
    const btnViewTree = document.getElementById('btn-view-tree');
    const btnBackup = document.getElementById('btn-backup-data');
    const btnAspect = document.getElementById('btn-aspect-toggle');
    const btnFullscreen = document.getElementById('btn-fullscreen-toggle');
    const btnHelp = document.getElementById('btn-help-guide');

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
        ? '<svg class="zen-btn-icon"><use href="#zen-bell-on"></use></svg> <span>Nhạc Khúc: BẬT</span>' 
        : '<svg class="zen-btn-icon"><use href="#zen-bell-off"></use></svg> <span>Nhạc Khúc: TẮT</span>';
    });

    btnViewTree.addEventListener('click', () => {
      window.gameAudio.playClick();
      this.openGrandFinaleModal();
    });

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

  // --- 3. THANH 6 HỘP TRÀ DƯỚI ĐÁY ---
  bindTeaBarEvents() {
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

    if (this.typingTimer) {
      clearInterval(this.typingTimer);
      this.typingTimer = null;
    }

    if (this.currentDialogueQueue.length === 0) {
      box.classList.add('hidden');
      return;
    }

    const currentSentence = this.currentDialogueQueue.shift();
    btnNext.innerHTML = (this.currentDialogueQueue.length > 0) 
      ? '<span>Tiếp tục</span> <svg class="zen-btn-icon"><use href="#zen-next"></use></svg>' 
      : '<span>Lĩnh Hội</span> <svg class="zen-btn-icon"><use href="#zen-check"></use></svg>';

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
    this.activeRealmForWish = realmId;
    const realmData = REALMS_DATA[realmId];
    const modal = document.getElementById('modal-wish');

    const wishIconEl = document.getElementById('wish-target-icon');
    if (realmData.assetIcon) {
      wishIconEl.innerHTML = `<img src="${realmData.assetIcon}" class="modal-badge-img" alt="${realmData.name}">`;
    } else {
      wishIconEl.innerHTML = '<svg class="zen-badge-icon"><use href="#zen-tea-leaf"></use></svg>';
    }

    document.getElementById('modal-wish-title').textContent = `Gửi Lời Chúc Mừng Sinh Nhật CTO`;
    document.getElementById('modal-wish-subtitle').textContent = `Lưu giữ thông điệp lên ${realmData.interactableName} (${realmData.name})`;

    // Tự động chọn phòng ban tương ứng
    const deptSelect = document.getElementById('wish-department');
    if (deptSelect && realmData.department) {
      for (let i = 0; i < deptSelect.options.length; i++) {
        if (deptSelect.options[i].text.includes(realmData.name)) {
          deptSelect.selectedIndex = i;
          break;
        }
      }
    }

    modal.classList.add('active');
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

    btnDelete.addEventListener('click', () => {
      if (currentWishId && confirm("Bạn có chắc muốn xóa lời chúc này không?")) {
        window.wishStorage.deleteWish(currentWishId);
        modal.classList.remove('active');
        if (window.gameEngine) {
          window.gameEngine.refreshCurrentInteractables();
        }
      }
    });

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

  // --- 7. ĐẠI CẢNH CÂY TRÀ TRI THỨC & SỔ LƯU BÚT SINH NHẬT ---
  bindGrandFinaleEvents() {
    const modal = document.getElementById('modal-grand-finale');
    const btnClose = document.getElementById('btn-close-grand-modal');
    const btnFireworks = document.getElementById('btn-fireworks');
    const filterDept = document.getElementById('book-filter-dept');

    const btnCloseFooter = document.getElementById('btn-close-grand-footer');

    btnClose.addEventListener('click', () => modal.classList.remove('active'));
    if (btnCloseFooter) btnCloseFooter.addEventListener('click', () => modal.classList.remove('active'));

    btnFireworks.addEventListener('click', () => {
      if (window.gameEngine) {
        window.gameEngine.spawnFireworks();
      }
      modal.classList.remove('active');
    });

    // Chuyển Tabs
    document.querySelectorAll('.grand-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.gameAudio.playClick();
        const tab = btn.dataset.tab;
        document.querySelectorAll('.grand-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.grand-tab-panel').forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const activePanel = document.getElementById(`tab-panel-${tab}`);
        if (activePanel) activePanel.classList.add('active');

        if (tab === 'book') {
          this.renderScrapbook(filterDept.value);
        }
      });
    });

    filterDept.addEventListener('change', (e) => {
      this.renderScrapbook(e.target.value);
    });
  }

  openGrandFinaleModal() {
    const modal = document.getElementById('modal-grand-finale');
    const allWishes = window.wishStorage.getAllWishes();
    document.getElementById('total-wishes-count').textContent = allWishes.length;
    modal.classList.add('active');
  }

  renderScrapbook(filterDept = "all") {
    const container = document.getElementById('scrapbook-container');
    container.innerHTML = "";

    let wishes = window.wishStorage.getAllWishes();
    if (filterDept !== "all") {
      wishes = wishes.filter(w => w.department.includes(filterDept) || (REALMS_DATA[w.realmId] && REALMS_DATA[w.realmId].department.includes(filterDept)));
    }

    if (wishes.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 30px; color: #888;">Chưa có lời chúc nào trong bộ phận này. Hãy là người đầu tiên gửi nhé!</div>`;
      return;
    }

    wishes.forEach(wish => {
      const card = document.createElement('div');
      card.className = 'scrapbook-card';
      const realmData = REALMS_DATA[wish.realmId] || REALMS_DATA[1];

      card.innerHTML = `
        <div class="sb-top">
          <span class="sb-author">
            ${realmData.assetIcon ? `<img src="${realmData.assetIcon}" class="sb-realm-thumb" alt="${realmData.name}">` : ''}
            ${wish.author}
          </span>
          <span class="sb-dept">${wish.department}</span>
        </div>
        <div class="sb-text">"${wish.message}"</div>
        ${wish.image ? `<img class="sb-thumb" src="${wish.image}" alt="Ảnh kỷ niệm">` : ''}
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
          // Nếu là modal thử thách và chưa chiến thắng -> Không cho phép đóng!
          if (modal.id === 'modal-minigame' && window.miniGameManager && !window.miniGameManager.gameWon) {
            window.miniGameManager.shakeGateHint();
            return;
          }
          modal.classList.remove('active');
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
            // Nếu là modal thử thách và chưa qua màn -> Chặn phím ESC
            if (m.id === 'modal-minigame' && window.miniGameManager && !window.miniGameManager.gameWon) {
              window.miniGameManager.shakeGateHint();
              return;
            }
            m.classList.remove('active');
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
