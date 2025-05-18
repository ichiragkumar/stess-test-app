import React, { useState } from 'react';
import { Key, Eye, EyeOff, Copy, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface ApiKeyInputProps {
  apiKey: string;
  onApiKeyChange: (apiKey: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKey, onApiKeyChange }) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateApiKey = async () => {
    setIsGenerating(true);
    try {
      const key = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const { data: ipData } = await fetch('https://api.ipify.org?format=json').then(res => res.json());
      
      const { error } = await supabase
        .from('api_keys')
        .insert([
          {
            key,
            ip_address: ipData.ip,
            expires_at: expiresAt.toISOString(),
          }
        ]);

      if (error) throw error;
      onApiKeyChange(key);
    } catch (error) {
      console.error('Error generating API key:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyApiKey = async () => {
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnSocial = (platform: 'twitter' | 'linkedin') => {
    const text = encodeURIComponent(
      `Just tested my API's performance with this amazing stress testing tool! 🚀\n\nCheck it out and test your APIs too!\n\nThanks @imchiragkumar for this awesome tool! 🙌\n\n#API #Testing #Performance #DevTools`
    );
    const url = encodeURIComponent(window.location.href);

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`,
    };

    window.open(shareUrls[platform], '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
          <Key className="h-5 w-5 mr-2 text-blue-500" />
          API Authentication
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Generate a one-time API key for testing. The key expires after 24 hours.
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type={showApiKey ? 'text' : 'password'}
            value={apiKey}
            readOnly
            placeholder="Generate an API key to start testing"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                      focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            {showApiKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generateApiKey}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
          >
            <Key className="h-4 w-4" />
            <span>{isGenerating ? 'Generating...' : 'Generate API Key'}</span>
          </motion.button>

          {apiKey && (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={copyApiKey}
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Copy className="h-4 w-4" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => shareOnSocial('twitter')}
                className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Share2 className="h-4 w-4" />
                <span>Share on Twitter</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => shareOnSocial('linkedin')}
                className="bg-[#0A66C2] hover:bg-[#094c8f] text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Share2 className="h-4 w-4" />
                <span>Share on LinkedIn</span>
              </motion.button>
            </>
          )}
        </div>
      </div>

      <p className="mt-4 text-xs text-amber-600 dark:text-amber-400">
        Note: Your API key is only valid for 24 hours and can only be used once.
      </p>
    </motion.div>
  );
};

export default ApiKeyInput;