import { motion } from 'framer-motion';
import { Account, Transaction } from '../../types';

interface QuickStatsProps {
  transactions: Transaction[];
}

const QuickStats = ({ transactions }: QuickStatsProps) => {
  const getTotalBalance = () => {
    const total = transactions.reduce((sum, t) => {
      const amount = t.type === 'expense' ? -t.amount : t.amount;
      return sum + amount;
    }, 0);
    return Math.max(0, total);
  };

  const getMonthlyIncome = () => {
    const thisMonth = new Date().getMonth();
    return transactions
      .filter(t => t.date && new Date(t.date).getMonth() === thisMonth && t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getMonthlyExpenses = () => {
    const thisMonth = new Date().getMonth();
    return transactions
      .filter(t => t.date && new Date(t.date).getMonth() === thisMonth && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
    >
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">Total Balance</h3>
        <p className="text-2xl font-bold">${getTotalBalance().toFixed(2)}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">Monthly Income</h3>
        <p className="text-2xl font-bold text-green-600">
          ${getMonthlyIncome().toFixed(2)}
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">Monthly Expenses</h3>
        <p className="text-2xl font-bold text-red-600">
          ${getMonthlyExpenses().toFixed(2)}
        </p>
      </div>
    </motion.div>
  );
};

export default QuickStats; 