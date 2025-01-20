import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Transaction, Account, Category, CreateTransactionDto } from '../types';
import { transactionService } from '../services/transaction.service';
import { accountService } from '../services/account.service';
import { formatCurrency } from '../utils/format';
import AddTransactionModal from '../components/dashboard/AddTransactionModal';
import { formatDate } from '../utils/formatters';
import { get } from 'http';

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const handleAddTransaction = async (data: CreateTransactionDto) => {
    try {
      const newTransaction = await transactionService.create(data);
      setTransactions([newTransaction, ...transactions]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionsData, accountsData] = await Promise.all([
          transactionService.getAll(),
          accountService.getAll()
        ]);
        setTransactions(transactionsData);
        setAccounts(accountsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getAccountName = (accountId: string) => {
    const account = accounts.find(acc => acc._id === accountId);
    return account?.name || 'Unknown Account';
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat._id === categoryId);
    console.log(category, "category");
    return category?.name || 'Unknown Category';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>Add Transaction</button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Account
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                To Account
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <motion.tr
                key={transaction._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.date ? new Date(transaction.date).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction?.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getCategoryName(transaction.category)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(transaction.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.type === 'income'
                        ? 'bg-green-100 text-green-800'
                        : transaction.type === 'expense'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {transaction.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getAccountName(transaction.account)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.type === 'transfer' ? getAccountName(transaction.toAccount || '') : '-'}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddTransaction}
        accounts={accounts}
        categories={categories}
      />
    </div>
  );
};

export default Transactions; 