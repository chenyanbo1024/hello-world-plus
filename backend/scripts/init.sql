-- Blog Database Initialization Script
-- Run this script to create the database and tables

CREATE DATABASE IF NOT EXISTS blog_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE blog_db;

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE COMMENT 'URL-friendly identifier',
    title VARCHAR(255) NOT NULL COMMENT 'Article title',
    excerpt TEXT NOT NULL COMMENT 'Short summary for list view',
    content LONGTEXT NOT NULL COMMENT 'Full article content in markdown',
    cover_image VARCHAR(500) DEFAULT NULL COMMENT 'Cover image URL',
    author_name VARCHAR(100) NOT NULL COMMENT 'Author display name',
    author_avatar VARCHAR(500) DEFAULT NULL COMMENT 'Author avatar URL',
    author_bio VARCHAR(500) DEFAULT NULL COMMENT 'Author bio',
    tags JSON DEFAULT NULL COMMENT 'Array of tag strings stored as JSON',
    category VARCHAR(100) DEFAULT 'uncategorized' COMMENT 'Article category',
    reading_time INT UNSIGNED DEFAULT 5 COMMENT 'Estimated reading time in minutes',
    is_published BOOLEAN DEFAULT FALSE COMMENT 'Publication status',
    published_at DATETIME DEFAULT NULL COMMENT 'Publication timestamp',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_slug (slug),
    INDEX idx_is_published (is_published),
    INDEX idx_published_at (published_at),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Blog articles';

-- Insert sample articles
INSERT INTO articles (slug, title, excerpt, content, author_name, author_bio, tags, category, reading_time, is_published, published_at) VALUES
('understanding-transformer-architecture',
 '深入理解 Transformer 架构：从 Attention 到 GPT',
 'Transformer 架构彻底改变了自然语言处理领域。本文从 Self-Attention 机制出发，深入解析 Transformer 的核心原理，并探讨其在 GPT 系列模型中的演进。',
 '# 深入理解 Transformer 架构

Transformer 架构自 2017 年在论文 "Attention Is All You Need" 中提出以来，已经彻底改变了整个深度学习领域。从 BERT 到 GPT-4，几乎所有最先进的语言模型都建立在 Transformer 之上。

## Self-Attention 机制

Self-Attention 是 Transformer 的核心。它允许模型在处理序列时关注到序列中的所有位置，而不仅仅是相邻的位置。

```python
# 简化的 Self-Attention 计算
def self_attention(Q, K, V):
    d_k = Q.shape[-1]
    scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)
    attention_weights = F.softmax(scores, dim=-1)
    return torch.matmul(attention_weights, V)
```

### Query、Key、Value 的直觉理解

可以把 Attention 机制想象成数据库检索：
- **Query (Q)**：你想要查找什么
- **Key (K)**：数据库中每条记录的索引
- **Value (V)**：每条记录的实际内容

## Multi-Head Attention

单一的 Attention 头可能无法捕捉所有类型的依赖关系。Multi-Head Attention 通过并行运行多个 Attention 头，让模型能同时关注不同类型的信息。

## 位置编码 (Positional Encoding)

由于 Transformer 没有循环结构，它需要额外的位置信息来理解序列的顺序。原始论文使用正弦/余弦函数来编码位置信息。

```python
def positional_encoding(seq_len, d_model):
    pe = torch.zeros(seq_len, d_model)
    position = torch.arange(0, seq_len).unsqueeze(1)
    div_term = torch.exp(
        torch.arange(0, d_model, 2) * -(math.log(10000.0) / d_model)
    )
    pe[:, 0::2] = torch.sin(position * div_term)
    pe[:, 1::2] = torch.cos(position * div_term)
    return pe
```

## 从 Transformer 到 GPT

GPT（Generative Pre-trained Transformer）使用了 Transformer 的解码器部分，通过自回归的方式生成文本。它的核心创新在于：

1. **大规模预训练**：在海量文本数据上进行无监督学习
2. **Few-shot Learning**：通过 Prompt Engineering 实现零样本和少样本学习
3. **Scaling Law**：模型规模越大，性能越强

## 总结

Transformer 架构的成功证明了 Attention 机制的强大。随着模型规模的不断增长和训练技术的改进，基于 Transformer 的模型将继续推动 AI 的边界。',
 'Alex Chen',
 'AI 研究者 & 技术博主',
 '["Transformer", "Deep Learning", "NLP", "GPT"]',
 'AI/ML',
 8,
 TRUE,
 '2025-03-15 10:00:00'),

