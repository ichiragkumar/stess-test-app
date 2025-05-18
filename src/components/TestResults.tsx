import React from 'react';
import { BarChart3, Download, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { TestStats } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TestResultsProps {
  stats: TestStats | null;
  onExport: () => void;
}

const TestResults: React.FC<TestResultsProps> = ({ stats, onExport }) => {
  if (!stats) return null;

  const successRate = stats.totalRequests > 0
    ? (stats.successfulRequests / stats.totalRequests) * 100
    : 0;

  const chartData = {
    labels: Array.from({ length: stats.totalRequests }, (_, i) => i + 1),
    datasets: [
      {
        label: 'Response Time (ms)',
        data: stats.responseTimes || Array(stats.totalRequests).fill(stats.averageResponseTime),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
          Test Results
        </h3>
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onExport}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg text-white"
        >
          <h4 className="text-lg font-semibold mb-2">Success Rate</h4>
          <div className="text-3xl font-bold">{successRate.toFixed(1)}%</div>
          <p className="text-blue-100 mt-1">
            {stats.successfulRequests} / {stats.totalRequests} requests
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg text-white"
        >
          <h4 className="text-lg font-semibold mb-2">Avg Response Time</h4>
          <div className="text-3xl font-bold">{stats.averageResponseTime.toFixed(2)}ms</div>
          <p className="text-green-100 mt-1">
            Min: {stats.minResponseTime.toFixed(2)}ms | Max: {stats.maxResponseTime.toFixed(2)}ms
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg text-white"
        >
          <h4 className="text-lg font-semibold mb-2">Throughput</h4>
          <div className="text-3xl font-bold">{stats.requestsPerSecond.toFixed(2)}</div>
          <p className="text-purple-100 mt-1">requests/second</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
      >
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Response Time Distribution</h4>
        <div className="h-64">
          <Line data={chartData} options={chartOptions} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TestResults;