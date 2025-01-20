import { Budget, Category } from '../../types';

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
    <div className="space-y-4">
      {budgets.map((budget) => (
        <div key={budget._id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">{getCategoryName(budget.category)}</h3>
              <p className="text-gray-600">
                {budget.period} - ${budget.amount}
              </p>
            </div>
            <div className="space-x-2">
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
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${(budget.currentSpending / budget.amount) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              ${budget.currentSpending} of ${budget.amount} spent
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}; 