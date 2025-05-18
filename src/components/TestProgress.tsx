import React from 'react';
import { Loader2 } from 'lucide-react';
import { TestStatus } from '../types';

interface TestProgressProps {
  status: TestStatus;
}

const TestProgress: React.FC<TestProgressProps> = ({ status }) => {
  if (status.status === 'idle') {
    return null;
  }

  const getStatusColor = () => {
    switch (status.status) {
      case 'running':
        return 'bg-blue-600';
      case 'completed':
        return 'bg-green-600';
      case 'failed':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const calculateTimeRemaining = () => {
    if (status.status !== 'running' || !status.startTime) return null;
    
    const elapsedTime = Date.now() - status.startTime;
    const percentComplete = status.progress / 100;
    
    if (percentComplete === 0) return 'Calculating...';
    
    const estimatedTotalTime = elapsedTime / percentComplete;
    const timeRemaining = estimatedTotalTime - elapsedTime;
    
    return formatTime(timeRemaining);
  };

  const timeRemaining = calculateTimeRemaining();
  const elapsedTime = status.startTime ? formatTime(Date.now() - status.startTime) : null;
  const totalTime = status.startTime && status.endTime ? formatTime(status.endTime - status.startTime) : null;

  return (
    <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-4 mb-6 animate-fadeIn">
      <div className="mb-2 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
          {status.status === 'running' && <Loader2 className="h-5 w-5 mr-2 text-blue-500 animate-spin" />}
          {status.status === 'completed' && <span className="h-5 w-5 mr-2 text-green-500">✓</span>}
          {status.status === 'failed' && <span className="h-5 w-5 mr-2 text-red-500">⨯</span>}
          
          Test Progress
          {status.status === 'running' && ' - Running'}
          {status.status === 'completed' && ' - Completed'}
          {status.status === 'failed' && ' - Failed'}
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {status.status === 'running' && timeRemaining && (
            <span>Est. remaining: {timeRemaining}</span>
          )}
          {status.status === 'completed' && totalTime && (
            <span>Total time: {totalTime}</span>
          )}
          {status.status === 'running' && elapsedTime && (
            <span className="ml-4">Elapsed: {elapsedTime}</span>
          )}
        </div>
      </div>

      <div className="relative pt-1">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
          <div
            style={{ width: `${status.progress}%` }}
            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${getStatusColor()}`}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>
            {status.currentOperation} / {status.totalOperations} operations
          </span>
          <span>{Math.round(status.progress)}%</span>
        </div>
      </div>

      {status.error && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 rounded text-red-700 dark:text-red-300 text-sm">
          <strong>Error:</strong> {status.error}
        </div>
      )}
    </div>
  );
};

export default TestProgress;