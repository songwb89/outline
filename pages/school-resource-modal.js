/**
 * 校本资源全屏组件
 * 功能：展示校本资源库，支持分类筛选，点击卡片预览，点击添加/采纳按钮加入备课区
 */

(function() {
  'use strict';

  // 资源类型标签配置
  const RESOURCE_TABS = [
    { id: 'all', label: '全部' },
    { id: 'lesson-plan', label: '教案' },
    { id: 'courseware', label: '课件' },
    { id: 'study-plan', label: '学案' },
    { id: 'activity', label: '活动' },
    { id: 'lottery', label: '抽奖' },
    { id: 'quiz', label: '随堂测' },
    { id: 'dictation', label: '听写' },
    { id: 'word-eval', label: '单词评测' },
    { id: 'dialogue-eval', label: '对话评测' },
    { id: 'scene-dialogue', label: '场景对话' },
    { id: 'agent', label: '智能体' }
  ];

  // 模拟资源数据
  const RESOURCE_DATA = {
    'lesson-plan': [
      { id: 'lp1', title: '《春》教学教案', type: 'lesson-plan', author: '张老师', date: '1月15日', icon: 'file-text', color: 'blue', bgColor: 'bg-blue-100', iconColor: 'text-blue-600', borderColor: 'border-blue-300' },
      { id: 'lp2', title: '《济南的冬天》教案', type: 'lesson-plan', author: '李老师', date: '1月12日', icon: 'file-text', color: 'blue', bgColor: 'bg-blue-100', iconColor: 'text-blue-600', borderColor: 'border-blue-300' },
      { id: 'lp3', title: '《背影》教学设计', type: 'lesson-plan', author: '王老师', date: '1月10日', icon: 'file-text', color: 'blue', bgColor: 'bg-blue-100', iconColor: 'text-blue-600', borderColor: 'border-blue-300' }
    ],
    'courseware': [
      { id: 'cw1', title: '《春》PPT课件', type: 'courseware', author: '赵老师', date: '1月14日', icon: 'presentation', color: 'green', bgColor: 'bg-green-100', iconColor: 'text-green-600', borderColor: 'border-green-300' },
      { id: 'cw2', title: '古诗词鉴赏课件', type: 'courseware', author: '钱老师', date: '1月11日', icon: 'presentation', color: 'green', bgColor: 'bg-green-100', iconColor: 'text-green-600', borderColor: 'border-green-300' },
      { id: 'cw3', title: '《荷塘月色》演示文稿', type: 'courseware', author: '孙老师', date: '1月8日', icon: 'presentation', color: 'green', bgColor: 'bg-green-100', iconColor: 'text-green-600', borderColor: 'border-green-300' }
    ],
    'study-plan': [
      { id: 'sp1', title: '《春》导学案', type: 'study-plan', author: '周老师', date: '1月13日', icon: 'book-open', color: 'cyan', bgColor: 'bg-cyan-100', iconColor: 'text-cyan-600', borderColor: 'border-cyan-300' },
      { id: 'sp2', title: '现代文阅读学案', type: 'study-plan', author: '吴老师', date: '1月10日', icon: 'book-open', color: 'cyan', bgColor: 'bg-cyan-100', iconColor: 'text-cyan-600', borderColor: 'border-cyan-300' }
    ],
    'activity': [
      { id: 'ac1', title: 'AI填字比赛活动', type: 'activity', author: '郑老师', date: '1月12日', icon: 'users', color: 'orange', bgColor: 'bg-orange-100', iconColor: 'text-orange-600', borderColor: 'border-orange-300' },
      { id: 'ac2', title: '小组协作探究', type: 'activity', author: '冯老师', date: '1月9日', icon: 'users', color: 'orange', bgColor: 'bg-orange-100', iconColor: 'text-orange-600', borderColor: 'border-orange-300' }
    ],
    'lottery': [
      { id: 'lt1', title: '随机抽奖活动', type: 'lottery', author: '陈老师', date: '1月15日', icon: 'gift', color: 'yellow', bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600', borderColor: 'border-yellow-300' },
      { id: 'lt2', title: '课堂随机点名', type: 'lottery', author: '褚老师', date: '1月14日', icon: 'gift', color: 'yellow', bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600', borderColor: 'border-yellow-300' }
    ],
    'quiz': [
      { id: 'qz1', title: '《春》随堂测验', type: 'quiz', author: '卫老师', date: '1月15日', icon: 'clipboard-check', color: 'purple', bgColor: 'bg-purple-100', iconColor: 'text-purple-600', borderColor: 'border-purple-300' },
      { id: 'qz2', title: '单元测试题', type: 'quiz', author: '蒋老师', date: '1月13日', icon: 'clipboard-check', color: 'purple', bgColor: 'bg-purple-100', iconColor: 'text-purple-600', borderColor: 'border-purple-300' }
    ],
    'dictation': [
      { id: 'dt1', title: '词语听写练习', type: 'dictation', author: '沈老师', date: '1月14日', icon: 'pen-tool', color: 'pink', bgColor: 'bg-pink-100', iconColor: 'text-pink-600', borderColor: 'border-pink-300' },
      { id: 'dt2', title: '古诗词默写', type: 'dictation', author: '韩老师', date: '1月11日', icon: 'pen-tool', color: 'pink', bgColor: 'bg-pink-100', iconColor: 'text-pink-600', borderColor: 'border-pink-300' }
    ],
    'word-eval': [
      { id: 'we1', title: '英语单词测试', type: 'word-eval', author: '杨老师', date: '1月14日', icon: 'spell-check', color: 'indigo', bgColor: 'bg-indigo-100', iconColor: 'text-indigo-600', borderColor: 'border-indigo-300' },
      { id: 'we2', title: '词汇量测评', type: 'word-eval', author: '朱老师', date: '1月12日', icon: 'spell-check', color: 'indigo', bgColor: 'bg-indigo-100', iconColor: 'text-indigo-600', borderColor: 'border-indigo-300' }
    ],
    'dialogue-eval': [
      { id: 'de1', title: '情景对话评测', type: 'dialogue-eval', author: '秦老师', date: '1月13日', icon: 'message-circle', color: 'teal', bgColor: 'bg-teal-100', iconColor: 'text-teal-600', borderColor: 'border-teal-300' },
      { id: 'de2', title: '口语表达能力测试', type: 'dialogue-eval', author: '尤老师', date: '1月10日', icon: 'message-circle', color: 'teal', bgColor: 'bg-teal-100', iconColor: 'text-teal-600', borderColor: 'border-teal-300' }
    ],
    'scene-dialogue': [
      { id: 'sd1', title: '购物场景对话', type: 'scene-dialogue', author: '许老师', date: '1月14日', icon: 'theater', color: 'rose', bgColor: 'bg-rose-100', iconColor: 'text-rose-600', borderColor: 'border-rose-300' },
      { id: 'sd2', title: '餐厅点餐对话', type: 'scene-dialogue', author: '何老师', date: '1月12日', icon: 'theater', color: 'rose', bgColor: 'bg-rose-100', iconColor: 'text-rose-600', borderColor: 'border-rose-300' }
    ],
    'agent': [
      { id: 'ag1', title: '苏轼', type: 'agent', author: '系统', date: '1月15日', icon: 'bot', color: 'purple', bgColor: 'bg-purple-100', iconColor: 'text-purple-600', borderColor: 'border-purple-300' },
      { id: 'ag2', title: '李清照', type: 'agent', author: '系统', date: '1月13日', icon: 'bot', color: 'purple', bgColor: 'bg-purple-100', iconColor: 'text-purple-600', borderColor: 'border-purple-300' },
      { id: 'ag3', title: '杜甫', type: 'agent', author: '系统', date: '1月11日', icon: 'bot', color: 'purple', bgColor: 'bg-purple-100', iconColor: 'text-purple-600', borderColor: 'border-purple-300' }
    ]
  };

  // 全局状态
  let currentTab = 'all';
  let modalContainer = null;
  let previewModal = null;

  // 初始化组件
  function init() {
    createModal();
    bindKeyboardEvents();
  }

  // 创建全屏模态框
  function createModal() {
    // 创建容器
    modalContainer = document.createElement('div');
    modalContainer.id = 'school-resource-modal';
    modalContainer.className = 'fixed inset-0 z-[200] hidden items-center justify-center';
    modalContainer.innerHTML = `
      <!-- 深色半透明遮罩 -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <!-- 资源库面板 -->
      <div class="relative bg-gray-50 rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
           style="width: 1500px; height: 700px;">
        ${getModalHTML()}
      </div>
    `;
    document.body.appendChild(modalContainer);

    // 创建预览模态框
    previewModal = document.createElement('div');
    previewModal.id = 'school-resource-preview-modal';
    previewModal.className = 'fixed inset-0 z-[210] hidden items-center justify-center';
    previewModal.innerHTML = `
      <!-- 深色半透明遮罩 -->
      <div class="absolute inset-0 bg-black/60"></div>
      <!-- 内容区域 -->
      <div class="relative flex items-center justify-center" style="top: 32px; bottom: 32px; left: 32px; right: 32px;">
        <div class="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-full max-h-full flex items-center justify-center">
          <button onclick="closeSchoolResourcePreview()" class="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors z-10 shadow-lg">
            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <div id="preview-content" class="flex items-center justify-center"></div>
        </div>
      </div>
    `;
    document.body.appendChild(previewModal);

    // 绑定事件
    bindModalEvents();
  }

  // 获取模态框HTML
  function getModalHTML() {
    const tabsHTML = RESOURCE_TABS.map(tab => `
      <button
        data-tab="${tab.id}"
        class="tab-btn px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap
          ${tab.id === 'all' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}"
      >
        ${tab.label}
      </button>
    `).join('');

    return `
      <!-- 顶部栏 -->
      <div class="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
        <div class="flex items-center gap-4">
          <h2 class="text-lg font-bold text-gray-800">校本资源库</h2>
        </div>
        <button onclick="closeSchoolResourceModal()" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 筛选标签 -->
      <div class="px-6 py-4 bg-white border-b border-gray-100">
        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          ${tabsHTML}
        </div>
      </div>

      <!-- 资源列表 -->
      <div class="flex-1 overflow-y-auto p-6">
        <div id="resource-grid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <!-- 动态渲染 -->
        </div>
      </div>
    `;
  }

  // 绑定模态框事件
  function bindModalEvents() {
    // Tab切换
    modalContainer.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        currentTab = this.dataset.tab;
        updateTabStyles();
        renderResourceGrid();
      });
    });

    // ESC关闭
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeSchoolResourceModal();
      }
    });

    // 点击背景关闭
    previewModal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeSchoolResourcePreview();
      }
    });
  }

  // 更新Tab样式
  function updateTabStyles() {
    modalContainer.querySelectorAll('.tab-btn').forEach(btn => {
      if (btn.dataset.tab === currentTab) {
        btn.className = 'tab-btn px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap bg-blue-600 text-white shadow-md';
      } else {
        btn.className = 'tab-btn px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap bg-white text-gray-600 hover:bg-gray-100 border border-gray-200';
      }
    });
  }

  // 渲染资源网格
  function renderResourceGrid() {
    const grid = modalContainer.querySelector('#resource-grid');
    let items = [];

    if (currentTab === 'all') {
      // 全部：合并所有类型的资源
      Object.values(RESOURCE_DATA).forEach(arr => items.push(...arr));
    } else {
      items = RESOURCE_DATA[currentTab] || [];
    }

    if (items.length === 0) {
      grid.innerHTML = '<div class="col-span-full text-center py-20 text-gray-400">暂无资源</div>';
      return;
    }

    grid.innerHTML = items.map(item => `
      <div class="group bg-white border ${item.borderColor} rounded-xl p-4 hover:shadow-lg transition-all duration-200 cursor-pointer relative overflow-visible"
           onclick="previewSchoolResource('${item.id}', '${item.type || currentTab}')">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 ${item.bgColor} rounded-lg flex items-center justify-center flex-shrink-0">
            <i data-lucide="${item.icon}" class="w-5 h-5 ${item.iconColor}"></i>
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-semibold text-gray-800 truncate group-hover:text-${item.color}-600 transition-colors">${item.title}</h4>
            <div class="flex items-center gap-2 mt-1.5">
              <span class="px-2 py-0.5 ${item.bgColor} ${item.iconColor} text-xs font-medium rounded-full">${getTypeName(item.id)}</span>
              <span class="text-xs text-gray-500">${item.author}</span>
              <span class="text-xs text-gray-300">|</span>
              <span class="text-xs text-gray-400">${item.date}</span>
            </div>
          </div>
        </div>
        <button
          onclick="event.stopPropagation(); addToPrepareArea('${item.id}', '${item.title}')"
          class="add-btn absolute bottom-3 right-3 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors opacity-0 group-hover:opacity-100"
        >
          <i data-lucide="plus" class="w-3 h-3 inline mr-1"></i>采纳
        </button>
      </div>
    `).join('');

    // 重新初始化图标
    if (window.lucide && window.lucide.createIcons) {
      lucide.createIcons();
    }
  }

  // 获取类型名称
  function getTypeName(id) {
    const typeMap = {
      'lp': '教案', 'cw': '课件', 'sp': '学案', 'ac': '活动',
      'lt': '抽奖', 'qz': '随堂测', 'dt': '听写', 'we': '单词评测',
      'de': '对话评测', 'sd': '场景对话', 'ag': '智能体'
    };
    const prefix = id.substring(0, 2);
    return typeMap[prefix] || '资源';
  }

  // 打开模态框
  window.openSchoolResourceModal = function() {
    currentTab = 'all';
    modalContainer.classList.remove('hidden');
    modalContainer.classList.add('flex');
    updateTabStyles();
    renderResourceGrid();
    // 初始化图标
    setTimeout(() => {
      if (window.lucide && window.lucide.createIcons) {
        lucide.createIcons();
      }
    }, 50);
  };

  // 关闭模态框
  window.closeSchoolResourceModal = function() {
    modalContainer.classList.add('hidden');
    modalContainer.classList.remove('flex');
    closeSchoolResourcePreview();
  };

  // 预览资源 - 调用 prepare.html 中的预览函数
  window.previewSchoolResource = function(id, type) {
    // 根据类型调用对应的预览函数
    const previewFunctions = {
      'lesson-plan': 'openLessonPlanPreview',
      'courseware': 'openCoursewarePreview',
      'study-plan': 'openStudyPlanPreview',
      'quiz': 'openQuizPreview',
      'activity': 'openActivityPreview',
      'lottery': 'openLotteryPreview',
      'dictation': 'openDictationPreview',
      'word-eval': 'openWordEvaluationPreview',
      'dialogue-eval': 'openDialoguePreview',
      'scene-dialogue': 'openSceneDialoguePreview',
      'agent': 'openAgentPreview'
    };

    const funcName = previewFunctions[type];
    if (funcName && typeof window[funcName] === 'function') {
      window[funcName](id);
    }
  };

  // 关闭预览
  window.closeSchoolResourcePreview = function() {
    previewModal.classList.add('hidden');
  };

  // 添加到备课区
  window.addToPrepareArea = function(id, title) {
    // 显示toast提示
    if (window.showToast) {
      showToast('已加入备课区', 'success');
    } else {
      // 备用方案：使用原生alert提示
      const toast = document.createElement('div');
      toast.className = 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[300] px-6 py-3 bg-emerald-600 text-white text-sm font-medium rounded-xl shadow-2xl';
      toast.textContent = '已加入备课区';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
    }
  };

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 绑定键盘事件
  function bindKeyboardEvents() {
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeSchoolResourceModal();
      }
    });
  }

})();
