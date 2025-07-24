# ai-starlist

自动获取 GitHub Star 项目并用 AI 进行语义分类，输出 Markdown 分类列表。

## 快速开始

1. 安装依赖（推荐 pnpm）

```bash
pnpm install
```

2. 配置 .env

参考 .env.example，填写你的 GitHub Token、用户名、AI 相关配置：

```ini
GITHUB_TOKEN=ghp_xxx                # GitHub 个人访问令牌，必填
GITHUB_USERNAME=your_github_username # GitHub 用户名，必填

# AI 提供商相关配置（至少填一种，默认 openai）
AI_PROVIDER=openai                  # openai / llama / g4f，默认 openai

# OpenAI 配置
OPENAI_API_KEY=sk-xxx               # OpenAI API Key，AI_PROVIDER=openai 时必填
OPENAI_MODEL=gpt-4.1-mini           # OpenAI 模型，默认 gpt-4.1-mini
OPENAI_BASE_URL=https://api.openai.com/v1 # OpenAI API Base URL，默认官方

# Llama 配置
LLAMA_API_URL=http://localhost:11434/api/generate # Llama API 地址，默认本地
LLAMA_MODEL=llama3                  # Llama 模型，默认 llama3

# g4f 配置
G4F_API_URL=http://localhost:8000   # g4f API 地址，默认本地
G4F_MODEL=gpt-3.5-turbo             # g4f 模型，默认 gpt-3.5-turbo
```

3. 拉取 Star 项

```
