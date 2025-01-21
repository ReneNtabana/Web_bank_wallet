import { Budget, Category } from '../../types';
import { formatCurrency } from '../../utils/format';

interface BudgetListProps {
  budgets: Budget[];
  categories: Category[];
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

export const BudgetList = ({ budgets, categories, onEdit, onDelete }: BudgetListProps) => {
  const getCategoryName = (category: string | { _id: string; name: string }) => {
    return typeof category === 'string'
      ? categories.find(c => c._id === category)?.name || 'Unknown Category'
      : category.name || 'Unknown Category';
  };

  return (
    <div className="grid gap-4">
      {budgets.map((budget) => {
        const spendingPercentage = ((budget.currentSpending || 0) / budget.amount) * 100;
        return (
          <div key={budget._id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{getCategoryName(budget.category)}</h3>
                <p className="text-sm text-gray-500">
                  {formatCurrency(budget.amount)} / {budget.period}
                </p>
                <p className="text-sm mt-1">
                  Spent: {formatCurrency(budget.currentSpending || 0)} 
                  ({spendingPercentage.toFixed(1)}%)
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(budget)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(budget._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="mt-2 w-full h-2 bg-gray-200 rounded-full">
              <div
                className={`h-full rounded-full ${
                  spendingPercentage > 90
                    ? 'bg-red-500'
                    : spendingPercentage > 70
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(spendingPercentage, 100)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}; 