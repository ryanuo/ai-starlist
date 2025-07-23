import dotenv from 'dotenv';
dotenv.config();

export interface Config {
  githubToken: string;
  githubUsername: string;
  openaiApiKey: string;
  aiProvider: string;
  llamaApiUrl: string;
  llamaModel: string;
}

export function getConfig(): Config {
  const githubToken = process.env.GITHUB_TOKEN || '';
  const githubUsername = process.env.GITHUB_USERNAME || '';
  const openaiApiKey = process.env.OPENAI_API_KEY || '';
  const aiProvider = process.env.AI_PROVIDER || 'openai';
  const llamaApiUrl = process.env.LLAMA_API_URL || 'http://localhost:11434/api/generate';
  const llamaModel = process.env.LLAMA_MODEL || 'llama3';
  if (!githubToken || !githubUsername) {
    throw new Error('请在 .env 文件中配置 GITHUB_TOKEN、GITHUB_USERNAME');
  }
  if (aiProvider === 'openai' && !openaiApiKey) {
    throw new Error('请在 .env 文件中配置 OPENAI_API_KEY');
  }
  return { githubToken, githubUsername, openaiApiKey, aiProvider, llamaApiUrl, llamaModel };
} 