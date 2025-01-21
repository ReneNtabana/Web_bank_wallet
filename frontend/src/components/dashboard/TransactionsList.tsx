import { Transaction, Account } from '../../types';
import { formatDate } from '../../utils/formatters';

interface TransactionsListProps {
  transactions: Transaction[];
  accounts: Account[];
  onNewTransaction: () => void;
}

const TransactionsList = ({ transactions, onNewTransaction }: TransactionsListProps) => {
  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'income':
        return '↑';
      case 'expense':
        return '↓';
      case 'transfer':
        return '↔';
    }
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
        <button
          onClick={onNewTransaction}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Add Transaction
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {transactions.length === 0 ? (
          <p className="text-center py-4 text-gray-500">No transactions yet</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {[...transactions].reverse().map((transaction) => (
              <li key={transaction._id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{getTransactionIcon(transaction.type)}</span>
                    <div>
                      <p className="font-medium">{transaction.description || 'No description'}</p>
                      <p className="text-sm text-gray-500">
                        {transaction.date ? formatDate(new Date(transaction.date)) : 'No date'}
                      </p>
                      <p className="text-sm text-gray-500">{transaction.account.name}</p>
                    </div>
                  </div>
                  <div className={`text-right ${
                    transaction.type === 'income' ? 'text-green-600' : 
                    transaction.type === 'expense' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    <p className="font-medium">
                      {transaction.type === 'expense' ? '-' : ''}${transaction.amount}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TransactionsList; 