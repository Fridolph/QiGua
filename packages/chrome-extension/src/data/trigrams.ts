export const BRANCH_NAMES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;

export type TrigramMeta = {
  name: string;
  symbol: string;
  element: string;
  nature: string;
};

export const trigrams: Record<number, TrigramMeta> = {
  1: { name: "乾", symbol: "☰", element: "金", nature: "天" },
  2: { name: "兑", symbol: "☱", element: "金", nature: "泽" },
  3: { name: "离", symbol: "☲", element: "火", nature: "火" },
  4: { name: "震", symbol: "☳", element: "木", nature: "雷" },
  5: { name: "巽", symbol: "☴", element: "木", nature: "风" },
  6: { name: "坎", symbol: "☵", element: "水", nature: "水" },
  7: { name: "艮", symbol: "☶", element: "土", nature: "山" },
  8: { name: "坤", symbol: "☷", element: "土", nature: "地" },
};

export type Hexagram = {
  index: number;
  name: string;
  symbol: string;
  upper: number;
  lower: number;
  binary: string;
  semantic: string;
  semantic_en: string;
  description: string;
};

export const hexagrams: Hexagram[] = [
  { index: 1, name: "乾为天", symbol: "䷀", upper: 1, lower: 1, binary: "111111", semantic: "创始", semantic_en: "Init", description: "创始、开端、纯阳之力。适合新项目启动、架构搭建、从零到一。" },
  { index: 2, name: "坤为地", symbol: "䷁", upper: 8, lower: 8, binary: "000000", semantic: "承载", semantic_en: "Carry", description: "承载、包容、厚德载物。适合基础设施搭建、平台建设、底层支撑。" },
  { index: 3, name: "水雷屯", symbol: "䷂", upper: 6, lower: 4, binary: "100010", semantic: "初创", semantic_en: "Start", description: "初生艰难、创业维艰。适合原型验证、MVP 阶段、从混沌中建立秩序。" },
  { index: 4, name: "山水蒙", symbol: "䷃", upper: 7, lower: 6, binary: "010001", semantic: "启蒙", semantic_en: "Enlighten", description: "启蒙开智、教育引导。适合学习研究、文档编写、知识传递。" },
  { index: 5, name: "水天需", symbol: "䷄", upper: 6, lower: 1, binary: "111010", semantic: "等待", semantic_en: "Wait", description: "等待时机、蓄势待发。适合异步处理、轮询机制、延迟加载。" },
  { index: 6, name: "天水讼", symbol: "䷅", upper: 1, lower: 6, binary: "010111", semantic: "争议", semantic_en: "Dispute", description: "争论、诉讼、意见分歧。适合 Code Review、技术讨论、方案辩论。" },
  { index: 7, name: "地水师", symbol: "䷆", upper: 8, lower: 6, binary: "010000", semantic: "动员", semantic_en: "Rally", description: "统兵出征、组织动员。适合团队集结、任务分配、全力上阵。" },
  { index: 8, name: "水地比", symbol: "䷇", upper: 6, lower: 8, binary: "000010", semantic: "协作", semantic_en: "Collab", description: "亲附协作、团结互助。适合结对编程、团队合作、知识共享。" },
  { index: 9, name: "风天小畜", symbol: "䷈", upper: 5, lower: 1, binary: "111011", semantic: "积累", semantic_en: "Save", description: "小有积蓄、逐渐积累。适合缓存策略、缓冲机制、积蓄力量。" },
  { index: 10, name: "天泽履", symbol: "䷉", upper: 1, lower: 2, binary: "110111", semantic: "实践", semantic_en: "Practice", description: "脚踏实地、如履薄冰。适合测试编写、质量保证、步步为营。" },
  { index: 11, name: "地天泰", symbol: "䷊", upper: 8, lower: 1, binary: "111000", semantic: "通畅", semantic_en: "Flow", description: "天地交泰、万事亨通。适合 CI/CD 管道畅通、交付顺利、顺风顺水。" },
  { index: 12, name: "天地否", symbol: "䷋", upper: 1, lower: 8, binary: "000111", semantic: "阻塞", semantic_en: "Block", description: "天地不交、闭塞不通。适合排查瓶颈、解决死锁、梳理阻滞。" },
  { index: 13, name: "天火同人", symbol: "䷌", upper: 1, lower: 3, binary: "101111", semantic: "共识", semantic_en: "Consensus", description: "同心同德、志同道合。适合 RFC 讨论、API 定稿、团队对齐。" },
  { index: 14, name: "火天大有", symbol: "䷍", upper: 3, lower: 1, binary: "111101", semantic: "丰收", semantic_en: "Harvest", description: "大有收获、成果丰硕。适合功能交付、里程碑达成、项目收割。" },
  { index: 15, name: "地山谦", symbol: "䷎", upper: 8, lower: 7, binary: "001000", semantic: "谦逊", semantic_en: "Humble", description: "谦虚退让、低调务实。适合代码极简、去除冗余、保持克制。" },
  { index: 16, name: "雷地豫", symbol: "䷏", upper: 4, lower: 8, binary: "000100", semantic: "预备", semantic_en: "Ready", description: "安乐愉悦、事先预备。适合需求评审、Sprint 规划、蓄势待发。" },
  { index: 17, name: "泽雷随", symbol: "䷐", upper: 2, lower: 4, binary: "100110", semantic: "跟随", semantic_en: "Follow", description: "随从顺应、借力而行。适合依赖注入、适配器模式、跟随主流方案。" },
  { index: 18, name: "山风蛊", symbol: "䷑", upper: 7, lower: 5, binary: "011001", semantic: "修复", semantic_en: "Fix", description: "积弊生虫、拨乱反正。适合 Bug 修复、补丁、代码腐化治理。" },
  { index: 19, name: "地泽临", symbol: "䷒", upper: 8, lower: 2, binary: "110000", semantic: "亲临", semantic_en: "Engage", description: "居高临下、亲自督导。适合代码走查、现场排查、深入一线。" },
  { index: 20, name: "风地观", symbol: "䷓", upper: 5, lower: 8, binary: "000011", semantic: "观察", semantic_en: "Observe", description: "观察审视、洞察本质。适合监控告警、日志分析、数据洞察。" },
  { index: 21, name: "火雷噬嗑", symbol: "䷔", upper: 3, lower: 4, binary: "100101", semantic: "决断", semantic_en: "Decide", description: "咬合决断、明辨是非。适合技术选型、架构决策、利弊权衡。" },
  { index: 22, name: "山火贲", symbol: "䷕", upper: 7, lower: 3, binary: "101001", semantic: "修饰", semantic_en: "Polish", description: "文饰美化、修整外观。适合 UI/UX 打磨、样式优化、体验提升。" },
  { index: 23, name: "山地剥", symbol: "䷖", upper: 7, lower: 8, binary: "000001", semantic: "剥离", semantic_en: "Strip", description: "层层剥落、去除冗余。适合废弃功能、下线模块、清理遗留代码。" },
  { index: 24, name: "地雷复", symbol: "䷗", upper: 8, lower: 4, binary: "100000", semantic: "回归", semantic_en: "Return", description: "一阳来复、回归正轨。适合版本回滚、服务恢复、回归测试。" },
  { index: 25, name: "天雷无妄", symbol: "䷘", upper: 1, lower: 4, binary: "100111", semantic: "纯粹", semantic_en: "Pure", description: "不妄为、纯然真实。适合代码重构、清理杂质、回归本质。" },
  { index: 26, name: "山天大畜", symbol: "䷙", upper: 7, lower: 1, binary: "111001", semantic: "储备", semantic_en: "Store", description: "大积蓄、厚积薄发。适合数据存储、持久化方案、容量规划。" },
  { index: 27, name: "山雷颐", symbol: "䷚", upper: 7, lower: 4, binary: "100001", semantic: "滋养", semantic_en: "Maintain", description: "颐养身心、自我供养。适合技术债偿还、日常维护、持续优化。" },
  { index: 28, name: "泽风大过", symbol: "䷛", upper: 2, lower: 5, binary: "011110", semantic: "过度", semantic_en: "Excess", description: "过犹不及、事态过头。适合排查过度设计、性能过剩、杀鸡用牛刀。" },
  { index: 29, name: "坎为水", symbol: "䷜", upper: 6, lower: 6, binary: "010010", semantic: "险阻", semantic_en: "Danger", description: "重重险阻、如临深渊。适合错误处理、边界条件、防御性编程。" },
  { index: 30, name: "离为火", symbol: "䷝", upper: 3, lower: 3, binary: "101101", semantic: "依附", semantic_en: "Bind", description: "光明依附、借势而行。适合系统集成、第三方 API 对接、平台依附。" },
  { index: 31, name: "泽山咸", symbol: "䷞", upper: 2, lower: 7, binary: "001110", semantic: "感应", semantic_en: "React", description: "感而遂通、相互感应。适合事件驱动架构、Webhook、响应式编程。" },
  { index: 32, name: "雷风恒", symbol: "䷟", upper: 4, lower: 5, binary: "011100", semantic: "持久", semantic_en: "Persist", description: "恒久不变、长期坚持。适合稳定运行、长期维护、持续交付。" },
  { index: 33, name: "天山遁", symbol: "䷠", upper: 1, lower: 7, binary: "001111", semantic: "退避", semantic_en: "Retreat", description: "退避隐让、暂避锋芒。适合 Feature Flag、优雅降级、暂缓发布。" },
  { index: 34, name: "雷天大壮", symbol: "䷡", upper: 4, lower: 1, binary: "111100", semantic: "强盛", semantic_en: "Robust", description: "大而强壮、势不可挡。适合性能优化、高并发处理、系统加固。" },
  { index: 35, name: "火地晋", symbol: "䷢", upper: 3, lower: 8, binary: "000101", semantic: "前进", semantic_en: "Advance", description: "光明上进、步步高升。适合版本迁移、技术升级、渐进演进。" },
  { index: 36, name: "地火明夷", symbol: "䷣", upper: 8, lower: 3, binary: "101000", semantic: "隐忍", semantic_en: "Endure", description: "光明被遮蔽、隐忍待时。适合容错设计、熔断降级、灰度发布。" },
  { index: 37, name: "风火家人", symbol: "䷤", upper: 5, lower: 3, binary: "101011", semantic: "内聚", semantic_en: "Cohere", description: "一家人、内部事务。适合模块拆分、高内聚低耦合、内部治理。" },
  { index: 38, name: "火泽睽", symbol: "䷥", upper: 3, lower: 2, binary: "110101", semantic: "分歧", semantic_en: "Fork", description: "背道而驰、意见不合。适合分支策略、多版本维护、分道扬镳。" },
  { index: 39, name: "水山蹇", symbol: "䷦", upper: 6, lower: 7, binary: "001010", semantic: "艰难", semantic_en: "Hardship", description: "山高水险、举步维艰。适合技术攻坚、疑难 bug、挑战难题。" },
  { index: 40, name: "雷水解", symbol: "䷧", upper: 4, lower: 6, binary: "010100", semantic: "释放", semantic_en: "Deploy", description: "困难解散、如释重负。适合版本发布、上线部署、问题解决。" },
  { index: 41, name: "山泽损", symbol: "䷨", upper: 7, lower: 2, binary: "110001", semantic: "减损", semantic_en: "Reduce", description: "损下益上、减少冗余。适合性能优化、压缩资源、剪枝去冗。" },
  { index: 42, name: "风雷益", symbol: "䷩", upper: 5, lower: 4, binary: "100011", semantic: "增益", semantic_en: "Improve", description: "增益补强、日益增进。适合功能增强、体验提升、锦上添花。" },
  { index: 43, name: "泽天夬", symbol: "䷪", upper: 2, lower: 1, binary: "111110", semantic: "决裂", semantic_en: "Break", description: "决断分离、果敢割舍。适合 Breaking Change、大版本升级、不破不立。" },
  { index: 44, name: "天风姤", symbol: "䷫", upper: 1, lower: 5, binary: "011111", semantic: "邂逅", semantic_en: "Encounter", description: "不期而遇、偶然相逢。适合新依赖引入、技术调研、意外发现。" },
  { index: 45, name: "泽地萃", symbol: "䷬", upper: 2, lower: 8, binary: "000110", semantic: "汇聚", semantic_en: "Aggregate", description: "聚集荟萃、人才济济。适合数据管道、聚合查询、集思广益。" },
  { index: 46, name: "地风升", symbol: "䷭", upper: 8, lower: 5, binary: "011000", semantic: "上升", semantic_en: "Promote", description: "上升晋升、步步高升。适合晋升评审、Stage 部署、层层推进。" },
  { index: 47, name: "泽水困", symbol: "䷮", upper: 2, lower: 6, binary: "010110", semantic: "困境", semantic_en: "Stuck", description: "穷困受困、四面楚歌。适合技术瓶颈、遗留系统困境、举步维艰。" },
  { index: 48, name: "水风井", symbol: "䷯", upper: 6, lower: 5, binary: "011010", semantic: "源泉", semantic_en: "Well", description: "井养不穷、取之不竭。适合开源贡献、工具库建设、基础能力沉淀。" },
  { index: 49, name: "泽火革", symbol: "䷰", upper: 2, lower: 3, binary: "101110", semantic: "变革", semantic_en: "Reform", description: "改革变革、推陈出新。适合架构重写、技术革新、推倒重来。" },
  { index: 50, name: "火风鼎", symbol: "䷱", upper: 3, lower: 5, binary: "011101", semantic: "鼎新", semantic_en: "Establish", description: "鼎立新制、革故鼎新。适合项目初始化、环境搭建、定规立范。" },
  { index: 51, name: "震为雷", symbol: "䷲", upper: 4, lower: 4, binary: "100100", semantic: "震动", semantic_en: "Shock", description: "雷声震动、震惊百里。适合线上故障响应、突发事故、紧急处理。" },
  { index: 52, name: "艮为山", symbol: "䷳", upper: 7, lower: 7, binary: "001001", semantic: "静止", semantic_en: "Still", description: "止而不动、稳重如山。适合功能冻结、稳定版本、以静制动。" },
  { index: 53, name: "风山渐", symbol: "䷴", upper: 5, lower: 7, binary: "001011", semantic: "渐进", semantic_en: "Iterate", description: "循序渐进、稳步前行。适合迭代开发、渐进增强、小步快跑。" },
  { index: 54, name: "雷泽归妹", symbol: "䷵", upper: 4, lower: 2, binary: "110100", semantic: "适配", semantic_en: "Adapt", description: "出嫁随夫、入乡随俗。适合兼容性处理、Polyfill、环境适配。" },
  { index: 55, name: "雷火丰", symbol: "䷶", upper: 4, lower: 3, binary: "101100", semantic: "丰盛", semantic_en: "Full", description: "丰大充盈、盛大繁盛。适合全栈开发、功能完备、盛大交付。" },
  { index: 56, name: "火山旅", symbol: "䷷", upper: 3, lower: 7, binary: "001101", semantic: "漂泊", semantic_en: "Remote", description: "旅居在外、客居他乡。适合远程协作、异步沟通、分布式团队。" },
  { index: 57, name: "巽为风", symbol: "䷸", upper: 5, lower: 5, binary: "011011", semantic: "渗透", semantic_en: "Penetrate", description: "风行草偃、无孔不入。适合深入分析、安全渗透测试、抽丝剥茧。" },
  { index: 58, name: "兑为泽", symbol: "䷹", upper: 2, lower: 2, binary: "110110", semantic: "愉悦", semantic_en: "Delight", description: "喜悦欢欣、和悦相处。适合开发者体验优化、UI 美感打磨、赏心悦目。" },
  { index: 59, name: "风水涣", symbol: "䷺", upper: 5, lower: 6, binary: "010011", semantic: "分发", semantic_en: "Distribute", description: "涣散分离、化整为零。适合 CDN 部署、微服务拆分、分布式架构。" },
  { index: 60, name: "水泽节", symbol: "䷻", upper: 6, lower: 2, binary: "110010", semantic: "节制", semantic_en: "Limit", description: "节制约束、过犹不及。适合限流控制、频率限制、资源配额。" },
  { index: 61, name: "风泽中孚", symbol: "䷼", upper: 5, lower: 2, binary: "110011", semantic: "诚信", semantic_en: "Trust", description: "中心诚信、内外相应。适合安全认证、加密方案、信任体系。" },
  { index: 62, name: "雷山小过", symbol: "䷽", upper: 4, lower: 7, binary: "001100", semantic: "小过", semantic_en: "Patch", description: "稍微过度、小有过失。适合 Hotfix、快速修复、瑕不掩瑜。" },
  { index: 63, name: "水火既济", symbol: "䷾", upper: 6, lower: 3, binary: "101010", semantic: "完成", semantic_en: "Complete", description: "既成已定、大功告成。适合功能交付、里程碑达成、项目完结。" },
  { index: 64, name: "火水未济", symbol: "䷿", upper: 3, lower: 6, binary: "010101", semantic: "未竟", semantic_en: "WIP", description: "事未成、来日方长。适合进行中任务、未完待续、持续迭代。" },
];
