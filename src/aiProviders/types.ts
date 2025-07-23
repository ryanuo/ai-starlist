export interface AIProvider {
  classify: (text: string) => Promise<string>
}
