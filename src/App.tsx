import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, Trophy, Clock, Shield } from 'lucide-react';
import Header from './components/Header';
import ApiKeyInput from './components/ApiKeyInput';
import TestConfigForm from './components/TestConfigForm';
import TestProgress from './components/TestProgress';
import TestResults from './components/TestResults';
import TestHistory from './components/TestHistory';
import Leaderboard from './components/Leaderboard';
import { TestConfig, TestStats, TestStatus, TestResult } from './types';
import { runTest } from './utils/testRunner';
import { saveConfig, loadConfig, saveResult, loadResults, deleteResult, exportResults } from './utils/localStorage';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function App() {
  const [showTester, setShowTester] = useState(false);
  const [config, setConfig] = useState<TestConfig>({
    apiKey: '',
    operations: 100,
    concurrency: 10,
    endpoint: '',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const [testStatus, setTestStatus] = useState<TestStatus>({
    status: 'idle',
    progress: 0,
    currentOperation: 0,
    totalOperations: 0,
  });

  const [currentTestStats, setCurrentTestStats] = useState<TestStats | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  useEffect(() => {
    const savedConfig = loadConfig();
    if (savedConfig) {
      setConfig(savedConfig);
    }
    
    const savedResults = loadResults();
    setTestResults(savedResults);
  }, []);

  if (!showTester) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-6">
              API Stress Testing Made Simple
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Test your API's performance, reliability, and scalability with our advanced stress testing platform.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="grid md:grid-cols-3 gap-8 mb-12"
          >
            <div className="bg-gray-800 p-6 rounded-lg">
              <Shield className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Testing</h3>
              <p className="text-gray-400">One-time API key generation with IP validation for secure testing sessions.</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <Clock className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">24-Hour Protection</h3>
              <p className="text-gray-400">Automatic IP blocking after test completion ensures controlled access.</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <Trophy className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Performance Ranking</h3>
              <p className="text-gray-400">Compare your API's performance with others on our global leaderboard.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-center"
          >
            <button
              onClick={() => setShowTester(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg inline-flex items-center transition-colors"
            >
              Start Testing
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 gap-6">
          <ApiKeyInput apiKey={config.apiKey} onApiKeyChange={(apiKey) => {
            const newConfig = { ...config, apiKey };
            setConfig(newConfig);
            saveConfig(newConfig);
          }} />
          
          <TestConfigForm
            config={config}
            onConfigChange={(newConfig) => {
              setConfig(newConfig);
              saveConfig(newConfig);
            }}
            onRunTest={async () => {
              setCurrentTestStats(null);
              setTestStatus({
                status: 'running',
                progress: 0,
                currentOperation: 0,
                totalOperations: config.operations,
              });

              await runTest(config, {
                onProgress: (status) => setTestStatus(status),
                onComplete: async (stats) => {
                  setCurrentTestStats(stats);
                  const result: TestResult = {
                    id: crypto.randomUUID(),
                    timestamp: Date.now(),
                    config: { ...config },
                    stats,
                  };
                  saveResult(result);
                  setTestResults([result, ...testResults]);
                },
                onError: (error) => console.error('Test error:', error),
              });
            }}
            isRunning={testStatus.status === 'running'}
          />
          
          <TestProgress status={testStatus} />
          
          {currentTestStats && (
            <TestResults stats={currentTestStats} onExport={() => {
              if (currentTestStats) {
                const result: TestResult = {
                  id: crypto.randomUUID(),
                  timestamp: Date.now(),
                  config: { ...config },
                  stats: currentTestStats,
                };
                exportResults([result]);
              }
            }} />
          )}
          
          <Leaderboard />
          
          {testResults.length > 0 && (
            <TestHistory
              results={testResults}
              onViewResult={(result) => {
                setCurrentTestStats(result.stats);
                setConfig(result.config);
                saveConfig(result.config);
                setTestStatus({
                  status: 'completed',
                  progress: 100,
                  currentOperation: result.config.operations,
                  totalOperations: result.config.operations,
                });
              }}
              onDeleteResult={(id) => {
                deleteResult(id);
                setTestResults(testResults.filter((result) => result.id !== id));
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;