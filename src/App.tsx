import React, { useState, useEffect } from 'react';
import { BarChart3, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import StatsCard from './components/StatsCard';
import DataTable from './components/DataTable';
import { formatDate } from './utils/formatters';

export interface DataRecord {
  id: string;
  email: string;
  description: string;
  registration_value: string;
  amount: string;
  time: string;
  purpose: string;
  terms: string;
  registration_type: string;
}

function App() {
  const [data, setData] = useState<DataRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/admin/read_data');
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      if (result.status === 'success') {
        setData(result.data);
        setError(null);
      } else {
        throw new Error(result.message || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = {
    totalRecords: data.length,
    todayRecords: data.filter(record => {
      try {
        return new Date(record.time).toDateString() === new Date().toDateString();
      } catch {
        return false;
      }
    }).length,
    uniqueKeys: new Set(data.map(record => record.id)).size
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Data Management Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">View and manage all submitted data records</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Records"
            value={stats.totalRecords}
            icon={BarChart3}
            color="blue"
          />
          <StatsCard
            title="Today's Records"
            value={stats.todayRecords}
            icon={BarChart3}
            color="green"
          />
          <StatsCard
            title="Unique Keys"
            value={stats.uniqueKeys}
            icon={BarChart3}
            color="purple"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Data Records</h2>
            <button
              onClick={fetchData}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </button>
          </div>

          <DataTable
            data={data}
            loading={loading}
            error={error}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
          />

          {!loading && !error && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, data.length)} to{' '}
                {Math.min(currentPage * itemsPerPage, data.length)} of {data.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md text-gray-600 hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {Math.ceil(data.length / itemsPerPage)}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(data.length / itemsPerPage)))}
                  disabled={currentPage >= Math.ceil(data.length / itemsPerPage)}
                  className="p-2 rounded-md text-gray-600 hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;