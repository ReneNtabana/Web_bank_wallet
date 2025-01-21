import { motion } from 'framer-motion';
import { Account, Transaction } from '../../types';
import { formatCurrency } from '../../utils/format';

interface QuickStatsProps {
  transactions: Transaction[];
  accounts: Account[];
}

const QuickStats = ({ transactions, accounts }: QuickStatsProps) => {
  const getTotalBalance = () => {
    const accountsTotal = accounts.reduce((sum, account) => sum + (account.balance || 0), 0);
    
    const transactionsTotal = transactions.reduce((sum, t) => {
      return sum + (t.type === 'expense' ? -t.amount : t.amount);
    }, 0);

    return accountsTotal + transactionsTotal;
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
        <p className="text-2xl font-bold">{formatCurrency(getTotalBalance())}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">Monthly Income</h3>
        <p className="text-2xl font-bold text-green-600">
          {formatCurrency(getMonthlyIncome())}
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">Monthly Expenses</h3>
        <p className="text-2xl font-bold text-red-600">
          {formatCurrency(getMonthlyExpenses())}
        </p>
      </div>
    </motion.div>
  );
};

export default QuickStats; 