('prompt-engineering-guide',
 'Prompt Engineering 实战指南：让 LLM 输出更精准',
 '掌握 Prompt Engineering 是高效使用大语言模型的关键。本文总结了几种经过验证的 Prompt 设计模式，帮助你在实际项目中获得更好的模型输出。',
 '# Prompt Engineering 实战指南

Prompt Engineering 是与大型语言模型交互的艺术和科学。好的 Prompt 可以显著提升模型的输出质量。

## 基础原则

### 1. 明确指令

最基本的原则是给模型清晰、具体的指令。

**不好的 Prompt：**
> 写一篇文章关于 AI

**好的 Prompt：**
> 请用中文写一篇 500 字的技术文章，主题是 RAG（检索增强生成）在企业中的应用。文章应该面向有 2-3 年经验的开发者，包含至少 2 个实际案例。

### 2. 分步骤思考（Chain-of-Thought）

让模型逐步推理，而不是直接给出答案。

```
请按以下步骤分析这个问题：
1. 首先，识别问题的关键约束条件
2. 然后，列出所有可能的解决方案
3. 接着，对每个方案进行优缺点分析
4. 最后，给出你的推荐方案和理由
```

## 高级技巧

### Few-Shot Learning

通过提供示例来引导模型的输出格式：

```
请按照以下格式提取信息：

输入：苹果公司发布了一款新的 MacBook Pro，售价 14999 元
输出：{"品牌": "Apple", "产品": "MacBook Pro", "价格": 14999, "货币": "CNY"}

输入：特斯拉 Model 3 在中国降价至 23 万元
输出：
```

### 角色设定（System Prompt）

通过设定角色来约束模型的行为：

```
你是一位有 10 年经验的资深后端工程师，擅长系统设计和性能优化。
在回答问题时，请：
- 使用专业但易懂的语言
- 提供具体的代码示例
- 考虑生产环境的最佳实践
```

## RAG（检索增强生成）

RAG 是将外部知识库与 LLM 结合的强大模式。它的核心流程是：

1. **检索**：根据用户查询，从知识库中检索相关文档
2. **增强**：将检索到的文档作为上下文注入 Prompt
3. **生成**：LLM 基于增强的上下文生成回答

## 总结

Prompt Engineering 是一项需要不断实践的技能。随着你与 LLM 的交互经验增加，你会发展出更直觉的 Prompt 设计能力。',
 'Alex Chen',
 'AI 研究者 & 技术博主',
 '["Prompt Engineering", "LLM", "RAG"]',
 'AI/ML',
 6,
 TRUE,
 '2025-03-20 14:30:00'),

('building-rag-system-with-langchain',
 '使用 LangChain 构建企业级 RAG 系统',
 'RAG 系统是当前 LLM 应用落地的最热门方向之一。本文将手把手教你使用 LangChain 构建一个完整的企业级 RAG 系统，包括文档处理、向量存储和检索优化。',
 '# 使用 LangChain 构建企业级 RAG 系统

在企业环境中，LLM 的最大挑战之一是它无法访问企业的私有数据。RAG（Retrieval-Augmented Generation）通过将检索系统与语言模型结合，优雅地解决了这个问题。

## 系统架构

一个典型的 RAG 系统包含以下组件：

```
用户查询 → Query 改写 → 向量检索 → 上下文重排 → Prompt 组装 → LLM 生成 → 回答
```

## 文档处理流水线

### 文档加载与切分

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader

# 加载 PDF 文档
loader = PyPDFLoader("enterprise_docs.pdf")
documents = loader.load()

# 递归切分
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    separators=["\\n\\n", "\\n", "。", "！", "？", "；", " ", ""]
)
chunks = text_splitter.split_documents(documents)
```

### 向量化与存储

```python
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./chroma_db"
)
```

## 检索优化策略

### 1. 混合检索

结合关键词检索（BM25）和语义检索（向量相似度），提高召回率。

### 2. 重排序（Re-ranking）

使用 Cross-Encoder 对初检结果进行精排：

```python
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import CrossEncoderReranker

compressor = CrossEncoderReranker(model_name="cross-encoder/ms-marco-MiniLM-L-6-v2")
compression_retriever = ContextualCompressionRetriever(
    base_compressor=compressor,
    base_retriever=vectorstore.as_retriever(search_kwargs={"k": 10})
)
```

### 3. 查询改写

使用 LLM 将用户的自然语言查询改写为更适合检索的形式。

## 总结

构建一个高质量的 RAG 系统需要在文档处理、检索策略和 Prompt 设计三个层面持续优化。LangChain 提供了丰富的工具链，让开发者可以快速搭建原型并逐步迭代。',
 'Alex Chen',
 'AI 研究者 & 技术博主',
 '["RAG", "LangChain", "LLM", "Vector Database"]',
 'AI/ML',
 10,
 TRUE,
 '2025-04-01 09:00:00'),

('fine-tuning-llm-with-lora',
 'LoRA 微调大模型：低成本定制你的专属 LLM',
 '全参数微调一个 7B 模型需要数十万 GPU 小时。LoRA 通过冻结原模型参数、只训练低秩适配器，将微调成本降低 90% 以上。本文详解 LoRA 原理和实战。',
 '# LoRA 微调大模型

随着开源 LLM 的快速发展，越来越多的团队希望在大模型基础上进行定制化微调。然而，全参数微调（Full Fine-tuning）需要巨大的计算资源。LoRA（Low-Rank Adaptation）提供了一种高效的替代方案。

## LoRA 的核心思想

LoRA 的核心洞察是：预训练模型在微调时，参数的变化量具有**低秩特性**。

数学上，对于预训练权重矩阵 `W₀ ∈ R^(d×k)`，LoRA 将更新表示为：

```
W = W₀ + ΔW = W₀ + BA
```

其中 `B ∈ R^(d×r)`，`A ∈ R^(r×k)`，且 `r << min(d, k)`。

这意味着我们只需要训练 `r × (d + k)` 个参数，而非 `d × k` 个参数。

## 实战：使用 PEFT 库微调

```python
from peft import LoraConfig, get_peft_model
from transformers import AutoModelForCausalLM

