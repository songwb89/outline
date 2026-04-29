/**
 * 用户个人信息弹窗组件
 */

// 加载样式
(function loadUserProfileStyles() {
  if (document.getElementById('user-profile-styles')) return;
  var style = document.createElement('style');
  style.id = 'user-profile-styles';
  style.textContent = `
    .upm-wrap { font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif; }
    .upm-overlay {
      background: rgba(0, 0, 0, 0.4);
    }
    .upm-modal {
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
    }
    .upm-header {
      padding: 16px 20px;
      border-bottom: 1px solid #eee;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #fff;
    }
    .upm-header-title {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
    }
    .upm-header-close {
      width: 28px;
      height: 28px;
      border: none;
      background: none;
      color: #999;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s;
    }
    .upm-header-close:hover { background: #f5f5f5; color: #666; }
    .upm-header-close svg { width: 18px; height: 18px; }

    .upm-tabs {
      display: flex;
      border-bottom: 1px solid #eee;
      background: #fafafa;
    }
    .upm-tab {
      flex: 1;
      padding: 12px 16px;
      font-size: 14px;
      color: #666;
      border: none;
      background: none;
      cursor: pointer;
      position: relative;
    }
    .upm-tab.active { color: #333; font-weight: 500; }
    .upm-tab.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 20%;
      right: 20%;
      height: 2px;
      background: #333;
      border-radius: 2px 2px 0 0;
    }

    .upm-content {
      padding: 20px;
      max-height: 60vh;
      overflow-y: auto;
    }
    .upm-tab-content { display: none; }
    .upm-tab-content.active { display: block; }

    /* 个人信息 */
    .upm-profile-top {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }
    .upm-avatar-wrap {
      position: relative;
      width: 64px;
      height: 64px;
      flex-shrink: 0;
    }
    .upm-avatar {
      position: relative;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: #f0f0f0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ccc;
      transition: all 0.2s;
      overflow: visible;
    }
    .upm-avatar:hover { background: #f0f0f0; }
    .upm-avatar svg { width: 32px; height: 32px; }
    .upm-avatar.has-img { background: none; }
    .upm-avatar.has-img > svg:first-child { display: none; }
    .upm-avatar-edit {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 22px;
      height: 22px;
      background: rgba(0,0,0,0.4);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s;
      border: 2px solid #fff;
    }
    .upm-avatar:hover .upm-avatar-edit { opacity: 1; }
    .upm-avatar-edit svg { width: 12px; height: 12px; color: #fff; }

    .upm-profile-info {
      flex: 1;
      min-width: 0;
    }
    .upm-profile-name {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }
    .upm-name-edit-btn {
      width: 24px;
      height: 24px;
      border: none;
      background: none;
      color: #999;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: all 0.2s;
    }
    .upm-name-edit-btn:hover { color: #333; background: #f5f5f5; }
    .upm-name-edit-btn svg { width: 14px; height: 14px; }
    .upm-name-input {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 2px 8px;
      width: 140px;
    }
    .upm-name-input:focus { outline: none; border-color: #333; }
    .upm-profile-phone {
      font-size: 13px;
      color: #999;
    }
    .upm-profile-subjects {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
    }
    .upm-subject-tag {
      padding: 2px 10px;
      background: #e8f5e9;
      color: #2e7d32;
      border-radius: 4px;
      font-size: 12px;
    }
    .upm-change-pwd-btn {
      margin-left: 12px;
      padding: 2px 10px;
      background: none;
      color: #3366ff;
      border: none;
      font-size: 12px;
      cursor: pointer;
    }
    .upm-change-pwd-btn:hover { text-decoration: underline; }
    .upm-tags {
      display: inline-flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
    }
    .upm-tag {
      padding: 2px 8px;
      background: #f5f5f5;
      color: #333;
      border-radius: 4px;
      font-size: 12px;
    }
    .upm-tag.main {
      background: #1a1a1a;
      color: #fff;
    }

    .upm-info-row {
      display: flex;
      padding: 10px 0;
      border-bottom: 1px solid #f5f5f5;
    }
    .upm-info-row:last-child { border-bottom: none; }
    .upm-info-item { flex: 1; }
    .upm-info-item + .upm-info-item { margin-left: 24px; }
    .upm-form-group { margin-bottom: 16px; }
    .upm-form-label { font-size: 12px; color: #666; margin-bottom: 6px; }
    .upm-form-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
    }
    .upm-form-input:focus { outline: none; border-color: #3366ff; }
    .upm-info-label {
      font-size: 12px;
      color: #999;
      margin-bottom: 2px;
    }
    .upm-info-value {
      font-size: 14px;
      color: #333;
    }
    .upm-classes-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      margin-top: 4px;
    }
    .upm-classes-table th {
      text-align: left;
      padding: 6px 8px;
      background: #f5f5f5;
      color: #666;
      font-weight: 500;
      border-bottom: 1px solid #eee;
    }
    .upm-classes-table td {
      padding: 6px 8px;
      border-bottom: 1px solid #f0f0f0;
      color: #333;
    }
    .upm-classes-table tr:last-child td { border-bottom: none; }
    .upm-class-teacher-tag {
      display: inline-block;
      padding: 2px 6px;
      background: #fff3e0;
      color: #ff6b00;
      border-radius: 4px;
      font-size: 12px;
    }

    .upm-table {
      width: 100%;
      border-collapse: collapse;
    }
    .upm-table th {
      text-align: left;
      font-size: 12px;
      font-weight: 500;
      color: #999;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .upm-table td {
      font-size: 13px;
      color: #333;
      padding: 10px 0;
      border-bottom: 1px solid #f5f5f5;
    }
    .upm-table tr:last-child td { border-bottom: none; }

    /* 扣点记录 */
    .upm-stat-row {
      display: flex;
      background: #f9f9f9;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
    }
    .upm-stat {
      flex: 1;
      text-align: center;
    }
    .upm-stat + .upm-stat {
      border-left: 1px solid #e5e5e5;
    }
    .upm-stat-num {
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 2px;
    }
    .upm-stat-num.orange { color: #fa8c16; }
    .upm-stat-num.green { color: #52c41a; }
    .upm-stat-label {
      font-size: 12px;
      color: #999;
    }

    .upm-filter-row {
      margin-bottom: 12px;
    }
    .upm-filter {
      padding: 6px 12px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      font-size: 13px;
      color: #333;
      background: #fff;
    }

    .upm-flow-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #f0f0f0;
      border-radius: 6px;
      overflow: hidden;
    }
    .upm-flow-table th {
      background: #fafafa;
      font-size: 12px;
      font-weight: 500;
      color: #999;
      padding: 10px 12px;
      text-align: left;
      border-bottom: 1px solid #f0f0f0;
    }
    .upm-flow-table td {
      font-size: 13px;
      color: #333;
      padding: 10px 12px;
      border-bottom: 1px solid #f5f5f5;
    }
    .upm-flow-table tr:last-child td { border-bottom: none; }
    .upm-flow-table tr:hover td { background: #fafafa; }
    .upm-points-minus { color: #fa541c; }
    .upm-points-plus { color: #52c41a; }
    .upm-points-summary {
      text-align: center;
      padding: 12px;
      margin-bottom: 16px;
      background: #fff7e6;
      border-radius: 6px;
      font-size: 14px;
      color: #666;
    }
    .upm-points-summary span { color: #fa541c; font-weight: bold; }
    .upm-badge {
      padding: 2px 6px;
      background: #f5f5f5;
      color: #666;
      border-radius: 2px;
      font-size: 12px;
    }
    .upm-badge.recharge { background: #f6ffed; color: #52c41a; }

    .upm-pager {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid #f0f0f0;
      flex-wrap: wrap;
      gap: 8px;
    }
    .upm-pager-info { font-size: 12px; color: #999; }
    .upm-pager-btns { display: flex; gap: 4px; flex-wrap: nowrap; align-items: center; }
    .upm-pager-btn {
      min-width: 28px;
      height: 28px;
      padding: 0 6px;
      border: 1px solid #d9d9d9;
      background: #fff;
      font-size: 12px;
      color: #333;
      border-radius: 4px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
    }
    .upm-pager-btn:hover { border-color: #333; }
    .upm-pager-btn.active { background: #1a1a1a; border-color: #1a1a1a; color: #fff; }
    .upm-pager-btn:disabled { color: #d9d9d9; cursor: not-allowed; }
    .upm-pager-btn svg { width: 12px; height: 12px; }

    .upm-footer {
      padding: 12px 20px;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      background: #fafafa;
    }
    .upm-btn {
      padding: 8px 20px;
      font-size: 14px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .upm-btn-cancel {
      border: 1px solid #d9d9d9;
      background: #fff;
      color: #333;
    }
    .upm-btn-cancel:hover { border-color: #333; }
    .upm-btn-save {
      border: none;
      background: #1a1a1a;
      color: #fff;
    }
    .upm-btn-save:hover { background: #333; }

    .upm-empty {
      text-align: center;
      padding: 40px 20px;
      color: #999;
      font-size: 14px;
    }

    /* 修改密码弹窗 */
    .upm-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .upm-modal-content {
      background: #fff;
      border-radius: 12px;
      width: 100%;
      max-width: 400px;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
    .upm-modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid #eee;
    }
    .upm-modal-title {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
    }
    .upm-modal-close {
      width: 28px;
      height: 28px;
      border: none;
      background: none;
      color: #999;
      cursor: pointer;
      font-size: 24px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s;
    }
    .upm-modal-close:hover {
      background: #f5f5f5;
      color: #666;
    }
    .upm-modal-body {
      padding: 20px;
    }
    .upm-modal-footer {
      padding: 12px 20px;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      background: #fafafa;
    }
    .upm-btn-primary {
      padding: 8px 20px;
      font-size: 14px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      background: #1a1a1a;
      color: #fff;
    }
    .upm-btn-primary:hover {
      background: #333;
    }
  `;
  document.head.appendChild(style);
})();

