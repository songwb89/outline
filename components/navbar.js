/**
 * 导航栏组件
 * 用于所有页面的统一顶部导航栏
 */

// 动态加载点数动画样式
(function loadPointsAnimationStyles() {
  if (document.getElementById('navbar-points-styles')) return;
  var style = document.createElement('style');
  style.id = 'navbar-points-styles';
  document.head.appendChild(style);
})();

class Navbar {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = {
      currentPage: options.currentPage || 'home',
      bodyClass: options.bodyClass || '',
      ...options
    };
    this.render();
  }

  // 导航项配置
  get navItems() {
    return [
      { id: 'academic', label: '教务管理', href: 'academic-class.html' },
      { id: 'overview', label: '数据总览', href: 'pages/academic-dashboard.html', external: true }
    ];
  }

  // 生成导航链接 HTML
  generateNavLinks() {
    return this.navItems.map(item => {
      const isExternal = item.external;
      const targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      const baseClass = 'px-4 py-2 text-sm rounded-lg transition-all no-underline';
      if (item.id === this.options.currentPage) {
        return `<a href="${item.href}"${targetAttr} class="${baseClass} font-medium bg-white/20 hover:bg-white/30 text-white">${item.label}</a>`;
      } else {
        return `<a href="${item.href}"${targetAttr} class="${baseClass} text-white/80 hover:bg-white/20 hover:text-white">${item.label}</a>`;
      }
    }).join('');
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

    this.container.outerHTML = `
      <header class="${headerClass}">
        <div class="flex items-center justify-between h-16 px-6">
          <!-- 左侧 Logo -->
          <div class="flex items-center gap-3 shrink-0">
            <img src="pages/img/logo.png" alt="兆涵科技" class="h-9 sm:h-10 w-auto max-h-10 object-contain object-left" />
            <div class="flex flex-col leading-tight">
              <span class="text-base sm:text-lg font-bold text-white">兆涵科技</span>
              <span class="text-xs text-white leading-none">Sigma Education</span>
            </div>
          </div>

          <!-- 中间导航 -->
          <nav class="flex items-center gap-1">
            ${this.generateNavLinks()}
          </nav>

          <!-- 右侧图标 + 用户 -->
          <div class="flex items-center gap-4">
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
            
            <!-- 用户信息 -->
            <div class="flex items-center gap-3 cursor-pointer hover:bg-white/20 p-2 rounded-lg transition-all">
              <div class="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                <i data-lucide="user" class="w-4 h-4"></i>
              </div>
              <div class="text-sm">
                <div class="font-medium">张老师</div>
              </div>
              <i data-lucide="chevron-down" class="w-4 h-4 text-white/70"></i>
            </div>
          </div>
        </div>
      </header>
    `;

    // 渲染完成后初始化 Lucide 图标
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
}

// 导出全局函数供页面使用
window.Navbar = Navbar;