# 加载基座模型
model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-2-7b-hf",
    load_in_4bit=True,
    device_map="auto"
)

# 配置 LoRA
lora_config = LoraConfig(
    r=16,  # 低秩维度
    lora_alpha=32,  # 缩放因子
    target_modules=["q_proj", "v_proj"],  # 应用到哪些层
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)

# 应用 LoRA
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()
# 输出: trainable params: 4,194,304 || all params: 6,738,415,616 || trainable%: 0.062%
```

## 参数选择指南

| 参数 | 推荐值 | 说明 |
|------|--------|------|
| r | 8-64 | 任务越复杂，r 越大 |
| alpha | 2×r | 通常设为 r 的 2 倍 |
| target_modules | q_proj, v_proj | 也可以尝试 k_proj, o_proj |
| dropout | 0.05-0.1 | 防止过拟合 |

## 总结

LoRA 让普通开发者也能在消费级 GPU 上微调大型语言模型。结合 QLoRA（量化 + LoRA），你甚至可以在单张 RTX 3090 上微调 7B 参数的模型。',
 'Alex Chen',
 'AI 研究者 & 技术博主',
 '["LoRA", "Fine-tuning", "LLM", "PEFT"]',
 'AI/ML',
 7,
 TRUE,
 '2025-04-10 16:00:00'),

('ai-agent-design-patterns',
 'AI Agent 设计模式：从 ReAct 到多 Agent 协作',
 'AI Agent 是 2025 年最热门的技术方向之一。本文系统梳理了 Agent 的核心设计模式，包括 ReAct、Plan-and-Execute、以及多 Agent 协作框架。',
 '# AI Agent 设计模式

AI Agent 是指能够自主感知环境、做出决策并执行动作的 AI 系统。与传统的 LLM 问答不同，Agent 强调**自主性**和**工具使用**能力。

## ReAct 模式

ReAct（Reasoning + Acting）是最经典的 Agent 设计模式。它让 LLM 交替进行推理和行动：

```
思考：用户想知道北京今天的天气。我需要查询天气 API。
行动：调用 get_weather(city="北京")
观察：北京今天晴，温度 22°C，湿度 45%
思考：我已经获取到天气信息，可以回答用户了。
回答：北京今天天气晴朗，气温 22°C，湿度 45%，适合户外活动。
```

```python
from langchain.agents import create_react_agent

agent = create_react_agent(
    llm=llm,
    tools=[search_tool, calculator_tool, weather_tool],
    prompt=react_prompt_template
)
```

## Plan-and-Execute 模式

对于复杂任务，ReAct 的逐步推理可能效率不高。Plan-and-Execute 模式先将任务分解为计划，再逐步执行：

1. **规划阶段**：LLM 生成完整的执行计划
2. **执行阶段**：按计划逐步执行每个步骤
3. **重规划**：如果某个步骤失败，重新调整计划

## 多 Agent 协作

### 基于角色的分工

```
┌─────────────┐
│  Coordinator │ ← 接收用户请求，分配任务
└──────┬──────┘
       │
  ┌────┴────┬─────────┐
  ▼         ▼         ▼
┌───┐   ┌───┐   ┌────────┐
│Research│ │Coder│  │Reviewer│
│Agent  │ │Agent│  │Agent  │
└──────┘ └───┘   └────────┘
```

### AutoGen 框架

```python
from autogen import AssistantAgent, UserProxyAgent

researcher = AssistantAgent(
    "researcher",
    system_message="你是一个研究助手，负责收集和分析信息。",
    llm_config=llm_config
)

coder = AssistantAgent(
    "coder",
    system_message="你是一个程序员，负责编写和调试代码。",
    llm_config=llm_config
)

# Agent 之间的对话会自动进行
user_proxy.initiate_chat(
    researcher,
    message="帮我写一个网页爬虫来收集 AI 新闻"
)
```

## 总结

AI Agent 正在从实验室走向生产环境。选择合适的设计模式取决于任务的复杂度和可靠性要求。对于简单任务，ReAct 就够了；对于复杂工作流，Plan-and-Execute 或多 Agent 协作更为合适。',
 'Alex Chen',
 'AI 研究者 & 技术博主',
 '["AI Agent", "ReAct", "Multi-Agent", "LangChain"]',
 'AI/ML',
 9,
 TRUE,
 '2025-04-15 11:00:00');
