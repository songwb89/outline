// points-manage.js - 点数管理系统共享数据与逻辑

// ============================================================
// Mock 数据
// ============================================================

const seedSchoolPointsRecords = [
  { id: 'spr001', schoolId: 'school001', type: 'purchase', points: 10000, balance: 10000, teacherId: null, source: '合同#HT-20260301', contractNo: 'HT-20260301', contractDate: '2026-03-01', contractAmount: 5000, remark: null, createdAt: '2026-03-01 09:00:00' },
  { id: 'spr002', schoolId: 'school001', type: 'gift', points: 2000, balance: 12000, teacherId: null, source: '促销活动赠送', contractNo: null, contractDate: null, contractAmount: null, remark: '新用户首月赠送', createdAt: '2026-03-02 10:30:00' },
  { id: 'spr003', schoolId: 'school001', type: 'consume', points: -15, balance: 11985, teacherId: 't001', source: '生成绘本', resourceName: '丑小鸭的故事', contractNo: null, contractDate: null, contractAmount: null, remark: null, createdAt: '2026-03-03 14:20:00' },
  { id: 'spr004', schoolId: 'school001', type: 'consume', points: -20, balance: 11965, teacherId: 't002', source: '生成课件', resourceName: 'Unit 3 课件', contractNo: null, contractDate: null, contractAmount: null, remark: null, createdAt: '2026-03-04 08:15:00' },
  { id: 'spr005', schoolId: 'school001', type: 'consume', points: -10, balance: 11955, teacherId: 't003', source: '生成数字人', resourceName: '数学老师数字人', contractNo: null, contractDate: null, contractAmount: null, remark: null, createdAt: '2026-03-05 16:40:00' },
  { id: 'spr006', schoolId: 'school001', type: 'consume', points: -30, balance: 11925, teacherId: 't001', source: '生成活动', resourceName: '消防安全演练', contractNo: null, contractDate: null, contractAmount: null, remark: null, createdAt: '2026-03-06 11:05:00' },
  { id: 'spr007', schoolId: 'school001', type: 'deduct', points: -500, balance: 11425, teacherId: null, source: '账户调整', contractNo: null, contractDate: null, contractAmount: null, remark: '重复充值退款', createdAt: '2026-03-10 09:00:00' },
  { id: 'spr008', schoolId: 'school001', type: 'consume', points: -25, balance: 11400, teacherId: 't004', source: '生成绘本', resourceName: '小红帽的故事', contractNo: null, contractDate: null, contractAmount: null, remark: null, createdAt: '2026-03-12 15:30:00' },
  { id: 'spr009', schoolId: 'school001', type: 'consume', points: -15, balance: 11385, teacherId: 't002', source: '生成课件', resourceName: '拼音教学课件', contractNo: null, contractDate: null, contractAmount: null, remark: null, createdAt: '2026-03-15 10:20:00' },
  { id: 'spr010', schoolId: 'school001', type: 'consume', points: -20, balance: 11365, teacherId: 't005', source: '生成数字人', resourceName: '英语老师数字人', contractNo: null, contractDate: null, contractAmount: null, remark: null, createdAt: '2026-03-18 09:45:00' },
  { id: 'spr011', schoolId: 'school002', type: 'purchase', points: 5000, balance: 5000, teacherId: null, source: '合同#HT-20260305', contractNo: 'HT-20260305', contractDate: '2026-03-05', contractAmount: 2500, remark: null, createdAt: '2026-03-05 11:00:00' },
  { id: 'spr012', schoolId: 'school002', type: 'consume', points: -100, balance: 4900, teacherId: 't101', source: '生成活动', resourceName: '春季运动会', contractNo: null, contractDate: null, contractAmount: null, remark: null, createdAt: '2026-03-08 14:00:00' },
  { id: 'spr013', schoolId: 'school003', type: 'gift', points: 3000, balance: 3000, teacherId: null, source: '促销活动赠送', contractNo: null, contractDate: null, contractAmount: null, remark: '试用活动', createdAt: '2026-03-01 08:00:00' },
];

