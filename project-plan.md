# RAG 私有知识库项目｜3 个月完整落地执行文档

文档版本：V1.0
适用人员：在职 5 年前端开发
项目定位：AI 应用面试演示项目，调用 LLM 与 Embedding API，**不本地部署大模型、不做模型微调**

## 技术栈

| 层 | 选型 |
| --- | --- |
| 前端 | React 18 + TypeScript + Vite + Ant Design + EventSource |
| 后端 | NestJS + TypeORM + SQLite + Multer + pdf-parse |
| 向量库 | Chroma（轻量内嵌，无需独立服务） |
| AI 服务 | 国内 LLM API、Embedding 向量嵌入 API（豆包 / 通义千问） |
| 部署 | Docker + docker-compose + 轻量云服务器 |

> **开发节奏**：工作日每晚 60~90 分钟，周末整块 2~3 小时
> **核心策略**：主线优先，Java 基础延后至第 3 个月最后一周；所有任务产出可运行代码，拒绝纯理论学习

---

## 仓库目录结构

```
rag-knowledge-web/
├── react-client/             # React 前端项目（Vite + TS + AntD）
│   ├── public/
│   ├── src/
│   │   ├── api/              # 请求封装（SSE、上传、对话接口）
│   │   ├── components/       # 公共组件：聊天框、文档卡片、引用弹窗等
│   │   ├── pages/            # 页面：Chat 对话页、知识库文档管理页
│   │   ├── hooks/            # 自定义 hooks（EventSource 封装、loading 状态等）
│   │   ├── types/            # ts 类型定义
│   │   ├── utils/            # 工具函数
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.development
│   ├── Dockerfile
│   └── package.json
│
├── nest-server/              # NestJS 后端项目
│   ├── src/
│   │   ├── modules/
│   │   │   ├── chat/         # 对话模块：SSE、LLM 调用、RAG 主逻辑
│   │   │   ├── document/     # 文档模块：PDF 上传、解析、存储
│   │   │   └── vector/       # 向量模块：Chroma、Embedding、chunk 检索
│   │   ├── common/           # 公共：拦截器、异常过滤器、工具、常量
│   │   ├── entities/         # TypeORM 实体（Session、Message、Document）
│   │   ├── config/           # 配置文件
│   │   └── main.ts
│   ├── uploads/              # 本地 PDF 文件存储目录（git 忽略）
│   ├── chroma-db/            # Chroma 向量库持久化目录（git 忽略）
│   ├── .env                  # 密钥、接口地址（git 忽略！）
│   ├── Dockerfile
│   └── package.json
│
├── docker/                   # 编排配置
│   └── docker-compose.yml
│
├── docs/                     # 项目文档
│   ├── todo.md               # 每周任务清单
│   ├── error-log.md          # 踩坑日志（面试素材）
│   ├── interview-notes.md    # 面试笔记
│   ├── architecture.md       # 架构图、流程图、技术说明
│   └── rules.md              # 项目开发规则
│
├── .gitignore                # 忽略：node_modules、.env、uploads、chroma-db、sqlite 数据库
├── project-plan.md           # 3 个月项目执行计划（本文件）
└── README.md                 # 项目主页说明、启动步骤、功能介绍
```

### .gitignore 参考内容

```gitignore
# node
node_modules
dist
build

# 密钥和环境变量
.env
.env.local

# 本地文件存储
nest-server/uploads/**
nest-server/chroma-db/**
nest-server/*.sqlite

# IDE
.vscode
.idea
```

---

## 一、文档总述

### 1. 项目简介与业务价值

本项目是一套 Web 端私有 PDF 文档知识库系统，基于 RAG 检索增强生成技术。用户上传 PDF 文档，系统自动解析文档、文本分块、向量化存入向量库；用户提问时，检索文档中相关片段，拼接提示词交给大模型，大模型仅基于私有文档内容回答问题，附带原文引用溯源，减少大模型幻觉。

适合企业内部文档、手册、资料私有问答场景。作为求职项目，重点展示：全栈开发能力、RAG 原理落地、SSE 流式通信、向量检索、Docker 部署。

