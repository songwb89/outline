/**
 * 导航栏组件
 * 用于所有页面的统一顶部导航栏
 */

// 动态加载点数动画样式
(function loadPointsAnimationStyles() {
  if (document.getElementById('navbar-points-styles')) return;
  var style = document.createElement('style');
  style.id = 'navbar-points-styles';
  style.textContent = `
    .points-display { position: relative; cursor: pointer; }
    .points-display:hover .points-value { text-shadow: 0 0 8px rgba(255, 255, 255, 0.5); }
    .points-animation-container { position: absolute; top: 0; right: 0.75rem; height: 100%; pointer-events: none; overflow: visible; z-index: 10; }
    .points-minus { position: absolute; left: calc(50% - 5px); transform: translateX(-50%); font-size: 1rem; font-weight: bold; color: #ef4444; text-shadow: 0 1px 3px rgba(0,0,0,0.3); animation: pointsMinusAnim 1.5s ease-out forwards; white-space: nowrap; }
    @keyframes pointsMinusAnim { 0% { top: calc(30% + 20px); opacity: 1; transform: translateX(-50%) scale(0.5); color: #dc2626; } 20% { transform: translateX(-50%) scale(1.3); color: #ef4444; } 50% { top: calc(50% + 20px); transform: translateX(-50%) scale(1.1); color: #dc2626; } 100% { top: calc(90% + 20px); opacity: 0; transform: translateX(-50%) scale(0.8); color: #dc2626; } }
    .points-value-anim { animation: pointsValueChange 0.4s ease-out; }
    @keyframes pointsValueChange { 0% { transform: scale(1); } 50% { transform: scale(1.3); color: #fca5a5; } 100% { transform: scale(1); } }

    /* 用户下拉菜单样式 */
    .user-dropdown { position: relative; }
    .user-dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 0.5rem;
      min-width: 140px;
      background-color: white;
      border-radius: 0.75rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      border: 1px solid #f3f4f6;
      padding: 0.25rem 0;
      z-index: 50;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-8px);
      transition: all 0.2s ease;
    }
    .user-dropdown-menu.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    .user-dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1rem;
      color: #374151;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .user-dropdown-item:hover {
      background-color: #f9fafb;
      color: #2563eb;
    }
    .user-dropdown-item i { width: 16px; height: 16px; }
  `;
  document.head.appendChild(style);
})();

