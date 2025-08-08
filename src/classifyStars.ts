import path from 'node:path'
import fs from 'fs-extra'
import { G4FProvider } from './aiProviders/g4fProvider'
import { LlamaProvider } from './aiProviders/llamaProvider'
import { OpenAIProvider } from './aiProviders/openaiProvider'
import { getConfig } from './config'
import { fetchStars } from './fetchStars'

interface StarRepo {
  full_name: string
  description: string
  html_url: string
  category?: string
}

export function parseCSVtoCategoryMap(csvText: string): Map<string, string[]> {
  const categoryMap = new Map<string, string[]>()

  csvText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line)
    .forEach((line) => {
      const [category, project] = line.split(',').map(part => part.trim())
      if (!category || !project)
        return

      if (!categoryMap.has(category)) {
        categoryMap.set(category, [])
      }
      categoryMap.get(category)!.push(project)
    })

  return categoryMap
}

export async function classifyStars() {
  const config = getConfig()
  let provider
  if (config.aiProvider === 'openai') {
    provider = new OpenAIProvider(config.openaiApiKey, config.openaiModel, config.openaiBaseURL)
  }
  else if (config.aiProvider === 'llama') {
    provider = new LlamaProvider(config.llamaApiUrl, config.llamaModel)
  }
  else if (config.aiProvider === 'g4f') {
    provider = new G4FProvider(config.g4fApiUrl, config.g4fModel)
  }
  else {
    throw new Error('未知 AI Provider')
  }

  // 优先读取本地 Star 项目
  const rawPath = path.resolve(__dirname, '../data/stars.raw.json')
  let stars: StarRepo[]
  if (await fs.pathExists(rawPath)) {
    stars = await fs.readJson(rawPath)
  }
  else {
    stars = await fetchStars()
  }

  // 构造分类文本
  const text = stars.map(repo => `${repo.full_name}: ${repo.description}`).join('')
  // AI 分类
  const result = await provider.classify(text)

  // 保存分类结果
  const outPath = path.resolve(__dirname, '../data/stars.classified.json')
  await fs.writeJson(outPath, result, { spaces: 2 })
  console.log('分类结果已保存到 data/stars.classified.json')
  return result
}

if (require.main === module) {
  classifyStars().catch(console.error)
}
