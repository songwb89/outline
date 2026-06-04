/**
 * 悬浮视频播放组件
 * 功能：悬浮显示、视频预览、播放/暂停、放大/缩小
 */

class FloatingVideoPlayer {
  constructor(options = {}) {
    this.videoSrc = options.videoSrc || 'data/6 Unit 1 My Name 39 s Gina P2.mp4';
    this.title = options.title || '';
    this.isPlaying = false;
    this.video = null;
    this.progress = 0;
    this.duration = 0;
    this.animationId = null;
    this.isExpanded = false;
    this.currentWidth = 400;
    this.expandedWidth = 700;

    this.init();
  }

  init() {
    this.createStyles();
    this.createPlayer();
    this.bindEvents();
  }

  createStyles() {
    const styleId = 'floating-video-player-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* 悬浮视频播放器容器 */
      .floating-video-player {
        position: fixed;
        top: 80px;
        right: 20px;
        width: 400px;
        z-index: 9999;
        opacity: 0;
        transform: scale(0.8) translateY(-20px);
        transition: opacity 0.3s ease, transform 0.3s ease, width 0.3s ease;
        pointer-events: none;
      }

      .floating-video-player.active {
        opacity: 1;
        transform: scale(1) translateY(0);
        pointer-events: auto;
      }

      .floating-video-player.expanded {
        width: 700px;
      }

      /* 视频容器背景 */
      .floating-video-inner {
        background: linear-gradient(135deg, rgba(55, 65, 81, 0.95) 0%, rgba(31, 41, 55, 0.95) 100%);
        border: 1px solid rgba(75, 85, 99, 0.5);
        border-radius: 16px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5),
                    0 0 40px rgba(59, 130, 246, 0.15);
        overflow: hidden;
        position: relative;
      }

      /* 视频元素 */
      .floating-video-inner video {
        width: 100%;
        height: auto;
        display: block;
        background: #000;
        border-radius: 12px 12px 0 0;
      }

