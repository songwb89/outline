/**
 * 课堂分析 - 应用程序
 * 处理所有交互逻辑和图表渲染 (使用ECharts)
 */

// 全局变量
let charts = {};
let currentStrategyTab = 'thinking';
let currentInnovationTab = 'questions';

// ============================================
// 模板函数：生成课堂结构AI分析文本
// ============================================
/**
 * 根据Rt、Ch、师生时长占比生成AI分析文本
 * 课堂类型划分：
 *   讲授型：Rt >= 0.7
 *   练习型：Rt <= 0.3
 *   对话型：0.3 < Rt < 0.7 且 Ch >= 0.4
 *   混合型：0.3 < Rt < 0.7 且 Ch < 0.4
 */
function generateClassTypeAnalysis(teacherRatio, studentRatio, rt, ch) {
  // 1. 判断课堂类型
  let classType;
  if (rt >= 0.7) {
    classType = '讲授型';
  } else if (rt <= 0.3) {
    classType = '练习型';
  } else if (ch >= 0.4) {
    classType = '对话型';
  } else {
    classType = '混合型';
  }

  // 2. 师生时长对比
  const ratioDiff = Math.abs(teacherRatio - studentRatio);
  let timeRatioText;
  if (teacherRatio > studentRatio) {
    const diff = teacherRatio - studentRatio;
    timeRatioText = `教师行为时长（占比${teacherRatio}%）大于学生行为时长（占比${studentRatio}%），高出${diff}%。`;
  } else if (teacherRatio < studentRatio) {
    const diff = studentRatio - teacherRatio;
    timeRatioText = `学生行为时长（占比${studentRatio}%）大于教师行为时长（占比${teacherRatio}%），高出${diff}%。`;
  } else {
    timeRatioText = `教师行为时长（占比${teacherRatio}%）与学生行为时长（占比${studentRatio}%）相当。`;
  }

  // 3. 课堂类型特征描述
  const typeFeatures = {
    '讲授型': '课堂呈现典型讲授型特征，教师行为占主导，适合知识密集型教学内容传递。',
    '练习型': '课堂呈现练习型特征，学生自主活动时间充足，有较多思考与练习空间。',
    '对话型': '课堂呈现对话型特征，师生互动频繁，交流充分，课堂氛围活跃。',
    '混合型': '课堂呈现混合型特征，教师讲授与师生对话相结合，教学节奏张弛有度。'
  };

  // 4. 生成综合结论
  return `${timeRatioText}本节课Rt=${rt.toFixed(2)}，Ch=${ch.toFixed(2)}，属于「${classType}」。${typeFeatures[classType]}`;
}

// ============================================
// 初始化
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  // 初始化Lucide图标
  lucide.createIcons();

  // 设置导出按钮事件
  document.getElementById('exportMindMap').addEventListener('click', exportMindMapAsImage);

  // 初始化策略Tab样式
  updateStrategyTabStyles();

  // 加载各模块数据
  loadTeachingStructure();
  loadTeachingBehavior();
  loadTeachingStrategy();

  // 初始化悬浮音频播放器
  initFloatingPlayer('data/kt4ys.mp3', '课堂教学录音');

  // 延迟渲染图表（等页面渲染完成后）
  setTimeout(() => {
    initAllCharts();
    // 动画显示进度条
    animateProgressBars();
  }, 300);
}

// ============================================
// 教学策略 Tab 切换
// ============================================
function switchStrategyTab(tab) {
  currentStrategyTab = tab;

  // 隐藏所有策略内容
  document.querySelectorAll('.strategy-content').forEach(el => {
    el.classList.add('hidden');
  });

  // 显示当前内容
  const target = document.getElementById(`strategy-${tab}`);
  if (target) {
    target.classList.remove('hidden');
    target.classList.add('fade-in');
  }

  // 更新Tab样式
  updateStrategyTabStyles();

  // 延迟渲染图表
  setTimeout(() => {
    initStrategyCharts();
  }, 100);

  lucide.createIcons();
}

function updateStrategyTabStyles() {
  document.querySelectorAll('.strategy-tab').forEach(tab => {
    if (tab.dataset.tab === currentStrategyTab) {
      tab.classList.add('bg-blue-500/20', 'text-blue-400');
      tab.classList.remove('text-gray-400', 'hover:bg-gray-700');
    } else {
      tab.classList.remove('bg-blue-500/20', 'text-blue-400');
      tab.classList.add('text-gray-400', 'hover:bg-gray-700');
    }
  });
}

// ============================================
// 教学创新子Tab切换
// ============================================
function switchInnovationTab(tab) {
  currentInnovationTab = tab;

  document.querySelectorAll('.innovation-content').forEach(el => {
    el.classList.add('hidden');
  });

  const target = document.getElementById(`innovation-${tab}`);
  if (target) {
    target.classList.remove('hidden');
    target.classList.add('fade-in');
  }

  updateInnovationTabStyles();
  lucide.createIcons();
}

function updateInnovationTabStyles() {
  document.querySelectorAll('.innovation-tab').forEach(tab => {
    if (tab.dataset.tab === currentInnovationTab) {
      tab.classList.add('bg-blue-500/20', 'text-blue-400');
      tab.classList.remove('text-gray-400', 'hover:bg-gray-700');
    } else {
      tab.classList.remove('bg-blue-500/20', 'text-blue-400');
      tab.classList.add('text-gray-400', 'hover:bg-gray-700');
    }
  });
}

// ============================================
// 初始化所有图表
// ============================================
function initAllCharts() {
  initSpeedChart();
  initBehaviorBarChart();
  initStrategyCharts();
  initSTChart();
  initRtChChart();
}

// ============================================
// 模块一：教学结构
// ============================================
function loadTeachingStructure() {
  loadPhases();
  loadClassType();
  loadKnowledgeStructure();
}

function loadPhases() {
  const data = MockData.teachingStructure.phases;

  // 设置AI分析摘要：建议部分不换行，直接接在点评内容后面
  const phaseAnalysisEl = document.getElementById('phaseAnalysis');
  const phaseSuggestionEl = document.getElementById('phaseSuggestion');
  if (phaseAnalysisEl) phaseAnalysisEl.textContent = data.analysis || '';
  if (phaseSuggestionEl) {
    phaseSuggestionEl.textContent = data.suggestion || '';
    phaseSuggestionEl.classList.remove('mt-2');
  }

  // 渲染手风琴式环节列表
  const accordionContainer = document.getElementById('phaseAccordion');
  accordionContainer.innerHTML = data.items.map((item, index) => {
    const subPhases = data.subPhases[item.name] || [];
    const hasSubPhases = subPhases.length > 0;
    const phaseNum = index + 1;
    const isFirstExpanded = index === 0 && hasSubPhases;

    return `
    <div class="phase-item bg-gray-700/30 rounded-lg border border-gray-700/50 overflow-hidden">
      <!-- 主环节头部 -->
      <div class="flex items-center gap-3 p-3"
           onclick="togglePhase(this)" data-phase="${item.name}">
        <!-- 序号 -->
        <div class="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-medium flex-shrink-0">
          ${phaseNum}
        </div>
        <!-- 环节名称 (可点击播放) -->
        <div class="flex items-center gap-2 flex-1 min-w-0 cursor-pointer group rounded px-1 -mx-1"
             onclick="event.stopPropagation(); showFloatingPlayer()">
          <span class="text-sm text-gray-400 group-hover:text-blue-400 truncate transition-colors" title="${item.name}">${item.name}</span>
          <svg class="w-4 h-4 text-gray-400 group-hover:text-blue-400 flex-shrink-0 transition-colors" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
        <!-- 占比条 -->
        <div class="flex items-center gap-2 w-56 flex-shrink-0">
          <span class="text-[11px] text-gray-500 w-6 text-right">占比</span>
          <div class="flex-1 h-1.5 bg-gray-700/80 rounded-full overflow-hidden">
            <div class="h-full bg-blue-500/80 rounded-full"
                 style="width: ${item.percentage}%"></div>
          </div>
          <span class="text-xs text-gray-400 w-10 text-right">${item.percentage}%</span>
        </div>
        <!-- 用时 -->
        <div class="text-xs text-gray-400 w-14 text-right flex-shrink-0">
          ${item.duration}
        </div>
        <!-- 展开/折叠图标 -->
        <div class="w-5 h-5 flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4 text-gray-400 transition-transform duration-200 phase-chevron ${isFirstExpanded ? '' : ''}" ${isFirstExpanded ? 'style="transform: rotate(180deg)"' : ''} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </div>
      <!-- 展开内容 -->
      <div class="phase-content ${isFirstExpanded ? '' : 'hidden'} border-t border-gray-700/50">
        ${hasSubPhases ? `
          <div class="p-3 bg-gray-800/50">
            <div class="text-xs text-gray-500 mb-2 flex items-center gap-2">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
              </svg>
              子环节详情
            </div>
            <div class="space-y-2">
              ${subPhases.map((sub, subIdx) => `
                <div class="flex items-start gap-3 text-xs">
                  <div class="w-4 h-4 rounded bg-gray-700 text-gray-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    ${subIdx + 1}
                  </div>
                  <div class="flex-1">
                    <div class="text-gray-300 cursor-pointer hover:text-blue-400 transition-colors" onclick="showFloatingPlayer()">${sub.name}</div>
                    <div class="text-gray-500 mt-0.5">${sub.timeRange} · ${sub.content}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : `
          <div class="p-3 bg-gray-800/50 text-xs text-gray-500">
            时间范围：${item.startTime} - ${item.endTime}
          </div>
        `}
      </div>
    </div>
    `;
  }).join('');

  lucide.createIcons();
}

function togglePhase(headerEl) {
  const item = headerEl.closest('.phase-item');
  const content = item.querySelector('.phase-content');
  const chevron = item.querySelector('.phase-chevron');

  content.classList.toggle('hidden');
  if (chevron) {
    chevron.style.transform = content.classList.contains('hidden') ? '' : 'rotate(180deg)';
  }
}

function playPhase(startTime, endTime) {
  console.log('播放环节:', startTime, '-', endTime);
  // TODO: 实现播放功能
  alert(`播放环节: ${startTime} - ${endTime}`);
}

function playPhaseByRange(timeRange) {
  console.log('播放子环节:', timeRange);
  // TODO: 实现播放功能
  alert(`播放子环节: ${timeRange}`);
}

function loadClassType() {
  const data = MockData.teachingStructure.classType;

  // AI分析文本（由模板生成）
  document.getElementById('stAnalysisText').textContent = generateClassTypeAnalysis(
    data.teacherRatio,
    data.studentRatio,
    data.rt,
    data.ch
  );

  // 初始化S-T图表
  setTimeout(() => {
    initSTChart();
    initRtChChart();
  }, 100);
}

// ============================================
// S-T行为分析图 (累积曲线)
// ============================================
function initSTChart() {
  const chartDom = document.getElementById('stChart');
  if (!chartDom) return;

  if (charts.stChart) {
    charts.stChart.dispose();
  }

  charts.stChart = echarts.init(chartDom);

  const data = MockData.teachingStructure.classType.stAnalysis.cumulativeData;

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(31, 41, 55, 0.95)',
      borderColor: '#4b5563',
      textStyle: { color: '#e5e7eb' },
      formatter: function(params) {
        const time = params[0].axisValue;
        let result = `<div style="font-weight:bold">${time}'</div>`;
        params.forEach(p => {
          if (p.seriesName !== '参考线') {
            const val = Array.isArray(p.value) ? p.value[1] : p.value;
            result += `<div style="color:${p.color}">${p.seriesName}: ${Number(val).toFixed(1)}分钟</div>`;
          }
        });
        return result;
      }
    },
    legend: {
      show: false
    },
    grid: {
      left: '18%',
      right: '8%',
      bottom: '18%',
      top: '8%'
    },
    xAxis: {
      name: '教师行为时间',
      nameLocation: 'middle',
      nameGap: 28,
      nameTextStyle: { color: '#9ca3af', fontSize: 10 },
      type: 'value',
      min: 0,
      max: 40,
      axisLine: { lineStyle: { color: '#4b5563' } },
      axisLabel: { color: '#9ca3af', fontSize: 9 },
      splitLine: { lineStyle: { color: 'rgba(75, 85, 99, 0.2)' } }
    },
    yAxis: {
      name: '学生行为时间',
      nameLocation: 'middle',
      nameGap: 45,
      nameTextStyle: { color: '#9ca3af', fontSize: 10 },
      type: 'value',
      min: 0,
      max: 10,
      axisLine: { lineStyle: { color: '#4b5563' } },
      axisLabel: { color: '#9ca3af', fontSize: 9 },
      splitLine: { lineStyle: { color: 'rgba(75, 85, 99, 0.2)' } }
    },
    series: [
      // 主曲线：S-T累积曲线
      {
        name: 'S-T曲线',
        type: 'line',
        data: data.map(d => [d.t, d.s]),
        smooth: true,
        lineStyle: {
          color: '#3b82f6',
          width: 3
        },
        itemStyle: {
          color: '#3b82f6'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
          ])
        },
        symbol: 'none'
      },
      // 起点标记
      {
        name: '起点',
        type: 'scatter',
        data: [[0, 0]],
        symbolSize: 8,
        itemStyle: {
          color: '#3b82f6',
          shadowBlur: 5,
          shadowColor: 'rgba(59, 130, 246, 0.5)'
        },
        tooltip: { show: false }
      },
      // 终点标记
      {
        name: '终点',
        type: 'scatter',
        data: [[data[data.length - 1].t, data[data.length - 1].s]],
        symbolSize: 10,
        itemStyle: {
          color: '#3b82f6',
          shadowBlur: 8,
          shadowColor: 'rgba(59, 130, 246, 0.6)'
        },
        tooltip: {
          formatter: function() {
            const last = data[data.length - 1];
            return `<div style="font-weight:bold">终点</div>
                    <div style="color:#3b82f6">T累计: ${last.t}分钟</div>
                    <div style="color:#f59e0b">S累计: ${last.s}分钟</div>`;
          }
        }
      }
    ]
  };

  charts.stChart.setOption(option);
}

