// This file contains global TypeScript declarations

// Extend the Window interface to include our environment variables
interface Window {
  ENV_DEEPSEEK_API_KEY?: string;
  ENV_OPENROUTER_API_KEY?: string;
} 