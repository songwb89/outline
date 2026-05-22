/**
 * 课堂分析模拟数据
 * 包含教学结构、教学行为、教学策略三大模块的完整模拟数据
 */

const MockData = {
  // ============================================
  // 课程基本信息
  // ============================================
  courseInfo: {
    name: '《春江花月夜》诗歌鉴赏',
    teacher: '张明华',
    subject: '语文',
    grade: '高二',
    date: '2024-12-15',
    duration: '45分钟',
    className: '高二(3)班'
  },

  // ============================================
  // 模块一：教学结构
  // ============================================
  teachingStructure: {
    // 1.1 教学环节
    phases: {
      analysis: '本节课先通过背诵回顾旧知，接着点名目标引入新课，对意象、人物情感、段落作用等展开分析。随后深入解读文本，涉及过渡句、意象、诗句理解等多方面内容，最后进行课程总结并布置巩固问题。整体环节丰富，对文本剖析细致。',
      suggestion: '建议在新课导入部分可增加趣味性元素，吸引学生注意力；在文本深入分析环节，可适当增加学生自主讨论时间，提升学生参与度。',
      items: [
        { name: '课程开场与旧知回顾', percentage: 10.9, duration: "4'45\"", startTime: "0:00", endTime: "4:45" },
        { name: '新课导入', percentage: 14.4, duration: "6'19\"", startTime: "4:45", endTime: "11:04" },
        { name: '文本深入分析', percentage: 70.7, duration: "30'57\"", startTime: "11:04", endTime: "42:01" },
        { name: '课程总结与巩固提升', percentage: 4.0, duration: "1'36\"", startTime: "42:01", endTime: "43:37" }
      ],
      subPhases: {
        '课程开场与旧知回顾': [
          { name: '课堂问候', timeRange: "0:00-0:30", content: '教师与学生互相问候' },
          { name: '背诵检查', timeRange: "0:30-2:15", content: '学生背诵上节课内容' },
          { name: '旧知提问', timeRange: "2:15-4:45", content: '教师提问相关知识点' }
        ],
        '新课导入': [
          { name: '创设情境', timeRange: "4:45-6:00", content: '播放背景音乐，营造氛围' },
          { name: '引入课题', timeRange: "6:00-8:30", content: '揭示本节课主题《春江花月夜》' },
          { name: '预习检查', timeRange: "8:30-11:04", content: '检查学生预习情况' }
        ],
        '文本深入分析': [
          { name: '过渡句分析', timeRange: "11'24\"-13'35\"", content: '分析诗句中地点的转换和过渡' },
          { name: '意象解读', timeRange: "13'35\"-16'39\"", content: '解读"玉户帘"和"捣衣砧"的意象' },
          { name: '诗句理解与感受分享', timeRange: "16'39\"-18'12\"", content: '让学生分享对诗句的感受' },
          { name: '大胆想法与意象分析', timeRange: "18'12\"-21'37\"", content: '分析思妇的想法和"鸿雁"、"鱼龙"的意象' },
          { name: '后世诗歌对比', timeRange: "21'37\"-24'1\"", content: '对比张若虚诗歌对后世的影响' },
          { name: '画面与视角转换', timeRange: "24'1\"-24:40\"", content: '分析画面和视角的转换' },
          { name: '游子部分分析', timeRange: "24'40\"-27'53\"", content: '分析游子部分的诗句' },
          { name: '学生感受分享', timeRange: "27'53\"-30'5\"", content: '让学生分享对游子部分诗句的感受' },
          { name: '结尾诗句分析', timeRange: "30'5\"-37'54\"", content: '分析结尾诗句的意境和手法' },
          { name: '手法讨论', timeRange: "37'54\"-42:21\"", content: '讨论诗歌表现手法' }
        ],
        '课程总结与巩固提升': [
          { name: '梳理脉络', timeRange: "42:01-42:45", content: '回顾全诗结构' },
          { name: '布置作业', timeRange: "42:45-43:37", content: '布置课后练习' }
        ]
      }
    },

    // 1.2 课堂结构类型
    classType: {
      teacherRatio: 75,
      studentRatio: 25,
      rt: 0.75,
      ch: 0.20,
      // S-T分析数据
      stAnalysis: {
        // S-T累积曲线数据 (时间点, T累计时间, S累计时间)
        // 假设总时长约43分钟，每分钟采样
        cumulativeData: [
          { time: 0, t: 0, s: 0 },
          { time: 1, t: 0.9, s: 0.1 },
          { time: 2, t: 1.8, s: 0.3 },
          { time: 3, t: 2.6, s: 0.4 },
          { time: 4, t: 3.5, s: 0.5 },
          { time: 5, t: 4.2, s: 0.8 },
          { time: 6, t: 5.0, s: 1.0 },
          { time: 7, t: 5.9, s: 1.1 },
          { time: 8, t: 6.7, s: 1.3 },
          { time: 9, t: 7.5, s: 1.5 },
          { time: 10, t: 8.4, s: 1.6 },
          { time: 11, t: 9.2, s: 1.8 },
          { time: 12, t: 10.0, s: 2.0 },
          { time: 13, t: 10.9, s: 2.1 },
          { time: 14, t: 11.7, s: 2.3 },
          { time: 15, t: 12.5, s: 2.5 },
          { time: 16, t: 13.4, s: 2.6 },
          { time: 17, t: 14.2, s: 2.8 },
          { time: 18, t: 15.0, s: 3.0 },
          { time: 19, t: 15.9, s: 3.1 },
          { time: 20, t: 16.7, s: 3.3 },
          { time: 21, t: 17.5, s: 3.5 },
          { time: 22, t: 18.4, s: 3.6 },
          { time: 23, t: 19.2, s: 3.8 },
          { time: 24, t: 20.0, s: 4.0 },
          { time: 25, t: 20.9, s: 4.1 },
          { time: 26, t: 21.7, s: 4.3 },
          { time: 27, t: 22.5, s: 4.5 },
          { time: 28, t: 23.4, s: 4.6 },
          { time: 29, t: 24.2, s: 4.8 },
          { time: 30, t: 25.0, s: 5.0 },
          { time: 31, t: 25.9, s: 5.1 },
          { time: 32, t: 26.7, s: 5.3 },
          { time: 33, t: 27.5, s: 5.5 },
          { time: 34, t: 28.4, s: 5.6 },
          { time: 35, t: 29.2, s: 5.8 },
          { time: 36, t: 30.0, s: 6.0 },
          { time: 37, t: 30.9, s: 6.1 },
          { time: 38, t: 31.7, s: 6.3 },
          { time: 39, t: 32.5, s: 6.5 },
          { time: 40, t: 33.4, s: 6.6 },
          { time: 41, t: 34.2, s: 6.8 },
          { time: 42, t: 35.0, s: 7.0 },
          { time: 43, t: 35.5, s: 7.5 }
        ]
      },
      // Rt-Ch三角图数据
      rtChAnalysis: {
        // 散点数据 (Rt, Ch)
        dataPoints: [
          { rt: 0.75, ch: 0.20, label: '本节课', isMain: true },
          { rt: 0.70, ch: 0.18, label: '样本1', isMain: false },
          { rt: 0.68, ch: 0.22, label: '样本2', isMain: false },
          { rt: 0.72, ch: 0.25, label: '样本3', isMain: false },
          { rt: 0.65, ch: 0.30, label: '样本4', isMain: false },
          { rt: 0.58, ch: 0.35, label: '样本5', isMain: false }
        ],
        // 四象限边界线参数
        quadrants: {
          lecture: { maxRt: 0.7, maxCh: 0.3 },    // 讲授型: Rt<=0.7, Ch<=0.3
          practice: { minRt: 0.4, maxCh: 0.3 },   // 练习型: Rt<=0.4, Ch<=0.3
          mixed: { minRt: 0.4, minCh: 0.3 },      // 混合型: Rt>=0.4, Ch>=0.3
          dialogue: { maxRt: 0.7, minCh: 0.3 }    // 对话型: Rt<=0.7, Ch>=0.3
        }
      }
    },

    // 1.3 知识点结构
    knowledgeStructure: {
      topic: '咏物抒怀诗',
      branches: [
        {
          name: '意象',
          color: '#10b981',
          children: [
            { name: '白云', color: '#34d399' },
            { name: '青枫浦', color: '#34d399' },
            { name: '扁舟子', color: '#34d399' },
            { name: '明月楼', color: '#34d399' }
          ]
        },
        {
          name: '情景交融',
          color: '#8b5cf6',
          children: [
            {
              name: '借景抒情',
              color: '#a78bfa',
              children: [
                { name: '象征', color: '#c4b5fd' }
              ]
            },
            {
              name: '动静结合',
              color: '#a78bfa',
              children: [
                { name: '以景结情', color: '#c4b5fd' }
              ]
            },
            {
              name: '虚实结合',
              color: '#a78bfa',
              children: [
                { name: '思乡怀人', color: '#c4b5fd' }
              ]
            }
          ]
        }
      ]
    }
  },

  // ============================================
  // 模块二：教学行为
  // ============================================
  teachingBehavior: {
    // 2.1 教师语速分析
    speakingSpeed: {
      totalWords: 7028,
      totalDuration: '31.8分钟',
      avgSpeed: 220,
      analysis: '本节课教师授课总文字量为7028字，实际讲授时长31.8分钟，平均语速达220字/分钟。依据教学标准，语速建议控制在150-250字/分钟区间。本次授课语速处于推荐范围内，节奏适中，表达清晰流畅，学生有足够时间理解消化。',
      chartData: [
        { time: 0, speed: 180 },
        { time: 1, speed: 182 },
        { time: 2, speed: 185 },
        { time: 3, speed: 188 },
        { time: 4, speed: 190 },
        { time: 5, speed: 195 },
        { time: 6, speed: 198 },
        { time: 7, speed: 200 },
        { time: 8, speed: 203 },
        { time: 9, speed: 205 },
        { time: 10, speed: 210 },
        { time: 11, speed: 215 },
        { time: 12, speed: 220 },
        { time: 13, speed: 235 },
        { time: 14, speed: 255 },
        { time: 15, speed: 270 },
        { time: 16, speed: 260 },
        { time: 17, speed: 250 },
        { time: 18, speed: 245 },
        { time: 19, speed: 240 },
        { time: 20, speed: 235 },
        { time: 21, speed: 240 },
        { time: 22, speed: 245 },
        { time: 23, speed: 248 },
        { time: 24, speed: 245 },
        { time: 25, speed: 245 },
        { time: 26, speed: 242 },
        { time: 27, speed: 238 },
        { time: 28, speed: 230 },
        { time: 29, speed: 225 },
        { time: 30, speed: 220 },
        { time: 31, speed: 210 },
        { time: 32, speed: 195 },
        { time: 33, speed: 180 },
        { time: 34, speed: 165 },
        { time: 35, speed: 150 },
        { time: 36, speed: 140 },
        { time: 37, speed: 130 },
        { time: 38, speed: 125 },
        { time: 39, speed: 122 },
        { time: 40, speed: 120 },
        { time: 41, speed: 105 },
        { time: 42, speed: 95 },
        { time: 43, speed: 88 },
        { time: 44, speed: 83 },
        { time: 45, speed: 80 }
      ]
    },

    // 2.2 高频词汇分析
    highFrequencyWords: {
      analysis: '根据词云，教师在课堂中高频提及"张若虚"、"游子"、"明月"等词，这些高频词语与课堂意象分析、文本深入探讨等内容紧密相关。',
      suggestion: '建议教师可进一步引导学生深入挖掘高频意象背后的深层情感与文化内涵。',
      words: [
        { text: '明月', weight: 100, level: 1 },
        { text: '游子', weight: 95, level: 1 },
        { text: '张若虚', weight: 70, level: 2 },
        { text: '月光', weight: 65, level: 2 },
        { text: '时候', weight: 60, level: 2 },
        { text: '水流', weight: 55, level: 2 },
        { text: '落花', weight: 48, level: 2 },
        { text: '意象', weight: 45, level: 3 },
        { text: '白云', weight: 42, level: 3 },
        { text: '鱼龙', weight: 40, level: 3 },
        { text: '大雁', weight: 38, level: 3 },
        { text: '思念', weight: 36, level: 3 },
        { text: '月落', weight: 34, level: 3 },
        { text: '春江', weight: 32, level: 3 },
        { text: '花林', weight: 30, level: 3 },
        { text: '滟滟', weight: 28, level: 3 },
        { text: '芳甸', weight: 26, level: 3 },
        { text: '月华', weight: 24, level: 3 },
        { text: '江天', weight: 22, level: 3 },
        { text: '霜月', weight: 20, level: 3 },
        { text: '青枫', weight: 18, level: 3 },
        { text: '江流', weight: 17, level: 3 },
        { text: '长空', weight: 16, level: 3 },
        { text: '扁舟', weight: 15, level: 3 },
        { text: '江畔', weight: 14, level: 3 },
        { text: '人生', weight: 13, level: 3 },
        { text: '宇宙', weight: 12, level: 3 },
        { text: '时空', weight: 11, level: 3 },
        { text: '情感', weight: 10, level: 3 },
        { text: '文化', weight: 9, level: 3 },
        { text: '古诗', weight: 8, level: 3 },
        { text: '意境', weight: 7, level: 3 },
        { text: '诗人', weight: 6, level: 3 },
        { text: '自然', weight: 5, level: 3 }
      ]
    },

    // 2.3 师生行为占比
    behaviorRatio: {
      teacherDuration: '33.1分钟',
      studentDuration: '10.6分钟',
      totalDuration: 43.7,
      teacherRatio: 75.78,
      studentRatio: 24.22,
      conclusion: '老师说话时长明显多于学生',
      suggestions: [
        '新课导入时可多设置互动问题激发学生思考',
        '课程总结时让学生先自主总结',
        '文本深入分析环节可进一步增加小组讨论等形式',
        '提高学生参与度，让课堂更活跃'
      ],
      phaseDetails: [
        { phase: '课程开场与旧知回顾', teacherDuration: '30"', studentDuration: "4'15\"", teacherPercent: 14.5, studentPercent: 89.5, evaluation: '尚可' },
        { phase: '新课导入', teacherDuration: "5'30\"", studentDuration: '45"', teacherPercent: 88.0, studentPercent: 12.0, evaluation: '低' },
        { phase: '文本深入分析', teacherDuration: "25'00\"", studentDuration: "5'57\"", teacherPercent: 80.8, studentPercent: 19.2, evaluation: '尚可' },
        { phase: '课程总结与巩固提升', teacherDuration: "1'20\"", studentDuration: '16"', teacherPercent: 83.3, studentPercent: 16.7, evaluation: '低' }
      ]
    }
  },

  // ============================================
  // 模块三：教学策略
  // ============================================
  teachingStrategy: {
    // Tab: 思维激发 (3.1)
    thinkingStimulus: {
      theme: '《春江花月夜》意象与情感鉴赏',
      // 3.1.1.1 问题链
      questionChains: [
        {
          id: 1,
          name: '意象分析',
          nodes: [
            {
              label: '意象分析',
              coreQuestion: '白云一片去悠悠，青枫浦上不胜愁是怎样的意象',
              thinking: '形象思维',
              thinkingDesc: '通过分析诗歌中的意象，培养学生形象思维能力',
              situation: '复杂情境',
              situationDesc: '问题涉及多个意象的关联分析',
              chainType: '收敛型',
              chainTypeDesc: '从多个意象的分析中收敛到核心意境的理解'
            },
            {
              label: '情感体会',
              coreQuestion: '从哪些关键词可以体会作者的情感',
              thinking: '逻辑思维',
              thinkingDesc: '通过关键词的提取和分析，培养学生逻辑思维能力',
              situation: '简单情境',
              situationDesc: '问题聚焦于特定词语的情感分析',
              chainType: '收敛型',
              chainTypeDesc: '从关键词的情感指向中归纳作者情感'
            },
            {
              label: '意境鉴赏',
              coreQuestion: '诗歌营造了怎样的意境',
              thinking: '形象思维',
              thinkingDesc: '引导学生感受诗歌的意境美，提升形象思维能力',
              situation: '复杂情境',
              situationDesc: '需要综合多个意象进行意境的整体感知',
              chainType: '收敛型',
              chainTypeDesc: '从景物描写中概括出诗歌的整体意境'
            },
            {
              label: '手法分析',
              coreQuestion: '诗歌运用了哪些表现手法',
              thinking: '逻辑思维',
              thinkingDesc: '通过对比和归纳，分析诗歌的表现手法',
              situation: '简单情境',
              situationDesc: '针对具体诗句的表现手法进行分析',
              chainType: '收敛型',
              chainTypeDesc: '从具体手法分析中归纳诗歌的艺术特点'
            },
            {
              label: '主题升华',
              coreQuestion: '这首诗表达了怎样的家国情怀',
              thinking: '辩证思维',
              thinkingDesc: '引导学生辩证地看待诗歌的家国情怀',
              situation: '复杂情境',
              situationDesc: '需要结合时代背景和个人情感进行辩证思考',
              chainType: '发散型',
              chainTypeDesc: '从个人情感发散到家国情怀的深度解读'
            }
          ]
        }
      ],

      // 3.1.1.2 问题分类
      questionClassification: {
        totalQuestions: 28,
        analysis: '课堂提问以理解性和应用性问题为主，注重引导学生思考，培养学生的分析能力。',
        suggestion: '可适当增加评价性和创造性问题，提升学生的高阶思维。',
        fourMat: {
          '是何--事实型': 15,
          '为何--原理型': 8,
          '若何--变化型': 10,
          '如何--方法型': 5
        },
        bloom: {
          '记忆': 5,
          '理解': 10,
          '应用': 8,
          '分析': 3,
          '评价': 1,
          '创造': 1
        },
        openness: {
          '开放性': 8,
          '封闭性': 20
        },
        // 问题详情列表
        questionList: [
          { time: '00:05:23', question: '同学们，昨天我们学习了《登鹳雀楼》，谁能告诉我这首诗的作者是谁？', fourMat: '是何--事实型', bloom: '记忆', studentAnswer: '是王之涣写的！', teacherFeedback: '很好，回答正确。' },
          { time: '00:06:45', question: '为什么诗人说"欲穷千里目"还需要"更上一层楼"呢？', fourMat: '为何--原理型', bloom: '理解', studentAnswer: '因为站得高才能看得远，诗人想看到更远的风景。', teacherFeedback: '理解得很准确，这就是诗人的远大抱负。' },
          { time: '00:08:12', question: '如果诗人没有登上楼，他还能写出这首诗吗？', fourMat: '若何--变化型', bloom: '分析', studentAnswer: '应该不能，因为他需要亲眼看到这样的景色才能写出诗。', teacherFeedback: '分析得有道理，请继续思考。' },
          { time: '00:10:30', question: '你能用今天学的方法来分析这首诗的意境吗？', fourMat: '如何--方法型', bloom: '应用', studentAnswer: '', teacherFeedback: '' },
          { time: '00:12:18', question: '这首诗中"白日依山尽"的"白日"是指什么？', fourMat: '是何--事实型', bloom: '记忆', studentAnswer: '是指傍晚的太阳。', teacherFeedback: '正确，继续保持。' },
          { time: '00:14:55', question: '黄河入海流的"入海"说明了什么？', fourMat: '为何--原理型', bloom: '理解', studentAnswer: '说明黄河的水最终流进了大海，就像我们的学习一样，要不断前进。', teacherFeedback: '你的比喻很好，理解了诗的深层含义。' },
          { time: '00:18:30', question: '如果我们把诗中的景象换一种方式描述，你会怎么说？', fourMat: '若何--变化型', bloom: '创造', studentAnswer: '', teacherFeedback: '' },
          { time: '00:21:10', question: '学习古诗对我们有什么帮助？请举例说明。', fourMat: '为何--原理型', bloom: '评价', studentAnswer: '可以让我们了解古代的文化，学习诗人的品格，还能提高写作水平。', teacherFeedback: '评价很全面，看来你收获不少。' },
          { time: '00:23:45', question: '谁能告诉我这首诗一共有几句？每句几个字？', fourMat: '是何--事实型', bloom: '记忆', studentAnswer: '一共四句，每句五个字。', teacherFeedback: '回答正确，这是五言绝句。' },
          { time: '00:26:30', question: '从"白日"到"黄河"，诗人的视线是怎样的？', fourMat: '如何--方法型', bloom: '分析', studentAnswer: '视线是从上往下的，从太阳到黄河。', teacherFeedback: '观察得很仔细，继续分析。' },
          { time: '00:29:15', question: '如果你来写这首诗，你会怎样描写这个场景？', fourMat: '若何--变化型', bloom: '创造', studentAnswer: '', teacherFeedback: '' },
          { time: '00:32:00', question: '"更上一层楼"除了字面意思，还有什么深层含义？', fourMat: '为何--原理型', bloom: '理解', studentAnswer: '还代表着要有更高的追求，不断进步。', teacherFeedback: '理解得非常到位！' },
          { time: '00:35:20', question: '这首诗表达了诗人怎样的情感？', fourMat: '为何--原理型', bloom: '理解', studentAnswer: '表达了诗人想要看得更远、追求更高目标的情感。', teacherFeedback: '很好，抓住了核心情感。' },
          { time: '00:38:50', question: '请大家把这首诗背诵一遍，有没有人愿意试试？', fourMat: '是何--事实型', bloom: '记忆', studentAnswer: '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。', teacherFeedback: '背诵流利，很棒！' },
          { time: '00:42:30', question: '学完这首诗后，你对自己的学习有什么启发？', fourMat: '如何--方法型', bloom: '评价', studentAnswer: '我明白了学习也要像登楼一样，要不断努力，才能看得更远。', teacherFeedback: '能学以致用，非常好！' },
        ]
      },

      // 3.1.2.1 学生思维分析
      studentThinking: {
        analysis: '学生在回答问题时，形象思维体现较为充分，能够通过表象理解诗歌意境；逻辑思维初步体现，但在推理归纳方面还有提升空间。',
        data: {
          '形象思维': { full: 8, partial: 4, none: 1 },
          '逻辑思维': { full: 5, partial: 6, none: 2 },
          '辩证思维': { full: 3, partial: 5, none: 5 },
          '创造思维': { full: 2, partial: 4, none: 7 },
          '元认知思维': { full: 1, partial: 3, none: 9 },
          '系统思维': { full: 2, partial: 5, none: 6 }
        }
      },

      // 3.1.2.2 学生回答分类
      studentAnswers: {
        analysis: '学生回答整体字数偏少，多数回答在10字以内，说明学生参与度有待提高。',
        suggestion: '可设计更多开放性问题，鼓励学生完整表达自己的观点。',
        responseRate: {
          '有应答': 24.14,
          '无应答': 75.86
        },
        wordDistribution: [
          { range: '0-5', count: 12 },
          { range: '6-10', count: 8 },
          { range: '11-15', count: 4 },
          { range: '16-20', count: 2 },
          { range: '21-30', count: 1 },
          { range: '31+', count: 0 }
        ]
      },

      // 3.1.3 教师反馈分析
      teacherFeedback: {
        analysis: '在这节课中，教师的反馈语类型包括评价性反馈、指导性反馈和鼓励性反馈。其中，评价性反馈出现9次，指导性反馈出现21次，鼓励性反馈出现9次。从高频词来看，老师更倾向于给予指导性反馈，能为学生指明学习方向。建议老师均衡使用各种反馈类型，让评价、指导与鼓励相辅相成，更好促进学生成长。',
        suggestion: '建议老师均衡使用各种反馈类型，让评价、指导与鼓励相辅相成，更好促进学生成长。',
        feedbackTypes: [
          { type: '评价性反馈', count: 9, percentage: 23, color: '#3b82f6' },
          { type: '指导性反馈', count: 21, percentage: 55, color: '#10b981' },
          { type: '鼓励性反馈', count: 9, percentage: 22, color: '#f59e0b' }
        ],
        feedbackWords: [
          { text: '不错', weight: 85, level: 1 },
          { text: '嗯', weight: 70, level: 2 },
          { text: '好', weight: 65, level: 2 },
          { text: '请坐', weight: 50, level: 3 },
          { text: '请一位同学', weight: 45, level: 3 },
          { text: '你来说', weight: 40, level: 3 },
          { text: '对', weight: 35, level: 3 },
          { text: '太好了', weight: 30, level: 3 }
        ],
        feedbackExamples: [
          { type: '评价性', content: '"你说的很准确，这就是答案。"' },
          { type: '指导性', content: '"不对，再想想，应该从另一个角度考虑。"' },
          { type: '鼓励性', content: '"非常好，继续加油！"' },
          { type: '评价性', content: '"分析得很到位，可见你下了功夫。"' },
          { type: '指导性', content: '"这个观点有意思，能展开说说吗？"' },
          { type: '鼓励性', content: '"没关系，勇敢说出来，错了也没关系。"' }
        ]
      }
    },

    // Tab: 教学创新 (3.2)
    teachingInnovation: {
      // 精彩提问
      brilliantQuestions: [
        {
          id: 1,
          title: '意象与情感关联',
          timeRange: "6'4\"-9'0\"",
          sparkOpinion: '本环节通过层层递进的问题，引导学生深入理解诗歌意象与情感之间的关系。问题设置由浅入深，有效促进了学生的思维发展。',
          dialogue: [
            { role: 'teacher', text: '同学们，今天我们来学习《春江花月夜》，这首诗被誉为"孤篇盖全唐"，你们知道为什么吗？' },
            { role: 'student', text: '老师，我觉得是因为它的意境特别美。' },
            { role: 'teacher', text: '很好，说说你的理由。' },
            { role: 'student', text: '诗中写了江、花、月、夜四种意象，每一种都很美。' },
            { role: 'teacher', text: '分析得很准确。那这首诗的意象有什么特点呢？' },
            { role: 'student', text: '老师，我觉得意象很丰富，有江水、明月、鲜花、白云等。' },
            { role: 'teacher', text: '很好，还有其他发现吗？' },
            { role: 'student', text: '这些意象组合在一起，构成了一幅完整的春江月夜图。' },
            { role: 'teacher', text: '说得非常好。那这些意象与情感之间有什么关联呢？' },
            { role: 'student', text: '我觉得明月象征着思念，江水象征着时间的流逝。' },
            { role: 'teacher', text: '理解得很深入，能结合诗句具体分析一下吗？' },
            { role: 'student', text: '比如"春江潮水连海平，海上明月共潮生"，写出了明月与潮水一同升起的壮观景象。' },
            { role: 'teacher', text: '分析得很到位，这正是意象与情感完美融合的体现。' }
          ]
        },
        {
          id: 2,
          title: '修辞手法分析',
          timeRange: "12'15\"-15'30\"",
          sparkOpinion: '教师引导学生分析诗歌中的修辞手法，通过具体例子帮助学生理解修辞的表达效果。教学思路清晰，讲解细致。',
          dialogue: [
            { role: 'teacher', text: '请同学们默读诗歌，找出其中运用的修辞手法。' },
            { role: 'student', text: '老师，我找到了对偶，如"春江潮水连海平，海上明月共潮生"。' },
            { role: 'teacher', text: '分析得很准确，还有其他修辞手法吗？' },
            { role: 'student', text: '还有夸张，"江流宛转绕芳甸"的"宛转"用了拟人的手法。' },
            { role: 'teacher', text: '很好，能具体分析一下这些修辞的表达效果吗？' },
            { role: 'student', text: '对偶让诗句读起来朗朗上口，富有节奏感。' },
            { role: 'teacher', text: '那拟人呢？' },
            { role: 'student', text: '拟人让江流具有了人的情感，显得更加生动。' },
            { role: 'teacher', text: '回答得很好，还有同学补充吗？' },
            { role: 'student', text: '老师，我觉得还有互文的手法，如"秦时明月汉时关"。' },
            { role: 'teacher', text: '你真是个细心的同学，这正是互文修辞的典型例子。' },
            { role: 'student', text: '谢谢老师，我会继续努力的。' }
          ]
        },
        {
          id: 3,
          title: '写作手法探究',
          timeRange: "25'10\"-28'45\"",
          sparkOpinion: '本环节引导学生探究诗歌的写作手法，通过对比分析帮助学生理解诗歌的艺术特色。教学层次分明，逻辑性强。',
          dialogue: [
            { role: 'teacher', text: '这首诗的写作手法有什么特点？请同学们分组讨论。' },
            { role: 'student', text: '我们组发现诗中运用了情景交融的手法。' },
            { role: 'teacher', text: '能具体举例说明吗？' },
            { role: 'student', text: '"江畔何人初见月，江月何年初照人"，借月抒发了对人生的思考。' },
            { role: 'teacher', text: '分析得很有深度。其他组有什么发现？' },
            { role: 'student', text: '老师，我们组发现诗中还有动静结合的手法。' },
            { role: 'teacher', text: '很好，请具体说明。' },
            { role: 'student', text: '"江流宛转绕芳甸"是动态描写，"月照花林皆似霰"是静态描写。' },
            { role: 'teacher', text: '观察得很仔细。还有什么手法？' },
            { role: 'student', text: '还有虚实结合，如"白云一片去悠悠"是实写，"青枫浦上不胜愁"是虚写。' },
            { role: 'teacher', text: '同学们的分析都很到位，看来大家对诗歌的理解很深入。' },
            { role: 'student', text: '谢谢老师的引导，让我们学会了多角度分析诗歌。' }
          ]
        }
      ],

      // 精彩情境
      brilliantScenarios: [
        {
          id: 1,
          title: '意境营造与情感共鸣',
          timeRange: "3'0\"-6'0\"",
          sparkOpinion: '教师通过声情并茂的朗读，配合古典音乐，营造出浓郁的诗歌意境。学生在沉浸式体验中自然感受到诗人的情感，达到了"入境生情"的教学效果。',
          dialogue: [
            { role: 'teacher', text: '同学们，请闭上眼睛，我们一起来感受这首诗的意境。' },
            { role: 'student', text: '老师，我好像闻到了江边花的香味。' },
            { role: 'teacher', text: '很好，你已经进入诗境了。还有什么感受？' },
            { role: 'student', text: '我感受到了月光的温柔，还有江水的流淌。' },
            { role: 'teacher', text: '现在请睁开眼睛，看屏幕上的画面。' },
            { role: 'student', text: '哇，好美啊！和诗里写的一模一样。' }
          ]
        },
        {
          id: 2,
          title: '情境角色扮演',
          timeRange: "18'30\"-22'0\"",
          sparkOpinion: '教师设计情境角色扮演活动，让学生化身诗人，以第一人称视角体验诗歌创作背景。这种沉浸式学习方式大大激发了学生的学习兴趣。',
          dialogue: [
            { role: 'teacher', text: '现在我们来做一个角色扮演游戏。假设你就是张若虚，站在江边，看着明月，你会想到什么？' },
            { role: 'student', text: '我会想到时光的流逝，人生短暂。' },
            { role: 'teacher', text: '很好，那你会对明月说什么呢？' },
            { role: 'student', text: '我会问明月：你见证了多少人间的悲欢离合？' },
            { role: 'teacher', text: '多么富有诗意的回答！这就是诗人当时的心境。' },
            { role: 'student', text: '老师，我现在能更好地理解这首诗了。' }
          ]
        }
      ],

      // 技术融合
      techIntegration: [
        {
          id: 1,
          title: '多媒体辅助教学',
          timeRange: "5'20\"-8'15\"",
          sparkOpinion: '教师使用多媒体展示诗歌意境，通过图片和音乐帮助学生直观感受诗歌描绘的画面。技术运用恰当，增强了教学效果。',
          dialogue: [
            { role: 'teacher', text: '请看屏幕上的这幅春江月夜图，你们看到了什么？' },
            { role: 'student', text: '我看到了宽阔的江面和皎洁的月亮。' },
            { role: 'teacher', text: '很好，再仔细观察还有什么？' },
            { role: 'student', text: '还有盛开的花朵和远处的山峦。' },
            { role: 'teacher', text: '现在让我们来听一段古筝音乐，感受一下诗中的意境。' },
            { role: 'student', text: '老师，音乐很悠扬，我仿佛看到了诗人站在江边。' },
            { role: 'teacher', text: '说得很好，谁能描述一下你想象中的画面？' },
            { role: 'student', text: '我看到月光洒在江面上，波光粼粼，江水缓缓流淌。' },
            { role: 'teacher', text: '画面感很强。那诗人当时是什么心情呢？' },
            { role: 'student', text: '我觉得诗人应该是思念远方的人，心情有些惆怅。' },
            { role: 'teacher', text: '理解得很准确，正是这种淡淡的哀愁让诗歌更具韵味。' },
            { role: 'student', text: '老师，我现在更能理解这首诗的美了。' },
            { role: 'teacher', text: '很好，接下来我们结合诗句深入分析。' }
          ]
        },
        {
          id: 2,
          title: '智慧课堂互动',
          timeRange: "18'0\"-22'30\"",
          sparkOpinion: '教师利用智慧课堂平台进行实时互动，及时了解学生的理解程度。平板答题、随机挑人等功能提高了学生的参与度。',
          dialogue: [
            { role: 'teacher', text: '请同学们拿出平板，完成这道选择题。' },
            { role: 'student', text: '老师，我已经完成了，是C选项。' },
            { role: 'teacher', text: '正确率为78%，看来大部分同学都掌握了。继续下一题。' },
            { role: 'student', text: '老师，这道题有点难，我能和同学讨论一下吗？' },
            { role: 'teacher', text: '可以，同桌之间可以交流一下。' },
            { role: 'student', text: '谢谢老师，我明白了，是A选项。' },
            { role: 'teacher', text: '很好，现在正确率提升到89%了。' },
            { role: 'teacher', text: '接下来随机挑人回答问题。' },
            { role: 'student', text: '老师，被选到了，我很紧张。' },
            { role: 'teacher', text: '没关系，说出你的想法就好。' },
            { role: 'student', text: '我觉得颈联写的是诗人对宇宙人生的思考。' },
            { role: 'teacher', text: '回答得很好，你的理解很深刻。' },
            { role: 'student', text: '谢谢老师的鼓励，我会继续努力学习的。' }
          ]
        }
      ],

      // 思维碰撞
      thinkingCollision: [
        {
          id: 1,
          title: '观点讨论与辩论',
          timeRange: "18'30\"-22'10\"",
          sparkOpinion: '本环节组织学生进行小组讨论，鼓励学生表达自己的观点。学生参与度较高，思维碰撞激烈，有效促进了深度学习。',
          dialogue: [
            { role: 'teacher', text: '关于"诗中表达的是思念还是感慨"这个问题，同学们有什么不同的看法？' },
            { role: 'student', text: '老师，我认为主要表达的是思念之情，你看"可怜楼上月徘徊"写的是妻子对丈夫的思念。' },
            { role: 'teacher', text: '有道理，其他同学怎么看？' },
            { role: 'student', text: '我不同意，我觉得是感慨，你看"人生代代无穷已，江月年年望相似"，这是对人生短暂的感慨。' },
            { role: 'teacher', text: '两种观点都有支持者，能说说你们的理由吗？' },
            { role: 'student', text: '从"谁家今夜扁舟子，何处相思明月楼"可以看出是思念。' },
            { role: 'student', text: '但"不知乘月几人归，落月摇情满江树"表达了很多人无法归来的遗憾。' },
            { role: 'teacher', text: '分析得都很有道理，能不能把两者结合起来看？' },
            { role: 'student', text: '老师，我明白了，诗人正是通过对亲人的思念来表达对人生的感慨。' },
            { role: 'teacher', text: '理解得非常透彻，这才是真正读懂了诗歌。' },
            { role: 'student', text: '谢谢老师，通过讨论我对诗歌的理解更深了。' },
            { role: 'teacher', text: '讨论得很好，希望同学们以后多思考、多交流。' }
          ]
        },
        {
          id: 2,
          title: '跨文本比较分析',
          timeRange: "32'0\"-38'20\"",
          sparkOpinion: '教师引导学生将《春江花月夜》与其他咏月诗词进行比较，培养学生的批判性思维能力。通过对比分析，学生更好地理解了本诗的独特之处。',
          dialogue: [
            { role: 'teacher', text: '我们之前学过李白的《静夜思》，，谁能比较一下两首诗的异同？' },
            { role: 'student', text: '老师，两首诗都写了月亮，但《春江花月夜》的月亮更加细腻、柔美。' },
            { role: 'teacher', text: '分析得很好，还有补充吗？' },
            { role: 'student', text: '李白写的是思乡之情，而这首诗表达的情感更加复杂。' },
            { role: 'teacher', text: '具体说说哪里不同？' },
            { role: 'student', text: '《静夜思》比较直接，而《春江花月夜》更加含蓄委婉。' },
            { role: 'teacher', text: '你们观察得很仔细。还有其他角度的比较吗？' },
            { role: 'student', text: '老师，我觉得从意象上看，李白只用了明月，而张若虚用了多个意象。' },
            { role: 'teacher', text: '说得很好，这说明什么问题？' },
            { role: 'student', text: '说明《春江花月夜》的意境更加丰富，内容更加充实。' },
            { role: 'teacher', text: '理解得很到位，这正是我们要学习的地方。' },
            { role: 'student', text: '老师，我现在明白了为什么说"孤篇盖全唐"了。' },
            { role: 'teacher', text: '希望同学们以后读诗也要多比较、多思考。' }
          ]
        }
      ]
    },

    // Tab: 教学设计 (3.3)
    teachingDesign: {
      // 教案文件
      designFile: {
        name: '《春江花月夜》教案.docx',
        status: 'uploaded'
      },

      // 教学目标达成度
      goalAchievement: [
        {
          id: 1,
          title: '知识与技能',
          content: '掌握"白云、扁舟子、明月楼"等意象的含义，理解诗歌"月下之情"的核心内容；掌握虚实结合、以景结情、化虚为实等表现手法。',
          achievement: 85,
          detail: '通过朗读和讨论，学生能够理解诗歌中的意象和表现手法，但在虚实结合的理解上还需深化。',
          activities: '掌握"白云、扁舟子、明月楼"等意象的含义，理解诗歌"月下之情"的核心内容；掌握虚实结合、以景结情、化虚为实等表现手法',
          content_covered: '朗读体悟、小组讨论、师生互动',
          methods: '朗读、讨论、互动',
          suggestion: '建议增加更多实例分析，帮助学生更直观地理解虚实结合的表现手法'
        },
        {
          id: 2,
          title: '过程与方法',
          content: '通过朗读体悟、小组讨论、师生互动，梳理诗歌情感脉络，学会鉴赏诗歌的意象与手法，提升诗歌鉴赏能力。',
          achievement: 75,
          detail: '学生能够通过互动和讨论梳理情感脉络，但在独立鉴赏能力上还需加强。',
          activities: '通过朗读体悟、小组讨论、师生互动，梳理诗歌情感脉络，学会鉴赏诗歌的意象与手法，提升诗歌鉴赏能力',
          content_covered: '朗读体悟、小组讨论、师生互动',
          methods: '朗读、讨论、互动',
          suggestion: '建议设计更多独立鉴赏任务，提升学生的自主分析能力'
        },
        {
          id: 3,
          title: '情感态度与价值观',
          content: '体悟诗歌中游子与思妇的相思之情，理解人类共通的离别之愁与归家之念，感受古典诗歌的意境之美与文化底蕴。',
          achievement: 90,
          detail: '学生能够深刻体悟诗歌中的情感，并理解其文化底蕴，但在意境美的感受上还需更多引导。',
          activities: '体悟诗歌中游子与思妇的相思之情，理解人类共通的离别之愁与归家之念，感受古典诗歌的意境之美与文化底蕴',
          content_covered: '朗读体悟、小组讨论、师生互动',
          methods: '朗读、讨论、互动',
          suggestion: '建议通过多媒体等手段，增强学生对意境美的直观感受'
        }
      ],

      // 教学环节执行度
      phaseExecution: [
        {
          phase: '课堂导入',
          planned: '创设情境',
          actual: '播放音乐',
          matchRate: 95,
          matchDesc: '完全匹配：教学设计中的导入环节与实际教学环节完全一致，包括背诵诗歌、开场问候与回顾旧知，引出本节课学习重点',
          executions: [
            { name: '课程开场与旧知回顾', rate: 95 },
            { name: '新课导入', rate: 95 },
            { name: '文本深入分析', rate: 0 },
            { name: '课程总结与巩固提升', rate: 0 }
          ]
        },
        {
          phase: '探究新知：赏析"月下之情"',
          planned: '意象分析',
          actual: '朗读感知',
          matchRate: 85,
          matchDesc: '部分匹配：教学设计中的探究新知环节在实际教学中得到了较为详细的展开，包括意象分析与情感探究、诗句赏析与意象解读、游子视角',
          executions: [
            { name: '课程开场与旧知回顾', rate: 0 },
            { name: '新课导入', rate: 85 },
            { name: '文本深入分析', rate: 85 },
            { name: '课程总结与巩固提升', rate: 0 }
          ]
        },
        {
          phase: '课堂小结',
          planned: '归纳要点',
          actual: '布置作业',
          matchRate: 75,
          matchDesc: '部分匹配：教学设计中的课堂小结环节在实际教学中有所体现，但实际教学中的总结更为详细，包括月下之景、月下之理和月下之情的总结，以及四幅图的内容',
          executions: [
            { name: '课程开场与旧知回顾', rate: 0 },
            { name: '新课导入', rate: 0 },
            { name: '文本深入分析', rate: 0 },
            { name: '课程总结与巩固提升', rate: 75 }
          ]
        },
        {
          phase: '课堂拓展与作业',
          planned: '听《经典咏流传》',
          actual: '布置作业',
          matchRate: 50,
          matchDesc: '部分匹配：教学设计中的课堂拓展与作业环节在实际教学中有所体现，但实际教学中的拓展部分较为简略，仅提及了听《经典咏流传》中的演唱，未详细展开作业布置',
          executions: [
            { name: '课程开场与旧知回顾', rate: 0 },
            { name: '新课导入', rate: 0 },
            { name: '文本深入分析', rate: 0 },
            { name: '课程总结与巩固提升', rate: 50 }
          ]
        }
      ],

      // 生成性教学内容
      generatedContent: {
        analysis: '本节课生成性教学内容占比约35%，主要体现在典故拓展（如曹植七哀诗）、跨文本关联（次北固山下）、生活化解读（弹棉花类比）等环节，有效提升了课堂开放性和文化厚度。<span class="text-blue-400">建议：1. 可预设更多弹性问题引导生成；2. 对生成的文化典故可做系统性整理形成教学资源库；3. 需注意时间分配，避免拓展影响核心目标达成。</span>',
        sections: [
          {
            name: '课堂导入',
            items: [
              { title: '学生背诵情况反馈', desc: '教师巡视时根据学生背诵情况调整节奏，非预设的个别指导。' },
              { title: '旧知回顾互动', desc: '学生回答哲思部分时，教师临时补充"人类延续无穷"的追问，深化理解。' }
            ]
          },
          {
            name: '探究新知：赏析"月下之情"',
            items: [
              { title: '意象解析延伸', desc: '讲解"不胜愁"时，临时拓展"臣不胜犬马怖惧之情"的文言例句。' },
              { title: '情感共鸣引导', desc: '讨论"谁家""何处"时生成"人类共情"观点，超出预设的意象分析。' },
              { title: '典故即时补充', desc: '分析"月徘徊"时随机引入曹植《七哀诗》典故，未在教案中体现。' },
              { title: '生活化类比', desc: '解释"捣衣砧"时生成"弹棉花"的现代生活类比，增强学生理解。' },
              { title: '跨篇目关联', desc: '讲到鸿雁传书时，临时关联《次北固山下》的"归雁洛阳边"。' }
            ]
          },
          {
            name: '课堂小结',
            items: [
              { title: '情感升华', desc: '总结时补充"家是精神寄托"的价值观引导，超出原定知识梳理目标。' }
            ]
          },
          {
            name: '课堂拓展与作业',
            items: [
              { title: '即兴文化关联', desc: '播放歌曲前生成"湘妃竹"与林黛玉潇湘馆的文学史关联。' }
            ]
          }
        ]
      }
    },

    // Tab: 内容组织 (3.4)
    contentOrganization: {
      // 知识点分析
      knowledgePoints: {
        summary: '本节课共涉及9个知识点，其中5个为教学重点。',
        points: [
          { id: 1, name: '咏物抒怀诗', connotation: '咏物抒怀诗是通过描写自然景物抒发个人情怀的诗歌类型。', timeRange: "20'5\"-20'30\"", activity: '教师引导学生分析《春江花月夜》作为咏物抒怀诗的特点。', teachingContent: '理解咏物抒怀诗的文体特征。', methods: '讲解、归纳总结', errorPoint: '学生可能混淆咏物抒怀诗与其他诗歌类型的区别。' },
          { id: 2, name: '意象', connotation: '意象是诗歌中通过具体形象表达抽象情感的艺术手法，是诗歌情感和意境的重要载体。', timeRange: "13'35\"-16:39\"", activity: '教师引导学生分析诗中出现的意象如白云、青枫浦、扁舟子、明月楼等，并讨论这些意象如何表达情感。', teachingContent: '分析《春江花月夜》中的意象及其象征意义。', methods: '提问引导、小组讨论', errorPoint: '学生可能混淆意象与普通景物描写，或无法准确理解意象的象征意义。' },
          { id: 3, name: '思乡怀人', connotation: '思乡怀人是诗歌中常见的主题，表达对故乡或亲人的思念之情。', timeRange: "15'20\"-18'45\"", activity: '教师引导学生分析诗中游子思妇的思乡怀人之情。', teachingContent: '探讨《春江花月夜》表达的思乡怀人情感。', methods: '提问引导、朗读体会', errorPoint: '学生可能无法深入体会诗歌中的情感内涵。' },
          { id: 4, name: '情景交融', connotation: '情景交融是指诗歌中景物描写与情感表达相互渗透、浑然一体的艺术手法。', timeRange: "18'45\"-21:00\"", activity: '教师引导学生体会诗中景物描写与情感表达的结合，如月光与愁思的交融。', teachingContent: '探讨《春江花月夜》中情景交融的艺术手法。', methods: '讲解、朗读体会', errorPoint: '学生可能难以区分单纯景物描写与情景交融的区别。' },
          { id: 5, name: '象征', connotation: '象征是通过具体形象暗示抽象概念或情感的艺术手法。', timeRange: "21'37\"-24'1\"", activity: '教师引导学生理解诗中月光的象征意义。', teachingContent: '分析《春江花月夜》中象征手法的运用。', methods: '讲解、提问引导', errorPoint: '学生可能难以准确把握象征物与被象征物之间的关系。' },
          { id: 6, name: '虚实结合', connotation: '虚实结合是通过现实与想象的交织来拓展诗歌意境的手法。', timeRange: "24'1\"-24:40\"", activity: '教师引导学生分析"愿逐月华流照君"等虚实相生的表现手法。', teachingContent: '探讨《春江花月夜》中虚实结合的艺术表现。', methods: '讲解、小组讨论', errorPoint: '学生可能混淆虚实描写的界限。' },
          { id: 7, name: '动静结合', connotation: '动静结合是通过静态与动态描写的对比来增强艺术表现力的手法。', timeRange: "25'0\"-26:30\"", activity: '教师引导学生分析诗中"闲潭梦落花"等动静结合的描写手法。', teachingContent: '分析《春江花月夜》中动静结合的表现手法。', methods: '举例分析、提问引导', errorPoint: '学生可能无法准确识别诗中的动静态描写及其作用。' },
          { id: 8, name: '借景抒情', connotation: '借景抒情是通过描写景物来间接表达情感的艺术手法。', timeRange: "26'30\"-28:00\"", activity: '教师引导学生理解诗人如何通过景物描写抒发情感。', teachingContent: '分析《春江花月夜》中借景抒情的表现手法。', methods: '讲解、朗读体会', errorPoint: '学生可能无法准确理解景物与情感的内在联系。' },
          { id: 9, name: '以景结情', connotation: '以景结情是通过景物描写来收束全诗、含蓄表达情感的手法。', timeRange: "28'0\"-30:5\"", activity: '教师引导学生分析"落月摇情满江树"的结尾手法。', teachingContent: '理解以景结情的艺术表现手法。', methods: '讲解、朗读体会', errorPoint: '学生可能无法理解结尾景物描写的深意。' }
        ]
      },

      // 知识点详细内容
      knowledgeDetail: {
        '咏物抒怀诗': {
          definition: '咏物抒怀诗是借事物抒发情怀的诗歌类型，通过对客观事物的描写来表达作者的主观情感。',
          activity: '教师引导学生分析《春江花月夜》中的意象与情感表达',
          content: ['咏物诗的特点', '"物"与"情"的关系', '托物言志的手法'],
          methods: ['讲授法', '对比分析法', '讨论法'],
          errorPoint: '学生易混淆咏物诗与借景抒情的区别',
          audioTime: { current: '2:34', total: '5:12' }
        }
      },

      // 核心素养分析
      coreCompetencies: [
        {
          id: 1,
          name: '语言建构与运用',
          description: '张若虚的《春江花月夜》诗歌文本分析，包括意象、修辞手法（如拟人、用典）、语言节奏和情感表达。',
          methods: '通过朗诵、意象分析、修辞手法讨论和情感体验，引导学生理解诗歌语言的美感和表达技巧。',
          dialogue: [
            '老师引导学生分析"白云一片去悠悠"中的"悠悠"二字，探讨其如何表现白云的缓慢飘动和情感的悠长。',
            '学生通过讨论理解语言如何构建意象和情感。'
          ],
          suggestion: '可以增加学生自主创作环节，让学生模仿诗歌中的意象和修辞手法，创作自己的短诗，进一步巩固语言建构能力。'
        },
        {
          id: 2,
          name: '思维发展与提升',
          description: '诗歌中的哲理思考，如"人生代代无穷已，江月年年望相似"，探讨宇宙永恒与人生短暂的关系。',
          methods: '通过提问和讨论，引导学生从诗歌中提取哲理，进行逻辑思考和抽象思维训练。',
          dialogue: [
            '老师提问："人生代代无穷已，江月年年望相似"表达了怎样的哲理？',
            '学生通过讨论理解人类生命的延续与自然的永恒对比。'
          ],
          suggestion: '可以设计小组辩论活动，围绕"永恒与短暂"的主题展开，提升学生的逻辑思维和辩证能力。'
        },
        {
          id: 3,
          name: '审美鉴赏与创造',
          description: '诗歌中的意象美和意境美，如"春江潮水连海平"的壮阔画面和"落月摇情满江树"的含蓄情感。',
          methods: '通过意象分析、意境想象和情感体验，培养学生的审美感知和创造力。',
          dialogue: [
            '老师引导学生描述"可怜楼上月徘徊"的画面。',
            '学生通过想象和表达，感受月光的拟人化和情感的投射。'
          ],
          suggestion: '可以结合多媒体资源，如播放经典咏流传中的《春江花月夜》演唱，让学生从听觉和视觉多角度感受诗歌的美。'
        },
        {
          id: 4,
          name: '文化传承与理解',
          description: '诗歌中的传统文化元素，如"鸿雁""鱼龙"的典故，以及"碣石潇湘"的地理文化内涵。',
          methods: '通过典故解析和文化背景介绍，帮助学生理解诗歌中的传统文化符号和思想。',
          dialogue: [
            '老师讲解"鸿雁长飞光不度"中鸿雁传书的典故。',
            '学生通过讨论理解古代通信方式和文化象征。'
          ],
          suggestion: '可以组织学生查阅相关历史文献或观看纪录片，深入了解诗歌中的文化背景，增强文化认同感。'
        }
      ]
    }
  },

  // ============================================
  // 课堂实录数据 - 录音原文
  // ============================================
  transcript: [
    { role: 'teacher', startTime: '00:00', text: '同学们好，今天我们继续学习《春江花月夜》。' },
    { role: 'student', startTime: '00:15', text: '老师好！' },
    { role: 'teacher', startTime: '00:20', text: '在上节课结束前，我布置了一个背诵任务，哪位同学能给我们背诵一下？' },
    { role: 'student', startTime: '00:35', text: '（学生背诵）春江潮水连海平，海上明月共潮生...' },
    { role: 'teacher', startTime: '01:10', text: '很好，这位同学背诵得很流利。' },
    { role: 'teacher', startTime: '01:25', text: '我们看到，这首诗的第一句就是"春江潮水连海平，海上明月共潮生"，写得非常壮观。今天我们就来深入分析这首诗。' },
    { role: 'teacher', startTime: '02:00', text: '首先请大家看第三联"鸿雁长飞光不度，鱼龙潜跃水成文"，这里的鸿雁和鱼龙代表了什么意象？' },
    { role: 'student', startTime: '02:30', text: '老师，鸿雁是不是代表书信？因为古人有鸿雁传书的说法。' },
    { role: 'teacher', startTime: '02:45', text: '非常好，你回答得很准确。鸿雁在古代诗歌中确实常常用来指代书信，也象征着思妇对游子的思念。' },
    { role: 'teacher', startTime: '03:15', text: '那么鱼龙呢？大家思考一下。' },
    { role: 'student', startTime: '03:35', text: '鱼龙可能也代表书信的意思，因为鱼也可以传书。' },
    { role: 'teacher', startTime: '03:50', text: '对的，古时有"鱼传尺素"的说法，鱼和鸿雁都是书信的象征。这里诗人用这两个意象，表达的是思妇内心的愁绪和对外出游子的思念。' },
    { role: 'teacher', startTime: '04:30', text: '我们再来看这首诗的结尾"不知乘月几人归，落月摇情满江树"，这一句包含了诗人什么样的情感？' },
    { role: 'student', startTime: '05:00', text: '我觉得这里有一种对游子归来的期盼，也有诗人对人生、对宇宙的思考。' },
    { role: 'teacher', startTime: '05:20', text: '分析得很好。这首诗不仅仅是一首思妇词，诗人张若虚通过春、江、花、月、夜这五种意象，构建了一个深邃的意境，表达了对宇宙人生的哲学思考。' }
  ]
};

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MockData;
}