      /* 底部控制栏 */
      .video-controls {
        padding: 12px 16px;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      /* 播放/暂停按钮 */
      .video-play-btn {
        width: 36px;
        height: 36px;
        background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
      }

      .video-play-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6);
      }

      .video-play-btn svg {
        width: 16px;
        height: 16px;
        fill: white;
      }

      .video-play-btn .icon-play {
        margin-left: 2px;
      }

      .video-play-btn .icon-pause {
        display: none;
      }

      .video-play-btn.playing .icon-play {
        display: none;
      }

      .video-play-btn.playing .icon-pause {
        display: block;
      }

      /* 进度条区域 */
      .video-progress-area {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .video-progress-bar {
        width: 100%;
        height: 4px;
        background: rgba(75, 85, 99, 0.6);
        border-radius: 2px;
        overflow: hidden;
        cursor: pointer;
      }

      .video-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #3b82f6, #6366f1);
        border-radius: 2px;
        width: 0%;
        transition: width 0.1s linear;
      }

      .video-time-display {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
        color: rgba(156, 163, 175, 0.7);
        font-variant-numeric: tabular-nums;
      }

      /* 放大/缩小按钮 */
      .video-expand-btn {
        width: 32px;
        height: 32px;
        background: rgba(75, 85, 99, 0.5);
        border: none;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: all 0.2s ease;
      }

      .video-expand-btn:hover {
        background: rgba(75, 85, 99, 0.8);
        transform: scale(1.05);
      }

      .video-expand-btn svg {
        width: 16px;
        height: 16px;
        stroke: rgba(156, 163, 175, 0.9);
        fill: none;
        stroke-width: 2;
      }

      /* 关闭按钮 */
      .video-close-btn {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 28px;
        height: 28px;
        background: rgba(0, 0, 0, 0.6);
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        z-index: 10;
      }

      .video-close-btn:hover {
        background: rgba(239, 68, 68, 0.8);
        transform: scale(1.1);
      }

      .video-close-btn svg {
        width: 14px;
        height: 14px;
        stroke: white;
        stroke-width: 2;
      }

      /* 加载中提示 */
      .video-loading {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: none;
      }

      .video-loading.active {
        display: flex;
      }

      .video-loading-spinner {
        width: 32px;
        height: 32px;
        border: 3px solid rgba(59, 130, 246, 0.3);
        border-top-color: #3b82f6;
        border-radius: 50%;
        animation: video-spin 1s linear infinite;
      }

      @keyframes video-spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  createPlayer() {
    const container = document.createElement('div');
    container.id = 'floatingVideoPlayer';
    container.className = 'floating-video-player';
    container.innerHTML = `
      <div class="floating-video-inner">
        <!-- 关闭按钮 -->
        <button class="video-close-btn" id="videoCloseBtn" title="关闭播放器">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-linecap="round"/>
          </svg>
        </button>

        <!-- 视频元素 -->
        <video id="floatingVideo" playsinline></video>

        <!-- 加载中 -->
        <div class="video-loading" id="videoLoading">
          <div class="video-loading-spinner"></div>
        </div>

        <!-- 控制栏 -->
        <div class="video-controls">
          <!-- 播放/暂停按钮 -->
          <button class="video-play-btn" id="videoPlayBtn">
            <svg class="icon-play" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <svg class="icon-pause" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          </button>

          <!-- 进度条区域 -->
          <div class="video-progress-area">
            <div class="video-progress-bar" id="videoProgressBar">
              <div class="video-progress-fill" id="videoProgressFill"></div>
            </div>
            <div class="video-time-display">
              <span id="videoCurrentTime">0:00</span>
              <span id="videoTotalTime">--:--</span>
            </div>
          </div>

          <!-- 放大/缩小按钮 -->
          <button class="video-expand-btn" id="videoExpandBtn" title="放大/缩小">
            <svg id="expandIcon" viewBox="0 0 24 24">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(container);
  }

  bindEvents() {
    this.playBtn = document.getElementById('videoPlayBtn');
    this.closeBtn = document.getElementById('videoCloseBtn');
    this.expandBtn = document.getElementById('videoExpandBtn');
    this.progressFill = document.getElementById('videoProgressFill');
    this.progressBar = document.getElementById('videoProgressBar');
    this.currentTimeEl = document.getElementById('videoCurrentTime');
    this.totalTimeEl = document.getElementById('videoTotalTime');
    this.container = document.getElementById('floatingVideoPlayer');
    this.videoEl = document.getElementById('floatingVideo');
    this.expandIcon = document.getElementById('expandIcon');
    this.loadingEl = document.getElementById('videoLoading');

    // 播放/暂停按钮
    this.playBtn.addEventListener('click', () => this.togglePlay());

    // 关闭按钮
    this.closeBtn.addEventListener('click', () => this.hide());

    // 放大/缩小按钮
    this.expandBtn.addEventListener('click', () => this.toggleExpand());

    // 进度条点击跳转
    this.progressBar.addEventListener('click', (e) => {
      const rect = this.progressBar.getBoundingClientRect();
      const percent = ((e.clientX - rect.left) / rect.width) * 100;
      this.seekToPercent(percent);
    });

    // 视频元素
    this.videoEl = document.getElementById('floatingVideo');
    this.videoEl.src = this.videoSrc;

    // 视频事件
    this.videoEl.addEventListener('loadedmetadata', () => {
      this.duration = this.videoEl.duration;
      if (this.totalTimeEl) this.totalTimeEl.textContent = this.formatTime(this.duration);
    });

    this.videoEl.addEventListener('timeupdate', () => {
      if (!this.duration) return;
      this.progress = (this.videoEl.currentTime / this.duration) * 100;
      this.updateProgress();
      if (this.currentTimeEl) {
        this.currentTimeEl.textContent = this.formatTime(this.videoEl.currentTime);
      }
    });

    this.videoEl.addEventListener('ended', () => {
      this.stop();
    });

    this.videoEl.addEventListener('error', (e) => {
      console.error('视频加载失败', e);
      if (this.totalTimeEl) this.totalTimeEl.textContent = 'Error';
    });

    this.videoEl.addEventListener('waiting', () => {
      this.loadingEl.classList.add('active');
    });

    this.videoEl.addEventListener('canplay', () => {
      this.loadingEl.classList.remove('active');
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
    this.isExpanded = false;
    this.container.classList.remove('expanded');
    this.updateExpandIcon();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    if (this.videoEl) {
      this.videoEl.play().then(() => {
        this.isPlaying = true;
        this.playBtn.classList.add('playing');
      }).catch(err => {
        console.error('播放失败:', err);
      });
    }
  }

  pause() {
    if (this.videoEl) {
      this.videoEl.pause();
      this.isPlaying = false;
      this.playBtn.classList.remove('playing');
    }
  }

  stop() {
    if (this.videoEl) {
      this.videoEl.pause();
      this.videoEl.currentTime = 0;
      this.isPlaying = false;
      this.playBtn.classList.remove('playing');
      this.progress = 0;
      this.updateProgress();
      if (this.currentTimeEl) this.currentTimeEl.textContent = '0:00';
    }
  }

  updateProgress() {
    if (this.progressFill) {
      this.progressFill.style.width = this.progress + '%';
    }
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
    if (this.isExpanded) {
      this.container.classList.add('expanded');
    } else {
      this.container.classList.remove('expanded');
    }
    this.updateExpandIcon();
  }

  updateExpandIcon() {
    if (this.expandIcon) {
      if (this.isExpanded) {
        // 收缩图标（缩小）
        this.expandIcon.innerHTML = '<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>';
      } else {
        // 放大图标
        this.expandIcon.innerHTML = '<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>';
      }
    }
  }

  seekToPercent(percent) {
    if (this.videoEl && this.duration) {
      this.videoEl.currentTime = (percent / 100) * this.duration;
    }
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

// 全局播放器实例
let floatingVideoPlayer = null;

// 初始化悬浮视频播放器
function initFloatingVideoPlayer(videoSrc, title) {
  if (!floatingVideoPlayer) {
    floatingVideoPlayer = new FloatingVideoPlayer({
      videoSrc: videoSrc,
      title: title || ''
    });
  }
  return floatingVideoPlayer;
}

// 显示悬浮视频播放器
function showFloatingVideoPlayer() {
  if (!floatingVideoPlayer) {
    initFloatingVideoPlayer('data/6 Unit 1 My Name 39 s Gina P2.mp4', '');
  }
  floatingVideoPlayer.show();
}

// 隐藏悬浮视频播放器
function hideFloatingVideoPlayer() {
  if (floatingVideoPlayer) {
    floatingVideoPlayer.hide();
  }
}
