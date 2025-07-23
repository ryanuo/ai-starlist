import { OpenAI } from 'openai';
import { AIProvider } from './types';

export class OpenAIProvider implements AIProvider {
  private apiKey: string;
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  async classify(text: string): Promise<string> {
    const openai = new OpenAI({ apiKey: this.apiKey });
    const prompt = `请为以下 GitHub 项目描述分配一个简明的分类（如：前端、后端、AI、工具、学习资料等）：\n"""${text}"""\n分类：`;
    const res = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 10,
      temperature: 0,
    });
    return res.choices[0].message.content?.trim() || '未分类';
  }
} 