// ============================================
// Rt-Ch三角分析图 (三角形区域)
// ============================================
function initRtChChart() {
  const chartDom = document.getElementById('rtChChart');
  if (!chartDom) return;

  if (charts.rtChChart) {
    charts.rtChChart.dispose();
  }

  charts.rtChChart = echarts.init(chartDom);

  // 当前课堂数据
  const rtValue = MockData.teachingStructure.classType.rt;
  const chValue = MockData.teachingStructure.classType.ch;

  // 通过模板计算课堂类型
  const determinedType = rtValue >= 0.7 ? '讲授型' : (rtValue <= 0.3 ? '练习型' : (chValue >= 0.4 ? '对话型' : '混合型'));

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(31, 41, 55, 0.95)',
      borderColor: '#4b5563',
      textStyle: { color: '#e5e7eb' },
      formatter: function(params) {
        if (params.componentType === 'series' && params.seriesType === 'scatter') {
          return `<div style="font-weight:bold">课堂数据</div>
                  <div>Rt值: ${rtValue.toFixed(2)}</div>
                  <div>Ch值: ${chValue.toFixed(2)}</div>
                  <div style="color:#3b82f6;margin-top:4px">判定: ${determinedType}</div>`;
        }
        return '';
      }
    },
    grid: {
      left: '15%',
      right: '10%',
      bottom: '18%',
      top: '8%',
      containLabel: true
    },
    xAxis: {
      name: 'Rt',
      nameLocation: 'middle',
      nameGap: 28,
      nameTextStyle: { color: '#9ca3af', fontSize: 12, fontWeight: 'bold' },
      type: 'value',
      min: 0,
      max: 1,
      axisLine: { lineStyle: { color: '#4b5563' } },
      axisLabel: {
        color: '#9ca3af',
        fontSize: 10,
        formatter: function(v) { return v.toFixed(1); }
      },
      splitLine: { lineStyle: { color: 'rgba(75, 85, 99, 0.2)' } }
    },
    yAxis: {
      name: 'Ch',
      nameLocation: 'middle',
      nameGap: 40,
      nameTextStyle: { color: '#9ca3af', fontSize: 12, fontWeight: 'bold' },
      type: 'value',
      min: 0,
      max: 1,
      axisLine: { lineStyle: { color: '#4b5563' } },
      axisLabel: {
        color: '#9ca3af',
        fontSize: 10,
        formatter: function(v) { return v.toFixed(1); }
      },
      splitLine: { lineStyle: { color: 'rgba(75, 85, 99, 0.2)' } }
    },
    series: [
      // 练习型区域 (三角形: (0,0)-(0.3,0)-(0.3,0.6))
      {
        name: '练习型',
        type: 'custom',
        renderItem: function(params, api) {
          const points = [
            api.coord([0, 0]),
            api.coord([0.3, 0]),
            api.coord([0.3, 0.6])
          ];
          return {
            type: 'polygon',
            shape: { points: points },
            style: {
              fill: 'rgba(16, 185, 129, 0.25)',
              stroke: 'rgba(16, 185, 129, 0.6)',
              lineWidth: 1.5
            }
          };
        },
        data: [0],
        z: 1
      },
      // 混合型区域 (正方形: (0.3,0)-(0.7,0)-(0.7,0.4)-(0.3,0.4))
      {
        name: '混合型',
        type: 'custom',
        renderItem: function(params, api) {
          const points = [
            api.coord([0.3, 0]),
            api.coord([0.7, 0]),
            api.coord([0.7, 0.4]),
            api.coord([0.3, 0.4])
          ];
          return {
            type: 'polygon',
            shape: { points: points },
            style: {
              fill: 'rgba(245, 158, 11, 0.25)',
              stroke: 'rgba(245, 158, 11, 0.6)',
              lineWidth: 1.5
            }
          };
        },
        data: [0],
        z: 1
      },
      // 讲授型区域 (三角形: (0.7,0)-(1,0)-(0.7,0.6))
      {
        name: '讲授型',
        type: 'custom',
        renderItem: function(params, api) {
          const points = [
            api.coord([0.7, 0]),
            api.coord([1, 0]),
            api.coord([0.7, 0.6])
          ];
          return {
            type: 'polygon',
            shape: { points: points },
            style: {
              fill: 'rgba(59, 130, 246, 0.25)',
              stroke: 'rgba(59, 130, 246, 0.6)',
              lineWidth: 1.5
            }
          };
        },
        data: [0],
        z: 1
      },
      // 对话型区域 (五边形: (0.3,0.4)-(0.7,0.4)-(0.7,0.6)-(0.5,1)-(0.3,0.6))
      {
        name: '对话型',
        type: 'custom',
        renderItem: function(params, api) {
          const points = [
            api.coord([0.3, 0.4]),
            api.coord([0.7, 0.4]),
            api.coord([0.7, 0.6]),
            api.coord([0.5, 1]),
            api.coord([0.3, 0.6])
          ];
          return {
            type: 'polygon',
            shape: { points: points },
            style: {
              fill: 'rgba(139, 92, 246, 0.25)',
              stroke: 'rgba(139, 92, 246, 0.6)',
              lineWidth: 1.5
            }
          };
        },
        data: [0],
        z: 1
      },
      // 区域标签
      {
        name: '标签',
        type: 'scatter',
        symbolSize: 0.1,
        data: [
          { value: [0.1, 0.2], label: '练习型', labelColor: '#34d399' },
          { value: [0.5, 0.15], label: '混合型', labelColor: '#fbbf24' },
          { value: [0.85, 0.18], label: '讲授型', labelColor: '#60a5fa' },
          { value: [0.5, 0.65], label: '对话型', labelColor: '#a78bfa' }
        ],
        label: {
          show: true,
          position: 'inside',
          formatter: function(p) { return p.data.label; },
          color: function(p) { return p.data.labelColor; },
          fontSize: 12,
          fontWeight: 'bold'
        },
        tooltip: { show: false },
        z: 3
      },
      // 当前课堂数据点
      {
        name: '当前课堂',
        type: 'scatter',
        data: [[rtValue, chValue]],
        symbolSize: 20,
        itemStyle: {
          color: '#3b82f6',
          shadowBlur: 12,
          shadowColor: 'rgba(59, 130, 246, 0.7)'
        },
        emphasis: {
          scale: 1.2,
          itemStyle: {
            shadowBlur: 18
          }
        },
        z: 10
      }
    ]
  };

  charts.rtChChart.setOption(option);

  // 更新底部标签
  const rtChTypeEl = document.getElementById('rtChType');
  if (rtChTypeEl) {
    rtChTypeEl.textContent = determinedType;
  }
}

function loadKnowledgeStructure() {
  const data = MockData.teachingStructure.knowledgeStructure;

  const chartDom = document.getElementById('mindMap');
  if (!chartDom) return;

  if (charts.mindMap) {
    charts.mindMap.dispose();
  }

  charts.mindMap = echarts.init(chartDom);

  const treeData = {
    name: data.topic,
    itemStyle: { color: '#3b82f6' },
    children: [
      {
        name: '意象',
        itemStyle: { color: '#10b981' },
        children: [
          { name: '白云', itemStyle: { color: '#34d399' } },
          { name: '青枫浦', itemStyle: { color: '#34d399' } },
          {
            name: '扁舟子',
            itemStyle: { color: '#34d399' },
            children: [
              { name: '明月楼', itemStyle: { color: '#6ee7b7' } }
            ]
          }
        ]
      },
      {
        name: '情景交融',
        itemStyle: { color: '#8b5cf6' },
        children: [
          {
            name: '借景抒情',
            itemStyle: { color: '#a78bfa' },
            children: [
              { name: '思乡怀人', itemStyle: { color: '#c4b5fd' } },
              { name: '象征', itemStyle: { color: '#c4b5fd' } },
              { name: '以景抒情', itemStyle: { color: '#c4b5fd' } }
            ]
          },
          { name: '动静结合', itemStyle: { color: '#a78bfa' } },
          { name: '虚实结合', itemStyle: { color: '#a78bfa' } }
        ]
      }
    ]
  };

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      show: false
    },
    series: [{
      type: 'tree',
      data: [treeData],
      orient: 'vertical',
      top: '5%',
      bottom: '5%',
      left: '15%',
      right: '15%',
      symbol: 'roundRect',
      symbolSize: [60, 28],
      nodePadding: 80,
      layerPadding: 50,
      itemStyle: {
        borderWidth: 0,
        shadowBlur: 10,
        shadowColor: 'rgba(59, 130, 246, 0.25)'
      },
      lineStyle: {
        color: '#4b5563',
        width: 2,
        curveness: 0.5
      },
      label: {
        show: true,
        position: 'inside',
        formatter: '{b}',
        color: '#fff',
        fontSize: 12,
        fontWeight: 500
      },
      emphasis: {
        disabled: true
      },
      expandAndCollapse: false,
      initialTreeDepth: 3,
      animationDuration: 800
    }]
  };

  charts.mindMap.setOption(option);
}

function animateProgressBars() {
  document.querySelectorAll('[data-width]').forEach(bar => {
    const width = bar.dataset.width;
    bar.style.width = width + '%';
  });
}

