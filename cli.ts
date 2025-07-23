#!/usr/bin/env node
import process from 'node:process'
import { Command } from 'commander'
import { classifyStars } from './src/classifyStars'
import { exportMarkdown } from './src/exportMarkdown'
import { fetchStars } from './src/fetchStars'

const program = new Command()
program.name('ai-starlist').description('AI GitHub Star 分类工具').version('1.0.0')

program
  .command('fetch')
  .description('拉取 GitHub Star 项列表')
  .action(async () => {
    await fetchStars()
  })

program
  .command('classify')
  .description('用 AI 对 Star 项进行分类')
  .action(async () => {
    await classifyStars()
  })

program
  .command('export')
  .description('导出分类结果为 Markdown')
  .action(async () => {
    await exportMarkdown()
  })

program.parseAsync(process.argv)