const seedTeacherPoints = [
  { teacherId: 't001', teacherName: '张老师', account: '30000022', consumed: 45, maxPoints: 1000, phone: '13800138000', subjects: [{ name: '语文', isMain: true }, { name: '英语', isMain: false }], classes: [{ name: '星光六班(六年级)', isHead: true }], lastLogin: '2026-02-10 11:01:02' },
  { teacherId: 't002', teacherName: '李老师', account: '30000023', consumed: 35, maxPoints: 800, phone: '', subjects: [{ name: '数学', isMain: true }, { name: '科学', isMain: false }], classes: [], lastLogin: '' },
  { teacherId: 't003', teacherName: '王老师', account: '30000024', consumed: 10, maxPoints: 500, phone: '15912345678', subjects: [{ name: '语文', isMain: true }], classes: [{ name: '一年级(1)班', isHead: true }], lastLogin: '2026-03-01 09:30:15' },
  { teacherId: 't004', teacherName: '赵老师', account: '30000025', consumed: 25, maxPoints: null, phone: '18600001111', subjects: [{ name: '英语', isMain: true }], classes: [{ name: '三年级(2)班', isHead: false }, { name: '四年级(1)班', isHead: false }], lastLogin: '2026-02-28 16:45:00' },
  { teacherId: 't005', teacherName: '陈老师', account: '30000026', consumed: 20, maxPoints: 500, phone: '', subjects: [{ name: '体育', isMain: true }, { name: '音乐', isMain: false }], classes: [{ name: '初二(3)班', isHead: false }], lastLogin: '' },
  { teacherId: 't006', teacherName: '刘老师', account: '30000027', consumed: 0, maxPoints: 1000, phone: '13788889999', subjects: [{ name: '美术', isMain: true }], classes: [], lastLogin: '2026-03-05 08:12:33' },
  { teacherId: 't007', teacherName: '周老师', account: '30000028', consumed: 500, maxPoints: 500, phone: '13611112222', subjects: [{ name: '道德与法治', isMain: true }], classes: [{ name: '六年级(2)班', isHead: true }], lastLogin: '2026-03-08 19:00:01' },
  { teacherId: 't008', teacherName: '孙老师', account: '30000029', consumed: 15, maxPoints: 2000, phone: '13344445555', subjects: [{ name: '化学', isMain: true }, { name: '生物', isMain: false }], classes: [{ name: '初三(1)班', isHead: false }], lastLogin: '2026-03-10 07:55:44' },
  { teacherId: 't009', teacherName: '钱老师', account: '30000030', consumed: 8, maxPoints: null, phone: '', subjects: [{ name: '历史', isMain: true }, { name: '地理', isMain: false }], classes: [{ name: '初一(4)班', isHead: false }], lastLogin: '' },
  { teacherId: 't010', teacherName: '吴老师', account: '30000031', consumed: 0, maxPoints: 300, phone: '13122223333', subjects: [{ name: '数学', isMain: true }], classes: [], lastLogin: '2026-01-20 14:00:00' },
];