// ============================================
// 导出思维导图为图片
// ============================================
function exportMindMapAsImage() {
  const chart = charts.mindMap;
  if (!chart) {
    alert('思维导图未加载');
    return;
  }

  const url = chart.getDataURL({
    type: 'png',
    pixelRatio: 2,
    backgroundColor: '#0f172a'
  });

  const link = document.createElement('a');
  link.download = '知识点结构.png';
  link.href = url;
  link.click();
}

// ============================================
// 模块二：教学行为
// ============================================
function loadTeachingBehavior() {
  loadHighFrequencyWords();
  loadBehaviorRatio();
}

function initSpeedChart() {
  const data = MockData.teachingBehavior.speakingSpeed;

  const analysisText = `本节课教师在授课过程中一共说了${data.totalWords}个字，共耗时${data.totalDuration}分钟，平均语速为${data.avgSpeed}字/分钟。课堂语速的范围推荐保持在150字/分钟到250字每分钟之间。`;
  document.getElementById('speedTrend').textContent = analysisText;

  // 渲染语速折线图
  const chartDom = document.getElementById('speedChart');
  if (!chartDom) return;

  if (charts.speedChart) {
    charts.speedChart.dispose();
  }

  charts.speedChart = echarts.init(chartDom);

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(31, 41, 55, 0.95)',
      borderColor: '#4b5563',
      textStyle: { color: '#e5e7eb' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.chartData.map(d => d.time + "'"),
      axisLine: { lineStyle: { color: '#4b5563' } },
      axisLabel: {
        color: '#9ca3af',
        interval: 4  // 每5分钟显示一个标签
      }
    },
    yAxis: {
      type: 'value',
      min: 50,
      max: 300,
      axisLine: { lineStyle: { color: '#4b5563' } },
      axisLabel: { color: '#9ca3af' },
      splitLine: { lineStyle: { color: 'rgba(75, 85, 99, 0.3)' } }
    },
    series: [
      {
        name: '语速',
        type: 'line',
        smooth: true,
        data: data.chartData.map(d => d.speed),
        lineStyle: { color: '#10b981', width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
            { offset: 1, color: 'rgba(16, 185, 129, 0.05)' }
          ])
        },
        itemStyle: { color: '#10b981' },
        symbol: 'none',
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: { type: 'dashed', color: '#6366f1' },
          data: [
            { yAxis: 150, label: { formatter: '下限 150', color: '#6366f1' } },
            { yAxis: 250, label: { formatter: '上限 250', color: '#6366f1' } }
          ]
        }
      }
    ]
  };

  charts.speedChart.setOption(option);
}

function loadHighFrequencyWords() {
  const data = MockData.teachingBehavior.highFrequencyWords;

  const chartDom = document.getElementById('wordCloud');
  if (!chartDom) return;

  if (charts.wordCloud) {
    charts.wordCloud.dispose();
  }

  charts.wordCloud = echarts.init(chartDom);

  const words = data.words.map(item => ({
    name: item.text,
    value: item.weight,
    text: item.text
  }));

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      show: true,
      backgroundColor: 'rgba(17, 24, 39, 0.95)',
      borderColor: 'rgba(75, 85, 99, 0.5)',
      textStyle: { color: '#e5e7eb' },
      formatter: (params) => `${params.name}<br/>出现频次：${params.value}`
    },
    series: [{
      type: 'wordCloud',
      shape: 'circle',
      left: 'center',
      top: 'center',
      width: '90%',
      height: '90%',
      sizeRange: [12, 52],
      rotationRange: [-30, 30],
      rotationStep: 15,
      gridSize: 8,
      drawOutOfBound: false,
      textStyle: {
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        color: function() {
          const colors = ['#60a5fa', '#34d399', '#f472b6', '#fbbf24', '#a78bfa', '#f87171', '#2dd4bf'];
          return colors[Math.floor(Math.random() * colors.length)];
        }
      },
      emphasis: {
        textStyle: {
          shadowBlur: 10,
          shadowColor: '#60a5fa'
        }
      },
      data: words
    }]
  };

  charts.wordCloud.setOption(option);

  // AI分析：建议部分不换行，直接接在点评内容后面
  const wordAnalysisEl = document.getElementById('wordAnalysis');
  const wordSuggestionEl = document.getElementById('wordSuggestion');
  if (wordAnalysisEl) wordAnalysisEl.textContent = data.analysis || '';
  if (wordSuggestionEl) {
    wordSuggestionEl.textContent = data.suggestion || '';
    wordSuggestionEl.classList.remove('mt-2');
  }
}

function loadBehaviorRatio() {
  const data = MockData.teachingBehavior.behaviorRatio;

  const analysisText = `老师说话${data.teacherDuration}，学生说话${data.studentDuration}，${data.conclusion}。课程开场与旧知回顾、文本深入分析环节学生参与度尚可，新课导入和课程总结环节参与度低。<span class="text-blue-400">建议老师在新课导入时可多设置互动问题激发学生思考，课程总结时让学生先自主总结。在文本深入分析环节可进一步增加小组讨论等形式，提高学生参与度，让课堂更活跃。</span>`;

  document.getElementById('behaviorConclusionText').innerHTML = analysisText;

  initBehaviorDonutChart();
}

function initBehaviorDonutChart() {
  const chartDom = document.getElementById('behaviorDonutChart');
  if (!chartDom) return;

  if (charts.behaviorDonutChart) {
    charts.behaviorDonutChart.dispose();
  }

  charts.behaviorDonutChart = echarts.init(chartDom);

  const data = MockData.teachingBehavior.behaviorRatio;

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(31, 41, 55, 0.95)',
      borderColor: '#4b5563',
      textStyle: { color: '#e5e7eb' },
      formatter: function(params) {
        const totalSeconds = Math.round(parseFloat(params.data.duration) * 60);
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return params.name + '：' + mins + "'" + secs.toString().padStart(2, '0') + "''";
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '65%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{c}%',
          color: '#e5e7eb',
          fontSize: 11,
          lineHeight: 16,
          backgroundColor: 'transparent',
          borderWidth: 0,
          padding: [0, 0, 0, 0]
        },
        labelLine: {
          show: true,
          lineStyle: {
            color: '#9ca3af',
            width: 1,
            type: 'solid'
          },
          length: 10,
          length2: 15
        },
        emphasis: {
          scale: true,
          scaleSize: 5
        },
        data: [
          { value: data.teacherRatio.toFixed(2), name: '教师', itemStyle: { color: '#3b82f6' }, duration: data.teacherDuration },
          { value: data.studentRatio.toFixed(2), name: '学生', itemStyle: { color: '#f59e0b' }, duration: data.studentDuration }
        ]
      }
    ]
  };

  charts.behaviorDonutChart.setOption(option);
}

function initBehaviorBarChart() {
  const chartDom = document.getElementById('behaviorChart');
  if (!chartDom) return;

  if (charts.behaviorChart) {
    charts.behaviorChart.dispose();
  }

  charts.behaviorChart = echarts.init(chartDom);

  const data = MockData.teachingBehavior.behaviorRatio.phaseDetails;

  // Parse duration string to seconds (e.g., "5'30\"" -> 330)
  const parseDuration = (str) => {
    const match = str.match(/(\d+)'(\d+)"|(\d+)"/);
    if (match) {
      if (match[3]) return parseInt(match[3]); // just seconds
      return parseInt(match[1]) * 60 + parseInt(match[2]); // minutes + seconds
    }
    return 0;
  };

  // Format seconds to display string (e.g., 5'30'')
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}''`;
    if (secs === 0) return `${mins}'`;
    return `${mins}'${secs}''`;
  };

  const teacherData = data.map(p => parseDuration(p.teacherDuration));
  const studentData = data.map(p => parseDuration(p.studentDuration));
  const maxDuration = Math.max(...teacherData, ...studentData);

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(31, 41, 55, 0.95)',
      borderColor: '#4b5563',
      textStyle: { color: '#e5e7eb' },
      formatter: function(params) {
        let result = `<div style="font-weight:bold;margin-bottom:8px">${params[0].axisValue}</div>`;
        params.forEach(p => {
          const total = p.data + params[params.indexOf(p) === 0 ? 1 : 0].data;
          const percent = ((p.data / total) * 100).toFixed(1);
          const color = p.seriesName === '教师' ? '#3b82f6' : '#f59e0b';
          result += `<div style="margin:4px 0">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${color};margin-right:6px"></span>
            ${p.seriesName}：${formatDuration(p.data)}（${percent}%）</div>`;
        });
        return result;
      }
    },
    legend: { show: false },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(p => p.phase.replace('课程', '').replace('与', '/')),
      axisLine: { lineStyle: { color: '#4b5563' } },
      axisLabel: { color: '#9ca3af', fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      name: '时长',
      nameTextStyle: { color: '#9ca3af', fontSize: 11 },
      axisLine: { lineStyle: { color: '#4b5563' } },
      axisLabel: {
        color: '#9ca3af',
        formatter: (val) => {
          const m = Math.floor(val / 60);
          const s = val % 60;
          return m > 0 ? `${m}'${s > 0 ? s + "''" : ''}` : `${s}''`;
        }
      },
      splitLine: { lineStyle: { color: 'rgba(75, 85, 99, 0.3)' } }
    },
    series: [
      {
        name: '教师',
        type: 'bar',
        stack: 'total',
        barWidth: '40%',
        data: teacherData,
        itemStyle: { color: '#3b82f6', borderRadius: [0, 0, 0, 0] }
      },
      {
        name: '学生',
        type: 'bar',
        stack: 'total',
        barWidth: '40%',
        data: studentData,
        itemStyle: { color: '#f59e0b', borderRadius: [4, 4, 0, 0] }
      }
    ]
  };

  charts.behaviorChart.setOption(option);
}

