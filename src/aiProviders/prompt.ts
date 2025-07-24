export function buildPrompt(text: string): string {
  return `请为以下 GitHub 项目描述分配一个简明的分类（如：前端、后端、AI、工具、学习资料等）。\n请严格按照“repo名：分类”格式返回，每行一个项目。例如：foo/bar：工具\n项目列表：\n"""${text}"""\n分类：`
}
