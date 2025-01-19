import { motion } from 'framer-motion';
import { Transaction } from '../../types';

interface TransactionsListProps {
  transactions: Transaction[];
  onNewTransaction: () => void;
}

const TransactionsList = ({ transactions, onNewTransaction }: TransactionsListProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white p-6 rounded-lg shadow-lg"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
        <button onClick={onNewTransaction} className="btn btn-primary">
          New Transaction
        </button>
      </div>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: transaction.category.color }}
              />
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-gray-500">
                  {transaction.category.name} • {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <p
              className={`font-bold ${
                transaction.type === 'income'
                  ? 'text-green-600'
                  : transaction.type === 'expense'
                  ? 'text-red-600'
                  : 'text-gray-600'
              }`}
            >
              {transaction.type === 'income' ? '+' : '-'} 
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(Math.abs(transaction.amount))}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default TransactionsList; 