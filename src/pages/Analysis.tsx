import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { FiCalendar, FiDownload, FiRefreshCcw, FiTrendingUp, FiPieChart, FiDollarSign } from 'react-icons/fi';
import { useTransactions } from '../hooks/useTransactions';

const COLORS = ['#6366f1', '#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

export function Analysis() {
  const { transactions } = useTransactions();
  const [timeRange, setTimeRange] = useState('6m'); // 1m, 3m, 6m, 1y
  const [selectedChart, setSelectedChart] = useState('overview'); // overview, category, trend

  const getTimeRangeDate = () => {
    switch (timeRange) {
      case '1m':
        return subMonths(new Date(), 1);
      case '3m':
        return subMonths(new Date(), 3);
      case '6m':
        return subMonths(new Date(), 6);
      case '1y':
        return subMonths(new Date(), 12);
      default:
        return subMonths(new Date(), 6);
    }
  };

  const filteredTransactions = useMemo(() => {
    const startDate = startOfMonth(getTimeRangeDate());
    return transactions.filter(t => new Date(t.date) >= startDate);
  }, [transactions, timeRange]);

  const monthlyData = useMemo(() => {
    const data = new Map();
    
    filteredTransactions.forEach(transaction => {
      const date = format(new Date(transaction.date), 'MMM yyyy');
      const amount = Number(transaction.amount);
      
      if (!data.has(date)) {
        data.set(date, { date, income: 0, expenses: 0, balance: 0 });
      }
      
      const entry = data.get(date);
      if (transaction.type === 'income') {
        entry.income += amount;
      } else {
        entry.expenses += amount;
      }
      entry.balance = entry.income - entry.expenses;
    });

    return Array.from(data.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [filteredTransactions]);

  const categoryData = useMemo(() => {
    const data = new Map();
    
    filteredTransactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const category = transaction.category || 'Other';
        const amount = Number(transaction.amount);
        
        if (!data.has(category)) {
          data.set(category, { name: category, value: 0 });
        }
        
        data.get(category).value += amount;
      });

    return Array.from(data.values());
  }, [filteredTransactions]);

  const trendData = useMemo(() => {
    const data = new Map();
    
    filteredTransactions.forEach(transaction => {
      const date = format(new Date(transaction.date), 'dd MMM');
      const amount = Number(transaction.amount);
      
      if (!data.has(date)) {
        data.set(date, { date, amount: 0, cumulative: 0 });
      }
      
      const entry = data.get(date);
      if (transaction.type === 'income') {
        entry.amount += amount;
      } else {
        entry.amount -= amount;
      }
    });

    let cumulative = 0;
    return Array.from(data.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(entry => {
        cumulative += entry.amount;
        return { ...entry, cumulative };
      });
  }, [filteredTransactions]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Financial Analysis
          </h1>
          <p className="mt-2 text-gray-600">Gain insights into your financial patterns and trends</p>
        </motion.div>

        {/* Controls */}
        <motion.div variants={itemVariants} className="mb-8 space-y-4 sm:space-y-0 sm:flex sm:flex-wrap sm:gap-4 items-center justify-between">
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
            {['1m', '3m', '6m', '1y'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                  timeRange === range
                    ? 'bg-white text-indigo-600 shadow-md'
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
            {[
              { id: 'overview', label: 'Overview', icon: FiCalendar },
              { id: 'category', label: 'Categories', icon: FiPieChart },
              { id: 'trend', label: 'Trends', icon: FiTrendingUp }
            ].map((chart) => (
              <button
                key={chart.id}
                onClick={() => setSelectedChart(chart.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 flex items-center gap-2 ${
                  selectedChart === chart.id
                    ? 'bg-white text-indigo-600 shadow-md'
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                {React.createElement(chart.icon, { className: 'w-4 h-4' })}
                {chart.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Charts */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8"
          style={{ height: '500px' }}
        >
          <AnimatePresence mode="wait">
            {selectedChart === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        border: 'none',
                        padding: '12px'
                      }}
                      formatter={(value) => [`₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, '']}
                    />
                    <Legend 
                      wrapperStyle={{
                        paddingTop: '20px'
                      }}
                    />
                    <Bar dataKey="income" fill="#6366f1" name="Income" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="expenses" fill="#ec4899" name="Expenses" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {selectedChart === 'category' && (
              <motion.div
                key="category"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={180}
                      innerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                          stroke="white"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        border: 'none',
                        padding: '12px'
                      }}
                      formatter={(value) => [`₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {selectedChart === 'trend' && (
              <motion.div
                key="trend"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        border: 'none',
                        padding: '12px'
                      }}
                      formatter={(value) => [`₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, '']}
                    />
                    <Legend 
                      wrapperStyle={{
                        paddingTop: '20px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="cumulative"
                      stroke="#8b5cf6"
                      fill="url(#colorGradient)"
                      fillOpacity={0.2}
                      name="Cumulative Balance"
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={itemVariants} className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Total Income</h3>
                <p className="mt-2 text-3xl font-bold text-green-600">
                  ₹{monthlyData.reduce((sum, month) => sum + month.income, 0)
                    .toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-4">
                <FiTrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Total Expenses</h3>
                <p className="mt-2 text-3xl font-bold text-red-600">
                  ₹{monthlyData.reduce((sum, month) => sum + month.expenses, 0)
                    .toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-red-100 rounded-full p-4">
                <FiPieChart className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Net Balance</h3>
                <p className="mt-2 text-3xl font-bold text-indigo-600">
                  ₹{monthlyData.reduce((sum, month) => sum + month.balance, 0)
                    .toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-indigo-100 rounded-full p-4">
                <FiDollarSign className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
