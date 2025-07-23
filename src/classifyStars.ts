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

export async function classifyStars() {
  const rawPath = path.resolve(__dirname, '../data/stars.raw.json');
  const outPath = path.resolve(__dirname, '../data/stars.classified.json');
  const stars: StarRepo[] = await fs.readJson(rawPath);
  const results: ClassifiedRepo[] = [];
  const ai = getAIProviderFromConfig();
  for (const repo of stars) {
    const text = `${repo.full_name}：${repo.description || ''}`;
    const category = await ai.classify(text);
    results.push({ ...repo, category });
    console.log(`${repo.full_name} => ${category}`);
  }
  await fs.writeJson(outPath, results, { spaces: 2 });
  return results;
}

if (require.main === module) {
  classifyStars().then(() => console.log('分类结果已保存到 data/stars.classified.json')).catch(console.error);
} 