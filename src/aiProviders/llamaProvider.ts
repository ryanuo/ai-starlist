import type { AIProvider } from './types'
import axios from 'axios'
import { buildPrompt } from './prompt'

export class LlamaProvider implements AIProvider {
  private apiUrl: string
  private model: string
  constructor(apiUrl: string, model: string) {
    this.apiUrl = apiUrl
    this.model = model
  }

  async classify(text: string): Promise<string> {
    const prompt = buildPrompt(text)
    const res = await axios.post(this.apiUrl, {
      model: this.model,
      prompt,
      stream: false,
    })
    return res.data.response.trim() || '未分类'
  }
}
