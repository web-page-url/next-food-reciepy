import { useState, useEffect } from 'react';

type DebugInfo = {
  openrouterKeyAvailable: boolean;
  openrouterKeyLength: number;
  deepseekKeyAvailable: boolean;
  deepseekKeyLength: number;
  currentUrl: string;
  isClientSide: boolean;
};

export default function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    openrouterKeyAvailable: false,
    openrouterKeyLength: 0,
    deepseekKeyAvailable: false,
    deepseekKeyLength: 0,
    currentUrl: '',
    isClientSide: false
  });

  useEffect(() => {
    // Only run in client-side
    if (typeof window !== 'undefined') {
      setDebugInfo({
        openrouterKeyAvailable: !!window.ENV_OPENROUTER_API_KEY,
        openrouterKeyLength: window.ENV_OPENROUTER_API_KEY?.length || 0,
        deepseekKeyAvailable: !!window.ENV_DEEPSEEK_API_KEY,
        deepseekKeyLength: window.ENV_DEEPSEEK_API_KEY?.length || 0,
        currentUrl: window.location.href,
        isClientSide: true
      });
    }
  }, []);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button 
        onClick={togglePanel}
        className="bg-gray-900 text-white px-3 py-2 rounded-md shadow-lg hover:bg-gray-800 transition-colors"
      >
        {isOpen ? 'Hide Debug' : 'Debug Info'}
      </button>
      
      {isOpen && (
        <div className="absolute bottom-12 right-0 bg-white p-4 rounded-md shadow-xl border border-gray-300 w-64 text-xs">
          <h3 className="font-bold mb-2 text-gray-800">API Configuration:</h3>
          <div className="space-y-1">
            <p className="text-gray-700">OpenRouter API Key: 
              <span className={debugInfo.openrouterKeyAvailable ? 'text-green-700 ml-1 font-medium' : 'text-red-700 ml-1 font-medium'}>
                {debugInfo.openrouterKeyAvailable ? `Available (${debugInfo.openrouterKeyLength} chars)` : 'Not set'}
              </span>
            </p>
            <p className="text-gray-700">DeepSeek API Key: 
              <span className={debugInfo.deepseekKeyAvailable ? 'text-green-700 ml-1 font-medium' : 'text-red-700 ml-1 font-medium'}>
                {debugInfo.deepseekKeyAvailable ? `Available (${debugInfo.deepseekKeyLength} chars)` : 'Not set'}
              </span>
            </p>
            <p className="text-gray-700">Current URL: <span className="text-blue-700 font-medium">{debugInfo.currentUrl}</span></p>
            <p className="text-gray-700">Client-side: <span className={debugInfo.isClientSide ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
              {debugInfo.isClientSide ? 'Yes' : 'No'}
            </span></p>

            <div className="mt-3 pt-2 border-t border-gray-200">
              <button 
                onClick={() => {
                  console.log('ENV_OPENROUTER_API_KEY length:', window.ENV_OPENROUTER_API_KEY?.length);
                  console.log('ENV_DEEPSEEK_API_KEY length:', window.ENV_DEEPSEEK_API_KEY?.length);
                  console.log('Current URL:', window.location.href);
                  console.log('Window ENV vars:', Object.keys(window).filter(k => k.startsWith('ENV_')));
                  alert('Debug info logged to console');
                }}
                className="text-blue-700 hover:text-blue-800 text-xs font-medium"
              >
                Log to Console
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 