const seedTeacherPointRecords = [
  { id: 'tpr001', teacherId: 't001', type: 'ai_consume', points: -15, source: '生成绘本', resourceName: '丑小鸭的故事', relatedId: 'prep001', createdAt: '2026-03-03 14:20:00' },
  { id: 'tpr002', teacherId: 't001', type: 'ai_consume', points: -30, source: '生成课件', resourceName: 'Unit 3 课件', relatedId: 'prep002', createdAt: '2026-03-06 11:05:00' },
  { id: 'tpr003', teacherId: 't002', type: 'ai_consume', points: -20, source: '生成数字人', resourceName: '数学老师数字人', relatedId: 'exam001', createdAt: '2026-03-04 08:15:00' },
  { id: 'tpr004', teacherId: 't002', type: 'ai_consume', points: -15, source: '生成活动', resourceName: '春季运动会', relatedId: 'prep003', createdAt: '2026-03-15 10:20:00' },
  { id: 'tpr005', teacherId: 't003', type: 'ai_consume', points: -10, source: '生成绘本', resourceName: '小红帽的故事', relatedId: 'plan001', createdAt: '2026-03-05 16:40:00' },
  { id: 'tpr006', teacherId: 't004', type: 'ai_consume', points: -25, source: '生成课件', resourceName: '拼音教学课件', relatedId: 'analysis001', createdAt: '2026-03-12 15:30:00' },
  { id: 'tpr007', teacherId: 't005', type: 'ai_consume', points: -20, source: '生成数字人', resourceName: '英语老师数字人', relatedId: 'exam002', createdAt: '2026-03-18 09:45:00' },
  { id: 'tpr008', teacherId: 't007', type: 'ai_consume', points: -50, source: '生成活动', resourceName: '消防安全演练', relatedId: 'prep004', createdAt: '2026-03-01 09:00:00' },
  { id: 'tpr009', teacherId: 't007', type: 'ai_consume', points: -50, source: '生成绘本', resourceName: '三只小猪', relatedId: 'exam003', createdAt: '2026-03-02 10:00:00' },
  { id: 'tpr010', teacherId: 't007', type: 'ai_consume', points: -100, source: '生成课件', resourceName: '古诗讲解课件', relatedId: 'analysis002', createdAt: '2026-03-03 11:00:00' },
  { id: 'tpr011', teacherId: 't007', type: 'ai_consume', points: -100, source: '生成数字人', resourceName: '语文老师数字人', relatedId: 'prep005', createdAt: '2026-03-04 12:00:00' },
  { id: 'tpr012', teacherId: 't007', type: 'ai_consume', points: -100, source: '生成活动', resourceName: '六一儿童节活动', relatedId: 'plan002', createdAt: '2026-03-05 13:00:00' },
  { id: 'tpr013', teacherId: 't007', type: 'ai_consume', points: -100, source: '生成绘本', resourceName: '卖火柴的小女孩', relatedId: 'exam004', createdAt: '2026-03-06 14:00:00' },
  { id: 'tpr014', teacherId: 't008', type: 'ai_consume', points: -15, source: '生成课件', resourceName: '面积计算课件', relatedId: 'prep006', createdAt: '2026-03-10 08:00:00' },
  { id: 'tpr015', teacherId: 't009', type: 'ai_consume', points: -8, source: '生成绘本', resourceName: '狼来了的故事', relatedId: 'exam005', createdAt: '2026-03-12 09:30:00' },
];

const seedSchools = [
  { schoolId: 'school001', schoolCode: 'kobe', schoolName: '星光小学', purchasePoints: 10000, giftPoints: 2000, consumed: 635, balance: 11365 },
  { schoolId: 'school002', schoolCode: 'Sophia', schoolName: '智慧中学', purchasePoints: 5000, giftPoints: 0, consumed: 100, balance: 4900 },
  { schoolId: 'school003', schoolCode: 'east_hs', schoolName: '东区实验学校', purchasePoints: 0, giftPoints: 3000, consumed: 0, balance: 3000 },
  { schoolId: 'school004', schoolCode: 'west_ms', schoolName: '西区外国语学校', purchasePoints: 20000, giftPoints: 5000, consumed: 8500, balance: 16500 },
  { schoolId: 'school005', schoolCode: 'north_01', schoolName: '北区第一小学', purchasePoints: 8000, giftPoints: 1000, consumed: 300, balance: 8700 },
  { schoolId: 'school006', schoolCode: 'demo_school', schoolName: '演示学校', purchasePoints: 100000, giftPoints: 0, consumed: 45000, balance: 55000 },
];

// ============================================================
// 存储
// ============================================================

