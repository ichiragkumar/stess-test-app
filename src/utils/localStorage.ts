import { TestConfig, TestResult } from '../types';

const STORAGE_KEYS = {
  CONFIG: 'api-stress-tester-config',
  RESULTS: 'api-stress-tester-results',
};

// Save the test configuration to localStorage
export const saveConfig = (config: TestConfig): void => {
  const configStr = JSON.stringify(config);
  localStorage.setItem(STORAGE_KEYS.CONFIG, configStr);
};

// Load the test configuration from localStorage
export const loadConfig = (): TestConfig | null => {
  const configStr = localStorage.getItem(STORAGE_KEYS.CONFIG);
  if (!configStr) return null;
  
  try {
    return JSON.parse(configStr) as TestConfig;
  } catch (error) {
    console.error('Error parsing stored config:', error);
    return null;
  }
};

// Save a test result to localStorage
export const saveResult = (result: TestResult): void => {
  const results = loadResults();
  results.unshift(result); // Add to the beginning of the array
  
  // Limit to storing the last 20 results
  const limitedResults = results.slice(0, 20);
  
  localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(limitedResults));
};

// Load all test results from localStorage
export const loadResults = (): TestResult[] => {
  const resultsStr = localStorage.getItem(STORAGE_KEYS.RESULTS);
  if (!resultsStr) return [];
  
  try {
    return JSON.parse(resultsStr) as TestResult[];
  } catch (error) {
    console.error('Error parsing stored results:', error);
    return [];
  }
};

// Delete a test result by ID
export const deleteResult = (id: string): void => {
  const results = loadResults();
  const updatedResults = results.filter(result => result.id !== id);
  localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(updatedResults));
};

// Export results as JSON file
export const exportResults = (results: TestResult[]): void => {
  const dataStr = JSON.stringify(results, null, 2);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
  
  const exportDate = new Date().toISOString().split('T')[0];
  const exportFileName = `api-stress-test-results-${exportDate}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileName);
  linkElement.click();
};