function loadParticipationAnalysis() {
  const data = MockData.teachingBehavior.behaviorRatio.phaseDetails;

  const container = document.getElementById('participationChart');
  container.innerHTML = data.map(phase => {
    const evalColors = {
      '高': 'bg-emerald-500',
      '尚可': 'bg-amber-500',
      '低': 'bg-red-500'
    };
    return `
      <div class="bg-gray-700/50 rounded-lg p-4">
        <div class="text-sm text-gray-300 mb-2 truncate">${phase.phase}</div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs text-gray-400">学生参与度</span>
          <span class="${evalColors[phase.evaluation]} text-xs px-2 py-0.5 rounded-full text-white">${phase.evaluation}</span>
        </div>
        <div class="space-y-1">
          <div class="flex justify-between text-xs">
            <span class="text-gray-400">教师 ${phase.teacherPercent}%</span>
          </div>
          <div class="h-2 bg-gray-600 rounded-full overflow-hidden">
            <div class="h-full bg-blue-500 rounded-full" style="width: ${phase.teacherPercent}%"></div>
          </div>
          <div class="flex justify-between text-xs">
            <span class="text-gray-400">学生 ${phase.studentPercent}%</span>
          </div>
          <div class="h-2 bg-gray-600 rounded-full overflow-hidden">
            <div class="h-full bg-amber-500 rounded-full" style="width: ${phase.studentPercent}%"></div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ============================================
// 模块三：教学策略
// ============================================
function loadTeachingStrategy() {
  loadThinkingStimulus();
  loadTeachingInnovation();
  loadTeachingDesign();
  loadContentOrganization();
}

function initStrategyCharts() {
  if (currentStrategyTab === 'thinking') {
    initFourMatChart();
    initBloomChart();
    initQuestionChainChart();
    initThinkingChart();
    initResponseDonutChart();
    initWordDistChart();
  }
}

function loadThinkingStimulus() {
  const data = MockData.teachingStrategy.thinkingStimulus;

  // 初始化环形图、4MAT雷达图和Bloom柱状图
  initOpennessDonutChart();
  initFourMatChart();
  initBloomChart();

  // 教师反馈分析
  loadTeacherFeedback(data.teacherFeedback);
}

function initFourMatChart() {
  const chartDom = document.getElementById('fourMatChart');
  if (!chartDom) return;

  if (charts.fourMatChart) {
    charts.fourMatChart.dispose();
  }

  charts.fourMatChart = echarts.init(chartDom);

  const data = MockData.teachingStrategy.thinkingStimulus.questionClassification.fourMat;
  const values = [
    data['是何--事实型'] || 0,
    data['为何--原理型'] || 0,
    data['若何--变化型'] || 0,
    data['如何--方法型'] || 0
  ];
  const maxVal = Math.max(...values, 1);

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(31, 41, 55, 0.95)',
      borderColor: '#4b5563',
      textStyle: { color: '#e5e7eb' },
      formatter: '{b}: {c} 题'
    },
    radar: {
      indicator: [
        { name: '是何\n事实型', max: maxVal },
        { name: '为何\n原理型', max: maxVal },
        { name: '若何\n变化型', max: maxVal },
        { name: '如何\n方法型', max: maxVal }
      ],
      center: ['50%', '55%'],
      radius: '65%',
      axisName: { color: '#e5e7eb', fontSize: 11 },
      splitArea: { areaStyle: { color: ['rgba(59, 130, 246, 0.05)', 'rgba(59, 130, 246, 0.1)'] } },
      axisLine: { lineStyle: { color: '#4b5563' } },
      splitLine: { lineStyle: { color: 'rgba(75, 85, 99, 0.3)' } }
    },
    series: [{
      type: 'radar',
      data: [{
        value: values,
        name: '4MAT',
        areaStyle: { color: 'rgba(59, 130, 246, 0.3)' },
        lineStyle: { color: '#3b82f6', width: 2 },
        itemStyle: { color: '#3b82f6' }
      }]
    }]
  };

  charts.fourMatChart.setOption(option);

  // 更新问题总数
  const total = values.reduce((sum, v) => sum + v, 0);
  const totalEl = document.getElementById('questionTotalCount');
  if (totalEl) totalEl.textContent = total;
}

let isEditMode = false;

function getFeedbackTag(feedback) {
  if (!feedback) {
    return '<span class="whitespace-nowrap px-2 py-1 text-xs rounded-md bg-gray-500/20 text-gray-400 border border-gray-500/30">无反馈</span>';
  }
  const lowerFeedback = feedback.toLowerCase();
  if (lowerFeedback.includes('指导') || lowerFeedback.includes('不对') || lowerFeedback.includes('再想想') || lowerFeedback.includes('角度')) {
    return '<span class="whitespace-nowrap px-2 py-1 text-xs rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">指导性</span>';
  }
  if (lowerFeedback.includes('鼓励') || lowerFeedback.includes('加油') || lowerFeedback.includes('很好') || lowerFeedback.includes('不错') || lowerFeedback.includes('棒') || lowerFeedback.includes('继续')) {
    return '<span class="whitespace-nowrap px-2 py-1 text-xs rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">鼓励性</span>';
  }
  if (lowerFeedback.includes('正确') || lowerFeedback.includes('准确') || lowerFeedback.includes('对') || lowerFeedback.includes('答案') || lowerFeedback.includes('分析')) {
    return '<span class="whitespace-nowrap px-2 py-1 text-xs rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">评价性</span>';
  }
  return '<span class="whitespace-nowrap px-2 py-1 text-xs rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">评价性</span>';
}

function showQuestionDetail() {
  const modal = document.getElementById('questionDetailModal');
  const tbody = document.getElementById('questionDetailBody');
  const data = MockData.teachingStrategy.thinkingStimulus.questionClassification.questionList;

  tbody.innerHTML = data.map((item, idx) => `
    <tr class="border-b border-gray-800 hover:bg-gray-800/30">
      <td class="px-4 py-3 text-gray-400 text-xs font-mono">${item.time}</td>
      <td class="px-4 py-3">
        ${item.studentAnswer || item.teacherFeedback ? `
        <button onclick="toggleAnswer(${idx})" class="text-blue-400 hover:text-blue-300 transition-colors">
          <svg id="expandIcon${idx}" class="w-4 h-4 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>` : '<span class="text-gray-600">-</span>'}
      </td>
      <td class="px-4 py-3 text-gray-200 text-sm">
        <div class="line-clamp-2" id="questionText${idx}">${item.question}</div>
        <div id="expandContent${idx}" class="hidden mt-3 space-y-3 pl-4 border-l-2 border-blue-500/50">
          ${item.studentAnswer ? `
          <div class="bg-gray-800/50 rounded-lg p-3">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs text-green-400 font-medium">学生应答</span>
            </div>
            <p class="text-sm text-gray-300">${item.studentAnswer}</p>
          </div>` : ''}
          ${item.teacherFeedback ? `
          <div class="bg-gray-800/50 rounded-lg p-3">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs text-yellow-400 font-medium">教师反馈</span>
            </div>
            <p class="text-sm text-gray-300">${item.teacherFeedback}</p>
          </div>` : ''}
        </div>
      </td>
      <td class="px-4 py-3">
        <span class="px-2 py-1 text-xs rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">${item.fourMat.split('--')[0]}</span>
      </td>
      <td class="px-4 py-3">
        <span class="px-2 py-1 text-xs rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">${item.bloom}</span>
      </td>
      <td class="px-4 py-3">
        ${item.studentAnswer ? `
          <span class="whitespace-nowrap px-2 py-1 text-xs rounded-md bg-green-500/20 text-green-300 border border-green-500/30">有应答</span>
        ` : `
          <span class="whitespace-nowrap px-2 py-1 text-xs rounded-md bg-gray-500/20 text-gray-400 border border-gray-500/30">无应答</span>
        `}
      </td>
      <td class="px-4 py-3">
        ${getFeedbackTag(item.teacherFeedback)}
      </td>
    </tr>
  `).join('');

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function toggleAnswer(idx) {
  const content = document.getElementById(`expandContent${idx}`);
  const icon = document.getElementById(`expandIcon${idx}`);
  const text = document.getElementById(`questionText${idx}`);

  if (content.classList.contains('hidden')) {
    content.classList.remove('hidden');
    icon.classList.add('rotate-180');
    text.classList.remove('line-clamp-2');
  } else {
    content.classList.add('hidden');
    icon.classList.remove('rotate-180');
    text.classList.add('line-clamp-2');
  }
}

function closeQuestionDetail() {
  document.getElementById('questionDetailModal').classList.add('hidden');
  document.body.style.overflow = '';
}

function toggleQuestionDetailEdit() {
  isEditMode = !isEditMode;
  alert('编辑功能开发中...');
}

function exportQuestionTable() {
  const data = MockData.teachingStrategy.thinkingStimulus.questionClassification.questionList;
  let csv = '时间,问题详情,4MAT,布鲁姆,学生应答,教师反馈\n';
  data.forEach(item => {
    csv += `"${item.time}","${item.question.replace(/"/g, '""')}","${item.fourMat}","${item.bloom}","${item.studentAnswer || ''}","${item.teacherFeedback || ''}"\n`;
  });

  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = '问答评详情.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function initBloomChart() {
  const chartDom = document.getElementById('bloomChart');
  if (!chartDom) return;

  if (charts.bloomChart) {
    charts.bloomChart.dispose();
  }

  charts.bloomChart = echarts.init(chartDom);

  const data = MockData.teachingStrategy.thinkingStimulus.questionClassification.bloom;
  const labels = Object.keys(data);
  const values = Object.values(data);
  const colors = labels.slice(0, 3).map(() => '#6366f1').concat(labels.slice(3).map(() => '#f59e0b'));

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(31, 41, 55, 0.95)',
      borderColor: '#4b5563',
      textStyle: { color: '#e5e7eb' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: labels,
      axisLine: { lineStyle: { color: '#4b5563' } },
      axisLabel: { color: '#9ca3af', fontSize: 9 }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#4b5563' } },
      axisLabel: { color: '#9ca3af' },
      splitLine: { lineStyle: { color: 'rgba(75, 85, 99, 0.3)' } }
    },
    series: [{
      type: 'bar',
      data: values.map((v, i) => ({ value: v, itemStyle: { color: colors[i] } })),
      barWidth: '50%',
      itemStyle: { borderRadius: [4, 4, 0, 0] }
    }]
  };

  charts.bloomChart.setOption(option);
}

// ============================================
// 问题开放性环形图
// ============================================
function initOpennessDonutChart() {
  const chartDom = document.getElementById('opennessDonutChart');
  if (!chartDom) return;

  if (charts.opennessDonutChart) {
    charts.opennessDonutChart.dispose();
  }

  charts.opennessDonutChart = echarts.init(chartDom);

  const openCount = 8;
  const closeCount = 30;
  const totalCount = openCount + closeCount;

  const openPercent = (openCount / totalCount * 100).toFixed(1);
  const closePercent = (closeCount / totalCount * 100).toFixed(1);

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(31, 41, 55, 0.95)',
      borderColor: '#4b5563',
      textStyle: { color: '#e5e7eb' },
      formatter: function(params) {
        return params.name + '：' + params.data.count;
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '65%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{d}%',
          color: '#e5e7eb',
          fontSize: 11,
          lineHeight: 16,
          backgroundColor: 'transparent',
          borderWidth: 0,
          padding: [0, 0, 0, 0]
        },
        labelLine: {
          show: true,
          lineStyle: {
            color: '#9ca3af',
            width: 1,
            type: 'solid'
          },
          length: 10,
          length2: 15
        },
        emphasis: {
          scale: true,
          scaleSize: 5
        },
        data: [
          {
            value: openPercent,
            name: '开放性',
            count: openCount,
            itemStyle: { color: '#10b981' }
          },
          {
            value: closePercent,
            name: '封闭性',
            count: closeCount,
            itemStyle: { color: '#6366f1' }
          }
        ]
      }
    ]
  };

  charts.opennessDonutChart.setOption(option);
}

function initQuestionChainChart() {
  const chartDom = document.getElementById('questionChainFlow');
  if (!chartDom) return;

  if (charts.questionChainChart) {
    charts.questionChainChart.dispose();
  }

  charts.questionChainChart = echarts.init(chartDom);

  // 初始化后渲染问题链（使用已有的数据）
  const data = MockData.teachingStrategy.thinkingStimulus;
  if (data && data.questionChains) {
    renderQuestionChainFlow(data.questionChains, data.theme);
  }
}

