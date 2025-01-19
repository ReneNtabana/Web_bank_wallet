import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { CreateTransactionData } from '../../services/transaction.service';
import { Account, Category, Budget } from '../../types';
import categoryService from '../../services/category.service';
import budgetService from '../../services/budget.service';
import { formatCurrency } from '../../utils/format';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTransactionData) => Promise<void>;
  accounts: Account[];
}

const AddTransactionModal = ({ isOpen, onClose, onSubmit, accounts }: AddTransactionModalProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState<CreateTransactionData>({
    type: 'expense',
    amount: 0,
    accountId: accounts[0]?.id || 0,
    categoryId: 0,
    description: '',
    date: new Date()
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, budgetsData] = await Promise.all([
          categoryService.getCategories(),
          budgetService.getBudgets()
        ]);
        setCategories(categoriesData);
        setBudgets(budgetsData);
        
        // Set initial categoryId if categories exist
        if (categoriesData.length > 0) {
          setFormData(prev => ({
            ...prev,
            categoryId: categoriesData[0]?.id || 0
          }));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  // Update selected budget when category changes
  useEffect(() => {
    const budget = budgets.find(b => 
      b.categoryId === formData.categoryId && 
      b.isActive &&
      new Date(b.startDate || '') <= new Date(formData.date) &&
      new Date(b.endDate || '') >= new Date(formData.date)
    );
    setSelectedBudget(budget || null);
  }, [formData.categoryId, formData.date, budgets]);

  const filteredCategories = categories.filter(
    category => category.type === formData.type
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
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
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Transaction Type
          </label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => {
              const newType = e.target.value as CreateTransactionData['type'];
              setFormData(prev => ({
                ...prev,
                type: newType,
                // Reset categoryId when type changes
                categoryId: categories.find(c => c.type === newType)?.id || 0
              }));
            }}
            className="input"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
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
          <label htmlFor="account" className="block text-sm font-medium text-gray-700">
            Account
          </label>
          <select
            id="account"
            value={formData.accountId}
            onChange={(e) => setFormData({ ...formData, accountId: parseInt(e.target.value) })}
            className="input"
          >
            {accounts.map(account => (
              <option key={account.id} value={account.id}>
                {account.name} ({account.type})
              </option>
            ))}
          </select>
        </div>

        {formData.type !== 'transfer' && (
          <>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              {isLoadingCategories ? (
                <div className="animate-pulse h-10 bg-gray-200 rounded"></div>
              ) : (
                <select
                  id="category"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
                  className="input"
                >
                  {filteredCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {selectedBudget && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Budget Information</h4>
                <div className="text-sm text-gray-600">
                  <p>Budget: {formatCurrency(selectedBudget?.amount ?? 0)}</p>
                  <p>Spent: {formatCurrency(selectedBudget?.currentSpending ?? 0)}</p>
                  <p>Remaining: {formatCurrency((selectedBudget?.amount ?? 0) - (selectedBudget?.currentSpending ?? 0))}</p>
                  {(selectedBudget?.currentSpending ?? 0) / (selectedBudget?.amount ?? 1) > 0.8 && (
                    <p className="text-yellow-600 mt-1">
                      Warning: This transaction will put you over 80% of your budget
                    </p>
                  )}
                  {(selectedBudget?.currentSpending ?? 0) + formData.amount > (selectedBudget?.amount ?? 0) && (
                    <p className="text-red-600 mt-1">
                      Warning: This transaction will exceed your budget
                    </p>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={formData.date instanceof Date ? formData.date.toISOString().split('T')[0] : ''}
            onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value || '') })}
            className="input"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input"
            rows={2}
          />
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
            disabled={isLoading || isLoadingCategories}
            className="btn btn-primary"
          >
            {isLoading ? 'Adding...' : 'Add Transaction'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTransactionModal; 