### 2. 项目目标

**开发目标**
1. V1：网页对话，SSE 流式打字输出，对话会话持久化
2. V2：完整 RAG 链路，PDF 上传解析、分块、向量检索、引用溯源（核心 Demo）
3. V3：系统健壮性优化、Docker 容器打包、公网服务器部署，可在线演示

**求职目标**
1. 投递 AI 应用开发、大模型应用、全栈开发岗位（A 简历）
2. 投递后端为 Java 技术栈团队的 BFF / 前端应用开发岗（B 简历）
3. 面试能够现场演示项目，清晰讲解 RAG、SSE 等技术原理与项目踩坑

### 3. 项目约束范围（范围控制，防止无限延期）

✅ **实现范围**：网页对话、SSE 流式输出、会话持久化、PDF 上传解析、文本分块、Embedding 向量生成、Chroma 向量检索、RAG 问答、引用溯源、异步文档处理、Docker 打包、公网部署

❌ **不实现**（后续有余力再扩展）：Agent 工具调用、图片解析、视频解析、RBAC 权限系统、多租户、分布式架构、本地大模型部署、模型微调

### 4. 最终交付物总览

1. Github 完整项目代码仓库
2. 公网可访问在线 Demo
3. 全套项目文档（架构、启动文档、踩坑记录）
4. 面试笔记、两套求职简历
5. SpringBoot 最小 Demo（协作级 Java 基础）

---

## 二、前置 0 阶段｜准备工作（正式开发前 1~2 天）

目标：初始化环境、仓库、密钥、文档骨架，不写业务代码

1. **本地开发环境准备**
    - Node.js >= 18.16、Git、VSCode、Postman
    - VSCode 插件：ESLint、Prettier、Markdown All in One
2. **Github 仓库初始化**
    - 创建仓库 `rag-knowledge-web`，初始化 README.md
    - 在 docs 目录新建 todo.md、error-log.md、interview-notes.md、architecture.md
3. **API 账号准备**
    - 申请 LLM API，获取 `LLM_API_KEY`
    - 申请 Embedding 向量嵌入 API，获取 `EMBEDDING_API_KEY`
    - 后端创建 `.env` 文件存放密钥，配置 `.gitignore`，**严禁密钥提交到 Github**
4. **项目开发规则**写入 docs/rules.md
    - Bug 攻坚上限 30 分钟，超时记录日志，次日处理
    - 最低保底规则，疲惫日方案，禁止连续断档 3 天
    - 每周日 15 分钟规划本周 3 个可交付任务

✅ **完成标志**：仓库创建完成，开发环境就绪，gitignore 配置完成，密钥本地保存。

---

## 三、第 1 个月｜V1 版本：流式对话 + 会话持久化（无 RAG 检索）

月度目标：跑通前后端流式对话链路，会话消息入库持久化；月末产出可独立演示 AI 对话网页。

### 第 1 周：Nest 后端初始化 + LLM 普通 API 调用

本周目标：创建 Nest 项目，封装大模型普通接口，配置跨域、全局异常过滤器，Postman 调用拿到 LLM 返回文本
> 4 个工作日晚间编码，周末 2~3h 整合调试

**任务清单**
1. Day1：Nest 项目初始化
    - nest new nest-server，安装依赖
    - 生成 chat 模块：nest g module chat，nest g controller chat，nest g service chat
    - main.ts 配置全局 CORS 跨域
2. Day2：环境变量与 HTTP 工具封装
    - 安装 @nestjs/config，配置 .env 读取 LLM 地址、API_KEY
    - 封装 axios 请求工具，编写基础 LLM 调用函数
3. Day3：全局拦截器 & 异常过滤器
    - 全局响应拦截器，统一返回格式 {code, msg, data}
    - 全局 Http 异常过滤器，捕获异常，标准化错误返回
4. Day4：非流式对话接口开发
    - ChatController 创建 POST 接口 `/chat/completion`
    - ChatService 封装 LLM 调用，入参 userMessage，返回完整文本
