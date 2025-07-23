export function buildPrompt(text: string): string {
  return `请为以下 GitHub 项目描述分配一个简明的分类（如：前端、后端、AI、工具、学习资料等）：\n"""${text}"""\n分类：`
}
