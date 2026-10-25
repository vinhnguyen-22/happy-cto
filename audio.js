/**
 * AUDIO ENGINE - WEB AUDIO API SYNTHESIZER
 * Chuyên tạo nhạc nền Trà Đạo / Guqin Zen Lo-Fi và hiệu ứng âm thanh ấm áp,
 * không cần tải file MP3 ngoài, chạy mượt mà ngay trên mọi trình duyệt!
 */

class AudioManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25]; // Đô Rê Mi Son La ngũ cung
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBGM();
    } else {
      this.init();
      this.startBGM();
    }
    return !this.isMuted;
  }

  // --- NHẠC NỀN TRÀ ĐẠO NGŨ CUNG THIỀN ĐỊNH ---
  startBGM() {
    if (this.isMuted || this.bgmPlaying) return;
    this.init();
    this.bgmPlaying = true;
    this.playNextZenNote();
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  playNextZenNote() {
    if (!this.bgmPlaying || this.isMuted) return;

    // Chọn nốt ngẫu nhiên trong thang âm ngũ cung tạo giai điệu du dương thanh tịnh
    const note = this.scale[Math.floor(Math.random() * this.scale.length)];
    this.playPluck(note, 2.8, 0.12);

    // Thỉnh thoảng đệm thêm một hợp âm trầm ấm
    if (Math.random() > 0.6) {
      setTimeout(() => {
        if (this.bgmPlaying && !this.isMuted) {
          const bassNote = this.scale[Math.floor(Math.random() * 3)] / 2;
          this.playPluck(bassNote, 3.5, 0.15);
        }
      }, 400);
    }

    // Khoảng thời gian ngẫu nhiên giữa các nốt (nhịp điệu thong dong như giọt trà rơi)
    const nextInterval = 1200 + Math.random() * 1800;
    this.bgmTimer = setTimeout(() => {
      this.playNextZenNote();
    }, nextInterval);
  }

  // Tiếng gảy đàn tranh / Guqin
  playPluck(freq, duration = 2.0, volume = 0.2) {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + duration);

      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // --- CÁC HIỆU ỨNG ÂM THANH (SFX) ---

  // Tiếng click nút gỗ
  playClick() {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {}
  }

  // Tiếng chuông gió / chuông khánh
  playBell(freq = 880) {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 2.5);
    } catch (e) {}
  }

  // Tiếng bước chân nhẹ trên sàn gỗ
  playStep() {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(80 + Math.random() * 20, now);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {}
  }

  // Tiếng mở cửa gỗ trang nghiêm
  playDoorOpen() {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.linearRampToValueAtTime(95, now + 0.8);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.8);
    } catch (e) {}
  }

  // Tiếng rót trà / suối chảy
  playTeaPour() {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      // White noise synthesis
      const bufferSize = this.ctx.sampleRate * 0.6;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.linearRampToValueAtTime(1800, now + 0.6);
      filter.Q.value = 3.0;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
    } catch (e) {}
  }

  // Tiếng phép thuật khi lưu lời chúc thành công
  playWishSaved() {
    if (!this.ctx || this.isMuted) return;
    const chords = [523.25, 659.25, 783.99, 1046.50]; // Đô - Mi - Sol - Đô cao
    chords.forEach((note, index) => {
      setTimeout(() => {
        this.playPluck(note, 1.2, 0.18);
      }, index * 90);
    });
  }

  // Tiếng pháo hoa chúc mừng sinh nhật
  playFirework() {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      // Tiếng nổ trầm
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.4);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);

      // Chùm sao lách tách
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          this.playBell(1200 + Math.random() * 800);
        }, 150 + i * 70);
      }
    } catch (e) {}
  }
}

// Khởi tạo đối tượng audio toàn cục
window.gameAudio = new AudioManager();
