import React, { useState } from 'react';
import { Transaction } from '../types';
import { generatePDF } from '../utils/pdfGenerator';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiTrash2, FiCalendar, FiTag, FiFileText } from 'react-icons/fi';
import { SiMicrosoftexcel } from 'react-icons/si';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onUpdateTransaction: (id: string, updates: Partial<Transaction>) => void;
}

export function TransactionList({ transactions, onDeleteTransaction, onUpdateTransaction }: TransactionListProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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

  const generateExcel = () => {
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
          <p className="text-sm text-gray-500 mt-1">{currentDate}</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateExcel}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center space-x-2 shadow-md"
          >
            <SiMicrosoftexcel className="h-4 w-4" />
            <span>Excel</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => generatePDF(transactions)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center space-x-2 shadow-md"
          >
            <FiFileText className="h-4 w-4" />
            <span>PDF</span>
          </motion.button>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        <AnimatePresence>
          {transactions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <p className="text-gray-500">No transactions yet</p>
            </motion.div>
          ) : (
            transactions.map((transaction) => (
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
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
                  <div className="flex-grow space-y-1">
                    <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <FiCalendar className="h-4 w-4" />
                        <span>{new Date(transaction.date).toLocaleDateString()}</span>
                      </div>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex items-center space-x-1">
                        <FiTag className="h-4 w-4" />
                        <span>{transaction.category || transaction.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                    <span className={`font-medium ${getAmountColor(transaction.type)} text-right min-w-[100px]`}>
                      ₹{transaction.amount.toFixed(2)}
                    </span>
                    <AnimatePresence>
                      {hoveredId === transaction.id && (
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => onDeleteTransaction(transaction.id)}
                          className="text-red-500 hover:text-red-600 focus:outline-none"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}