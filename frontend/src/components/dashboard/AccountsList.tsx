import { Account, Transaction } from '../../types';
import { formatCurrency } from '../../utils/format';
import { motion } from 'framer-motion';

interface AccountsListProps {
  accounts: Account[];
  onAddAccount: () => void;
  transactions: Transaction[];
}

const AccountsList = ({ accounts, onAddAccount, transactions }: AccountsListProps) => {
  const calculateAccountBalance = (accountId: string) => {
    const accountTransactions = transactions.filter(t => t.account._id === accountId);
    return accountTransactions.reduce((sum, t) => {
      return sum + (t.type === 'expense' ? -t.amount : t.amount);
    }, 0);
  };

  const getTotalBalance = () => {
    if (!accounts || accounts.length === 0) return 0;
    
    return accounts.reduce((sum, account) => {
      const initialBalance = account.balance || 0;
      const transactionsBalance = calculateAccountBalance(account._id);
      return sum + initialBalance + transactionsBalance;
    }, 0);
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Your Accounts</h2>
          <p className="text-gray-600">Total Balance: {formatCurrency(getTotalBalance())}</p>
        </div>
        <button
          onClick={onAddAccount}
          className="btn btn-primary"
        >
          Add Account
        </button>
      </div>

      <div className="grid gap-4">
        {accounts.map((account) => {
          const currentBalance = (account.balance || 0) + calculateAccountBalance(account._id);
          return (
            <motion.div
              key={account._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{account.name}</h3>
                  <p className="text-sm text-gray-500">{account.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    {account.currency} {currentBalance.toFixed(2)}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AccountsList; 