class Navbar {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = {
      currentPage: options.currentPage || 'home',
      showTestButton: options.showTestButton || false,
      showPointsAnimation: options.showPointsAnimation || false,
      compactMode: options.compactMode || false,
      bodyClass: options.bodyClass || '',
      ...options
    };
    this.render();
  }

  // 导航项配置
  get navItems() {
    return [
      { id: 'home', label: '首页', href: 'home.html' },
      { id: 'prepare', label: '智能备课', href: 'prepare.html' },
      { id: 'teach', label: '智能授课', href: 'teach.html' },
      { id: 'evaluate', label: '智能评测', href: 'evaluate.html' },
      { id: 'analysis', label: '学情分析', href: 'analysis.html' },
      { id: 'ai', label: 'AI专区', href: 'ai.html' },
      { id: 'academic', label: '教务管理', href: 'academic-class.html' }
    ];
  }

  // 生成导航链接 HTML
  generateNavLinks() {
    return this.navItems.map(item => {
      if (item.id === this.options.currentPage) {
        return `<a href="${item.href}" class="px-4 py-2 text-sm font-medium rounded-lg bg-white/20 transition-all hover:bg-white/30 no-underline text-white">
          ${item.label}
        </a>`;
      } else {
        return `<a href="${item.href}" class="px-4 py-2 text-sm text-white/80 rounded-lg transition-all hover:bg-white/20 hover:text-white no-underline">${item.label}</a>`;
      }
    }).join('');
  }

  // 生成测试按钮（仅 ai.html 需要）
  generateTestButton() {
    if (!this.options.showTestButton) return '';
    return `<button id="test-points-minus-btn" class="px-3 py-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs font-bold rounded-full border-2 border-dashed border-gray-300 shadow-lg transform rotate-2 hover:scale-110 hover:rotate-[-2deg] transition-all cursor-pointer">
      扣减动画
    </button>`;
  }

  // 生成点数显示（区分是否带动画容器）
  generatePointsDisplay() {
    if (this.options.showPointsAnimation) {
      // ai.html 特殊结构：带动画容器
      return `
        <div class="flex flex-col items-end gap-0.5 points-display" id="points-container">
          <div class="flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-lg">
            <i data-lucide="coins" class="w-4 h-4"></i>
            <span class="text-sm font-medium">可用额度：</span>
            <span id="header-points" class="text-sm font-bold min-w-[3rem] text-right">--</span>
          </div>
          <div class="points-animation-container" id="points-animation-container"></div>
        </div>
      `;
    } else {
      // 普通结构
      return `
        <div class="flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-lg">
          <i data-lucide="coins" class="w-4 h-4"></i>
          <span class="text-sm font-medium">可用额度：</span>
          <span id="header-points" class="text-sm font-bold">--</span>
        </div>
      `;
    }
  }

  // 渲染导航栏
  render() {
    if (!this.container) {
      console.error(`Navbar: 找不到容器 #${this.containerId}`);
      return;
    }

    const headerClass = this.options.bodyClass.includes('h-screen') 
      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg flex-shrink-0'
      : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg';
    const navHtml = this.options.compactMode
      ? '<div class="flex-1"></div>'
      : `<nav class="flex items-center gap-1">${this.generateNavLinks()}</nav>`;
    const pointsHtml = this.options.compactMode ? '' : this.generatePointsDisplay();
    const testButtonHtml = this.options.compactMode ? '' : this.generateTestButton();

    this.container.outerHTML = `
      <header class="${headerClass}">
        <div class="flex items-center justify-between h-16 px-6">
          <!-- 左侧 Logo -->
          <div class="flex items-center gap-3 shrink-0">
            <img src="img/logo.png" alt="兆涵科技" class="h-9 sm:h-10 w-auto max-h-10 object-contain object-left" />
            <div class="flex flex-col leading-tight">
              <span class="text-base sm:text-lg font-bold text-white">兆涵科技</span>
              <span class="text-xs text-white leading-none">Sigma Education</span>
            </div>
          </div>

          <!-- 中间导航 -->
          ${navHtml}

          <!-- 右侧图标 + 用户 -->
          <div class="flex items-center gap-4">
            ${testButtonHtml}
            ${pointsHtml}

            <!-- 任务 -->
            <div class="relative cursor-pointer hover:bg-white/20 p-2 rounded-lg transition-all">
              <i data-lucide="list-todo" class="w-5 h-5"></i>
              <span class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
            </div>
            
            <!-- 通知 -->
            <div class="relative cursor-pointer hover:bg-white/20 p-2 rounded-lg transition-all">
              <i data-lucide="bell" class="w-5 h-5"></i>
              <span class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">5</span>
            </div>
            
            <!-- 用户信息 - 带下拉菜单 -->
            <div class="user-dropdown" id="user-dropdown">
              <div class="flex items-center gap-3 cursor-pointer hover:bg-white/20 p-2 rounded-lg transition-all" id="user-dropdown-toggle">
                <div class="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center overflow-hidden">
                  <img id="navbar-user-avatar" src="img/tx.png" alt="头像" class="w-full h-full object-cover" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
                  <i data-lucide="user" class="w-4 h-4" style="display:none;"></i>
                </div>
                <div class="text-sm">
                  <div class="font-medium" id="navbar-user-name">张老师</div>
                </div>
                <i data-lucide="chevron-down" class="w-4 h-4 text-white/70 transition-transform" id="user-dropdown-arrow"></i>
              </div>
              <!-- 下拉菜单 -->
              <div id="user-dropdown-menu" class="user-dropdown-menu">
                <div class="user-dropdown-item text-gray-700 hover:text-blue-600 hover:bg-gray-50" onclick="openUserProfile()">
                  <i data-lucide="user-circle" class="w-4 h-4"></i>
                  <span>个人中心</span>
                </div>
                <div style="border-top: 1px solid #f3f4f6; margin: 0.25rem 0;"></div>
                <div class="user-dropdown-item text-red-600 hover:text-red-700 hover:bg-red-50" onclick="logout()">
                  <i data-lucide="log-out" class="w-4 h-4"></i>
                  <span>退出登录</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    `;

    // 渲染完成后初始化 Lucide 图标
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // 绑定用户下拉菜单事件
    this.bindUserDropdown();

    // 初始化点数和绑定测试按钮
    if (this.options.showTestButton) {
      initPoints();
      bindTestButton();
    }
  }

  // 绑定用户下拉菜单
  bindUserDropdown() {
    var dropdown = document.getElementById('user-dropdown');
    var toggle = document.getElementById('user-dropdown-toggle');
    var menu = document.getElementById('user-dropdown-menu');
    var arrow = document.getElementById('user-dropdown-arrow');

    if (!dropdown || !toggle || !menu) return;

    // 点击切换下拉菜单
    toggle.addEventListener('click', function(e) {
      e.stopPropagation();
      var isOpen = menu.classList.contains('show');
      if (isOpen) {
        closeUserDropdown();
      } else {
        menu.classList.add('show');
        if (arrow) arrow.style.transform = 'rotate(180deg)';
      }
    });

    // 点击其他区域关闭
    document.addEventListener('click', function(e) {
      if (!dropdown.contains(e.target)) {
        closeUserDropdown();
      }
    });
  }

  // 设置用户信息
  setUserInfo(name, avatar) {
    var nameEl = document.getElementById('navbar-user-name');
    var avatarEl = document.getElementById('navbar-user-avatar');
    if (nameEl) nameEl.textContent = name || '用户';
    if (avatarEl && avatar) avatarEl.src = avatar;
  }
}

