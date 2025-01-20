import { useState } from 'react';
import Modal from '../common/Modal';
import { Account, CreateTransactionDto } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTransactionDto) => void;
  accounts: Account[];
}

const AddTransactionModal = ({ isOpen, onClose, onSubmit, accounts }: Props) => {
  const [account, setAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense' | 'transfer'>('expense');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return; // Early return if no account selected
    onSubmit({
      account,
      toAccount: type === 'transfer' ? toAccount : undefined,
      amount: parseFloat(amount),
      type,
      description,
      date
    });
    onClose();
    // Reset form
    setAccount('');
    setToAccount('');
    setAmount('');
    setType('expense');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Transaction">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            title="Type"
            value={type}
            onChange={(e) => setType(e.target.value as typeof type)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {type === 'transfer' ? 'From Account' : 'Account'}
          </label>
          <select
            title="Account"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          >
            <option value="">Select Account</option>
            {accounts.map((acc) => (
              <option key={acc._id} value={acc._id}>
                {acc.name}
              </option>
            ))}
          </select>
        </div>

        {type === 'transfer' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">To Account</label>
            <select
              title="To Account"
              value={toAccount}
              onChange={(e) => setToAccount(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            >
              <option value="">Select Account</option>
              {accounts
                .filter((acc) => acc._id !== account)
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
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            title="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
          >
            Add Transaction
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTransactionModal; 