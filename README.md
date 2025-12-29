# 远山的密文板占卜小屋

基于游戏《明日方舟》集成战略玩法"探索者的银淞止境"中"密文板"的设定创作的神秘学占卜网站应用。

## 功能特性

- 密文板选择与组合
- 密文板宣告展示
- AI 驱动的占卜师对话
- 神秘的北方冰原界面风格
- 响应式设计（PC + 移动端）

## 技术栈

- React 18
- Vite
- Tailwind CSS
- OpenAI GPT-4o-mini

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并配置：

```env
VITE_AI_API_KEY=your_api_key_here
VITE_AI_BASE_URL=https://api.openai.com/v1
```

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 构建生产版本

```bash
npm run build
```

## 项目结构

```
euskal/
├── src/
│   ├── components/       # React 组件
│   │   ├── Dialog/      # 对话模块
│   │   ├── FoldartalSelection/  # 密文板选择
│   │   ├── FoldartalDeclaration/ # 密文板宣告
│   │   └── Menu/        # 菜单系统
│   ├── data/            # 数据文件
│   │   ├── foldartals.ts  # 密文板数据
│   │   └── flairs.ts     # 修辞数据
│   ├── services/        # 服务层
│   │   └── aiService.ts  # AI 服务
│   ├── types/           # 类型定义
│   │   └── foldartal.ts
│   ├── utils/           # 工具函数
│   │   ├── foldartalLogic.ts  # 密文板逻辑
│   │   └── prompts.ts         # AI 提示词
│   ├── App.tsx          # 主应用
│   ├── main.tsx         # 入口文件
│   └── index.css       # 样式文件
├── public/             # 静态资源
│   ├── asset/           # 图片资源
│   └── fonts/          # 字体文件
├── package.json
├── vite.config.js
├── tailwind.config.js
└── tsconfig.json
```

## 使用说明

1. 输入您的称呼
2. 选择布局密文板（艾塔布局）
3. 选择本因密文板（法玛谋篇）
4. 查看密文板宣告
5. 与占卜师远山进行对话

## 密文板规则

- 世相类密文板只能与世相类密文板组合
- 同类型密文板组合时触发协语
- 世相类密文板无价值，不可回购

## 字体

项目使用萨米文字字体（FarNorthRunes），字体文件需从以下位置获取：

https://prts.sh/wiki/微件:FarNorthRunesFonts

下载后放置在 `public/fonts/` 目录下。

## 版本

v1.0.0

## 许可证

本项目仅供学习交流使用。