function renderQuestionChainFlow(chains, theme) {
  const container = document.getElementById('questionChainFlow');
  if (!container || !charts.questionChainChart) return;

  const chain = chains[0];
  const nodes = chain.nodes;

  // 计算错落位置（左右交替，上下大幅错落）
  const chartWidth = container.offsetWidth || 900;
  const chartHeight = 400;
  const spacing = chartWidth / (nodes.length + 1);

  // 气泡颜色配置（更具视觉冲击）
  const bubbleColors = [
    { start: 'rgba(96, 165, 250, 0.08)', end: 'rgba(59, 130, 246, 0.03)', border: 'rgba(96, 165, 250, 0.5)', glow: 'rgba(59, 130, 246, 0.1)' },
    { start: 'rgba(167, 139, 250, 0.08)', end: 'rgba(139, 92, 246, 0.03)', border: 'rgba(167, 139, 250, 0.5)', glow: 'rgba(139, 92, 246, 0.1)' },
    { start: 'rgba(110, 231, 183, 0.08)', end: 'rgba(16, 185, 129, 0.03)', border: 'rgba(110, 231, 183, 0.5)', glow: 'rgba(16, 185, 129, 0.1)' },
    { start: 'rgba(251, 191, 36, 0.08)', end: 'rgba(245, 158, 11, 0.03)', border: 'rgba(251, 191, 36, 0.5)', glow: 'rgba(245, 158, 11, 0.1)' },
    { start: 'rgba(252, 165, 165, 0.08)', end: 'rgba(239, 68, 68, 0.03)', border: 'rgba(252, 165, 165, 0.5)', glow: 'rgba(239, 68, 68, 0.1)' },
    { start: 'rgba(147, 197, 253, 0.08)', end: 'rgba(99, 102, 241, 0.03)', border: 'rgba(147, 197, 253, 0.5)', glow: 'rgba(99, 102, 241, 0.1)' },
  ];

  const echartsNodes = nodes.map((node, idx) => {
    // 上下交替偏移
    const isLeft = idx % 2 === 0;
    const yOffset = isLeft ? -15 : 15;
    const colorIdx = idx % bubbleColors.length;
    const colors = bubbleColors[colorIdx];

    return {
      name: idx.toString(),
      x: spacing * (idx + 1),
      y: chartHeight / 2 + yOffset,
      symbolSize: 240,
      itemStyle: {
        color: {
          type: 'radial',
          x: 0.35,
          y: 0.35,
          r: 0.8,
          colorStops: [
            { offset: 0, color: colors.start },
            { offset: 0.7, color: colors.end },
            { offset: 1, color: 'rgba(0, 0, 0, 0.05)' }
          ]
        },
        borderColor: colors.border,
        borderWidth: 1,
        shadowColor: colors.glow,
        shadowBlur: 15,
        shadowOffsetX: 0,
        shadowOffsetY: 2
      },
      label: {
        show: true,
        formatter: () => {
          return `{num|${idx + 1}}\n{label|${node.label}}\n\n{tag1|◈ ${node.thinking}}\n{tag2|◈ ${node.situation}}\n{tag3|◈ ${node.chainType}}`;
        },
        rich: {
          num: {
            color: colors.border,
            fontSize: 18,
            fontWeight: 'bold',
            align: 'center',
            lineHeight: 28
          },
          label: { 
            color: '#ffffff', 
            fontSize: 16, 
            fontWeight: 'bold', 
            lineHeight: 28,
            padding: [0, 0, 6, 0],
            align: 'center'
          },
          tag1: { 
            color: 'rgba(255, 255, 255, 0.9)', 
            fontSize: 12, 
            lineHeight: 22,
            align: 'center'
          },
          tag2: { 
            color: 'rgba(255, 255, 255, 0.7)', 
            fontSize: 12, 
            lineHeight: 22,
            align: 'center'
          },
          tag3: { 
            color: 'rgba(255, 255, 255, 0.5)', 
            fontSize: 12, 
            lineHeight: 22,
            align: 'center'
          }
        },
        textAlign: 'center',
        verticalAlign: 'middle'
      },
      data: { index: idx, node: node }
    };
  });

  // 曲线连接（贝塞尔曲线，S形）
  const links = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    const sourceNode = echartsNodes[i];
    const targetNode = echartsNodes[i + 1];
    const isUpToDown = i % 2 === 0; // 正向、反向交替
    const curveness = isUpToDown ? 0.4 : -0.4;

    links.push({
      source: i.toString(),
      target: (i + 1).toString(),
      lineStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 1, y2: 0,
          colorStops: [
            { offset: 0, color: bubbleColors[i % bubbleColors.length].border },
            { offset: 1, color: bubbleColors[(i + 1) % bubbleColors.length].border }
          ]
        },
        width: 1.5,
        type: 'solid',
        curveness: curveness,
        opacity: 0.4
      },
      symbol: ['none', 'arrow'],
      symbolSize: [6, 6],
      effect: {
        show: true,
        period: 3,
        color: 'rgba(255, 255, 255, 0.5)',
        symbolSize: 5,
        trailLength: 0.3
      }
    });
  }

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(31, 41, 55, 0.95)',
      borderColor: '#4b5563',
      textStyle: { color: '#e5e7eb' },
      enterable: true,
      extraCssText: 'max-width: 320px;',
      formatter: (params) => {
        if (params.dataType === 'node') {
          const node = params.data.data.node;
          return `<div style="font-size:12px">
            <div style="font-size:15px;font-weight:bold;color:#fbbf24;margin-bottom:10px;border-bottom:1px solid #4b5563;padding-bottom:10px">${node.label}</div>
            <div style="color:#93c5fd;font-weight:500;margin-bottom:4px">核心问题</div>
            <div style="margin-bottom:10px;line-height:1.5">${node.coreQuestion}</div>
            <div style="color:#a78bfa;font-weight:500">◉ ${node.thinking}</div>
            <div style="color:#9ca3af;font-size:11px;margin-bottom:6px">${node.thinkingDesc || ''}</div>
            <div style="color:#6ee7b7;font-weight:500">◉ ${node.situation}</div>
            <div style="color:#9ca3af;font-size:11px;margin-bottom:6px">${node.situationDesc || ''}</div>
            <div style="color:#fbbf24;font-weight:500">◉ ${node.chainType}</div>
            <div style="color:#9ca3af;font-size:11px">${node.chainTypeDesc || ''}</div>
          </div>`;
        }
        return '';
      }
    },
    series: [{
      type: 'graph',
      layout: 'none',
      data: echartsNodes,
      links: links,
      roam: false,
      lineStyle: {
        opacity: 0.7
      },
      emphasis: {
        focus: 'adjacency',
        lineStyle: {
          width: 2,
          color: '#ffffff',
          shadowColor: 'rgba(255, 255, 255, 0.3)',
          shadowBlur: 5
        },
        itemStyle: {
          shadowBlur: 25
        }
      },
      zlevel: 10
    }]
  };

  charts.questionChainChart.setOption(option, true);
  charts.questionChainChart.resize();
}

function initThinkingChart() {
  const chartDom = document.getElementById('thinkingChart');
  if (!chartDom) return;

  if (charts.thinkingChart) {
    charts.thinkingChart.dispose();
  }

  charts.thinkingChart = echarts.init(chartDom);

  const data = MockData.teachingStrategy.thinkingStimulus.studentThinking.data;

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(31, 41, 55, 0.95)',
      borderColor: '#4b5563',
      textStyle: { color: '#e5e7eb' }
    },
    legend: {
      data: ['全面体现', '初步体现', '尚未体现'],
      textStyle: { color: '#9ca3af', fontSize: 10 },
      top: 0
    },
    grid: {
      left: '1%',
      right: '1%',
      bottom: '3%',
      top: '20%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: Object.keys(data),
      axisLine: { lineStyle: { color: '#4b5563' } },
      axisLabel: { color: '#9ca3af', fontSize: 9 }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#4b5563' } },
      axisLabel: { color: '#9ca3af' },
      splitLine: { lineStyle: { color: 'rgba(75, 85, 99, 0.3)' } }
    },
    series: [
      {
        name: '全面体现',
        type: 'bar',
        stack: 'total',
        data: Object.values(data).map(v => v.full),
        itemStyle: { color: '#10b981' }
      },
      {
        name: '初步体现',
        type: 'bar',
        stack: 'total',
        data: Object.values(data).map(v => v.partial),
        itemStyle: { color: '#f59e0b' }
      },
      {
        name: '尚未体现',
        type: 'bar',
        stack: 'total',
        data: Object.values(data).map(v => v.none),
        itemStyle: { color: '#6366f1' }
      }
    ]
  };

  charts.thinkingChart.setOption(option);
}

function initResponseDonutChart() {
  const chartDom = document.getElementById('responseDonutChart');
  if (!chartDom) return;

  if (charts.responseDonutChart) {
    charts.responseDonutChart.dispose();
  }

  charts.responseDonutChart = echarts.init(chartDom);

  const data = MockData.teachingStrategy.thinkingStimulus.studentAnswers.responseRate;
  const responsePercent = parseFloat(data['有应答']);
  const noResponsePercent = parseFloat(data['无应答']);

  // 根据百分比计算次数（总问题数38个）
  const totalQuestions = 38;
  const responseCount = Math.round(totalQuestions * responsePercent / 100);
  const noResponseCount = totalQuestions - responseCount;

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(31, 41, 55, 0.95)',
      borderColor: '#4b5563',
      textStyle: { color: '#e5e7eb' },
      formatter: function(params) {
        return params.name + '：' + params.data.count;
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '65%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{d}%',
          color: '#e5e7eb',
          fontSize: 11,
          lineHeight: 16,
          backgroundColor: 'transparent',
          borderWidth: 0,
          padding: [0, 0, 0, 0]
        },
        labelLine: {
          show: true,
          lineStyle: {
            color: '#9ca3af',
            width: 1,
            type: 'solid'
          },
          length: 10,
          length2: 15
        },
        emphasis: {
          scale: true,
          scaleSize: 5
        },
        data: [
          {
            value: responsePercent.toFixed(1),
            name: '有应答',
            count: responseCount,
            itemStyle: { color: '#10b981' }
          },
          {
            value: noResponsePercent.toFixed(1),
            name: '无应答',
            count: noResponseCount,
            itemStyle: { color: '#6366f1' }
          }
        ]
      }
    ]
  };

  charts.responseDonutChart.setOption(option);
}

function initWordDistChart() {
  const chartDom = document.getElementById('wordDistChart');
  if (!chartDom) return;

  if (charts.wordDistChart) {
    charts.wordDistChart.dispose();
  }

  charts.wordDistChart = echarts.init(chartDom);

  const data = MockData.teachingStrategy.thinkingStimulus.studentAnswers.wordDistribution;

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(31, 41, 55, 0.95)',
      borderColor: '#4b5563',
      textStyle: { color: '#e5e7eb' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.range),
      axisLine: { lineStyle: { color: '#4b5563' } },
      axisLabel: { color: '#9ca3af', fontSize: 11 }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#4b5563' } },
      axisLabel: { color: '#9ca3af' },
      splitLine: { lineStyle: { color: 'rgba(75, 85, 99, 0.3)' } }
    },
    series: [{
      type: 'bar',
      data: data.map(d => d.count),
      itemStyle: { color: '#6366f1', borderRadius: [4, 4, 0, 0] },
      barWidth: '60%'
    }]
  };

  charts.wordDistChart.setOption(option);
}