5. 周末整合调试
    - Postman 测试接口，验证返回结果
    - 增加 class-validator 参数校验，处理超时、非法参数
    - 代码提交 Github，记录踩坑到 error-log.md

**验收标准**
Nest 服务正常启动；Postman 调用接口成功获取大模型文本；全局异常捕获生效。

### 第 2 周：Nest SSE 流式接口开发（面试重点）

本周目标：SSE 服务端推送接口，大模型逐字流式返回，处理客户端断连，避免后台请求堆积

**任务清单**
1. Day1：Nest SSE 基础 Demo
    - 学习 @Sse() 装饰器基础用法，编写简单 SSE 测试接口，手动推送文本片段，Postman 验证
2. Day2：改造 LLM 调用开启 stream 流式返回
    - LLM 请求开启 stream=true，监听返回 chunk 分片
    - 将分片通过 SSE 推送到前端
3. Day3：SSE 连接管理、断连处理
    - 监听客户端 close 事件，终止 LLM 请求，防止内存泄漏
    - 定义消息类型：文本片段、结束标识、异常消息
4. Day4：参数校验 + 请求超时控制
    - 校验消息非空，设置接口超时时间
5. 周末整合调试
    - Postman 订阅 SSE 接口，验证逐字输出；测试中途关闭连接，后台终止请求
    - 抽取 LLM 流式调用为独立 Service 方法，代码重构
    - Github 提交，记录 SSE 踩坑（长连接、内存泄漏，作为面试素材）

**验收标准**
SSE 接口实现逐字返回；客户端断开连接，后台停止 LLM 请求，无请求堆积。

### 第 3 周：React 前端对话页面 + SSE 客户端对接

本周目标：开发对话页面，对接 SSE 接口，实现打字机文本渲染

**任务清单**
1. Day1：React 项目初始化
    - Vite 创建 react-client，TS 模板
    - 安装 antd，配置基础路由，创建 Chat 对话页面
2. Day2：聊天 UI 布局开发
    - 消息列表、底部输入框、发送按钮、loading 状态
    - 用户消息、AI 消息两套样式区分
3. Day3：前端封装 EventSource
    - 封装 EventSource 工具订阅 SSE 接口
    - 处理消息分片拼接、网络断开异常监听
4. Day4：交互逻辑
    - 回车 / 点击发送；发送时禁用输入框
    - 流式文本拼接渲染，实现打字机效果
5. 周末前后端本地联调
    - 本地联调，发送消息，验证逐字展示
    - 修复重复请求、网络异常 UI 提示
    - Github 提交

**验收标准**
页面可提问，AI 逐字打字输出；网络异常页面展示错误提示。

### 第 4 周：SQLite 数据库、会话与消息持久化，V1 整体联调

本周目标：会话、聊天消息入库，支持新建 / 切换会话，V1 版本可完整演示

**任务清单**
1. Day1：ORM 与数据库配置
    - nest-server 安装 TypeORM + sqlite3，配置数据库连接
2. Day2：数据库实体定义
    - Session 实体：id、title、createTime（会话）
    - Message 实体：id、sessionId、role(user/assistant)、content、createTime
    - 自动生成数据表
3. Day3：会话管理接口开发
    - 接口：创建会话、获取会话列表、删除会话
    - 消息保存：用户消息、AI 回答存入数据库
4. Day4：前端会话管理
    - 左侧会话列表；切换会话加载历史消息；新建会话按钮
5. 周末 V1 整体联调 & 文档更新
    - 全流程测试：新建会话、对话、刷新页面查看历史、切换会话
    - Bug 修复，优化 UI 提示
    - 更新 README，描述 V1 功能；踩坑日志更新
    - Github 完整提交

**月末 V1 验收标准**
访问前端页面，新建会话提问，AI 流式回答；刷新页面，历史消息保留。V1 仅对话，无文档上传、知识库检索。

---

## 四、第 2 个月｜V2 版本：完整 RAG 核心链路（面试核心 Demo）

月度目标：PDF 上传、文档解析、文本分块、Embedding 向量生成、Chroma 向量库、相似度检索、RAG 问答链路、引用溯源。月末产出完整私有知识库。

