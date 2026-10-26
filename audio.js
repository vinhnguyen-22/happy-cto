/**
 * AUDIO ENGINE - BACKGROUND MUSIC & RETRO SOUND EFFECTS
 * Nhạc nền chính thức từ file audio bg.mp3 kết hợp cùng hệ thống âm thanh hiệu ứng (SFX)
 * Chạy mượt mà trên mọi trình duyệt, hỗ trợ loop mượt, toggle mute và điều chỉnh âm lượng.
 */

class AudioManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.bgmPlaying = false;
    this.initialized = false;
    this.masterGain = null;

    // Nhạc nền chính thức từ file audio bg.mp3
    this.bgmSrc = 'audio bg.mp3';
    this.bgmAudio = null;
    this.bgmVolume = 0.55; // Âm lượng nhạc nền êm dịu, hài hòa với SFX

    // Bảng tần số nốt nhạc Chiptune cho SFX
    this.NOTES = {
      REST: 0,
      C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
      C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, Bb4: 466.16, B4: 493.88,
      C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, Bb5: 932.33, B5: 987.77,
      C6: 1046.50, D6: 1174.66, E6: 1318.51
    };
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    if (!this.bgmAudio) {
      this.bgmAudio = document.getElementById('game-bgm');
      if (!this.bgmAudio) {
        this.bgmAudio = new Audio();
        this.bgmAudio.id = 'game-bgm';
        this.bgmAudio.src = encodeURI(this.bgmSrc);
        this.bgmAudio.loop = true;
        this.bgmAudio.preload = 'auto';
      }
      this.bgmAudio.volume = this.isMuted ? 0 : this.bgmVolume;
      this.bgmAudio.muted = this.isMuted;
    }

    this.initialized = true;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBGM();
      if (this.bgmAudio) {
        this.bgmAudio.volume = 0;
        this.bgmAudio.muted = true;
      }
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
    } else {
      this.init();
      if (this.bgmAudio) {
        this.bgmAudio.muted = false;
        this.bgmAudio.volume = this.bgmVolume;
      }
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      }
      this.startBGM();
    }
    return !this.isMuted;
  }

  // --- PHÁT NHẠC NỀN AUDIO BG.MP3 ---
  startBGM() {
    if (this.isMuted) return;
    this.init();
    this.bgmPlaying = true;

    if (this.bgmAudio) {
      this.bgmAudio.muted = false;
      this.bgmAudio.volume = this.bgmVolume;
      const playPromise = this.bgmAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          // Trình duyệt có thể cần tương tác người dùng (click) trước khi cho phép phát audio
          console.log("Audio BGM chờ tương tác từ người dùng:", err);
        });
      }
    }
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmAudio) {
      this.bgmAudio.pause();
    }
  }

  setBGMVolume(val) {
    this.bgmVolume = Math.max(0, Math.min(1, val));
    if (this.bgmAudio && !this.isMuted) {
      this.bgmAudio.volume = this.bgmVolume;
    }
  }

  // Nốt Square Wave (Lead Mario Chiptune)
  playSquareNote(freq, time, duration, volume = 0.15) {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, time);

      // Lọc nhẹ để tiếng retro 8-bit trong trẻo, không bị chói tai
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2600, time);

      // Envelope ADSR staccato nhanh
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(volume, time + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(time);
      osc.stop(time + duration);
    } catch (e) {}
  }

  // Nốt Triangle Wave (Bouncy Bassline Mario)
  playTriangleNote(freq, time, duration, volume = 0.2) {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(volume, time + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(time);
      osc.stop(time + duration);
    } catch (e) {}
  }

  // Snare Drum Chiptune
  playNoiseSnare(time) {
    if (!this.ctx || this.isMuted) return;
    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.06);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, time);
      filter.Q.value = 2.0;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.07, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(time);
      noise.stop(time + 0.06);
    } catch (e) {}
  }

  // Hi-Hat Chiptune
  playHiHat(time) {
    if (!this.ctx || this.isMuted) return;
    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.02);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(7000, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.025, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(time);
      noise.stop(time + 0.02);
    } catch (e) {}
  }

  // --- CÁC HIỆU ỨNG ÂM THANH MARIO RETRO (SFX) ---

  // Tiếng Mario Ăn Đồng Xu (Iconic Coin Sound: B5 -> E6)
  playCoin() {
    if (!this.ctx || this.isMuted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(this.NOTES.B5, now);
      osc.frequency.setValueAtTime(this.NOTES.E6, now + 0.07);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.setValueAtTime(0.18, now + 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.38);
    } catch (e) {}
  }

  // Tiếng Mario Nhảy (Boing Jump Sound: 150Hz -> 600Hz slide)
  playJump() {
    if (!this.ctx || this.isMuted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.16);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {}
  }

  // Tiếng Mario Nhặt Nấm Biến Lớn (Power-Up Arpeggio)
  playPowerup() {
    if (!this.ctx || this.isMuted) return;
    this.init();
    const notes = [
      this.NOTES.G4, this.NOTES.B4, this.NOTES.D5,
      this.NOTES.G5, this.NOTES.B5, this.NOTES.D6
    ];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.12);
      }, idx * 60);
    });
  }

  // Khúc Khải Hoàn Chiến Thắng / Qua Cõi (Mario Stage Clear Fanfare!)
  playFanfare() {
    if (!this.ctx || this.isMuted) return;
    this.init();
    const fanfareNotes = [
      { f: this.NOTES.G4, d: 80 }, { f: this.NOTES.C5, d: 80 }, { f: this.NOTES.E5, d: 80 },
      { f: this.NOTES.G5, d: 80 }, { f: this.NOTES.C6, d: 180 }, { f: this.NOTES.E6, d: 240 }
    ];
    let offset = 0;
    fanfareNotes.forEach(item => {
      setTimeout(() => {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(item.f, now);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + (item.d / 1000));
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + (item.d / 1000));
      }, offset);
      offset += item.d + 30;
    });
  }

  // Tiếng click nút 8-bit giòn giã
  playClick() {
    if (!this.ctx || this.isMuted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(640, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.05);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  // Tiếng bước chân retro
  playStep() {
    if (!this.ctx || this.isMuted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140 + Math.random() * 30, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.04);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  }

  // Tiếng mở cửa / chuyển cõi
  playDoorOpen() {
    this.playPowerup();
  }

  // Tiếng chuông khánh
  playBell(freq = 880) {
    this.playCoin();
  }

  // Tiếng rót trà
  playTeaPour() {
    if (!this.ctx || this.isMuted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.4);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1600, now);
      filter.frequency.linearRampToValueAtTime(2200, now + 0.4);
      filter.Q.value = 4.0;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(now);
      noise.stop(now + 0.4);
    } catch (e) {}
  }

  // Khi lưu lời chúc thành công: Coin + Fanfare chúc mừng rực rỡ!
  playWishSaved() {
    this.playCoin();
    setTimeout(() => {
      this.playFanfare();
    }, 180);
  }

  // Tiếng pháo hoa chúc mừng
  playFirework() {
    if (!this.ctx || this.isMuted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(28, now + 0.35);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.35);

      // Chùm sao lách tách
      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          this.playCoin();
        }, 120 + i * 80);
      }
    } catch (e) {}
  }
}

// Khởi tạo AudioManager toàn cục
window.gameAudio = new AudioManager();