function loadTeacherFeedback(data) {
  // 反馈类型环图
  const chartDom = document.getElementById('feedbackTypeChart');
  if (chartDom) {
    if (charts.feedbackTypeChart) {
      charts.feedbackTypeChart.dispose();
    }
    charts.feedbackTypeChart = echarts.init(chartDom);

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(31, 41, 55, 0.95)',
        borderColor: '#4b5563',
        textStyle: { color: '#e5e7eb' },
        formatter: '{b}: {c}'
      },
      series: [{
        type: 'pie',
        radius: ['40%', '65%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{d}%',
          color: '#e5e7eb',
          fontSize: 11,
          lineHeight: 16,
          backgroundColor: 'transparent',
          borderWidth: 0,
          padding: [0, 0, 0, 0]
        },
        labelLine: {
          show: true,
          lineStyle: {
            color: '#9ca3af',
            width: 1,
            type: 'solid'
          },
          length: 10,
          length2: 15
        },
        emphasis: {
          scale: true,
          scaleSize: 5
        },
        data: data.feedbackTypes.map(item => ({
          value: item.count,
          name: item.type,
          itemStyle: { color: item.color }
        }))
      }]
    };

    charts.feedbackTypeChart.setOption(option);
  }

  // 反馈语词云
  const wordCloudDom = document.getElementById('feedbackWordCloud');
  if (!wordCloudDom) return;

  if (charts.feedbackWordCloud) {
    charts.feedbackWordCloud.dispose();
  }

  charts.feedbackWordCloud = echarts.init(wordCloudDom);

  const words = data.feedbackWords.map(item => ({
    name: item.text,
    value: item.weight
  }));

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      show: true,
      backgroundColor: 'rgba(17, 24, 39, 0.95)',
      borderColor: 'rgba(75, 85, 99, 0.5)',
      textStyle: { color: '#e5e7eb' },
      formatter: (params) => `${params.name}<br/>出现频次：${params.value}`
    },
    series: [{
      type: 'wordCloud',
      shape: 'circle',
      left: 'center',
      top: 'center',
      width: '100%',
      height: '100%',
      sizeRange: [18, 50],
      rotationRange: [-15, 15],
      rotationStep: 10,
      gridSize: 14,
      drawOutOfBound: true,
      textStyle: {
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        color: function() {
          const colors = ['#f472b6', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#2dd4bf'];
          return colors[Math.floor(Math.random() * colors.length)];
        }
      },
      data: words
    }]
  };

  charts.feedbackWordCloud.setOption(option);

  // 反馈示例 - 单列统一样式
  const examplesContainer = document.getElementById('feedbackExamples');
  const typeColorMap = {
    '评价性': 'rgba(59, 130, 246, 0.7)',
    '指导性': 'rgba(16, 185, 129, 0.7)',
    '鼓励性': 'rgba(245, 158, 11, 0.7)'
  };
  examplesContainer.innerHTML = data.feedbackExamples.map(ex => `
    <div class="bg-gray-700/30 border border-gray-600/30 px-3 py-2 rounded-lg">
      <div class="text-xs" style="color: ${typeColorMap[ex.type] || 'rgba(156, 163, 175, 0.7)'}">${ex.type}</div>
      <div class="text-sm text-gray-300">${ex.content}</div>
    </div>
  `).join('');
}

function loadTeachingInnovation() {
  const data = MockData.teachingStrategy.teachingInnovation;

  // 精彩提问
  const questionsContainer = document.getElementById('brilliantQuestions');
  questionsContainer.innerHTML = data.brilliantQuestions.map(q => createHighlightCard(q)).join('');

  // 精彩情境
  const scenariosContainer = document.getElementById('brilliantScenarios');
  scenariosContainer.innerHTML = data.brilliantScenarios.map(s => createHighlightCard(s)).join('');

  // 技术融合
  const techContainer = document.getElementById('techIntegration');
  techContainer.innerHTML = data.techIntegration.map(t => createHighlightCard(t)).join('');

  // 思维碰撞
  const collisionContainer = document.getElementById('thinkingCollision');
  collisionContainer.innerHTML = data.thinkingCollision.map(c => createHighlightCard(c)).join('');
}

