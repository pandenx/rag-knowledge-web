# 每周任务清单（docs/todo.md）

> 每周日更新。规则见 `rules.md`：只写**可交付代码任务**，不写模糊的学习目标。
> 勾选 `[x]` 表示完成。

---

## 第 0 阶段：环境与仓库准备（正式开发前 1~2 天）

- [ √ ] 安装 Node >= 18.16、Git、VSCode、Postman，配置插件
- [ √ ] 创建 Github 仓库 `rag-knowledge-web`，初始化 README
- [ √ ] 申请 LLM API、Embedding API，获取 key，配置本地 .env + .gitignore
- [ √ ] 创建 docs 目录下 todo / error-log / interview-notes / architecture 文档

---

## 第 1 个月：V1 流式对话 + 会话持久化

### 第 1 周：Nest 初始化 + LLM 普通调用

- [ ] nest new nest-server，生成 chat 模块，配置 CORS
- [ ] 配置 .env 读取密钥，封装 axios HTTP 工具、LLM 调用函数
- [ ] 全局响应拦截器 + 全局异常过滤器
- [ ] 实现 POST /chat/completion 非流式接口
- [ ] Postman 测试通过，参数校验，Github 提交

### 第 2 周：Nest SSE 流式接口

- [ ] @Sse() 基础 Demo，Postman 验证推送
- [ ] LLM 开启 stream=true，分片经 SSE 推送
- [ ] 客户端断连处理，终止后台请求，防止内存泄漏
- [ ] 参数校验 + 超时控制
- [ ] 抽取流式调用为独立 Service，记录 SSE 踩坑，提交

### 第 3 周：React 前端对话页面

- [ ] Vite 创建 react-client，antd，创建 Chat 页面
- [ ] 聊天 UI：消息列表、输入框、loading
- [ ] 封装 EventSource，处理分片拼接、网络异常
- [ ] 交互逻辑：发送、禁用、打字机渲染
- [ ] 前后端本地联调，验证逐字展示，提交

### 第 4 周：SQLite 持久化 + V1 联调

- [ ] 安装 TypeORM + sqlite3，配置连接
- [ ] Session、Message 实体定义，自动建表
- [ ] 会话接口：创建/列表/删除；消息入库
- [ ] 前端会话列表、切换、新建
- [ ] V1 全流程测试，刷新页面历史保留，更新 README，提交

✅ **V1 月末验收**：网页对话，AI 流式输出，刷新后历史保留。

---

## 第 2 个月：V2 完整 RAG 链路

### 第 5 周：文件上传 + PDF 解析

- [ ] 后端 multer 上传接口，限 PDF 类型 + 大小
- [ ] pdf-parse 解析 Service，捕获损坏/加密异常
- [ ] 前端知识库管理页：上传、文件列表
- [ ] Document 实体，元信息 + 全文入库
- [ ] 多 PDF 测试，处理大文件超时，提交

### 第 6 周：Chunk 分块 + Embedding

- [ ] 分块函数：块 500 字 / 重叠 100 字，边界处理
- [ ] Embedding Service：向量化 + 超时/限流重试
- [ ] 批量向量化，保存 chunk 原文/向量/documentId
- [ ] 分块参数测试，微调
- [ ] 端到端测试：上传→解析→切分→向量化，记录分块策略

### 第 7 周：Chroma + 相似度检索

- [ ] 安装 chromadb，创建集合，封装向量库 Service
- [ ] chunk 向量 + 元数据存入 Chroma
- [ ] 检索接口：问题向量化 → 检索 TopN 片段
- [ ] 简易调试页验证召回
- [ ] 多问题测试召回效果，调优

### 第 8 周：RAG 链路串联 + 引用溯源

- [ ] 设计系统提示词，限制仅用参考文档，禁止编造
- [ ] 改造对话接口：提问→检索→Prompt→LLM→SSE
- [ ] 后端返回原文片段，前端展示引用卡片
- [ ] 边界测试：文档外问题不编造，多文档检索
- [ ] V2 全流程联调，更新 README + 架构图，整理 RAG 笔记

✅ **V2 月末验收**：上传 PDF → 提问 → 基于文档回答 + 引用溯源（核心面试 Demo）。

---

## 第 3 个月：V3 优化、部署、面试

### 第 9 周：异步任务 + 容错重构

- [ ] PDF 解析、向量化改后台异步任务，文档状态枚举
- [ ] 前端文档状态展示，失败可重试
- [ ] 限流捕获、重试、链路日志、超时处理
- [ ] 代码重构，抽取公共 Service
- [ ] 回归 V1、V2 全部功能

### 第 10 周：Docker 部署

- [ ] 编写前后端 Dockerfile
- [ ] docker-compose.yml 编排 + sqlite 持久化
- [ ] 轻量服务器装 docker，安全组放行端口
- [ ] 服务器部署，静态资源、文件存储持久化
- [ ] 处理跨域、文件读写、重启问题；公网可访问

### 第 11 周：文档 + 面试准备

- [ ] 完善 README：架构图、功能截图、启动/部署步骤、难点
- [ ] 整理 interview-notes.md 全部条目
- [ ] 梳理面试官高频追问，准备应答
- [ ] 模拟面试，完整口述项目
- [ ] 演练项目演示，撰写简历项目描述

### 第 12 周：简历投递 + Java 最小学习

- [ ] 优化 A 简历（AI 应用岗）
- [ ] 优化 B 简历（Java 栈团队 BFF 岗）
- [ ] 投递简历，跟进面试，补充面试问题到笔记
- [ ] Java 最小 Demo：SpringBoot 基础 CRUD + 文件上传接口

✅ **第 3 个月整体交付**：公网 Demo + 完整项目 + 两套简历 + 面试笔记 + SpringBoot 最小 Demo。
