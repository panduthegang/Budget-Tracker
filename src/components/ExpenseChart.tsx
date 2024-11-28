import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { Transaction, ExpenseCategory } from '../types';

interface ExpenseChartProps {
  transactions: Transaction[];
}

const COLORS = {
  food: '#ef4444',
  transportation: '#f59e0b',
  utilities: '#10b981',
  entertainment: '#6366f1',
  shopping: '#ec4899',
  healthcare: '#06b6d4',
  other: '#8b5cf6',
};

export function ExpenseChart({ transactions }: ExpenseChartProps) {
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const category = t.category || 'other';
      acc[category] = (acc[category] || 0) + t.amount;
      return acc;
    }, {} as Record<ExpenseCategory, number>);

  const data = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: amount,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-lg"
    >
      <h3 className="text-lg font-semibold mb-4">Expense Breakdown</h3>
      <div className="h-48 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={window.innerWidth < 640 ? 40 : 60}
              outerRadius={window.innerWidth < 640 ? 55 : 80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
            />
            <Legend 
              layout={window.innerWidth < 640 ? "horizontal" : "vertical"}
              align={window.innerWidth < 640 ? "center" : "right"}
              verticalAlign={window.innerWidth < 640 ? "bottom" : "middle"}
              wrapperStyle={window.innerWidth < 640 ? { fontSize: '12px' } : { fontSize: '14px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}