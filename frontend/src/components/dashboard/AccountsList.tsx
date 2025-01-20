import { Account } from '../../types';

interface AccountsListProps {
  accounts: Account[];
  onAddAccount: () => void;
}

const AccountsList = ({ accounts, onAddAccount }: AccountsListProps) => {
  const getTotalBalance = () => {
    return accounts.reduce((sum, account) => sum + account.balance, 0);
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Accounts</h2>
        <button
          onClick={onAddAccount}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Add Account
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <div key={account._id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{account.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{account.type}</p>
              </div>
              <p className="text-lg font-semibold">
                {account.currency} {account.balance.toFixed(2)}
              </p>
            </div>
          </div>
        ))}

        <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <p className="text-gray-500 mb-2">Total Balance</p>
            <p className="text-2xl font-bold">${getTotalBalance().toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsList; 