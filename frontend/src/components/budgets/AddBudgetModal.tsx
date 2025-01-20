import { useState } from 'react';
import Modal from '../common/Modal';
import { Category, CreateBudgetDto } from '../../types';

interface AddBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBudgetDto) => Promise<void>;
  categories: Category[];
}

const AddBudgetModal = ({ isOpen, onClose, onSubmit, categories }: AddBudgetModalProps) => {
  const [formData, setFormData] = useState<CreateBudgetDto>({
    category: categories[0]?._id || 'default',
    amount: 0,
    period: 'monthly',
    startDate: new Date().toISOString().split('T')[0] || '',
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0] || '',
    notifications: {
      enabled: true,
      threshold: 80
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categories.length) return;
    setIsLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error adding budget:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Budget">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="input"
            required
          >
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Budget Amount
          </label>
          <input
            type="number"
            id="amount"
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
            className="input"
            required
          />
        </div>

        <div>
          <label htmlFor="period" className="block text-sm font-medium text-gray-700">
            Period
          </label>
          <select
            id="period"
            value={formData.period}
            onChange={(e) => setFormData({ ...formData, period: e.target.value as CreateBudgetDto['period'] })}
            className="input"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="input"
              required
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="input"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="notificationsEnabled"
              checked={formData.notifications?.enabled}
              onChange={(e) => setFormData({
                ...formData,
                notifications: {
                  ...formData.notifications,
                  enabled: e.target.checked
                }
              })}
              className="h-4 w-4 text-black border-gray-300 rounded"
            />
            <label htmlFor="notificationsEnabled" className="ml-2 block text-sm text-gray-700">
              Enable notifications
            </label>
          </div>

          {formData.notifications?.enabled && (
            <div>
              <label htmlFor="threshold" className="block text-sm font-medium text-gray-700">
                Alert Threshold (%)
              </label>
              <input
                type="number"
                id="threshold"
                min="1"
                max="100"
                value={formData.notifications.threshold}
                onChange={(e) => setFormData({
                  ...formData,
                  notifications: {
                    ...formData.notifications,
                    enabled: e.target.checked
                  }
                })}
                className="input"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? 'Adding...' : 'Add Budget'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddBudgetModal; 