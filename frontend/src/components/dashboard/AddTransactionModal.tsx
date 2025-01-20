import { useState } from 'react';
import Modal from '../common/Modal';
import { Account, Category, CreateTransactionDto } from '../../types';
import { categoryService } from '../../services/category.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTransactionDto) => Promise<void>;
  accounts: Account[];
  categories: Category[];
}

const AddTransactionModal = ({ isOpen, onClose, onSubmit, accounts, categories }: Props) => {
  const [formData, setFormData] = useState<CreateTransactionDto>({
    accountId: '',
    categoryId: '',
    amount: 0,
    type: 'expense',
    description: '',
    date: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let categoryId = formData.categoryId;
      
      // If using custom category, create it first
      if (formData.customCategory) {
        const newCategory = await categoryService.create({
          name: formData.customCategory,
          type: formData.type as 'income' | 'expense',
          color: '#' + Math.floor(Math.random()*16777215).toString(16) // Random color
        });
        categoryId = newCategory._id;
      }

      await onSubmit({
        ...formData,
        categoryId,
      });

      setFormData({
        accountId: '',
        categoryId: '',
        amount: 0,
        type: 'expense',
        description: '',
        date: ''
      });
      onClose();
    } catch (error) {
      console.error('Error adding transaction:', error);
    } finally {
      setIsLoading(false);
    }
  };
  console.log(formData, "------")

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
            value={formData.accountId}
            onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
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

        {formData.type === 'transfer' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">To Account</label>
            <select
              title="To Account"
              value={formData.accountId}
              onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            >
              <option value="">Select Account</option>
              {accounts
                .filter((acc) => acc._id !== formData.accountId)
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
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
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
              value={formData.customCategory || ''}
              onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
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