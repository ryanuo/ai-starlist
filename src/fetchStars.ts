import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import { getConfig } from './config';

export async function fetchStars() {
  const { githubToken, githubUsername } = getConfig();
  let page = 1;
  const perPage = 100;
  let stars: any[] = [];
  while (true) {
    const res = await axios.get(
      `https://api.github.com/users/${githubUsername}/starred`,
      {
        headers: { Authorization: `token ${githubToken}` },
        params: { per_page: perPage, page },
      }
    );
    if (res.data.length === 0) break;
    stars = stars.concat(res.data);
    if (res.data.length < perPage) break;
    page++;
  }
  await fs.ensureDir(path.resolve(__dirname, '../data'));
  await fs.writeJson(path.resolve(__dirname, '../data/stars.raw.json'), stars, { spaces: 2 });
  return stars;
}

if (require.main === module) {
  fetchStars().then(() => console.log('Star 项目已保存到 data/stars.raw.json')).catch(console.error);
} 