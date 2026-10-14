# 架构说明（docs/architecture.md）

> 用途：记录项目整体架构、数据流转、关键设计决策，供开发参考和面试讲解。

## 一、整体架构

```
┌─────────────────────────────┐
│  用户前端（react-client）     │
│  React18 + TS + AntD + SSE  │
│  页面：Chat 对话 / 知识库管理 │
└──────────┬──────────────────┘
           │ HTTP / SSE
┌──────────▼──────────────────┐
│  NestJS 后端（nest-server）   │
│  ├─ modules/chat      对话+RAG│
│  ├─ modules/document  文档处理│
│  └─ modules/vector    向量检索│
│  公共：拦截器、异常过滤、日志  │
└─────┬──────────┬───────────┬─┘
      │          │           │
 SQLite       Chroma       上传文件
(会话/消息/    (向量库)     (uploads/)
文档元数据)
      │          │
      └──── LLM API + Embedding API ────┘
```

## 二、核心数据流程

### 流程 A：文档入库（上传时执行，一次性）

```
PDF 上传
  → multer 接收，限制类型/大小，存 uploads/
  → pdf-parse 提取纯文本
  → 文本切分 Chunk（块 500 字，重叠 100 字）
  → 每个 Chunk 调用 Embedding API 转成向量
  → 向量 + 原文 + documentId 存入 Chroma
  → 文档元信息 + 全文存入 SQLite Document 表
```

### 流程 B：RAG 问答（用户提问时执行，实时）

```
用户问题
  → 调用 Embedding 将问题转成向量
  → 在 Chroma 检索相似度最高的 TopN（3~5）个 Chunk 片段
  → 组装系统提示词：
      只使用参考文档回答；无相关信息则说"无相关资料"；禁止编造
      参考文档：{召回片段}，用户问题：{question}
  → 发送给 LLM API（stream=true 流式）
  → 通过 SSE 将回答逐字推送到前端
  → 前端打字机渲染，同时展示引用的原文片段
```

## 三、数据库设计（SQLite）

### Session（会话）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | int PK | 主键 |
| title | text | 会话标题 |
| createTime | datetime | 创建时间 |

### Message（消息）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | int PK | 主键 |
| sessionId | int FK | 所属会话 |
| role | text | user / assistant |
| content | text | 消息内容 |
| createTime | datetime | 创建时间 |

### Document（文档）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | int PK | 主键 |
| fileName | text | 文件名 |
| filePath | text | 本地存储路径 |
| textContent | text | 提取的全文 |
| status | text | 处理中 / 成功 / 失败 |
| createTime | datetime | 创建时间 |

## 四、关键设计决策

1. **SSE 而非 WebSocket**：AI 对话是服务端单向推流，SSE 基于 HTTP、实现简单、自动重连，适合打字机输出
2. **Chroma 而非 Milvus**：演示项目，Chroma 内嵌免部署；生产可替换
3. **TypeORM + SQLite**：文件型数据库免安装服务，开发成本低
4. **模块化分层**：chat / document / vector 模块独立，代码清晰，便于面试讲解
5. **异步文档处理**：大 PDF 解析、向量化放后台，避免阻塞上传接口

## 五、部署架构（第 3 个月）

```
公网用户 → 云服务器（docker-compose）
                ├── react-client 容器（Nginx 托管静态资源）
                ├── nest-server 容器
                │     ├── SQLite（挂载持久化卷）
                │     ├── Chroma（挂载持久化卷）
                │     └── uploads（挂载持久化卷）
                └── 对外暴露 80/443 端口
```
