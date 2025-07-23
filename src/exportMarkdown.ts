import fs from 'fs-extra';
import path from 'path';

interface ClassifiedRepo {
  full_name: string;
  description: string;
  html_url: string;
  category: string;
  [key: string]: any;
}

export async function exportMarkdown() {
  const inputPath = path.resolve(__dirname, '../data/stars.classified.json');
  const outputPath = path.resolve(__dirname, '../data/STARLIST.md');
  const repos: ClassifiedRepo[] = await fs.readJson(inputPath);
  // 按分类分组
  const grouped: Record<string, ClassifiedRepo[]> = {};
  for (const repo of repos) {
    if (!grouped[repo.category]) grouped[repo.category] = [];
    grouped[repo.category].push(repo);
  }
  // 生成 Markdown
  let md = '# AI StarList 分类列表\n\n';
  for (const category of Object.keys(grouped).sort()) {
    md += `## ${category}\n`;
    for (const repo of grouped[category]) {
      md += `- [${repo.full_name}](${repo.html_url})`;
      if (repo.description) md += `：${repo.description}`;
      md += '\n';
    }
    md += '\n';
  }
  await fs.writeFile(outputPath, md);
  console.log('已导出 Markdown 到 data/STARLIST.md');
  return outputPath;
}

if (require.main === module) {
  exportMarkdown().catch(console.error);
} 