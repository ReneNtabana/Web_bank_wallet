import { Budget, Transaction } from '../models/index.js';
import { Op } from 'sequelize';

class NotificationService {
  static async checkBudgetThresholds(userId, transaction) {
    try {
      // Get active budgets for the transaction's category
      const budgets = await Budget.findAll({
        where: {
          userId,
          categoryId: transaction.categoryId,
          isActive: true,
          startDate: { [Op.lte]: transaction.date },
          endDate: { [Op.gte]: transaction.date }
        }
      });

      const notifications = [];

      for (const budget of budgets) {
        // Calculate total spending for this budget period
        const totalSpending = await Transaction.sum('amount', {
          where: {
            userId,
            categoryId: budget.categoryId,
            type: 'expense',
            date: {
              [Op.between]: [budget.startDate, budget.endDate]
            }
          }
        }) || 0;

        // Update current spending
        budget.currentSpending = totalSpending;
        await budget.save();

        // Check if threshold is exceeded
        if (budget.notifications?.enabled) {
          const spendingPercentage = (totalSpending / budget.amount) * 100;
          const threshold = budget.notifications.threshold || 80;

          if (spendingPercentage >= threshold) {
            notifications.push({
              type: 'BUDGET_THRESHOLD_EXCEEDED',
              message: `You've spent ${spendingPercentage.toFixed(1)}% of your ${budget.period} budget for ${transaction.Category?.name}`,
              budget: {
                id: budget.id,
                amount: budget.amount,
                spent: totalSpending,
                remaining: budget.amount - totalSpending,
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