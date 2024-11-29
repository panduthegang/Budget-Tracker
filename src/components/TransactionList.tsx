import React, { useState, useMemo } from 'react';
import { Transaction } from '../types';
import { generatePDF } from '../utils/pdfGenerator';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiTrash2, FiCalendar, FiTag, FiFileText, FiSearch } from 'react-icons/fi';
import { SiMicrosoftexcel } from 'react-icons/si';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export function TransactionList({ transactions, onDeleteTransaction }: TransactionListProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | Transaction['type']>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            t.amount.toString().includes(searchTerm);
        const matchesType = filterType === 'all' || t.type === filterType;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        const aValue = sortBy === 'date' ? new Date(a.date).getTime() : a.amount;
        const bValue = sortBy === 'date' ? new Date(b.date).getTime() : b.amount;
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      });
  }, [transactions, searchTerm, filterType, sortBy, sortOrder]);

  const handleSort = (newSortBy: 'date' | 'amount') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  const toggleTransactionSelection = (id: string) => {
    const newSelected = new Set(selectedTransactions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTransactions(newSelected);
  };

  const handleBatchDelete = async () => {
    try {
      await Promise.all(Array.from(selectedTransactions).map(id => onDeleteTransaction(id)));
      setSelectedTransactions(new Set());
      setIsDeleteModalOpen(false);
      toast.success('Selected transactions deleted successfully');
    } catch (error) {
      toast.error('Failed to delete some transactions');
    }
  };

  const getTypeColor = (type: Transaction['type']) => {
    switch (type) {
      case 'income':
        return 'bg-green-50 border-green-200';
      case 'expense':
        return 'bg-red-50 border-red-200';
      case 'credit-card':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getAmountColor = (type: Transaction['type']) => {
    switch (type) {
      case 'income':
        return 'text-green-600';
      case 'expense':
        return 'text-red-600';
      case 'credit-card':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const generateExcel = (filteredAndSortedTransactions: Transaction[]) => {
    // Create a CSV string
    const csvContent = [
      ['Date', 'Description', 'Category', 'Type', 'Amount'],
      ...transactions.map(t => [
        t.date,
        t.description,
        t.category,
        t.type,
        t.amount.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
          <p className="text-sm text-gray-500 mt-1">{currentDate}</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => generateExcel(filteredAndSortedTransactions)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center space-x-2 shadow-md"
          >
            <SiMicrosoftexcel className="h-4 w-4" />
            <span>Excel</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => generatePDF(filteredAndSortedTransactions)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center space-x-2 shadow-md"
          >
            <FiFileText className="h-4 w-4" />
            <span>PDF</span>
          </motion.button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
          <option value="credit-card">Credit Card</option>
        </select>

        <div className="flex gap-2">
          <button
            onClick={() => handleSort('date')}
            className={`px-3 py-2 rounded-md ${
              sortBy === 'date' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('amount')}
            className={`px-3 py-2 rounded-md ${
              sortBy === 'amount' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Amount {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>

        {selectedTransactions.size > 0 && (
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete Selected ({selectedTransactions.size})
          </button>
        )}
      </div>

      {/* Transaction List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        <AnimatePresence>
          {filteredAndSortedTransactions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <p className="text-gray-500">No transactions found</p>
            </motion.div>
          ) : (
            filteredAndSortedTransactions.map((transaction) => (
              <motion.div
                key={transaction.id}
                variants={itemVariants}
                layout
                onHoverStart={() => setHoveredId(transaction.id)}
                onHoverEnd={() => setHoveredId(null)}
                className={`relative border p-4 rounded-lg ${getTypeColor(
                  transaction.type
                )} transition-shadow hover:shadow-md`}
              >
                <div className="absolute top-4 left-4">
                  <input
                    type="checkbox"
                    checked={selectedTransactions.has(transaction.id)}
                    onChange={() => toggleTransactionSelection(transaction.id)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 pl-8">
                  <div className="flex-grow space-y-1">
                    <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <FiCalendar className="h-4 w-4" />
                        <span>{format(new Date(transaction.date), 'MMM d, yyyy')}</span>
                      </div>
                      {transaction.category && (
                        <div className="flex items-center space-x-1">
                          <FiTag className="h-4 w-4" />
                          <span>{transaction.category}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className={`text-lg font-semibold ${getAmountColor(transaction.type)}`}>
                      {transaction.type === 'income' ? '+' : '-'}₹
                      {transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>

                    <button
                      onClick={() => onDeleteTransaction(transaction.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg p-6 max-w-sm w-full"
            >
              <h3 className="text-lg font-medium text-gray-900">Delete Transactions</h3>
              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to delete {selectedTransactions.size} selected transactions? This action cannot be undone.
              </p>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBatchDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-md"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}