// 变量
var upmAllRecords = [];
var upmCurPage = 1;
var upmPageSize = 6;
var upmFilterType = 'all';

// Toast 提示
var upmToastTimer = null;
function upmToast(message, type) {
  var toast = document.getElementById('upm-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'upm-toast';
    toast.className = 'fixed top-16 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl text-white text-sm font-medium shadow-2xl flex items-center gap-2 transition-all duration-300';
    document.body.appendChild(toast);
  }
  toast.className = 'fixed top-16 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl text-white text-sm font-medium shadow-2xl flex items-center gap-2 transition-all duration-300 ' + (type === 'error' ? 'bg-red-500' : type === 'info' ? 'bg-blue-500' : 'bg-emerald-500');
  toast.innerHTML = '<span>' + message + '</span>';
  toast.style.opacity = '0';
  toast.style.transform = 'translateX(-50%) translateY(-8px)';
  setTimeout(function() { toast.style.opacity = '1'; toast.style.transform = 'translateX(-50%) translateY(0)'; }, 10);
  if (upmToastTimer) clearTimeout(upmToastTimer);
  upmToastTimer = setTimeout(function() {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(-8px)';
    setTimeout(function() { toast.remove(); }, 300);
    upmToastTimer = null;
  }, 2500);
}

// 显示弹窗
window.showUserProfileModal = function() {
  var modal = document.getElementById('upm-modal');
  if (!modal) {
    document.body.insertAdjacentHTML('beforeend', getUserProfileModalHTML());
  }
  modal = document.getElementById('upm-modal');
  modal.classList.remove('hidden');
  loadUserProfileData();
  switchTab('profile');
  if (typeof lucide !== 'undefined') lucide.createIcons();
};

