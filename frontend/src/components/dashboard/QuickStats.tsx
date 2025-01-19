import { motion } from 'framer-motion';
import { Account, Transaction } from '../../types';

interface QuickStatsProps {
  accounts: Account[];
  recentTransactions: Transaction[];
}

const QuickStats = ({ accounts, recentTransactions }: QuickStatsProps) => {
  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
    >
      <div className="bg-black text-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-medium mb-2">Total Balance</h3>
        <p className="text-3xl font-bold">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(totalBalance)}
        </p>
      </div>
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-medium mb-2">Active Accounts</h3>
        <p className="text-3xl font-bold">{accounts.length}</p>
      </div>
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-medium mb-2">Recent Activity</h3>
        <p className="text-3xl font-bold">{recentTransactions.length}</p>
      </div>
    </motion.div>
  );
};

export default QuickStats; 