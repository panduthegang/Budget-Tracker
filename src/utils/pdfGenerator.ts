import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaction } from '../types';
import { format } from 'date-fns';

export const generatePDF = (transactions: Transaction[]) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text('Transaction History', 14, 15);

  const tableData = transactions.map((t) => [
    format(new Date(t.date), 'MMM d, yyyy'),
    t.description,
    t.type,
    t.category || '-',
    `₹${Math.abs(t.amount).toFixed(2)}`,
  ]);

  autoTable(doc, {
    head: [['Date', 'Description', 'Type', 'Category', 'Amount']],
    body: tableData,
    startY: 25,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 139, 202] },
  });

  doc.save('transactions.pdf');
};