// 隐藏弹窗
window.hideUserProfileModal = function() {
  var modal = document.getElementById('upm-modal');
  if (modal) modal.classList.add('hidden');
};

// 切换标签
function switchTab(tab) {
  document.querySelectorAll('.upm-tab').forEach(function(t) { t.classList.remove('active'); });
  document.querySelectorAll('.upm-tab-content').forEach(function(c) { c.classList.remove('active'); });
  var activeTab = document.querySelector('.upm-tab[data-tab="' + tab + '"]');
  var activeContent = document.getElementById('upm-' + tab + '-content');
  if (activeTab) activeTab.classList.add('active');
  if (activeContent) activeContent.classList.add('active');
  if (tab === 'records') renderFlowTable();
}

// 获取弹窗HTML
function getUserProfileModalHTML() {
  return `
  <div id="upm-modal" class="hidden fixed inset-0 z-[9999] flex items-center justify-center p-4 upm-wrap">
    <div class="upm-overlay absolute inset-0" onclick="hideUserProfileModal()"></div>
    <div class="upm-modal relative z-10" style="width: 560px;">
      <div class="upm-header">
        <span class="upm-header-title">个人中心</span>
        <button class="upm-header-close" onclick="hideUserProfileModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <div class="upm-tabs">
        <button class="upm-tab active" data-tab="profile" onclick="switchTab('profile')">个人信息</button>
        <button class="upm-tab" data-tab="records" onclick="switchTab('records')">扣点记录</button>
      </div>

      <div class="upm-content">
        <!-- 个人信息 -->
        <div id="upm-profile-content" class="upm-tab-content active">
          <div class="upm-profile-top">
            <div class="upm-avatar-wrap">
              <div id="upm-avatar" class="upm-avatar has-img" onclick="document.getElementById('upm-avatar-input').click()">
                <img src="img/tx.png" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" />
                <div class="upm-avatar-edit">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </div>
              </div>
            </div>
            <input type="file" id="upm-avatar-input" accept="image/*" style="display:none" onchange="handleAvatarChange(this)" />
            <div class="upm-profile-info">
              <div class="upm-profile-name">
                <span id="upm-name-text">张老师</span>
                <input type="text" id="upm-name-input" class="upm-name-input" value="张老师" style="display:none" onblur="saveNameOnBlur()" />
                <button class="upm-name-edit-btn" onclick="toggleEditName()">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
              </div>
              <div class="upm-profile-subjects" id="upm-subjects">
                <span class="upm-subject-tag">语文</span>
                <span class="upm-subject-tag">数学</span>
              </div>
            </div>
          </div>

          <div class="upm-info-row">
            <div class="upm-info-item">
              <div class="upm-info-label">登录账号</div>
              <div class="upm-info-value" id="upm-account">30000022</div>
            </div>
            <div class="upm-info-item">
              <div class="upm-info-label">密码</div>
              <div class="upm-info-value">
                <span>******</span>
                <button class="upm-change-pwd-btn" onclick="showChangePasswordModal()">修改</button>
              </div>
            </div>
          </div>
          <div class="upm-info-row">
            <div class="upm-info-item">
              <div class="upm-info-label">手机号</div>
              <div class="upm-info-value" id="upm-phone">13812345678</div>
            </div>
            <div class="upm-info-item">
              <div class="upm-info-label">所在学校</div>
              <div class="upm-info-value" id="upm-school">第一中学</div>
            </div>
          </div>

          <div class="upm-info-row">
            <div class="upm-info-item">
              <div class="upm-info-label">任教班级</div>
              <div class="upm-info-value">
                <table class="upm-classes-table">
                  <thead>
                    <tr>
                      <th>班级</th>
                      <th>任教</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>一年级(1)班</td>
                      <td><span class="upm-class-teacher-tag">班主任</span> 语文</td>
                    </tr>
                    <tr>
                      <td>一年级(2)班</td>
                      <td>数学</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- 扣点记录 -->
        <div id="upm-records-content" class="upm-tab-content">
          <div class="upm-points-summary">
            累计消耗：<span id="upm-total-used">50</span>
          </div>

          <table class="upm-flow-table">
            <thead>
              <tr>
                <th>时间</th>
                <th>消耗</th>
                <th>来源</th>
              </tr>
            </thead>
            <tbody id="upm-flow-body"></tbody>
          </table>

          <div class="upm-pager">
            <div class="upm-pager-info">共 <span id="upm-total-count">0</span> 条</div>
            <div class="upm-pager-btns">
              <button class="upm-pager-btn" id="upm-prev" onclick="upmGoPage(upmCurPage - 1)" disabled>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <div id="upm-pages"></div>
              <button class="upm-pager-btn" id="upm-next" onclick="upmGoPage(upmCurPage + 1)" disabled>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="upm-footer">
        <button class="upm-btn upm-btn-cancel" onclick="hideUserProfileModal()">取消</button>
        <button class="upm-btn upm-btn-save" onclick="saveUserProfile()">保存</button>
      </div>
    </div>
  </div>
  `;
}