### 第 5 周：文件上传能力 + PDF 文本解析

本周目标：前端上传 PDF；后端接收、存储文件，提取 PDF 纯文本，文档元信息入库

**任务清单**
1. Day1：后端文件上传接口
    - Nest 配置 multer 文件上传，限制文件类型仅 PDF，设置文件大小上限
    - 接收文件，本地磁盘保存，返回 fileId、文件名
2. Day2：PDF 解析服务开发
    - 安装 pdf-parse 库，编写 PDF 解析 Service，提取 PDF 纯文本
    - 捕获异常：损坏 PDF、加密 PDF，返回前端错误
3. Day3：前端知识库管理页面
    - 上传按钮、文档列表；展示文档名称、上传时间；上传 loading、成功 / 失败提示
4. Day4：文档元信息入库
    - 创建 Document 实体：id、fileName、filePath、textContent、createTime
    - 解析完成后，文档信息 + 全文存入 SQLite
5. 周末调试
    - 多 PDF 上传测试，验证文本提取，处理大 PDF 超时问题
    - Github 提交

**验收标准**
前端上传 PDF，后端提取文本，文档信息入库。

### 第 6 周：文本 Chunk 分块 + Embedding 向量化

本周目标：文档文本切分（Chunk，带重叠窗口）；调用 Embedding 接口，文本块转为向量

**任务清单**
1. Day1：文本分块工具函数
    - 分割函数默认配置：块 500 字，重叠 100 字
    - 边界处理：短文档不切割；测试长文档切分结果
2. Day2：Embedding Service 封装
    - 封装 Embedding 接口调用函数，输入文本，返回向量数组
    - 增加超时、限流异常捕获，简单重试逻辑
3. Day3：批量向量化
    - 遍历文档所有 chunk，批量调用 Embedding，生成向量
    - 保存 chunk 原文、向量、documentId 关联关系
4. Day4：分块参数测试
    - 测试多份文档，观察切分效果，微调 chunk 大小
5. 周末端到端测试
    - 链路测试：上传 PDF → 解析文本 → 切分 chunk → 生成向量
    - Github 提交；记录分块策略写入 docs/architecture.md

**验收标准**
文档可切分，每一个文本块成功生成向量。

### 第 7 周：接入 Chroma 向量库，实现相似度检索

本周目标：接入 Chroma 向量库；向量入库；用户提问转向量，检索 TopN 相似片段

**任务清单**
1. Day1：Chroma 初始化封装
    - nest-server 安装 chromadb，初始化客户端，创建向量集合
    - 封装向量库 Service：新增向量、删除向量、相似度检索
2. Day2：Chunk 向量存入 Chroma
    - 将 chunk 原文、向量、documentId 元数据存入向量集合
3. Day3：检索接口开发
    - 用户提问文本调用 Embedding 生成 question 向量
    - 在 Chroma 检索相似度最高的前 3~5 条 chunk 片段
4. Day4：简易前端调试页面
    - 输入问题，展示召回的文档片段，验证检索相关性
5. 周末调优
    - 多问题测试召回效果，调整召回数量
    - Github 提交

**验收标准**
提问能够召回 PDF 内对应的原文片段。

### 第 8 周：串联完整 RAG 链路、Prompt 模板、引用溯源，V2 联调

本周目标：检索结果组装 Prompt 传给 LLM，SSE 流式返回；前端展示引用原文片段，限制大模型只使用参考文档

**任务清单**
1. Day1：RAG 系统提示词模板
    > 系统提示词：你只能使用下面提供的参考文档回答用户问题。如果文档没有相关信息，直接回答"无相关资料"，禁止编造内容。参考文档：{召回片段}，用户问题：{question}
2. Day2：改造对话接口，接入完整 RAG 链路
    - 链路：用户提问 → Embedding 转向量 → 向量库检索 chunk → 拼接 Prompt → LLM 流式调用 → SSE 推送前端
3. Day3：引用溯源功能
    - 后端同步返回检索到的原文片段，随 AI 回答返回前端
    - 前端 AI 回答下方展示【参考文档片段】卡片
