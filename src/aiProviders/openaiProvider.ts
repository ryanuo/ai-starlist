import type { AIProvider } from './types'
import { OpenAI } from 'openai'
import { buildPrompt } from './prompt'

export class OpenAIProvider implements AIProvider {
  private apiKey: string
  private g4fModel: string
  private defaultBaseURL: string

  constructor(apiKey: string, g4fModel: string, defaultBaseURL: string) {
    this.apiKey = apiKey
    this.g4fModel = g4fModel
    this.defaultBaseURL = defaultBaseURL
  }

  async classify(text: string): Promise<string> {
    const openai = new OpenAI({ apiKey: this.apiKey, baseURL: this.defaultBaseURL })
    const prompt = buildPrompt(text)
    const res = await openai.chat.completions.create({
      model: this.g4fModel,
      messages: [
        { role: 'system', content: '你是一个优秀的开源项目分类器' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.4,
    })
    console.log('OpenAI 分类结果：', res.choices[0].message.content)
    return res.choices[0].message.content?.trim() || '未分类'
  }
}
