import { motion } from 'framer-motion';
import { Account } from '../../types';

interface AccountsListProps {
  accounts: Account[];
  onAddAccount: () => void;
}

const AccountsList = ({ accounts, onAddAccount }: AccountsListProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white p-6 rounded-lg shadow-lg mb-8"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Accounts</h2>
        <button onClick={onAddAccount} className="btn btn-primary">
          Add Account
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium text-gray-800">{account.name}</h3>
            <p className="text-lg font-bold text-black">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: account.currency,
              }).format(account.balance)}
            </p>
            <p className="text-sm text-gray-500 capitalize">{account.type}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AccountsList; 