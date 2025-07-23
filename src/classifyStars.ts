import fs from 'fs-extra';
import path from 'path';
import { getConfig } from './config';
import { LlamaProvider } from './aiProviders/llamaProvider';
import { OpenAIProvider } from './aiProviders/openaiProvider';
import type { AIProvider } from './aiProviders/types';

interface StarRepo {
  full_name: string;
  description: string;
  html_url: string;
  [key: string]: any;
}

interface ClassifiedRepo extends StarRepo {
  category: string;
}

function getAIProviderFromConfig(): AIProvider {
  const { aiProvider, openaiApiKey, llamaApiUrl, llamaModel } = getConfig();
  if (aiProvider === 'llama') {
    return new LlamaProvider(llamaApiUrl, llamaModel);
  }
  return new OpenAIProvider(openaiApiKey);
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}

function buildBatchPrompt(batch: StarRepo[]): string {
  let prompt = '/nothink 请为以下 GitHub 项目分配简明分类（如：前端、后端、AI、工具、学习资料等），输出格式为“项目名：分类”\n';
  batch.forEach((repo, idx) => {
    prompt += `${idx + 1}. ${repo.full_name}：${repo.description || ''}\n`;
  });
  prompt += '\n只输出分类结果，每行一个，格式为“项目名：分类”。';
  return prompt;
}

function parseBatchResult(batch: StarRepo[], aiResult: string): string[] {
  // 解析 AI 返回的批量分类结果
  const lines = aiResult.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const map: Record<string, string> = {};
  lines.forEach(line => {
    const m = line.match(/^(.*?)：(.+)$/);
    if (m) {
      map[m[1].trim()] = m[2].trim();
    }
  });
  return batch.map(repo => map[repo.full_name] || '未分类');
}

export async function classifyStars() {
  const rawPath = path.resolve(__dirname, '../data/stars.raw.json');
  const outPath = path.resolve(__dirname, '../data/stars.classified.json');
  const stars: StarRepo[] = await fs.readJson(rawPath);
  const results: ClassifiedRepo[] = [];
  const ai = getAIProviderFromConfig();
  const batches = chunkArray(stars, 50);
  for (const batch of batches) {
    const prompt = buildBatchPrompt(batch);
    const aiResult = await ai.classify(prompt);
    const categories = parseBatchResult(batch, aiResult);
    batch.forEach((repo, i) => {
      results.push({ ...repo, category: categories[i] });
      console.log(`${repo.full_name} => ${categories[i]}`);
    });
  }
  await fs.writeJson(outPath, results, { spaces: 2 });
  return results;
}

if (require.main === module) {
  classifyStars().then(() => console.log('分类结果已保存到 data/stars.classified.json')).catch(console.error);
} 