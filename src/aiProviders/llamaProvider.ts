import axios from 'axios';
import { AIProvider } from './types';

export class LlamaProvider implements AIProvider {
  private apiUrl: string;
  private model: string;
  constructor(apiUrl: string, model: string) {
    this.apiUrl = apiUrl;
    this.model = model;
  }
  async classify(text: string): Promise<string> {
    const prompt = `请为以下 GitHub 项目描述分配一个简明的分类（如：前端、后端、AI、工具、学习资料等）：\n"""${text}"""\n分类：`;
    const res = await axios.post(this.apiUrl, {
      model: this.model,
      prompt,
      stream: false
    });
    return res.data.response.trim() || '未分类';
  }
} 