// 手机号脱敏
function maskPhone(phone) {
  if (!phone || phone.length < 7) return phone || '-';
  return phone.substring(0,3) + '****' + phone.substring(7);
}

// 加载数据
function loadUserProfileData() {
  var data = JSON.parse(localStorage.getItem('currentTeacher') || 'null') || {
    name: '张老师', phone: '13812345678', account: '30000022',
    avatar: 'img/tx.png', school: '第一中学',
    subjects: [{name:'语文',isMain:true},{name:'数学',isMain:false}],
    classes: [
      {name:'一年级(1)班',roles:['语文(主)','班主任']},
      {name:'一年级(2)班',roles:['数学']}
    ],
    totalPoints: 100, usedPoints: 50
  };

  var nameText = document.getElementById('upm-name-text');
  var nameInput = document.getElementById('upm-name-input');
  if (nameText) nameText.textContent = data.name;
  if (nameInput) nameInput.value = data.name;

  var phoneEl = document.getElementById('upm-phone');
  if (phoneEl) phoneEl.textContent = data.phone;

  var accountEl = document.getElementById('upm-account');
  if (accountEl) accountEl.textContent = data.account || '-';

  var schoolEl = document.getElementById('upm-school');
  if (schoolEl) schoolEl.textContent = data.school;

  var subjectsEl = document.getElementById('upm-subjects');
  if (subjectsEl && data.subjects) {
    subjectsEl.innerHTML = data.subjects.map(function(s) {
      return '<span class="upm-subject-tag">' + s.name + '</span>';
    }).join('');
  }

  var classesEl = document.getElementById('upm-classes');
  if (classesEl && data.classes && data.classes.length > 0) {
    var html = '<table class="upm-classes-table"><thead><tr><th>班级</th><th>任教</th></tr></thead><tbody>';
    data.classes.forEach(function(c) {
      var rolesHtml = c.roles.map(function(r) {
        if (r === '班主任') {
          return '<span class="upm-class-teacher-tag">' + r + '</span>';
        }
        return r;
      }).join('、');
      html += '<tr><td>' + c.name + '</td><td>' + rolesHtml + '</td></tr>';
    });
    html += '</tbody></table>';
    classesEl.innerHTML = html;
  } else if (classesEl) {
    classesEl.textContent = '-';
  }

  var avatarEl = document.getElementById('upm-avatar');
  if (avatarEl) {
    if (data.avatar && data.avatar.startsWith('data:')) {
      avatarEl.innerHTML = '<img src="' + data.avatar + '" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" /><div class="upm-avatar-edit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></div>';
      avatarEl.classList.add('has-img');
    }
  }

  var totalEl = document.getElementById('upm-total');
  var usedEl = document.getElementById('upm-used');
  var remainEl = document.getElementById('upm-remain');
  var total = data.totalPoints || 100;
  var used = data.usedPoints || 0;
  if (totalEl) totalEl.textContent = total;
  if (usedEl) usedEl.textContent = used;
  if (remainEl) remainEl.textContent = total - used;

  upmAllRecords = [
    {createdAt:'2026-03-06 11:05',points:-30,type:'consume',desc:'生成课件(Unit 3 课件)'},
    {createdAt:'2026-03-03 14:20',points:-15,type:'consume',desc:'生成绘本(丑小鸭的故事)'},
    {createdAt:'2026-04-29 10:30',points:-2,type:'consume',desc:'教案生成(第1课时的教案)'},
    {createdAt:'2026-04-28 15:20',points:-5,type:'consume',desc:'课件生成(Unit 5 Section A)'},
    {createdAt:'2026-04-27 14:30',points:-3,type:'consume',desc:'课件生成(Unit 5 Section A)'},
    {createdAt:'2026-04-25 11:00',points:-1,type:'consume',desc:'教案生成(青蛙写诗)'},
    {createdAt:'2026-04-24 16:00',points:-10,type:'consume',desc:'课件生成(Unit 5 Section A)'},
    {createdAt:'2026-04-15 10:00',points:-5,type:'consume',desc:'课件生成(Unit 5 Section A)'},
    {createdAt:'2026-04-10 14:20',points:-8,type:'consume',desc:'课件生成(Unit 5 Section A)'},
    {createdAt:'2026-04-08 09:30',points:-6,type:'consume',desc:'教案生成(Unit 5 Section A)'}
  ];
  upmCurPage = 1;
  upmFilterType = 'all';
}