function getSchoolPointsRecords(schoolId) {
  const key = 'schoolPointsRecords_' + schoolId;
  let data = JSON.parse(localStorage.getItem(key));
  if (!data) {
    const schools = getSchools();
    const school = schools.find(s => s.schoolId === schoolId);
    data = [];
    if (school) {
      const sources = ['生成绘本', '生成课件', '生成数字人', '生成活动'];
      const resourceNames = {
        '生成绘本': ['丑小鸭的故事', '小红帽的故事', '三只小猪', '卖火柴的小女孩', '狼来了的故事'],
        '生成课件': ['Unit 3 课件', '拼音教学课件', '古诗讲解课件', '面积计算课件'],
        '生成数字人': ['数学老师数字人', '英语老师数字人', '语文老师数字人'],
        '生成活动': ['消防安全演练', '春季运动会', '六一儿童节活动']
      };
      const teacherNames = ['张老师', '李老师', '王老师', '赵老师', '陈老师', '刘老师', '周老师'];
      const now = Date.now();
      const base = new Date('2026-03-01').getTime();
      let recordId = 1;

      const addRecord = (type, pts, source, teacherName, teacherId, resourceName) => {
        let defaultRemark = null;
        if (type === 'gift') defaultRemark = '新用户首月赠送';
        else if (type === 'deduct') defaultRemark = '账户调整';
        data.push({
          id: 'spr_' + schoolId + '_' + (recordId++),
          schoolId,
          type,
          points: pts,
          teacherId: teacherId !== undefined ? teacherId : null,
          source: source || (type === 'purchase' ? '合同#HT-' + randDate() : type === 'gift' ? '促销活动赠送' : '账户调整'),
          resourceName: resourceName || null,
          contractNo: type === 'purchase' ? 'HT-' + randDate() : null,
          contractDate: type === 'purchase' ? randDate() : null,
          contractAmount: type === 'purchase' ? Math.floor(Math.abs(pts) * (0.4 + Math.random() * 0.3)) : null,
          remark: defaultRemark,
          createdAt: new Date(base + Math.random() * (now - base)).toISOString().replace('T', ' ').slice(0, 19)
        });
      };

      if (school.purchasePoints > 0) addRecord('purchase', school.purchasePoints);
      if (school.giftPoints > 0) addRecord('gift', school.giftPoints);
      if (school.consumed > 0) {
        const count = Math.min(Math.ceil(school.consumed / 100), 15);
        const baseConsume = school.consumed / count;
        for (let i = 0; i < count; i++) {
          const pts = -Math.round(baseConsume * (0.7 + Math.random() * 0.6));
          const tIdx = Math.floor(Math.random() * teacherNames.length);
          const teacherId = 't' + String(tIdx + 1).padStart(3, '0');
          const source = sources[Math.floor(Math.random() * sources.length)];
          const resName = resourceNames[source][Math.floor(Math.random() * resourceNames[source].length)];
          addRecord('consume', pts, source, teacherNames[tIdx], teacherId, resName);
        }
      }
      if (school.consumed > 300) addRecord('deduct', -Math.round(school.consumed * 0.05));
      data.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      for (let i = 0; i < data.length; i++) {
        const prev = i === 0 ? (school.purchasePoints + school.giftPoints) : data[i - 1].balance;
        data[i].balance = Math.max(0, prev + data[i].points);
      }
    }
    localStorage.setItem(key, JSON.stringify(data));
  }
  return data;
}

function randDate() {
  const y = 2026, m = String(Math.floor(Math.random() * 3) + 1).padStart(2, '0'), d = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  return y + '-' + m + '-' + d;
}

function getTeacherPoints() {
  let data = JSON.parse(localStorage.getItem('teacherPoints'));
  if (!data) {
    data = [...seedTeacherPoints];
    localStorage.setItem('teacherPoints', JSON.stringify(data));
  }
  return data;
}

function getTeacherPointRecords(teacherId) {
  const key = 'teacherPointRecords_' + teacherId;
  let data = JSON.parse(localStorage.getItem(key));
  if (!data) {
    data = seedTeacherPointRecords.filter(r => r.teacherId === teacherId);
    localStorage.setItem(key, JSON.stringify(data));
  }
  return data;
}

function getSchools() {
  let data = JSON.parse(localStorage.getItem('schools'));
  if (!data || data.length === 0) {
    data = [...seedSchools];
    localStorage.setItem('schools', JSON.stringify(data));
  }
  return data;
}

function getSchoolPointsBySchoolId(schoolId) {
  const schools = getSchools();
  return schools.find(s => s.schoolId === schoolId) || null;
}

// ============================================================
// 点数统计计算
// ============================================================

function calcSchoolStats(schoolId) {
  const records = getSchoolPointsRecords(schoolId);
  const school = getSchoolPointsBySchoolId(schoolId);
  if (!school) return { purchasePoints: 0, giftPoints: 0, consumed: 0, balance: 0 };
  return {
    purchasePoints: school.purchasePoints,
    giftPoints: school.giftPoints,
    consumed: school.consumed,
    balance: school.balance
  };
}

function calcTeacherStats(teacherId) {
  const teachers = getTeacherPoints();
  const t = teachers.find(x => x.teacherId === teacherId);
  if (!t) return { consumed: 0, maxPoints: null, remaining: null };
  const remaining = t.maxPoints === null ? null : Math.max(0, t.maxPoints - t.consumed);
  return { consumed: t.consumed, maxPoints: t.maxPoints, remaining };
}

// ============================================================
// Toast 提示（全局唯一实例，避免多个 toast 叠加）
// ============================================================

let pmToastTimer = null;

