export function isGeminiApiKeyConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

export function defaultGeminiModel(): string {
  return process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash";
}
