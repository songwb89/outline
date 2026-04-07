const MENU_CONFIG = [
  {
    id: 'school',
    icon: 'users',
    label: '学校管理',
    children: [
      { href: 'admin-school.html', label: '学校管理' },
      { href: 'admin-points.html', label: '点数管理' }
    ]
  },
  {
    id: 'purchase',
    icon: 'shopping-cart',
    label: '采购管理',
    children: [
      { href: 'admin-purchase.html', label: '开通套餐' },
      { href: 'admin-trial.html', label: '开通试用' }
    ]
  },
  {
    id: 'product',
    icon: 'package',
    label: '产品管理',
    children: [
      { href: 'admin-package.html', label: '套餐管理' },
      { href: 'admin-price-config.html', label: '消耗规则' }
    ]
  },
  {
    id: 'data',
    icon: 'database',
    label: '业务数据',
    children: [
      { href: 'admin-courseware.html', label: '文件管理' }
    ]
  }
];

function renderSidebar(currentPage) {
  const container = document.getElementById('sidebar-container');
  if (!container) return;

  let html = '';
  const pathname = currentPage || window.location.pathname.split('/').pop() || '';

  MENU_CONFIG.forEach(group => {
    const isActiveGroup = group.children.some(child => child.href === pathname);
    const isExpanded = isActiveGroup;

    html += `
      <div class="admin-nav-group px-4 mb-1">
        <button type="button" data-group-id="${group.id}" class="admin-nav-group-btn w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg">
          <i data-lucide="${group.icon}" class="w-5 h-5 text-gray-400"></i>
          <span>${group.label}</span>
          <i data-lucide="chevron-right" class="w-4 h-4 text-gray-400 ml-auto group-arrow ${isExpanded ? 'rotate-90' : ''}"></i>
        </button>
        <div id="nav-${group.id}-children" class="ml-4 mt-1 space-y-0.5 ${isExpanded ? '' : 'hidden'}">
    `;

    group.children.forEach(child => {
      const isActive = child.href === pathname;
      html += `
        <a href="${child.href}" class="admin-nav-subitem ${isActive ? 'active' : ''} w-full text-left flex items-center gap-2 pl-4 pr-3 py-2 text-sm font-medium rounded-lg">
          <span>${child.label}</span>
        </a>
      `;
    });

    html += `
        </div>
      </div>
    `;
  });

  container.outerHTML = `
    <aside class="w-64 bg-white border-r border-gray-200 flex flex-col">
      <nav class="flex-1 overflow-y-auto py-4" id="sidebar-nav">${html}</nav>
    </aside>
  `;

  if (window.lucide) lucide.createIcons();

  // 绑定展开/收起事件
  document.querySelectorAll('.admin-nav-group-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const groupId = this.getAttribute('data-group-id');
      const children = document.getElementById(`nav-${groupId}-children`);
      if (children) children.classList.toggle('hidden');
      const arrow = this.querySelector('.group-arrow');
      if (arrow) arrow.classList.toggle('rotate-90');
      if (window.lucide) lucide.createIcons();
    });
  });
}
