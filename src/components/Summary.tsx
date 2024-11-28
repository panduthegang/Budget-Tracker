import React from 'react';
import { Transaction } from '../types';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

interface SummaryProps {
  transactions: Transaction[];
}

export function Summary({ transactions }: SummaryProps) {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const creditCardBills = transactions
    .filter((t) => t.type === 'credit-card')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses - creditCardBills;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-r from-green-400 to-green-500 p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:shadow-xl"
      >
        <h3 className="text-sm font-medium text-white/80">Income</h3>
        <p className="text-3xl font-bold text-white mt-2">
          ₹<CountUp end={income} decimals={2} duration={1} />
        </p>
        <div className="mt-2 text-white/60 text-sm">
          Total earnings
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-r from-red-400 to-red-500 p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:shadow-xl"
      >
        <h3 className="text-sm font-medium text-white/80">Expenses</h3>
        <p className="text-3xl font-bold text-white mt-2">
          ₹<CountUp end={expenses} decimals={2} duration={1} />
        </p>
        <div className="mt-2 text-white/60 text-sm">
          Total spending
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-r from-purple-400 to-purple-500 p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:shadow-xl"
      >
        <h3 className="text-sm font-medium text-white/80">Credit Card Bills</h3>
        <p className="text-3xl font-bold text-white mt-2">
          ₹<CountUp end={creditCardBills} decimals={2} duration={1} />
        </p>
        <div className="mt-2 text-white/60 text-sm">
          Credit payments
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-r from-blue-400 to-blue-500 p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:shadow-xl"
      >
        <h3 className="text-sm font-medium text-white/80">Balance</h3>
        <p className="text-3xl font-bold text-white mt-2">
          ₹<CountUp end={balance} decimals={2} duration={1} />
        </p>
        <div className="mt-2 text-white/60 text-sm">
          Net balance
        </div>
      </motion.div>
    </div>
  );
}