function createHighlightCard(item) {
  const dialogueItems = item.dialogue.map(d => `
    <div class="flex items-start gap-3">
      <span class="px-1.5 py-0.5 ${d.role === 'teacher' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'} rounded flex items-center justify-center text-xs flex-shrink-0 font-medium">
        ${d.role === 'teacher' ? '师' : '生'}
      </span>
      <span class="text-sm text-gray-300">${d.text}</span>
    </div>
  `).join('');

  return `
    <div class="card rounded-xl overflow-hidden">
      <div class="grid grid-cols-12 divide-x divide-gray-700/50">
        <!-- 左侧：主题 + AI分析 -->
        <div class="col-span-5 p-5">
          <span class="inline-block w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 font-bold mb-4">
            ${String(item.id).padStart(2, '0')}
          </span>
          <div class="flex items-start gap-3 mb-4 group">
            <div class="flex flex-col items-center justify-center gap-2 w-[170px] h-[100px] bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-lg flex-shrink-0 group-hover:from-blue-500/30 group-hover:to-indigo-500/30 transition-all">
              <svg class="w-14 h-14 text-blue-400 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <rect x="1" y="9" width="3" height="6" rx="1.5"/>
                <rect x="6" y="5" width="3" height="14" rx="1.5"/>
                <rect x="11" y="2" width="3" height="20" rx="1.5"/>
                <rect x="16" y="5" width="3" height="14" rx="1.5"/>
                <rect x="21" y="9" width="3" height="6" rx="1.5"/>
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <h3 onclick="showFloatingPlayer()" class="font-medium text-white leading-tight cursor-pointer group-hover:text-blue-400 transition-colors">${item.title}</h3>
                <svg onclick="showFloatingPlayer()" class="w-4 h-4 text-gray-400 group-hover:text-blue-400 flex-shrink-0 transition-colors cursor-pointer" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <span class="text-xs text-gray-400">${item.timeRange}</span>
            </div>
          </div>
          <div class="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-medium text-blue-300 bg-blue-500/25 px-2.5 py-1 rounded-full border border-blue-400/30 shadow-sm">AI分析</span>
              <span class="text-xs text-gray-500">由AI生成 · 仅供参考</span>
            </div>
            <p class="text-sm text-gray-300 leading-relaxed">${item.sparkOpinion}</p>
          </div>
        </div>
        <!-- 右侧：对话记录 -->
        <div class="col-span-7 p-5">
          <div class="flex items-center gap-2 mb-3">
            <i data-lucide="message-square" class="w-4 h-4 text-gray-400"></i>
            <span class="text-sm font-medium text-gray-300">对话记录</span>
            <span class="text-xs text-gray-500">(${item.dialogue.length}条)</span>
          </div>
          <div class="dialogue-container bg-gray-800/30 rounded-lg p-3 overflow-y-auto scrollbar-thin" style="max-height: 240px;">
            <div class="space-y-3">${dialogueItems}</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function toggleDialogueExpand(btn) {
  const card = btn.closest('.card');
  const dialogueContainer = card.querySelector('.dialogue-container');
  const isExpanded = dialogueContainer.style.maxHeight === 'none';

  if (isExpanded) {
    dialogueContainer.style.maxHeight = '140px';
    btn.querySelector('.expand-text').textContent = '展开全部';
    btn.querySelector('.expand-icon').classList.remove('rotate-180');
  } else {
    dialogueContainer.style.maxHeight = 'none';
    btn.querySelector('.expand-text').textContent = '收起';
    btn.querySelector('.expand-icon').classList.add('rotate-180');
  }
}

function toggleAudio(btn) {
  const icon = btn.querySelector('i');
  if (icon.getAttribute('data-lucide') === 'play') {
    icon.setAttribute('data-lucide', 'pause');
    btn.classList.add('bg-blue-500', 'text-white');
    btn.classList.remove('bg-blue-500/20', 'text-blue-400');
    showToast('success', '正在播放音频...');
  } else {
    icon.setAttribute('data-lucide', 'play');
    btn.classList.remove('bg-blue-500', 'text-white');
    btn.classList.add('bg-blue-500/20', 'text-blue-400');
    showToast('info', '已暂停');
  }
  lucide.createIcons();
}

function toggleDialogue(btn) {
  const content = btn.nextElementSibling;
  const icon = btn.querySelector('i:last-child');

  content.classList.toggle('hidden');
  if (content.classList.contains('hidden')) {
    icon.style.transform = 'rotate(0deg)';
  } else {
    icon.style.transform = 'rotate(180deg)';
  }
}

function loadTeachingDesign() {
  const data = MockData.teachingStrategy.teachingDesign;

  // 教案文件
  document.getElementById('designFileName').textContent = data.designFile.name;

  // 教学目标达成度
  const goalContainer = document.getElementById('goalAchievement');
  goalContainer.innerHTML = data.goalAchievement.map((goal, idx) => {
    const pct = goal.achievement;

    return `
      <div class="bg-gray-700/50 rounded-xl p-5 border border-gray-600/30 hover:border-gray-500/50 transition-colors">
        <div class="flex items-center gap-5">
          <!-- 左侧：环形进度图 -->
          <div class="flex-shrink-0 relative w-20 h-20">
            <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#374151" stroke-width="10"/>
              <circle cx="50" cy="50" r="42" fill="none" stroke="#22c55e" stroke-width="10"
                stroke-linecap="round"
                stroke-dasharray="${pct * 2.638} ${263.894 - pct * 2.638}"/>
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-xl font-bold text-white">${pct}%</span>
            </div>
          </div>
          <!-- 右侧：目标信息 -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-2">
              <span class="w-5 h-5 bg-green-500/20 rounded flex items-center justify-center text-green-400 text-xs font-bold">${goal.id}</span>
              <span class="text-sm font-medium text-white">${goal.title}：${goal.content}</span>
            </div>
            <!-- 目标达成详情 -->
            <div class="mb-3">
              <span class="text-xs text-gray-400 leading-relaxed">目标达成详情：${goal.detail}</span>
            </div>
          </div>
        </div>

        <!-- 下方信息：教学活动、教学内容、教学方法 -->
        <div class="mt-4 pt-4 border-t border-gray-700/50 space-y-2">
          <div class="flex items-start gap-2 text-xs text-gray-400 leading-relaxed">
            <span class="w-1.5 h-1.5 bg-gray-500 rounded-full mt-1.5 flex-shrink-0"></span>
            <div><span class="text-gray-300 font-medium">教学活动：</span>${goal.activities}</div>
          </div>
          <div class="flex items-start gap-2 text-xs text-gray-400 leading-relaxed">
            <span class="w-1.5 h-1.5 bg-gray-500 rounded-full mt-1.5 flex-shrink-0"></span>
            <div><span class="text-gray-300 font-medium">教学内容：</span>${goal.content_covered}</div>
          </div>
          <div class="flex items-start gap-2 text-xs text-gray-400 leading-relaxed">
            <span class="w-1.5 h-1.5 bg-gray-500 rounded-full mt-1.5 flex-shrink-0"></span>
            <div><span class="text-gray-300 font-medium">教学方法：</span>${goal.methods}</div>
          </div>
        </div>

        <!-- 教学建议 -->
        <div class="flex items-start gap-2 bg-blue-500/10 rounded-lg p-3 mt-4 border border-blue-500/20">
          <span class="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></span>
          <div class="text-xs leading-relaxed">
            <span class="text-blue-400 font-medium">教学建议：</span><span class="text-blue-300">${goal.suggestion}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // 重新初始化图标
  lucide.createIcons();

  // 教学环节执行度
  const executionContainer = document.getElementById('phaseExecution');
  const phases = data.phaseExecution;
  const execPhases = ['课程开场与旧知回顾', '新课导入', '文本深入分析', '课程总结与巩固提升'];

  // 生成表格HTML
  let tableHTML = `
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-gray-700">
          <th class="text-left py-3 px-4 text-gray-400 font-medium w-[600px]">设计环节</th>
          <th colspan="4" class="text-center py-3 text-gray-400 font-medium border-l border-gray-700">执行环节</th>
        </tr>
        <tr class="border-b border-gray-700 bg-gray-800/30">
          <th class="py-2 px-4"></th>
          ${execPhases.map(ep => `
            <th class="text-center py-2 px-2 text-gray-500 text-xs font-normal">${ep}</th>
          `).join('')}
        </tr>
      </thead>
      <tbody>
        ${phases.map(p => `
          <tr class="border-b border-gray-700/50">
            <td class="py-3 px-4 align-top">
              <div class="text-gray-300 font-medium mb-2">${p.phase}</div>
              <p class="text-xs text-gray-500 leading-relaxed">${p.matchDesc.replace('完全匹配：', '<span class="text-emerald-400 font-medium">完全匹配：</span>').replace('部分匹配：', '<span class="text-blue-400 font-medium">部分匹配：</span>')}</p>
            </td>
            ${p.executions.map(exec => `
              <td class="py-3 px-2 align-top border-l border-gray-700/30">
                ${exec.rate > 0 ? `
                  <div class="flex flex-col items-center gap-1">
                    <div class="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                      <div class="h-full bg-blue-500 rounded-full transition-all" style="width: ${exec.rate}%"></div>
                    </div>
                    <span class="text-xs text-gray-400">${exec.rate}%</span>
                  </div>
                ` : `
                  <div class="h-8"></div>
                `}
              </td>
            `).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  executionContainer.innerHTML = tableHTML;

  // 生成性教学内容
  const generatedContainer = document.getElementById('generatedContent');
  const generatedData = data.generatedContent;
  
  // 生成AI分析文本块
  let generatedHTML = `
    <div class="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-6">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-medium text-blue-300 bg-blue-500/25 px-2.5 py-1 rounded-full border border-blue-400/30 shadow-sm">AI分析</span>
        <span class="text-xs text-gray-500">由AI生成 · 仅供参考</span>
      </div>
      <p class="text-sm text-gray-300 leading-relaxed">${generatedData.analysis}</p>
    </div>
  `;
  
  // 生成四个小标题及其内容卡片
  generatedData.sections.forEach((section, index) => {
    generatedHTML += `
      <div class="mb-4 last:mb-0">
        <h4 class="text-sm font-semibold text-white mb-3">
          ${section.name}
        </h4>
        <div class="pl-7 bg-gray-700/50 rounded-lg p-3">
          ${section.items.map(item => `
            <div class="mb-3 last:mb-0">
              <div class="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <span class="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0"></span>
                ${item.title}
              </div>
              <div class="text-sm text-gray-400 leading-relaxed mt-1">${item.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  });
  
  generatedContainer.innerHTML = generatedHTML;

  lucide.createIcons();
}

function loadContentOrganization() {
  const data = MockData.teachingStrategy.contentOrganization;

  // 知识点分析 - 文本内容已在HTML中固定

  const pointsContainer = document.getElementById('knowledgePoints');
  pointsContainer.innerHTML = data.knowledgePoints.points.map((point, index) => `
    <div class="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-xl p-5 cursor-pointer hover:from-gray-800/80 hover:to-gray-900/80 transition-all duration-300 border border-gray-700/30 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 group" onclick="showKnowledgeDetail(${point.id})">
      <!-- 头部：序号 + 标题 + 播放按钮 -->
      <div class="flex items-center gap-2 mb-4">
        <span class="text-xs text-gray-500 font-mono">${String(index + 1).padStart(2, '0')}</span>
        <h3 class="text-base font-medium text-white group-hover:text-blue-400 transition-colors cursor-pointer">${point.name}</h3>
        <svg onclick="event.stopPropagation(); showFloatingPlayer()" class="w-4 h-4 text-gray-400 group-hover:text-blue-400 flex-shrink-0 transition-colors cursor-pointer ml-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>
      
      <!-- 内涵 -->
      <p class="text-sm text-gray-400 leading-relaxed mb-3 pl-4 border-l border-gray-700">${point.connotation}</p>
      
      <!-- 时间 -->
      <div class="text-xs text-gray-500 mb-4 flex items-center gap-2">
        <i data-lucide="clock" class="w-3 h-3"></i>
        <span>${point.timeRange}</span>
      </div>
      
      <!-- 分隔线 -->
      <div class="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-4"></div>
      
      <!-- 教学活动/内容/方法 -->
      <div class="space-y-2 mb-4">
        <div class="flex items-start gap-2 text-sm text-gray-400 leading-relaxed">
          <span class="w-1.5 h-1.5 bg-gray-500 rounded-full mt-1.5 flex-shrink-0"></span>
          <div><span class="text-gray-300 font-medium">教学活动：</span>${point.activity}</div>
        </div>
        <div class="flex items-start gap-2 text-sm text-gray-400 leading-relaxed">
          <span class="w-1.5 h-1.5 bg-gray-500 rounded-full mt-1.5 flex-shrink-0"></span>
          <div><span class="text-gray-300 font-medium">教学内容：</span>${point.teachingContent}</div>
        </div>
        <div class="flex items-start gap-2 text-sm text-gray-400 leading-relaxed">
          <span class="w-1.5 h-1.5 bg-gray-500 rounded-full mt-1.5 flex-shrink-0"></span>
          <div><span class="text-gray-300 font-medium">教学方法：</span>${point.methods}</div>
        </div>
      </div>
      
      <!-- 易错点 -->
      <div class="pt-3 border-t border-gray-700/50 flex items-start gap-2">
        <i data-lucide="alert-circle" class="w-3.5 h-3.5 text-gray-500 flex-shrink-0 mt-0.5"></i>
        <div class="flex-1">
          <span class="text-sm text-gray-300 font-medium">易错点</span>
          <p class="text-sm text-gray-500 mt-0.5 leading-relaxed">${point.errorPoint}</p>
        </div>
      </div>
    </div>
  `).join('');

  // 核心素养分析
  const competencyContainer = document.getElementById('coreCompetencies');
  competencyContainer.innerHTML = data.coreCompetencies.map(comp => `
    <div class="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-xl p-5 border border-gray-700/30 hover:border-blue-500/30 transition-all duration-300">
      <!-- 素养标题 -->
      <div class="flex items-center gap-2 mb-3">
        <i data-lucide="award" class="w-5 h-5 text-yellow-400"></i>
        <h3 class="text-base font-semibold text-white">${comp.name}</h3>
      </div>
      
      <!-- 描述 -->
      <p class="text-sm text-gray-400 leading-relaxed mb-4">${comp.description}</p>
      
      <!-- 教学方法 -->
      <div class="bg-blue-500/5 rounded-lg p-3 border border-blue-500/20 mb-3">
        <div class="flex items-center gap-2 mb-2">
          <i data-lucide="book-open" class="w-4 h-4 text-blue-400"></i>
          <span class="text-xs font-medium text-blue-300">教学方法</span>
        </div>
        <p class="text-xs text-gray-400 leading-relaxed">${comp.methods}</p>
      </div>
      
      <!-- 师生对话 -->
      <div class="bg-purple-500/5 rounded-lg p-3 border border-purple-500/20 mb-4">
        <div class="flex items-center gap-2 mb-2">
          <i data-lucide="message-circle" class="w-4 h-4 text-purple-400"></i>
          <span class="text-xs font-medium text-purple-300">师生对话</span>
        </div>
        <div class="space-y-1">
          ${comp.dialogue.map(d => `<p class="text-xs text-gray-400 leading-relaxed">${d}</p>`).join('')}
        </div>
      </div>
      
      <!-- 教学建议 -->
      <div class="flex items-start gap-2">
        <i data-lucide="lightbulb" class="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5"></i>
        <div>
          <span class="text-xs font-medium text-blue-300">教学建议</span>
          <p class="text-xs text-gray-400 leading-relaxed mt-1">${comp.suggestion}</p>
        </div>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

// ============================================
// 模态框
// ============================================
function showModal(modalId) {
  const modal = document.getElementById('customModal');
  modal.classList.remove('hidden');

  if (modalId === 'questionChainModal') {
    showQuestionChainModal();
  }
}

function closeModal() {
  const modal = document.getElementById('customModal');
  modal.classList.add('hidden');
}

function hideModal() {
  const modal = document.getElementById('customModal');
  modal.classList.add('hidden');
}

function showQuestionChainModal() {
  const data = MockData.teachingStrategy.thinkingStimulus.questionChains;
  const modal = document.getElementById('customModal');
  document.getElementById('modalTitle').textContent = '问题链详情';

  document.getElementById('modalContent').innerHTML = data.map(chain => `
    <div class="mb-6 last:mb-0">
      <div class="flex items-center gap-3 mb-3">
        <span class="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 font-bold">
          ${chain.id}
        </span>
        <h4 class="font-medium text-white">${chain.name}</h4>
      </div>
      <div class="bg-gray-700/50 rounded-lg p-4 space-y-3">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-gray-400">核心问题：</span>
            <span class="text-gray-300">${chain.coreQuestion}</span>
          </div>
          <div>
            <span class="text-gray-400">学科思维：</span>
            <span class="text-blue-400">${chain.thinking}</span>
          </div>
          <div>
            <span class="text-gray-400">情境类型：</span>
            <span class="text-emerald-400">${chain.situation}</span>
          </div>
          <div>
            <span class="text-gray-400">问题集类型：</span>
            <span class="text-purple-400">${chain.questionType}</span>
          </div>
        </div>
        <div>
          <span class="text-gray-400 text-sm">关联问题：</span>
          <div class="mt-2 space-y-1">
            ${chain.relatedQuestions.map((q, i) => `
              <div class="flex items-center gap-2 text-sm text-gray-300">
                <span class="text-gray-500">${i + 1}.</span>
                <span>${q}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function showQuestionChainDetail(idx, event) {
  const chain = MockData.teachingStrategy.thinkingStimulus.questionChains[0];
  const node = chain.nodes[idx];
  if (!node) return;

  const modal = document.getElementById('customModal');
  modal.innerHTML = `
    <div class="space-y-4">
      <div>
        <span class="text-sm text-blue-400">核心问题</span>
        <p class="text-gray-200 mt-1">${node.coreQuestion}</p>
      </div>
      <div class="space-y-3">
        <div>
          <span class="text-sm text-blue-400">${node.thinking}</span>
          <p class="text-xs text-gray-500 mt-0.5">${node.thinkingDesc || ''}</p>
        </div>
        <div>
          <span class="text-sm text-blue-400">${node.situation}</span>
          <p class="text-xs text-gray-500 mt-0.5">${node.situationDesc || ''}</p>
        </div>
        <div>
          <span class="text-sm text-blue-400">${node.chainType}</span>
          <p class="text-xs text-gray-500 mt-0.5">${node.chainTypeDesc || ''}</p>
        </div>
      </div>
    </div>
  `;
  modal.classList.remove('hidden');
  modal.style.left = (event.clientX + 15) + 'px';
  modal.style.top = (event.clientY + 15) + 'px';
  lucide.createIcons();
}

function showKnowledgeDetail(id) {
  const point = MockData.teachingStrategy.contentOrganization.knowledgePoints.points.find(p => p.id === id);
  const detail = MockData.teachingStrategy.contentOrganization.knowledgeDetail[point.name];
  if (!detail) return;

  const modal = document.getElementById('customModal');
  document.getElementById('modalTitle').textContent = point.name;
  document.getElementById('modalContent').innerHTML = `
    <div class="space-y-4">
      <div class="bg-gray-700/50 rounded-lg p-4">
        <h4 class="text-sm text-gray-400 mb-2 flex items-center gap-2">
          <i data-lucide="book" class="w-4 h-4"></i> 知识点内涵
        </h4>
        <p class="text-gray-300">${detail.definition}</p>
      </div>
      <div class="bg-gray-700/50 rounded-lg p-4">
        <h4 class="text-sm text-gray-400 mb-2 flex items-center gap-2">
          <i data-lucide="list" class="w-4 h-4"></i> 教学内容
        </h4>
        <div class="space-y-1">
          ${detail.content.map(c => `<p class="text-gray-300">${c}</p>`).join('')}
        </div>
      </div>
      <div class="bg-gray-700/50 rounded-lg p-4">
        <h4 class="text-sm text-gray-400 mb-2 flex items-center gap-2">
          <i data-lucide="settings" class="w-4 h-4"></i> 教学方法
        </h4>
        <p class="text-gray-300">${detail.methods.join('、')}</p>
      </div>
      <div class="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
        <h4 class="text-sm text-amber-400 mb-2 flex items-center gap-2">
          <i data-lucide="alert-triangle" class="w-4 h-4"></i> 易错点
        </h4>
        <p class="text-gray-300">${detail.errorPoint}</p>
      </div>
      <div class="bg-gray-700/50 rounded-lg p-4">
        <h4 class="text-sm text-gray-400 mb-2 flex items-center gap-2">
          <i data-lucide="volume-2" class="w-4 h-4"></i> 知识点实录
        </h4>
        <div class="bg-gray-800 rounded-lg p-4">
          <div class="flex items-center gap-4">
            <button class="p-2 bg-blue-500 hover:bg-blue-600 rounded-full text-white transition-colors">
              <i data-lucide="play" class="w-5 h-5"></i>
            </button>
            <div class="flex-1">
              <div class="h-2 bg-gray-600 rounded-full overflow-hidden">
                <div class="h-full bg-blue-500 rounded-full" style="width: 49%"></div>
              </div>
              <div class="flex justify-between text-xs text-gray-400 mt-1">
                <span>${detail.audioTime.current}</span>
                <span>${detail.audioTime.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  modal.classList.remove('hidden');
  lucide.createIcons();
}

// 点击模态框外部关闭
document.getElementById('customModal').addEventListener('click', (e) => {
  if (e.target.id === 'customModal') {
    closeModal();
  }
});

// ESC键关闭模态框
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});

// ============================================
// Toast 提示
// ============================================
function showToast(type, message) {
  const toast = document.getElementById('toast');
  const icon = document.getElementById('toastIcon');
  const msg = document.getElementById('toastMessage');

  const icons = {
    success: '<i data-lucide="check-circle" class="w-5 h-5 text-emerald-400"></i>',
    error: '<i data-lucide="x-circle" class="w-5 h-5 text-red-400"></i>',
    warning: '<i data-lucide="alert-triangle" class="w-5 h-5 text-amber-400"></i>',
    info: '<i data-lucide="info" class="w-5 h-5 text-blue-400"></i>'
  };

  icon.innerHTML = icons[type] || icons.info;
  msg.textContent = message;
  toast.classList.remove('hidden');

  lucide.createIcons();

  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

// ============================================
// 响应窗口大小变化，重新渲染图表
// ============================================
window.addEventListener('resize', () => {
  Object.values(charts).forEach(chart => {
    if (chart && chart.resize) {
      chart.resize();
    }
  });
});

// ============================================
// 文档预览功能
// ============================================
function previewDesignFile() {
  const fileName = document.getElementById('designFileName').textContent;
  if (!fileName) {
    showToast('warning', '没有可预览的文件');
    return;
  }

  const modal = document.getElementById('docPreviewModal');
  const title = document.getElementById('docPreviewTitle');
  const container = document.getElementById('docxContainer');

  title.textContent = fileName;
  container.innerHTML = '<div class="flex items-center justify-center h-64"><div class="text-gray-500">加载中...</div></div>';
  modal.classList.remove('hidden');

  loadAndPreviewDoc(fileName);
}

async function loadAndPreviewDoc(fileName) {
  const container = document.getElementById('docxContainer');
  try {
    const fileUrl = './data/' + encodeURIComponent(fileName);
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error('文件加载失败');
    }
    const arrayBuffer = await response.arrayBuffer();
    container.innerHTML = '';
    await docx.renderAsync(arrayBuffer, container, null, {
      className: 'docx-content',
      inWrapper: true,
      breakPages: true
    });
  } catch (error) {
    console.error('文档预览失败:', error);
    container.innerHTML = '<div class="flex flex-col items-center justify-center h-64 text-gray-400"><p class="text-center">无法预览此文档</p><p class="text-xs text-gray-500 mt-2">支持预览 .docx 格式文件</p></div>';
  }
}

function closeDocPreview() {
  document.getElementById('docPreviewModal').classList.add('hidden');
}

// ============================================
// 视图切换功能
// ============================================
let isRecordView = false;
let mainAudioPlayer = null;

function toggleView() {
  isRecordView = !isRecordView;
  const recordView = document.getElementById('recordView');
  const analysisView = document.getElementById('analysisView');
  const btn = document.getElementById('viewToggleBtn');

  if (isRecordView) {
    recordView.classList.remove('hidden');
    analysisView.classList.add('hidden');
    document.body.classList.add('overflow-hidden');
    btn.innerHTML = '<i data-lucide="bar-chart-2" class="w-4 h-4"></i><span>查看分析报告</span>';
    lucide.createIcons();
    initRecordView();
  } else {
    recordView.classList.add('hidden');
    analysisView.classList.remove('hidden');
    document.body.classList.remove('overflow-hidden');
    btn.innerHTML = '<i data-lucide="file-text" class="w-4 h-4"></i><span>课堂实录</span>';
    lucide.createIcons();
  }
}

function initRecordView() {
  initMainAudioPlayer();
  renderMindmap();
  renderTranscript();
}

function initMainAudioPlayer() {
  const audio = document.getElementById('mainAudio');
  const playBtn = document.querySelector('#recordView .w-12');
  const playIcon = document.getElementById('mainPlayIcon');
  const progressBar = document.getElementById('progressBar');
  const currentTimeEl = document.getElementById('currentTime');
  const totalTimeEl = document.getElementById('totalTime');

  if (!audio || mainAudioPlayer) return;
  mainAudioPlayer = audio;

  audio.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = progress + '%';
    currentTimeEl.textContent = formatTime(audio.currentTime);
  });

  audio.addEventListener('ended', () => {
    playIcon.setAttribute('data-lucide', 'play');
    lucide.createIcons();
  });

  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      playIcon.setAttribute('data-lucide', 'pause');
    } else {
      audio.pause();
      playIcon.setAttribute('data-lucide', 'play');
    }
    lucide.createIcons();
  });

  // 点击进度条跳转
  progressBar.parentElement.addEventListener('click', (e) => {
    const rect = e.target.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
  });
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// jsMind 实例
let jsMindInstance = null;

