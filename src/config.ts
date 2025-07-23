import process from 'node:process'
import dotenv from 'dotenv'

dotenv.config()

export interface Config {
  githubToken: string
  githubUsername: string
  openaiApiKey: string
  openaiModel: string
  openaiBaseURL: string
  aiProvider: string
  llamaApiUrl: string
  llamaModel: string
  g4fApiUrl: string
  g4fModel: string
}

export function getConfig(): Config {
  console.log('process.env', process.env)
  const githubToken = process.env.GITHUB_TOKEN || ''
  const githubUsername = process.env.GITHUB_USERNAME || ''
  const aiProvider = process.env.AI_PROVIDER || 'openai'
  // llama
  const llamaApiUrl = process.env.LLAMA_API_URL || 'http://localhost:11434/api/generate'
  const llamaModel = process.env.LLAMA_MODEL || 'llama3'
  // g4f
  const g4fApiUrl = process.env.G4F_API_URL || 'http://localhost:8000'
  const g4fModel = process.env.G4F_MODEL || 'gpt-3.5-turbo'
  // OpenAI
  const openaiApiKey = process.env.OPENAI_API_KEY || ''
  const openaiModel = process.env.OPENAI_MODEL || 'gpt-4.1-mini'
  const openaiBaseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'

  if (!githubToken || !githubUsername) {
    throw new Error('请在 .env 文件中配置 GITHUB_TOKEN、GITHUB_USERNAME')
  }
  if (aiProvider === 'openai' && !openaiApiKey) {
    throw new Error('请在 .env 文件中配置 OPENAI_API_KEY')
  }
  return {
    githubToken,
    githubUsername,
    openaiApiKey,
    aiProvider,
    llamaApiUrl,
    llamaModel,
    g4fApiUrl,
    g4fModel,
    openaiBaseURL,
    openaiModel,
  }
}
