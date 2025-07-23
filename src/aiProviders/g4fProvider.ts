import type { AIProvider } from './types'
import axios from 'axios'

export class G4FProvider implements AIProvider {
  private apiUrl: string
  private model: string
  constructor(apiUrl: string, model: string) {
    this.apiUrl = apiUrl
    this.model = model
  }

  async classify(text: string): Promise<string> {
    const url = `${this.apiUrl.replace(/\/$/, '')}/g4f/${this.model}`
    const res = await axios.post(url, {
      message: text,
    })
    return (res.data.data || res.data.response || '').trim() || '未分类'
  }
}
