import { Budget } from '../models/Budget.model.js';
import { Transaction } from '../models/Transaction.model.js';

class NotificationService {
  static async checkBudgetThresholds(userId, transaction) {
    try {
      // Get active budgets for the transaction's category
      const budgets = await Budget.find({
        user: userId,
        category: transaction.category,
        isActive: true,
        startDate: { $lte: transaction.date },
        endDate: { $gte: transaction.date }
      });

      const notifications = [];

      for (const budget of budgets) {
        // Calculate total spending for this budget period
        const totalSpending = await Transaction.aggregate([
          {
            $match: {
              user: userId,
              category: budget.category,
              type: 'expense',
              date: {
                $gte: budget.startDate,
                $lte: budget.endDate
              }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' }
            }
          }
        ]);

        const currentSpending = totalSpending[0]?.total || 0;

        // Update current spending in budget
        budget.currentSpending = currentSpending;
        await budget.save();

        // Check if threshold is exceeded
        if (budget.notifications?.enabled) {
          const spendingPercentage = (currentSpending / budget.amount) * 100;
          const threshold = budget.notifications.threshold || 80;

          if (spendingPercentage >= threshold) {
            notifications.push({
              type: 'BUDGET_THRESHOLD_EXCEEDED',
              message: `You've spent ${spendingPercentage.toFixed(1)}% of your ${budget.period} budget for ${transaction.category.name}`,
              budget: {
                id: budget._id,
                amount: budget.amount,
                spent: currentSpending,
                remaining: budget.amount - currentSpending,
                period: budget.period
              }
            });
          }
        }
      }

      return notifications;
    } catch (error) {
      console.error('Error checking budget thresholds:', error);
      return [];
    }
  }
}

export default NotificationService; 