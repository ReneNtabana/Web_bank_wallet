import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Budget, Category, CreateBudgetDto } from '../types';
import { budgetService } from '../services/budget.service';
import { categoryService } from '../services/category.service';
import AddBudgetModal from '../components/budgets/AddBudgetModal';
import { formatCurrency } from "../utils/format";
import EditBudgetModal from '../components/budgets/EditBudgetModal';

const Budgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const [budgetsData, categoriesData] = await Promise.all([
          budgetService.getAll(),
          categoryService.getAll()
        ]);
        console.log('Budgets:', budgetsData);
        console.log('Categories:', categoriesData);
        setBudgets(budgetsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching budgets:', error);
        setError('Failed to load budgets');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  const handleAddBudget = async (data: CreateBudgetDto) => {
    try {
      setIsLoading(true);
      const newBudget = await budgetService.create(data);
      setBudgets([...budgets, newBudget]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error creating budget:', error);
      setError('Failed to create budget');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBudget = async (id: string, data: Partial<Budget>) => {
    try {
      const updatedBudget = await budgetService.update(id, data);
      setBudgets(budgets.map(budget => 
        budget._id === updatedBudget._id ? updatedBudget : budget
      ));
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  const handleEditClick = (budget: Budget) => {
    setSelectedBudget(budget);
    setIsEditModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-4">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Budgets</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn btn-primary"
        >
          Add Budget
        </button>
      </div>

      {budgets.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">No budgets yet</p>
      ) : (
        <div className="grid gap-6">
          {budgets.map(budget => (
            <BudgetCard 
              key={budget._id} 
              budget={budget} 
              onEdit={handleEditClick}
            />
          ))}
        </div>
      )}

      <AddBudgetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddBudget}
        categories={categories}
      />

      <EditBudgetModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBudget(null);
        }}
        onSubmit={handleEditBudget}
        budget={selectedBudget}
        categories={categories}
      />
    </div>
  );
};

const BudgetCard = ({ budget, onEdit }: { budget: Budget; onEdit: (budget: Budget) => void }) => {
  const progress = (budget.currentSpending / budget.amount) * 100;
  const isOverBudget = progress > 100;
  const isNearThreshold = progress >= (budget.notifications?.threshold || 80);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-lg"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-md text-black font-bold">
            {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)} Budget
          </p>
          <p className="text-sm text-gray-500">
            {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold">
            {formatCurrency(budget.currentSpending)} / {formatCurrency(budget.amount)}
          </p>
          <p className={`text-sm ${isOverBudget ? 'text-red-500' : isNearThreshold ? 'text-yellow-500' : 'text-gray-500'}`}>
            {isOverBudget 
              ? `${(progress - 100).toFixed(1)}% over budget` 
              : `${(100 - progress).toFixed(1)}% remaining`}
          </p>
        </div>
        <button
          title='Edit button'
          type="button"
          onClick={() => onEdit(budget)}
          className="p-2 text-gray-500 hover:text-black"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      </div>

      <div className="relative pt-1">
        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
          <div
            style={{ width: `${Math.min(progress, 100)}%` }}
            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
              isOverBudget ? 'bg-red-500' : isNearThreshold ? 'bg-yellow-500' : 'bg-green-500'
            }`}
          />
        </div>
      </div>

      {budget.notifications?.enabled && (
        <div className="mt-2 text-sm text-gray-500">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Alert at {budget.notifications.threshold}%
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default Budgets; 