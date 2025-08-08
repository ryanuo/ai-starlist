import type { AIProvider } from './types'
import axios from 'axios'
import { buildPrompt } from './prompt'

export class OpenAIProvider implements AIProvider {
  private apiKey: string
  private model: string
  private defaultBaseURL: string

  constructor(apiKey: string, model: string, defaultBaseURL: string) {
    this.apiKey = apiKey
    this.model = model
    this.defaultBaseURL = defaultBaseURL
  }

  async classify(text: string): Promise<string> {
    const prompt = buildPrompt(text)
    const res = await axios.post(
      `${this.defaultBaseURL}/v1/chat/completions`,
      {
        model: this.model,
        messages: [
          { role: 'user', content: prompt },
        ],
        temperature: 0.4,
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    )
    return res.data.choices?.[0]?.message?.content?.trim() || '未分类'
  }
}
