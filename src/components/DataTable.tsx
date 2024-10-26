import React from 'react';
import { Loader2 } from 'lucide-react';
import type { DataRecord } from '../App';
import { formatDate } from '../utils/formatters';

interface DataTableProps {
  data: DataRecord[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  itemsPerPage: number;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  loading,
  error,
  currentPage,
  itemsPerPage,
}) => {
  if (loading) {
    return (
      <div className="py-12">
        <div className="flex justify-center items-center">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <div className="text-center text-red-500">
          <p className="text-lg font-semibold mb-2">Failed to load data</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Terms</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {pageData.map((record, index) => (
            <tr
              key={record.id + index}
              className={`${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              } hover:bg-gray-100 transition-colors`}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.email || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.description || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.id || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.registration_value || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.amount || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {record.time ? formatDate(record.time) : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.purpose || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.terms || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.registration_type || '-'}</td>
            </tr>
          ))}
          {pageData.length === 0 && (
            <tr>
              <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;