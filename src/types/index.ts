export interface TestConfig {
  apiKey: string;
  operations: number;
  concurrency: number;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers: Record<string, string>;
  body?: string;
}

export interface TestResult {
  id: string;
  timestamp: number;
  config: TestConfig;
  stats: TestStats;
}

export interface TestStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  totalTime: number;
  requestsPerSecond: number;
  responseTimes?: number[]; // Array of response times for charting
}

export interface TestStatus {
  status: 'idle' | 'running' | 'completed' | 'failed';
  progress: number; // 0-100
  currentOperation: number;
  totalOperations: number;
  startTime?: number;
  endTime?: number;
  error?: string;
}