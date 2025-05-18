import React, { useState } from 'react';
import { Settings, Sliders, Globe, Code } from 'lucide-react';
import { TestConfig } from '../types';

interface TestConfigFormProps {
  config: TestConfig;
  onConfigChange: (config: TestConfig) => void;
  onRunTest: () => void;
  isRunning: boolean;
}

const TestConfigForm: React.FC<TestConfigFormProps> = ({
  config,
  onConfigChange,
  onRunTest,
  isRunning,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customHeaders, setCustomHeaders] = useState('');
  const [customBody, setCustomBody] = useState('');

  const handleChange = (name: keyof TestConfig, value: any) => {
    onConfigChange({ ...config, [name]: value });
  };

  const handleHeadersChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomHeaders(e.target.value);
    try {
      const headers = JSON.parse(e.target.value);
      handleChange('headers', headers);
    } catch (error) {
      // Invalid JSON, will use the current headers
    }
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomBody(e.target.value);
    handleChange('body', e.target.value);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-4 mb-6">
      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
          <Settings className="h-5 w-5 mr-2 text-blue-500" />
          Test Configuration
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Configure your API test parameters and operation count.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="endpoint"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            API Endpoint
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              id="endpoint"
              value={config.endpoint}
              onChange={(e) => handleChange('endpoint', e.target.value)}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-white py-2"
              placeholder="https://api.example.com/endpoint"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="method"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            HTTP Method
          </label>
          <select
            id="method"
            value={config.method}
            onChange={(e) => handleChange('method', e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-white"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="operations"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Number of Operations [0-{config.operations}]
          </label>
          <div className="mt-1 flex items-center">
            <input
              type="range"
              id="operations"
              min="1"
              max="1000"
              value={config.operations}
              onChange={(e) => handleChange('operations', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 min-w-[40px]">
              {config.operations}
            </span>
          </div>
        </div>

        <div>
          <label
            htmlFor="concurrency"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Concurrency
          </label>
          <div className="mt-1 flex items-center">
            <input
              type="range"
              id="concurrency"
              min="1"
              max="100"
              value={config.concurrency}
              onChange={(e) => handleChange('concurrency', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 min-w-[40px]">
              {config.concurrency}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-700 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Sliders className="h-4 w-4 mr-1" />
          {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
        </button>
      </div>

      {showAdvanced && (
        <div className="mt-4 grid grid-cols-1 gap-4">
          <div>
            <label
              htmlFor="headers"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Custom Headers (JSON)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Code className="h-4 w-4 text-gray-400" />
              </div>
              <textarea
                id="headers"
                value={customHeaders || JSON.stringify(config.headers, null, 2)}
                onChange={handleHeadersChange}
                rows={4}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-white py-2"
                placeholder='{"Content-Type": "application/json"}'
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Enter headers as valid JSON object.
            </p>
          </div>

          {(config.method === 'POST' || config.method === 'PUT' || config.method === 'PATCH') && (
            <div>
              <label
                htmlFor="body"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Request Body
              </label>
              <textarea
                id="body"
                value={customBody || config.body || ''}
                onChange={handleBodyChange}
                rows={4}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-white py-2"
                placeholder='{"key": "value"}'
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Enter request body (usually JSON).
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mt-6">
        <button
          type="button"
          onClick={onRunTest}
          disabled={isRunning || !config.endpoint}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
            ${
              isRunning || !config.endpoint
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
        >
          {isRunning ? 'Test Running...' : 'Start Test'}
        </button>
        {!config.endpoint && (
          <p className="mt-2 text-xs text-red-500">Please enter an API endpoint.</p>
        )}
      </div>
    </div>
  );
};

export default TestConfigForm;