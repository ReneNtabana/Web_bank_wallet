import { useState } from 'react';
import Modal from '../common/Modal';
import { CreateAccountDto } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAccountDto) => void;
}

const AddAccountModal = ({ isOpen, onClose, onSubmit }: Props) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'bank' | 'cash' | 'mobile_money' | 'other'>('bank');
  const [balance, setBalance] = useState('');
  const [currency, setCurrency] = useState('USD');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      type,
      balance: parseFloat(balance),
      currency
    });
    onClose();
    // Reset form
    setName('');
    setType('bank');
    setBalance('');
    setCurrency('USD');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            title="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            title="Type"
            value={type}
            onChange={(e) => setType(e.target.value as typeof type)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="bank">Bank</option>
            <option value="cash">Cash</option>
            <option value="mobile_money">Mobile Money</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Initial Balance</label>
          <input
            title="Initial Balance"
            type="number"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Currency</label>
          <select
            title="Currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
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
            Create Account
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddAccountModal; 