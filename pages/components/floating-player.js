/**
 * 悬浮音频播放组件
 * 功能：悬浮显示、环形进度条、播放/暂停、关闭
 */

class FloatingAudioPlayer {
  constructor(options = {}) {
    this.audioSrc = options.audioSrc || 'data/kt4ys.mp3';
    this.title = options.title || '';
    this.isPlaying = false;
    this.audio = null;
    this.progress = 0;
    this.duration = 0;
    this.animationId = null;

    this.init();
  }

  init() {
    this.createStyles();
    this.createPlayer();
    this.bindEvents();
  }

  createStyles() {
    const styleId = 'floating-player-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* 悬浮播放器容器 */
      .floating-player {
        position: fixed;
        top: 80px;
        right: 20px;
        width: 160px;
        height: 160px;
        z-index: 9999;
        opacity: 0;
        transform: scale(0.8) translateY(-20px);
        transition: opacity 0.3s ease, transform 0.3s ease;
        pointer-events: none;
      }

      .floating-player.active {
        opacity: 1;
        transform: scale(1) translateY(0);
        pointer-events: auto;
      }

      /* 正方形背景 */
      .floating-player-inner {
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(55, 65, 81, 0.95) 0%, rgba(31, 41, 55, 0.95) 100%);
        border: 1px solid rgba(75, 85, 99, 0.5);
        border-radius: 16px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5),
                    0 0 40px rgba(59, 130, 246, 0.15);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        cursor: default;
      }

      /* 背景动画效果 */
      .floating-player-inner::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
        animation: pulse-bg 4s ease-in-out infinite;
      }

      @keyframes pulse-bg {
        0%, 100% { transform: scale(0.8); opacity: 0.5; }
        50% { transform: scale(1.2); opacity: 1; }
      }

      /* 环形进度条容器 */
      .progress-ring-container {
        position: relative;
        width: 100px;
        height: 100px;
      }

      /* SVG 环形进度条 */
      .progress-ring {
        transform: rotate(-90deg);
        filter: drop-shadow(0 0 6px rgba(59, 130, 246, 0.4));
      }

      .progress-ring-bg {
        fill: none;
        stroke: rgba(75, 85, 99, 0.6);
        stroke-width: 4;
      }

      .progress-ring-fill {
        fill: none;
        stroke: url(#progressGradient);
        stroke-width: 4;
        stroke-linecap: round;
        stroke-dasharray: 251.2;
        stroke-dashoffset: 251.2;
        transition: stroke-dashoffset 0.1s linear;
      }

      /* 中心播放按钮 */
      .center-btn {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 44px;
        height: 44px;
        background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
      }

      .center-btn:hover {
        transform: translate(-50%, -50%) scale(1.1);
        box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6);
      }

      .center-btn:active {
        transform: translate(-50%, -50%) scale(0.95);
      }

      .center-btn svg {
        width: 20px;
        height: 20px;
        fill: white;
      }

      .center-btn .icon-play {
        margin-left: 2px;
      }

      .center-btn .icon-pause {
        display: none;
      }

      .center-btn.playing .icon-play {
        display: none;
      }

      .center-btn.playing .icon-pause {
        display: block;
      }

      /* 时间显示 */
      .player-time {
        margin-top: 2px;
        font-size: 10px;
        color: rgba(156, 163, 175, 0.7);
        font-variant-numeric: tabular-nums;
      }

      /* 关闭按钮 */
      .close-btn {
        position: absolute;
        top: 6px;
        right: 6px;
        width: 22px;
        height: 22px;
        background: rgba(75, 85, 99, 0.5);
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        padding: 0;
      }

      .close-btn:hover {
        background: rgba(239, 68, 68, 0.6);
        transform: scale(1.1);
      }

      .close-btn svg {
        width: 12px;
        height: 12px;
        stroke: rgba(156, 163, 175, 0.8);
        stroke-width: 2;
      }

      .close-btn:hover svg {
        stroke: white;
      }

      /* 波浪动画效果 */
      .wave-effect {
        position: absolute;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }

      .wave-ring {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 60px;
        height: 60px;
        border: 2px solid rgba(59, 130, 246, 0.3);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
      }

      .playing .wave-ring {
        animation: wave-expand 2s ease-out infinite;
      }

      .playing .wave-ring:nth-child(2) {
        animation-delay: 0.6s;
      }

      .playing .wave-ring:nth-child(3) {
        animation-delay: 1.2s;
      }

      @keyframes wave-expand {
        0% {
          width: 60px;
          height: 60px;
          opacity: 0.6;
        }
        100% {
          width: 140px;
          height: 140px;
          opacity: 0;
        }
      }

      /* 音符飘动动画 */
      .note-float {
        position: absolute;
        font-size: 14px;
        color: rgba(59, 130, 246, 0.6);
        pointer-events: none;
        animation: float-up 3s ease-out infinite;
        opacity: 0;
      }

      .playing .note-float:nth-child(1) {
        left: 20%;
        animation-delay: 0s;
      }

      .playing .note-float:nth-child(2) {
        left: 50%;
        animation-delay: 1s;
      }

      .playing .note-float:nth-child(3) {
        left: 75%;
        animation-delay: 2s;
      }

      @keyframes float-up {
        0% {
          bottom: 30%;
          opacity: 0;
          transform: translateX(0);
        }
        20% {
          opacity: 1;
        }
        80% {
          opacity: 0.5;
        }
        100% {
          bottom: 80%;
          opacity: 0;
          transform: translateX(10px);
        }
      }
    `;
    document.head.appendChild(style);
  }

  createPlayer() {
    const container = document.createElement('div');
    container.id = 'floatingPlayer';
    container.className = 'floating-player';
    container.innerHTML = `
      <div class="floating-player-inner">
        <!-- 波浪动画 -->
        <div class="wave-effect">
          <div class="wave-ring"></div>
          <div class="wave-ring"></div>
          <div class="wave-ring"></div>
        </div>

        <!-- 音符飘动 -->
        <div class="note-float">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        </div>
        <div class="note-float">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        </div>
        <div class="note-float">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        </div>

        <!-- SVG 渐变定义 -->
        <svg width="0" height="0" style="position: absolute;">
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#3b82f6"/>
              <stop offset="100%" style="stop-color:#6366f1"/>
            </linearGradient>
          </defs>
        </svg>

        <!-- 环形进度条 -->
        <div class="progress-ring-container">
          <svg class="progress-ring" width="100" height="100" viewBox="0 0 100 100">
            <circle class="progress-ring-bg" cx="50" cy="50" r="40"/>
            <circle class="progress-ring-fill" cx="50" cy="50" r="40"/>
          </svg>

          <!-- 中心播放按钮 -->
          <button class="center-btn" id="playerBtn">
            <svg class="icon-play" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <svg class="icon-pause" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          </button>
        </div>

        <!-- 时间 -->
        <div class="player-time">
          <span id="floating-currentTime">0:00</span> / <span id="floating-totalTime">--:--</span>
        </div>

        <!-- 关闭按钮 -->
        <button class="close-btn" id="closeBtn" title="关闭播放器">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(container);
  }

  bindEvents() {
    this.playerBtn = document.getElementById('playerBtn');
    this.closeBtn = document.getElementById('closeBtn');
    this.progressRing = document.querySelector('.progress-ring-fill');
    this.currentTimeEl = document.getElementById('floating-currentTime');
    this.totalTimeEl = document.getElementById('floating-totalTime');
    this.container = document.getElementById('floatingPlayer');

    // 播放/暂停按钮
    this.playerBtn.addEventListener('click', () => this.togglePlay());

    // 关闭按钮
    this.closeBtn.addEventListener('click', () => this.hide());

    // 创建音频对象
    this.audio = new Audio(this.audioSrc);
    // 确保使用正确的基础路径
    if (!this.audioSrc.startsWith('http') && !this.audioSrc.startsWith('/')) {
      this.audio.src = 'data/kt4ys.mp3';
    }
    this.startOffset = 15; // 跳过前15秒

    // 音频事件
    this.audio.addEventListener('loadedmetadata', () => {
      this.duration = this.audio.duration;
      if (this.totalTimeEl) this.totalTimeEl.textContent = this.formatTime(this.duration);
      if (this.currentTimeEl) this.currentTimeEl.textContent = '0:00';
    });

    this.audio.addEventListener('timeupdate', () => {
      if (!this.duration) return;
      // 计算相对于总时长的进度百分比
      this.progress = (this.audio.currentTime / this.duration) * 100;
      this.updateProgress();
      // 当前时间显示：从0开始（实际播放位置 - 跳过的前12秒）
      if (this.currentTimeEl) {
        const displayTime = Math.max(0, this.audio.currentTime - this.startOffset);
        this.currentTimeEl.textContent = this.formatTime(displayTime);
      }
    });

    this.audio.addEventListener('ended', () => {
      this.stop();
    });

    this.audio.addEventListener('error', (e) => {
      console.error('音频加载失败', e);
      if (this.totalTimeEl) this.totalTimeEl.textContent = 'Error';
      if (this.currentTimeEl) this.currentTimeEl.textContent = 'Error';
    });
  }

  show() {
    this.container.classList.add('active');
    // 显示后自动播放
    this.play();
  }

  hide() {
    this.stop();
    this.container.classList.remove('active');
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    if (this.audio) {
      // 每次播放都从 startOffset 开始
      this.audio.currentTime = this.startOffset;
      // 显示0:00
      if (this.currentTimeEl) this.currentTimeEl.textContent = '0:00';
      this.audio.play().then(() => {
        this.isPlaying = true;
        this.playerBtn.classList.add('playing');
        this.container.querySelector('.floating-player-inner').classList.add('playing');
        this.startProgressAnimation();
      }).catch(err => {
        console.error('播放失败:', err);
      });
    }
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
      this.isPlaying = false;
      this.playerBtn.classList.remove('playing');
      this.container.querySelector('.floating-player-inner').classList.remove('playing');
      this.stopProgressAnimation();
    }
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = this.startOffset;
      this.isPlaying = false;
      this.playerBtn.classList.remove('playing');
      this.container.querySelector('.floating-player-inner').classList.remove('playing');
      this.progress = 0;
      this.updateProgress();
      // 重置为0，但总时长保持不变
      if (this.currentTimeEl) this.currentTimeEl.textContent = '0:00';
      this.stopProgressAnimation();
    }
  }

  startProgressAnimation() {
    // 使用 requestAnimationFrame 实现平滑动画
    const animate = () => {
      if (!this.isPlaying) return;
      // 进度条更新在 timeupdate 事件中处理
      this.animationId = requestAnimationFrame(animate);
    };
    this.animationId = requestAnimationFrame(animate);
  }

  stopProgressAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  updateProgress() {
    // 周长 = 2 * PI * r = 2 * 3.14159 * 40 ≈ 251.2
    const circumference = 251.2;
    const offset = circumference - (this.progress / 100) * circumference;
    this.progressRing.style.strokeDashoffset = offset;
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // 跳转到指定时间
  seek(time) {
    if (this.audio) {
      this.audio.currentTime = time;
    }
  }

  // 跳转到百分比位置
  seekToPercent(percent) {
    if (this.audio && this.duration) {
      this.audio.currentTime = (percent / 100) * this.duration;
    }
  }
}

// 全局播放器实例
let floatingPlayer = null;

// 初始化悬浮播放器
function initFloatingPlayer(audioSrc, title) {
  if (!floatingPlayer) {
    floatingPlayer = new FloatingAudioPlayer({
      audioSrc: audioSrc,
      title: title || ''
    });
  }
  return floatingPlayer;
}

// 显示悬浮播放器
function showFloatingPlayer() {
  if (!floatingPlayer) {
    initFloatingPlayer('data/kt4ys.mp3', '');
  }
  floatingPlayer.show();
}

// 隐藏悬浮播放器
function hideFloatingPlayer() {
  if (floatingPlayer) {
    floatingPlayer.hide();
  }
}
