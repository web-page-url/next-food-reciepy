import { Html, Head, Main, NextScript } from "next/document";

// Helper function to safely escape strings for JavaScript
function escapeForJS(str?: string): string {
  if (!str) return '';
  
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/</g, '\\u003C')
    .replace(/>/g, '\\u003E')
    .replace(/&/g, '\\u0026');
}

export default function Document() {
  // Access environment variables at render-time
  const deepseekApiKey = process.env.DEEPSEEK_API_KEY || '';
  const openrouterApiKey = process.env.OPENROUTER_API_KEY || '';
  
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased">
        <Main />
        <NextScript />
        
        {/* Expose environment variables to client-side JavaScript */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.ENV_DEEPSEEK_API_KEY = "${escapeForJS(deepseekApiKey)}";
              window.ENV_OPENROUTER_API_KEY = "${escapeForJS(openrouterApiKey)}";
            `,
          }}
        />
      </body>
    </Html>
  );
}