// 编辑姓名
function toggleEditName() {
  var nameText = document.getElementById('upm-name-text');
  var nameInput = document.getElementById('upm-name-input');
  if (!nameText || !nameInput) return;

  if (nameInput.style.display === 'none') {
    nameText.style.display = 'none';
    nameInput.style.display = 'inline';
    nameInput.focus();
    nameInput.select();
  } else {
    saveNameOnBlur();
  }
}

// 离焦保存姓名
function saveNameOnBlur() {
  var nameText = document.getElementById('upm-name-text');
  var nameInput = document.getElementById('upm-name-input');
  if (!nameText || !nameInput) return;
  if (nameInput.style.display === 'none') return;

  var newName = nameInput.value.trim();
  if (newName) {
    nameText.textContent = newName;
    nameInput.value = newName;
  }
  nameText.style.display = 'inline';
  nameInput.style.display = 'none';
}

// 头像上传
function handleAvatarChange(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var avatarEl = document.getElementById('upm-avatar');
      if (avatarEl) {
        avatarEl.innerHTML = '<img src="' + e.target.result + '" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" /><div class="upm-avatar-edit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></div>';
        avatarEl.classList.add('has-img');
      }
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// 筛选
function upmChangeFilter(val) {
  upmFilterType = val;
  upmCurPage = 1;
  renderFlowTable();
}

// 渲染流水
function renderFlowTable() {
  var filtered = upmAllRecords.filter(function(r) { return r.points < 0; });

  var totalUsed = filtered.reduce(function(sum, r) { return sum + Math.abs(r.points); }, 0);
  var totalUsedEl = document.getElementById('upm-total-used');
  if (totalUsedEl) totalUsedEl.textContent = totalUsed;

  var totalPages = Math.max(1, Math.ceil(filtered.length / upmPageSize));
  var start = (upmCurPage - 1) * upmPageSize;
  var pageData = filtered.slice(start, start + upmPageSize);

  var tbody = document.getElementById('upm-flow-body');
  var countEl = document.getElementById('upm-total-count');
  if (countEl) countEl.textContent = filtered.length;
  if (!tbody) return;

  if (pageData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" class="upm-empty">暂无记录</td></tr>';
  } else {
    tbody.innerHTML = pageData.map(function(r) {
      return '<tr>' +
        '<td>' + r.createdAt + '</td>' +
        '<td class="upm-points-minus">' + Math.abs(r.points) + '</td>' +
        '<td>' + r.desc + '</td>' +
        '</tr>';
    }).join('');
  }

  var prevBtn = document.getElementById('upm-prev');
  var nextBtn = document.getElementById('upm-next');
  if (prevBtn) prevBtn.disabled = upmCurPage <= 1;
  if (nextBtn) nextBtn.disabled = upmCurPage >= totalPages;

  var pagesEl = document.getElementById('upm-pages');
  if (pagesEl) {
    pagesEl.innerHTML = '';
    var startPage = Math.max(1, Math.min(upmCurPage - 2, totalPages - 4));
    var endPage = Math.min(startPage + 4, totalPages);
    for (var i = startPage; i <= endPage; i++) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = i;
      btn.className = 'upm-pager-btn' + (i === upmCurPage ? ' active' : '');
      btn.onclick = (function(p) { return function() { upmGoPage(p); }; })(i);
      pagesEl.appendChild(btn);
    }
  }
}