function renderMindmap() {
  const container = document.getElementById('jsmind_container');
  if (!container) return;

  const phasesData = MockData.teachingStructure.phases;

  // 构建径向布局的思维导图
  const directions = ['left', 'right', 'left', 'right'];

  const rootNode = {
    id: 'root',
    topic: '课程纪要',
    children: phasesData.items.map((item, idx) => {
      const dir = directions[idx % 4];
      const subPhases = phasesData.subPhases[item.name] || [];

      const children = subPhases.length > 0
        ? subPhases.map((subItem, subIdx) => ({
            id: 'sub_' + item.name + '_' + subIdx,
            topic: subItem.name,
            direction: subIdx % 2 === 0 ? (dir === 'left' ? 'right' : 'left') : dir
          }))
        : [];

      return {
        id: 'phase_' + item.name,
        topic: item.name,
        direction: dir,
        children: children
      };
    })
  };

  const mindData = {
    meta: {
      name: '课堂脉络',
      author: 'AI分析',
      version: '1.0'
    },
    format: 'node_tree',
    data: rootNode
  };

  // 如果已存在实例，先清除
  if (jsMindInstance) {
    jsMindInstance.destroy();
  }

  // 配置选项 - 启用拖动和缩放
  const options = {
    container: 'jsmind_container',
    theme: 'dark',
    editable: false,
    view: {
      engine: 'canvas',
      hmargin: 100,
      vmargin: 80,
      line_width: 2,
      line_color: '#4b5563',
      draggable: true,
      hide_scrollbars_when_draggable: true,
      zoom: { min: 0.3, max: 2.0, step: 0.1 }
    },
    layout: {
      hspace: 100,
      vspace: 40,
      pspace: 25,
      rank: 'same'
    },
    shortcut: {
      enable: false
    }
  };

  // 初始化并显示
  jsMindInstance = new jsMind(options);
  jsMindInstance.show(mindData);

  // 渲染完成后设置节点颜色并自动缩放适应
  setTimeout(() => {
    applyNodeColors();
    autoFitMindmap();
    initMindmapMouseWheel();
  }, 150);
}

// 初始化鼠标滚轮缩放
function initMindmapMouseWheel() {
  const container = document.getElementById('jsmind_container');
  if (!container || !jsMindInstance) return;

  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      jsMindInstance.view.zoom_out();
    } else {
      jsMindInstance.view.zoom_in();
    }
  }, { passive: false });
}

// 自动缩放以适应容器
function autoFitMindmap() {
  if (!jsMindInstance) return;

  const container = document.getElementById('jsmind_container');
  if (!container) return;

  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  // 获取思维导图的尺寸
  const viewSize = jsMindInstance.view.size;
  if (!viewSize) return;

  const mindWidth = viewSize.w;
  const mindHeight = viewSize.h;

  // 计算缩放比例，确保完整显示
  const scaleX = (containerWidth - 40) / mindWidth;
  const scaleY = (containerHeight - 40) / mindHeight;
  const targetScale = Math.min(scaleX, scaleY, 1);

  // 获取当前缩放值
  const currentScale = jsMindInstance.view._zoom || 1;

  // 如果需要缩小，多次调用 zoom_out
  if (targetScale < currentScale && targetScale > 0.1) {
    const diff = currentScale - targetScale;
    const steps = Math.ceil(diff / 0.1);
    for (let i = 0; i < steps; i++) {
      jsMindInstance.view.zoom_out();
    }
  }
}

// 为不同层级节点设置颜色
function applyNodeColors() {
  if (!jsMindInstance) return;

  const phasesData = MockData.teachingStructure.phases;

  // 设置根节点颜色 - 蓝色
  jsMindInstance.set_node_color('root', '#3b82f6', '#ffffff');

  // 设置一级节点颜色 - 紫色/靛蓝
  phasesData.items.forEach((item, index) => {
    const nodeId = 'phase_' + item.name;
    const colors = ['#6366f1', '#8b5cf6', '#7c3aed', '#4f46e5'];
    try {
      jsMindInstance.set_node_color(nodeId, colors[index % colors.length], '#ffffff');
    } catch (e) {}
  });

  // 设置二级节点颜色 - 青绿色
  phasesData.items.forEach(item => {
    const subPhases = phasesData.subPhases[item.name] || [];
    subPhases.forEach((subItem, subIdx) => {
      const nodeId = 'sub_' + item.name + '_' + subIdx;
      const colors = ['#10b981', '#14b8a6', '#06b6d4', '#0ea5e9'];
      try {
        jsMindInstance.set_node_color(nodeId, colors[subIdx % colors.length], '#ffffff');
      } catch (e) {}
    });
  });
}

function zoomInMindmap() {
  if (jsMindInstance) {
    jsMindInstance.view.zoom_in();
  }
}

function zoomOutMindmap() {
  if (jsMindInstance) {
    jsMindInstance.view.zoom_out();
  }
}

function resetMindmapView() {
  if (jsMindInstance) {
    jsMindInstance.show(jsMindInstance.get_data());
    setTimeout(() => {
      applyNodeColors();
      autoFitMindmap();
    }, 150);
  }
}

function renderTranscript() {
  const container = document.getElementById('transcriptContainer');
  const transcript = MockData.transcript;

  if (!transcript || transcript.length === 0) {
    container.innerHTML = '<div class="text-gray-500 text-center py-8">暂无录音原文数据</div>';
    return;
  }

  let html = '';
  transcript.forEach(item => {
    const roleClass = item.role === 'teacher' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400';
    const roleLabel = item.role === 'teacher' ? '师' : '生';
    const startTime = item.startTime || '00:00';

    html += `
      <div class="p-3 bg-gray-800/50 rounded-lg">
        <div class="flex items-center gap-2 mb-2">
          <span class="px-1.5 py-0.5 ${roleClass} rounded text-xs font-medium">${roleLabel}</span>
          <span class="text-xs text-gray-500">${startTime}</span>
        </div>
        <p class="text-gray-300 text-sm leading-relaxed">${item.text}</p>
      </div>
    `;
  });

  container.innerHTML = html;
}