4. Day4：边界场景测试
    - 测试问题不在文档内，验证模型不会编造；多文档混合检索测试
5. 周末 V2 完整联调，文档整理
    - 完整流程：上传 PDF → 提问 → AI 基于文档回答，附带原文引用
    - 修复链路 bug，优化错误提示
    - 更新 README，补充 RAG 架构图；整理 RAG 原理笔记至 interview-notes.md
    - Github 完整提交

**月末 V2 验收标准**
完整 RAG 系统可用：上传私有 PDF，提问，AI 基于文档回答，页面展示引用原文片段。项目核心 Demo 完成，可用于面试演示。

---

## 五、第 3 个月｜V3 版本：系统优化、容器化部署、面试材料、简历投递、Java 基础补充

月度目标：提升项目健壮性、公网可访问、整理面试全套材料，最后一周开启 Java 协作级学习

### 第 9 周：异步任务、容错优化、代码重构

本周目标：大文档解析改为后台异步任务；增加文档状态、异常容错；清理冗余代码

**任务清单**
1. Day1：异步任务改造
    - 使用 Nest 异步处理，PDF 解析、向量化改为后台任务
    - 文档状态枚举：处理中 / 成功 / 失败，存入数据库
2. Day2：前端文档状态展示
    - 文件列表增加状态标签；处理中 loading；失败文档支持重新解析
3. Day3：异常容错增强
    - API 限流捕获、重试；链路关键节点日志打印；超时处理
4. Day4：代码重构，抽取公共工具与 Service，清理重复代码
5. 周末回归测试
    - 回归 V1、V2 全部功能，避免重构引入 bug

**验收标准**
大 PDF 上传不会阻塞接口；文档状态正常，失败文档支持重新解析。

### 第 10 周：Docker 打包 + 云服务器公网部署

本周目标：编写 Dockerfile、docker-compose；轻量服务器部署，公网访问 Demo

**任务清单**
1. Day1：编写前端 Dockerfile、后端 Dockerfile
2. Day2：编写 docker-compose.yml 编排前后端，配置 sqlite 持久化
3. Day3：轻量云服务器准备（1 核 2G 即可）
    - 服务器安装 docker、docker-compose；安全组放行端口
4. Day4：服务器部署项目，静态资源、文件存储持久化配置
5. 周末部署调试
    - 处理跨域、文件读写、服务重启问题

**验收标准**
公网地址直接访问整套 RAG 知识库，上传 PDF、问答功能正常；面试可直接打开网页现场演示。

### 第 11 周：完善项目文档 + 全套面试笔记，模拟面试演练

本周目标：完善 Github 文档，整理面试题库，反复口述项目原理

**任务清单**
1. Day1：完善 README.md
    - 项目背景、业务价值、完整架构图、技术选型说明、功能截图
    - 本地启动步骤、部署步骤；项目难点、踩坑与优化方案（面试核心素材）
2. Day2：完善 docs/interview-notes.md
    - 内容见附录 4 目录模板
3. Day3：梳理面试官高频追问，准备应答思路
4. Day4：模拟面试，完整口述整套 RAG 项目
5. 周末反复演练项目演示，撰写简历项目描述文字

**验收标准**
Github 文档完整；面试笔记齐全，可以流畅口述整套项目架构与难点。

### 第 12 周：简历重构、投递简历 + Java 支线最小学习启动

> 主线项目不再新增功能，仅修复 Bug；开启 Java 协作级最小学习，**不重写 RAG 项目**

**任务清单**
1. 前 3 天：简历优化，两套简历
    - A 简历（AI 应用岗）：重点突出 React + Nest + RAG 项目
    - B 简历（Java 栈团队，BFF / 前端应用岗）：弱化 Nest，突出后端思维、接口协作能力
    - 作品集链接：Github 仓库 + 公网 Demo 地址
