import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { budgetService } from '../../services/budget.service';
import { formatCurrency } from '../../utils/format';

interface BudgetStatus {
  id: number;
   category: {
    name: string;
    _id: string;
    type: string;
  };
  amount: number;
  spent: number;
  remaining: number;
  spendingPercentage: number;
  period: string;
  isThresholdExceeded: boolean;
  threshold: number;
}

const BudgetOverview = () => {
  const [budgetStatus, setBudgetStatus] = useState<BudgetStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBudgetStatus = async () => {
      try {
        const data = await budgetService.getBudgetStatus();
        setBudgetStatus(data);
      } catch (error) {
        console.error('Error fetching budget status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudgetStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  const alertBudgets = budgetStatus.filter(budget => budget.isThresholdExceeded);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Budget Overview</h2>
      
      {alertBudgets.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-medium text-red-600 mb-2">Budget Alerts</h3>
          <div className="space-y-2">
            {alertBudgets.map(budget => (
              <motion.div
                key={budget.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{budget.category}</p>
                  <p className="text-sm text-gray-600">
                    {budget.spendingPercentage.toFixed(1)}% spent of {formatCurrency(budget.amount)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    Remaining: {formatCurrency(budget.remaining)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {budgetStatus
          .filter(budget => !budget.isThresholdExceeded)
          .map(budget => (
            <motion.div
              key={budget.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div>
                <p className="font-medium">{budget.category}</p>
                <p className="text-sm text-gray-600">
                  {budget.spendingPercentage.toFixed(1)}% spent
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm">
                  {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
                </p>
                <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
                  <div
                    className={`h-full rounded-full ${
                      budget.spendingPercentage > 90
                        ? 'bg-red-500'
                        : budget.spendingPercentage > 70
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(budget.spendingPercentage, 100)}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
};

export default BudgetOverview; 
