import React, { useState, useEffect } from 'react';
import { TransactionType, ExpenseCategory } from '../types';
import toast from 'react-hot-toast';
import { FiAlertCircle } from 'react-icons/fi';

interface TransactionFormProps {
  onAddTransaction: (description: string, amount: number, type: TransactionType, category?: ExpenseCategory) => void;
}

const EXPENSE_CATEGORIES: { [key in ExpenseCategory]: { icon: string; label: string } } = {
  food: { icon: '🍽️', label: 'Food & Dining' },
  transportation: { icon: '🚗', label: 'Transportation' },
  utilities: { icon: '💡', label: 'Utilities & Bills' },
  entertainment: { icon: '🎮', label: 'Entertainment' },
  shopping: { icon: '🛍️', label: 'Shopping' },
  healthcare: { icon: '🏥', label: 'Healthcare' },
  other: { icon: '📝', label: 'Other' }
};

const TRANSACTION_TYPES: { [key in TransactionType]: { icon: string; label: string } } = {
  income: { icon: '💰', label: 'Income' },
  expense: { icon: '💸', label: 'Expense' },
  'credit-card': { icon: '💳', label: 'Credit Card' }
};

export function TransactionForm({ onAddTransaction }: TransactionFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState<ExpenseCategory>('other');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({ description: '', amount: '' });

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        handleSubmit(e as any);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [description, amount, type, category]);

  const validateForm = (): boolean => {
    const newErrors = { description: '', amount: '' };
    let isValid = true;

    if (!description.trim()) {
      newErrors.description = '❌ Description is required';
      isValid = false;
    } else if (description.length > 50) {
      newErrors.description = '❌ Description must be less than 50 characters';
      isValid = false;
    }

    if (!amount) {
      newErrors.amount = '❌ Amount is required';
      isValid = false;
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = '❌ Amount must be a positive number';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateForm()) {
      toast.error('📝 Please fix the form errors');
      return;
    }

    setIsSubmitting(true);
    try {
      onAddTransaction(
        description.trim(),
        Number(amount),
        type,
        type === 'expense' ? category : undefined
      );
      
      // Reset form
      setDescription('');
      setAmount('');
      setType('expense');
      setCategory('other');
      setErrors({ description: '', amount: '' });
      toast.success('✅ Transaction added successfully!');
    } catch (error) {
      toast.error('❌ Failed to add transaction');
      console.error('Error adding transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-lg">
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          ✏️ Description *
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) {
                setErrors(prev => ({ ...prev, description: '' }));
              }
            }}
            className={`block w-full pr-10 ${
              errors.description
                ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            } rounded-md`}
            placeholder="Enter transaction description"
            maxLength={50}
          />
          {errors.description && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <FiAlertCircle className="h-5 w-5 text-red-500" />
            </div>
          )}
        </div>
        {errors.description ? (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        ) : (
          <p className="mt-1 text-sm text-gray-500">📏 {description.length}/50 characters</p>
        )}
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          💵 Amount (₹) *
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">₹</span>
          </div>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              if (errors.amount) {
                setErrors(prev => ({ ...prev, amount: '' }));
              }
            }}
            className={`block w-full pl-7 pr-10 ${
              errors.amount
                ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            } rounded-md`}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
          {errors.amount && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <FiAlertCircle className="h-5 w-5 text-red-500" />
            </div>
          )}
        </div>
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
        )}
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          📊 Type *
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as TransactionType)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
        >
          {(Object.keys(TRANSACTION_TYPES) as TransactionType[]).map((t) => (
            <option key={t} value={t}>
              {TRANSACTION_TYPES[t].icon} {TRANSACTION_TYPES[t].label}
            </option>
          ))}
        </select>
      </div>

      {type === 'expense' && (
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            🏷️ Category *
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
          >
            {(Object.keys(EXPENSE_CATEGORIES) as ExpenseCategory[]).map((cat) => (
              <option key={cat} value={cat}>
                {EXPENSE_CATEGORIES[cat].icon} {EXPENSE_CATEGORIES[cat].label}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          isSubmitting
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        }`}
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            💾 Saving...
          </>
        ) : (
          <>💾 Add Transaction</>
        )}
      </button>
    </form>
  );
}