import { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../common/Modal';
import { Account, Category, CreateTransactionDto } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTransactionDto) => Promise<void>;
  accounts: Account[];
  categories: Category[];
}

const AddTransactionModal = ({ isOpen, onClose, onSubmit, accounts, categories }: Props) => {
  if (accounts.length === 0) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="No Accounts">
        <div className="text-center py-6">
          <p className="text-gray-600 mb-4">
            You need to create an account before adding transactions.
          </p>
          <Link
            to="/accounts"
            className="inline-block px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Create Account
          </Link>
        </div>
      </Modal>
    );
  }

  const [formData, setFormData] = useState<CreateTransactionDto>({
    account: accounts[0] || { _id: '', name: '', type: '' },
    amount: 0,
    type: 'expense',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0] || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    try {
      setIsLoading(true);
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error adding transaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Transaction">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            title="Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as typeof formData.type })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Account</label>
          <select
            title="Account"
            value={formData.account._id}
            onChange={(e) => {
              const selectedAccount = accounts.find(acc => acc._id === e.target.value);
              if (!selectedAccount) return;
              setFormData({
                ...formData,
                account: selectedAccount
              });
            }}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          >
            <option value="">Select Account</option>
            {accounts.map((account) => (
              <option key={account._id} value={account._id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>

        {formData.type === 'transfer' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">To Account</label>
            <select
              title="To Account"
              value={formData.account._id}
              onChange={(e) => {
                const selectedAccount = accounts.find(acc => acc._id === e.target.value);
                if (!selectedAccount) return;
                setFormData({
                  ...formData,
                  account: selectedAccount
                });
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            >
              <option value="">Select Account</option>
              {accounts
                .filter((acc) => acc._id !== formData.account._id)
                .map((acc) => (
                  <option key={acc._id} value={acc._id}>
                    {acc.name}
                  </option>
                ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            title="Amount"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
            min="0.01"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <input
            title="Description"
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            title="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          {categories.filter(cat => cat.type === formData.type).length > 0 ? (
            <select
              title="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            >
              <option value="">Select Category</option>
              {categories
                .filter(cat => cat.type === formData.type)
                .map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          ) : (
            <input
              title="Custom Category"
              type="text"
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Enter custom category"
              required
            />
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Submitting...
              </div>
            ) : (
              'Add Transaction'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTransactionModal; 