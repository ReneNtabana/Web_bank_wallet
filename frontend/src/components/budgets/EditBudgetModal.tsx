import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Budget, Category } from '../../types';
import { formatCurrency } from '../../utils/format';

interface EditBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: Partial<Budget>) => Promise<void>;
  budget: Budget | null;
  categories: Category[];
}

const EditBudgetModal = ({ isOpen, onClose, onSubmit, budget, categories }: EditBudgetModalProps) => {
  const [formData, setFormData] = useState<Partial<Budget>>({
    ...budget,
    notifications: {
      enabled: budget?.notifications?.enabled ?? false,
      threshold: budget?.notifications?.threshold ?? 80
    } as { enabled: boolean; threshold: number }
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (budget) {
      setFormData({
        amount: budget.amount,
        period: budget.period,
        startDate: budget.startDate || '',
        endDate: budget.endDate || '',
        notifications: {
          enabled: budget.notifications.enabled,
          threshold: budget.notifications.threshold || 80
        } as { enabled: boolean; threshold: number },
        isActive: budget.isActive
      });
    }
  }, [budget]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!budget) return;
    
    setIsLoading(true);
    try {
      await onSubmit(budget._id, formData);
      onClose();
    } catch (error) {
      console.error('Error updating budget:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationsToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      notifications: {
        enabled: e.target.checked,
        threshold: formData.notifications?.threshold ?? 80
      } as { enabled: boolean; threshold: number }
    });
  };

  if (!budget) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Budget - ${budget.category}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          {budget.currentSpending > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              Current spending: {formatCurrency(budget.currentSpending)}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="period" className="block text-sm font-medium text-gray-700">
            Period
          </label>
          <select
            id="period"
            value={formData.period}
            onChange={(e) => setFormData({ 
              ...formData, 
              period: e.target.value as 'daily' | 'weekly' | 'monthly' | 'yearly'
            })}
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
              onChange={handleNotificationsToggle}
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
                value={formData.notifications?.threshold}
                onChange={(e) => {
                  const value = e.target.value === '' ? '' : parseInt(e.target.value);
                  setFormData({
                    ...formData,
                    notifications: {
                      enabled: formData.notifications?.enabled ?? true,
                      threshold: value === '' ? 0 : value
                    } as { enabled: boolean; threshold: number }
                  });
                }}
                className="input"
              />
            </div>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="h-4 w-4 text-black border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
            Budget is active
          </label>
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
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditBudgetModal; 