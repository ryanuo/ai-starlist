# ai-starlist

自动获取 GitHub Star 项目并用 AI 进行语义分类，输出 Markdown 分类列表。

## 快速开始

1. 安装依赖（推荐 pnpm）

```bash
pnpm install
```

2. 配置 .env

参考 .env.example，填写你的 GitHub Token、用户名、OpenAI Key：

```
GITHUB_TOKEN=ghp_xxx
GITHUB_USERNAME=your_github_username
OPENAI_API_KEY=sk-xxx
```

3. 拉取 Star 项

```bash
pnpm exec tsx cli.ts fetch
```

4. AI 分类

```bash
pnpm exec tsx cli.ts classify
```

5. 导出 Markdown

```bash
pnpm exec tsx cli.ts export
```

## 目录结构

- src/ 主要源码
- data/ 数据缓存与输出
- cli.ts 命令行入口

## 依赖
- axios
- openai
- commander
- dotenv
- fs-extra
- typescript

## License
MIT