2. 中间 3 天：投递简历，跟进面试；面试问题持续补充到面试笔记
3. 周末：Java 最小协作级学习（仅学习以下范围，不深入复杂中间件）
    - SpringBoot 项目基础结构，Controller / Service / Repository 职责
    - 实体类、MyBatis 基础 CRUD，数据库事务概念
    - 最小 Demo：实现文件上传接口 + 查询接口
    - 通用后端概念：日志、全局异常、参数校验

**第 3 个月整体交付验收**
1. 公网可访问 RAG 知识库 Demo
2. Github 完整项目，全套项目文档
3. 两套简历 + 完整面试笔记
4. SpringBoot 最小 Demo，具备和 Java 后端协作沟通的基础认知

---

## 六、附录

### 附录 1｜每周固定执行流程模板（每周周日 15 分钟）

1. 写下本周 3 个可交付代码任务（禁止写"学习 RAG 理论"这类模糊目标）
2. 预估每个任务耗时
3. 回顾上周 error-log，查看遗留 bug，判断是否需要修复

> 每日学习规则
- 正常日：60~90 分钟，开发代码
- 疲惫降级日：25 分钟，仅阅读文档、梳理 todo、写笔记，不新增代码
- Bug 卡死超过 30 分钟：记录到 error-log.md，停止，次日再处理

### 附录 2｜禁止新增功能清单（范围控制）

❌ 不做：Agent 工具调用、图片解析、视频解析、用户权限系统、多租户、分布式部署、本地大模型部署、模型微调
✅ 上述功能在 RAG 核心项目完成，拿到面试机会后，有余力再作为扩展功能开发

### 附录 3｜交付物汇总表

| 阶段 | 交付物 |
| --- | --- |
| 0 阶段 | Github 仓库、开发环境、基础文档模板 |
| 第 1 月末 | V1：网页流式对话，会话历史持久化 |
| 第 2 月末 | V2：完整 RAG 知识库，PDF 上传、检索、问答 + 引用溯源（核心面试 Demo） |
| 第 3 月末 | V3：异步任务优化、Docker、公网部署、全套面试笔记、两套简历、SpringBoot 最小 Demo |

### 附录 4｜面试笔记目录模板（docs/interview-notes.md）

1. 项目整体介绍（1 分钟简短口述，3 分钟详细口述）
2. 技术选型理由：Nest、Chroma、SSE 选型理由
3. RAG 完整链路原理
4. Chunk 分块策略、重叠窗口的作用
5. Embedding 与向量检索原理
6. 大模型幻觉问题，RAG 缓解手段
7. SSE 流式实现，断线处理、长连接风险
8. 项目遇到的问题 & 解决方案（面试官重点提问）
9. 项目瓶颈，可优化方向
10. Java 基础知识点（第 12 周补充）

### 附录 5｜风险清单 & 应对预案

| 风险 | 应对方案 |
| --- | --- |
| LLM / Embedding 接口限流、收费超支 | 本地缓存测试文本，测试阶段减少批量向量化调用；设置接口重试与请求频率限制 |
| Chroma 向量库大数据量性能下降 | 本项目为演示项目，文档量控制；面试主动说明生产环境可替换 Milvus / PGVector |
| 开发时间不足，进度滞后 | 砍掉额外美化功能，优先保证核心链路可用；启用疲惫降级方案，不中断习惯 |
| 部署服务器不稳定 | 轻量服务器仅面试演示使用，本地保留完整可用版本 |

### 附录 6｜面试应答预备要点（技术选型、Nest vs Java、项目难点）

1. **为什么选择 Nest 而不是 Java？**
   > 我是前端背景，TS 技术栈熟练，Nest 可以快速独立完成整套 AI 应用 Demo，聚焦 RAG 业务链路验证。同时我学习 SpringBoot 基础，理解 Java 后端开发思想。入职 Java 栈团队，我可以负责 BFF 层、AI 交互模块，和后端同学协同开发。
2. **为什么选用 Chroma？**
   > 项目为演示项目，Chroma 内嵌无需额外服务，开箱即用，开发简单；生产环境可以替换为 Milvus、PGVector 等向量数据库。
3. **项目最大难点**：SSE 长连接管理、大文档解析阻塞、分块策略调优，提前准备踩坑故事。