function pmToast(message, type) {
  let toast = document.getElementById('pm-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'pm-toast';
    toast.className = 'fixed top-16 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl text-white text-sm font-medium shadow-2xl flex items-center gap-2 transition-all duration-300';
    document.body.appendChild(toast);
  }
  toast.className = 'fixed top-16 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl text-white text-sm font-medium shadow-2xl flex items-center gap-2 transition-all duration-300 ' + (type === 'error' ? 'bg-red-500' : type === 'info' ? 'bg-blue-500' : 'bg-emerald-500');
  toast.innerHTML = '<span>' + message + '</span>';
  toast.style.opacity = '0';
  toast.style.transform = 'translateX(-50%) translateY(-8px)';
  setTimeout(() => { toast.style.opacity = '1'; toast.style.transform = 'translateX(-50%) translateY(0)'; }, 10);
  if (pmToastTimer) clearTimeout(pmToastTimer);
  pmToastTimer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(-8px)';
    setTimeout(() => toast.remove(), 300);
    pmToastTimer = null;
  }, 2500);
}

// ============================================================
// 通用弹窗管理
// ============================================================

function pmShowModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('hidden');
  requestAnimationFrame(() => {
    modal.querySelector('.pm-modal-content') && (modal.querySelector('.pm-modal-content').style.transform = 'scale(1)');
  });
}

function pmHideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.querySelector('.pm-modal-content') && (modal.querySelector('.pm-modal-content').style.transform = 'scale(0.95)');
  setTimeout(() => modal.classList.add('hidden'), 200);
}

// 点击遮罩关闭
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('pm-modal-overlay')) {
    const modal = e.target.closest('.pm-modal');
    if (modal) pmHideModal(modal.id);
  }
});

// ============================================================
// 通用分页渲染
// ============================================================

function pmRenderPagination(containerId, currentPage, totalPages, totalCount, onPageChange) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const prevBtn = document.getElementById(containerId + '-prev');
  const nextBtn = document.getElementById(containerId + '-next');
  const pageNums = document.getElementById(containerId + '-pages');
  const countEl = document.getElementById(containerId + '-count');
  if (countEl) countEl.textContent = totalCount;
  if (prevBtn) prevBtn.disabled = currentPage <= 1;
  if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
  if (pageNums) {
    pageNums.innerHTML = '';
    const maxBtns = 5;
    let start = Math.max(1, currentPage - Math.floor(maxBtns / 2));
    let end = Math.min(totalPages, start + maxBtns - 1);
    start = Math.max(1, end - maxBtns + 1);
    for (let i = start; i <= end; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = i;
      btn.className = i === currentPage
        ? 'min-w-[34px] px-2 py-1.5 rounded text-sm font-semibold bg-blue-600 text-white'
        : 'min-w-[34px] px-2 py-1.5 rounded text-sm font-medium text-gray-700 hover:bg-gray-100';
      btn.onclick = () => onPageChange(i);
      pageNums.appendChild(btn);
    }
  }
}

// ============================================================
// 类型标签映射
// ============================================================

function pmRecordTypeLabel(type) {
  const map = {
    'purchase': { label: '购买', cls: 'bg-blue-100 text-blue-700' },
    'gift': { label: '赠送', cls: 'bg-purple-100 text-purple-700' },
    'consume': { label: '消费', cls: 'bg-orange-100 text-orange-700' },
    'deduct': { label: '扣减', cls: 'bg-red-100 text-red-700' },
    'ai_consume': { label: 'AI消耗', cls: 'bg-orange-100 text-orange-700' },
    'manual_adjust': { label: '手动调整', cls: 'bg-gray-100 text-gray-700' },
    'initial': { label: '初始分配', cls: 'bg-green-100 text-green-700' }
  };
  return map[type] || { label: type, cls: 'bg-gray-100 text-gray-700' };
}

// ============================================================
// 消耗状态
// ============================================================

function pmConsumeStatus(teacher) {
  if (teacher.maxPoints === null) return { label: '无限制', cls: 'bg-gray-100 text-gray-600' };
  if (teacher.consumed >= teacher.maxPoints) return { label: '已达上限', cls: 'bg-red-100 text-red-700' };
  const pct = teacher.consumed / teacher.maxPoints;
  if (pct >= 0.8) return { label: '即将达限', cls: 'bg-orange-100 text-orange-700' };
  return { label: '正常', cls: 'bg-green-100 text-green-700' };
}

// ============================================================
// 初始化图标
// ============================================================

function pmInitIcons() {
  if (window.lucide && typeof lucide.createIcons === 'function') lucide.createIcons();
}
