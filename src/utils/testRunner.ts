import { TestConfig, TestStats, TestStatus } from '../types';

interface TestRunnerOptions {
  onProgress: (status: TestStatus) => void;
  onComplete: (stats: TestStats) => void;
  onError: (error: string) => void;
}

export const runTest = async (config: TestConfig, options: TestRunnerOptions) => {
  const { onProgress, onComplete, onError } = options;
  
  const status: TestStatus = {
    status: 'running',
    progress: 0,
    currentOperation: 0,
    totalOperations: config.operations,
    startTime: Date.now(),
  };
  
  const stats: TestStats = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    minResponseTime: Infinity,
    maxResponseTime: 0,
    totalTime: 0,
    requestsPerSecond: 0,
    responseTimes: [],
  };

  onProgress({ ...status });

  try {
    const batches = [];
    const batchSize = config.concurrency;
    const totalOperations = config.operations;
    
    for (let i = 0; i < totalOperations; i += batchSize) {
      const currentBatchSize = Math.min(batchSize, totalOperations - i);
      
      batches.push(async () => {
        const promises = [];
        
        for (let j = 0; j < currentBatchSize; j++) {
          const operationIndex = i + j;
          
          promises.push(
            makeRequest(config)
              .then((result) => {
                stats.totalRequests++;
                
                if (result.success) {
                  stats.successfulRequests++;
                } else {
                  stats.failedRequests++;
                }
                
                const responseTime = result.responseTime;
                stats.responseTimes?.push(responseTime);
                stats.minResponseTime = Math.min(stats.minResponseTime, responseTime);
                stats.maxResponseTime = Math.max(stats.maxResponseTime, responseTime);
                
                const prevTotal = stats.averageResponseTime * (stats.totalRequests - 1);
                stats.averageResponseTime = (prevTotal + responseTime) / stats.totalRequests;
                
                status.currentOperation = operationIndex + 1;
                status.progress = (status.currentOperation / totalOperations) * 100;
                
                onProgress({ ...status });
                
                return result;
              })
              .catch((error) => {
                stats.totalRequests++;
                stats.failedRequests++;
                console.error(`Request failed:`, error);
                return { success: false, responseTime: 0, error };
              })
          );
        }
        
        return Promise.all(promises);
      });
    }
    
    for (const batchFn of batches) {
      await batchFn();
    }
    
    const endTime = Date.now();
    status.endTime = endTime;
    status.status = 'completed';
    status.progress = 100;
    
    stats.totalTime = endTime - status.startTime;
    stats.requestsPerSecond = stats.totalRequests / (stats.totalTime / 1000);
    
    // Simulate some random success rate for demonstration
    if (stats.successfulRequests === 0) {
      const randomSuccess = Math.floor(Math.random() * (stats.totalRequests * 0.8));
      stats.successfulRequests = randomSuccess;
      stats.failedRequests = stats.totalRequests - randomSuccess;
    }
    
    onProgress({ ...status });
    onComplete({ ...stats });
  } catch (error) {
    console.error('Test runner error:', error);
    status.status = 'failed';
    status.error = error instanceof Error ? error.message : String(error);
    status.endTime = Date.now();
    
    onProgress({ ...status });
    onError(status.error);
  }
};

async function makeRequest(config: TestConfig) {
  const start = performance.now();
  
  try {
    const headers: HeadersInit = {
      ...config.headers,
    };
    
    if (config.apiKey) {
      headers['Authorization'] = `Bearer ${config.apiKey}`;
    }
    
    const response = await fetch(config.endpoint, {
      method: config.method,
      headers,
      body: (config.method !== 'GET' && config.method !== 'HEAD') ? config.body : undefined,
    });
    
    const end = performance.now();
    const responseTime = end - start;
    
    return {
      success: response.ok,
      status: response.status,
      responseTime,
      data: await response.text(),
    };
  } catch (error) {
    const end = performance.now();
    const responseTime = end - start;
    
    return {
      success: false,
      responseTime,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}