// 翻页
function upmGoPage(page) {
  var filtered = upmAllRecords.filter(function(r) { return r.points < 0; });
  var totalPages = Math.max(1, Math.ceil(filtered.length / upmPageSize));
  if (page < 1 || page > totalPages) return;
  upmCurPage = page;
  renderFlowTable();
}

// 保存
function saveUserProfile() {
  var nameText = document.getElementById('upm-name-text');
  var nameInput = document.getElementById('upm-name-input');
  var name = nameText ? nameText.textContent.trim() : '';
  if (!name) { alert('请输入姓名'); return; }

  var data = JSON.parse(localStorage.getItem('currentTeacher') || '{}');
  data.name = name;
  var avatarEl = document.getElementById('upm-avatar');
  if (avatarEl) {
    var img = avatarEl.querySelector('img');
    if (img) data.avatar = img.src;
  }
  localStorage.setItem('currentTeacher', JSON.stringify(data));

  var navbarName = document.getElementById('navbar-user-name');
  if (navbarName) navbarName.textContent = name;

  hideUserProfileModal();
}

function showChangePasswordModal() {
  var html = '<div class="upm-modal-overlay" id="upm-change-pwd-overlay" onclick="if(event.target===this)hideChangePasswordModal()">' +
    '<div class="upm-modal-content">' +
      '<div class="upm-modal-header">' +
        '<div class="upm-modal-title">修改密码</div>' +
        '<button class="upm-modal-close" onclick="hideChangePasswordModal()">&times;</button>' +
      '</div>' +
      '<div class="upm-modal-body">' +
        '<div class="upm-form-group">' +
          '<input type="password" id="upm-new-pwd" class="upm-form-input" placeholder="请输入新密码" />' +
        '</div>' +
        '<div class="upm-form-group">' +
          '<input type="password" id="upm-confirm-pwd" class="upm-form-input" placeholder="请再次输入新密码" />' +
        '</div>' +
        '<div id="upm-pwd-error" style="color:#ff4444;font-size:12px;margin-top:8px;display:none;">两次密码输入不一致</div>' +
      '</div>' +
      '<div class="upm-modal-footer">' +
        '<button class="upm-btn upm-btn-cancel" onclick="hideChangePasswordModal()">取消</button>' +
        '<button class="upm-btn upm-btn-primary" onclick="submitChangePassword()">确定</button>' +
      '</div>' +
    '</div>' +
  '</div>';
  document.body.insertAdjacentHTML('beforeend', html);
}

function hideChangePasswordModal() {
  var overlay = document.getElementById('upm-change-pwd-overlay');
  if (overlay) overlay.remove();
}

function submitChangePassword() {
  var newPwd = document.getElementById('upm-new-pwd').value;
  var confirmPwd = document.getElementById('upm-confirm-pwd').value;
  var errorEl = document.getElementById('upm-pwd-error');
  if (newPwd !== confirmPwd) {
    errorEl.style.display = 'block';
    return;
  }
  errorEl.style.display = 'none';
  upmToast('密码修改成功', 'success');
  hideChangePasswordModal();
}