// 关闭用户下拉菜单
function closeUserDropdown() {
  var menu = document.getElementById('user-dropdown-menu');
  var arrow = document.getElementById('user-dropdown-arrow');
  if (menu) menu.classList.remove('show');
  if (arrow) arrow.style.transform = '';
}

// 打开个人信息弹窗
function openUserProfile() {
  closeUserDropdown();
  if (window.showUserProfileModal) {
    window.showUserProfileModal();
  }
}

// 退出登录
function logout() {
  closeUserDropdown();
  if (typeof window.confirmLogout === 'function') {
    window.confirmLogout();
  } else {
    if (confirm('确定要退出登录吗？')) {
      localStorage.removeItem('currentTeacher');
      window.location.href = 'login.html';
    }
  }
}

// 初始化点数
function initPoints() {
  var schoolId = 'school_001';
  var purchases = JSON.parse(localStorage.getItem('purchases_' + schoolId) || '[]');
  var total = 0;
  purchases.forEach(function(p) { total += (p.points || 0) - (p.consumed || 0); });
  if (total === 0 && purchases.length === 0) {
    total = 100;
    localStorage.setItem('purchases_' + schoolId, JSON.stringify([{ points: 100, consumed: 0 }]));
  }
  var el = document.getElementById('header-points');
  if (el) el.textContent = total.toLocaleString();
}

// 绑定测试按钮点击事件
function bindTestButton() {
  var testBtn = document.getElementById('test-points-minus-btn');
  if (testBtn) {
    testBtn.addEventListener('click', function() {
      var pointsEl = document.getElementById('header-points');
      if (pointsEl) {
        var currentVal = parseInt(pointsEl.textContent.replace(/,/g, '')) || 0;
        if (currentVal > 0) {
          var deductPoints = Math.floor(Math.random() * 3) + 1;
          triggerPointsDeduct(deductPoints);
        }
      }
    });
  }
}

// 导出全局函数供页面使用
window.Navbar = Navbar;

// 全局函数：打开个人中心（供 HTML onclick 调用）
function openUserProfile() {
  if (typeof showUserProfileModal === 'function') {
    showUserProfileModal();
  } else {
    var script = document.createElement('script');
    script.src = 'components/user-profile-modal.js';
    script.onload = function() {
      if (typeof showUserProfileModal === 'function') {
        showUserProfileModal();
      }
    };
    document.head.appendChild(script);
  }
}
