import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Transaction } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.emailVerified) {
      setLoading(false);
      return;
    }

    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 5000; // 5 seconds

    const setupListener = () => {
      const q = query(
        collection(db, 'transactions'),
        where('userId', '==', currentUser.uid),
        orderBy('date', 'desc')
      );

      const unsubscribe = onSnapshot(
        q, 
        (snapshot) => {
          const newTransactions = snapshot.docs.map(doc => ({
            id: doc.id,
            description: doc.data().description || '',
            amount: Number(doc.data().amount) || 0,
            type: doc.data().type || 'expense',
            category: doc.data().category,
            date: doc.data().date || new Date().toISOString(),
            userId: doc.data().userId
          })) as Transaction[];
          setTransactions(newTransactions);
          setLoading(false);
          retryCount = 0; // Reset retry count on successful fetch
        },
        (error) => {
          console.error('Error fetching transactions:', error);
          if (error.code === 'failed-precondition' && retryCount < maxRetries) {
            retryCount++;
            toast.error(`Database indexes are being built. Retrying in ${retryDelay/1000} seconds... (Attempt ${retryCount}/${maxRetries})`);
            setTimeout(setupListener, retryDelay);
          } else {
            toast.error('Unable to load transactions. Please try again later.');
            setLoading(false);
          }
        }
      );

      return unsubscribe;
    };

    const unsubscribe = setupListener();
    return () => unsubscribe();
  }, [currentUser]);

  const validateTransaction = (
    description: string,
    amount: number,
    type: Transaction['type'],
    category?: Transaction['category']
  ): boolean => {
    if (!description.trim()) {
      toast.error('Description is required');
      return false;
    }
    if (isNaN(amount) || amount <= 0) {
      toast.error('Amount must be a positive number');
      return false;
    }
    if (!['income', 'expense', 'credit-card'].includes(type)) {
      toast.error('Invalid transaction type');
      return false;
    }
    if (type === 'expense' && category && !['food', 'transportation', 'utilities', 'entertainment', 'shopping', 'healthcare', 'other'].includes(category)) {
      toast.error('Invalid expense category');
      return false;
    }
    return true;
  };

  const addTransaction = async (
    description: string,
    amount: number,
    type: Transaction['type'],
    category?: Transaction['category']
  ) => {
    if (!currentUser?.emailVerified) {
      toast.error('Please verify your email to add transactions');
      return;
    }

    if (!validateTransaction(description, amount, type, category)) {
      return;
    }

    try {
      const newTransaction = {
        description: description.trim(),
        amount: Number(amount),
        type,
        category: type === 'expense' ? category : null,
        date: new Date().toISOString(),
        userId: currentUser.uid,
      };

      await addDoc(collection(db, 'transactions'), newTransaction);
      toast.success('Transaction added successfully');
    } catch (error: any) {
      console.error('Error adding transaction:', error);
      if (error.code === 'invalid-argument') {
        toast.error('Invalid transaction data. Please check your input.');
      } else if (error.code === 'failed-precondition') {
        toast.error('Database is being initialized. Please try again in a few moments.');
      } else {
        toast.error('Failed to add transaction. Please try again later.');
      }
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'transactions', id));
      toast.success('Transaction deleted successfully');
    } catch (error) {
      toast.error('Failed to delete transaction');
      console.error('Error deleting transaction:', error);
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    if (!currentUser?.emailVerified) {
      toast.error('Please verify your email to update transactions');
      return;
    }

    try {
      const transactionRef = doc(db, 'transactions', id);
      await updateDoc(transactionRef, updates);
      toast.success('Transaction updated successfully');
    } catch (error) {
      toast.error('Failed to update transaction');
      console.error('Error updating transaction:', error);
    }
  };

  return {
    transactions,
    loading,
    addTransaction,
    deleteTransaction,
    updateTransaction
  };
}