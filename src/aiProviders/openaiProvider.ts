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
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 10,
      temperature: 0,
    })
    return res.choices[0].message.content?.trim() || '未分类'
  }
}
