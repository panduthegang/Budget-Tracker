import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { TransactionForm } from '../components/TransactionForm';
import { TransactionList } from '../components/TransactionList';
import { Summary } from '../components/Summary';
import { useTransactions } from '../hooks/useTransactions';
import { motion } from 'framer-motion';
import { FiPieChart, FiTrendingUp, FiDollarSign } from 'react-icons/fi';

export function Dashboard() {
  const { currentUser } = useAuth();
  const { transactions, loading, addTransaction, deleteTransaction, updateTransaction } = useTransactions();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 animate-pulse">Loading your transactions...</p>
        </div>
      </div>
    );
  }

  // Calculate total income, expenses, and balance
  const totals = transactions.reduce(
    (acc, transaction) => {
      const amount = Number(transaction.amount);
      if (transaction.type === 'income') {
        acc.income += amount;
      } else if (transaction.type === 'expense') {
        acc.expenses += amount;
      } else if (transaction.type === 'credit-card') {
        acc.creditCard += amount;
      }
      return acc;
    },
    { income: 0, expenses: 0, creditCard: 0 }
  );

  const balance = totals.income - totals.expenses - totals.creditCard;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Income</p>
                  <p className="mt-2 text-3xl font-bold text-green-600">₹{totals.income.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-green-100 rounded-full p-4">
                  <FiTrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                  <p className="mt-2 text-3xl font-bold text-red-600">₹{totals.expenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-red-100 rounded-full p-4">
                  <FiPieChart className="h-8 w-8 text-red-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Balance</p>
                  <p className={`mt-2 text-3xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-blue-100 rounded-full p-4">
                  <FiDollarSign className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Transaction</h2>
                <TransactionForm onAddTransaction={addTransaction} />
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4"></h2>
                <TransactionList 
                  transactions={transactions}
                  onDeleteTransaction={deleteTransaction}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}