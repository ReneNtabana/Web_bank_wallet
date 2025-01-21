import { Budget } from '../models/Budget.model.js';
import { Transaction } from '../models/Transaction.model.js';
import { Notification } from '../models/Notification.model.js';

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
        if (budget.notifications?.enabled) {
          // Calculate current spending for this budget period
          const currentSpending = await Transaction.aggregate([
            {
              $match: {
                user: userId,
                category: transaction.category,
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

          const spendingAmount = currentSpending[0]?.total || 0;
          const spendingPercentage = (spendingAmount / budget.amount) * 100;

          if (spendingPercentage >= budget.notifications.threshold) {
            const notification = await Notification.create({
              user: userId,
              type: 'budget',
              message: `Your ${budget.category.name} budget has exceeded ${budget.notifications.threshold}% of its limit`,
              budget: {
                id: budget._id,
                amount: budget.amount,
                spent: spendingAmount,
                remaining: budget.amount - currentSpending,
                period: budget.period
              }
            });
            notifications.push(notification);
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