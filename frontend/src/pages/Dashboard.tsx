import { useEffect, useState } from 'react';
// import axios from 'axios';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '../redux/store';
import { accountService } from '../services/account.service';
import transactionService from '../services/transaction.service';
import { categoryService } from '../services/category.service';
import WelcomeSection from '../components/dashboard/WelcomeSection';
import QuickStats from '../components/dashboard/QuickStats';
import AccountsList from '../components/dashboard/AccountsList';
import TransactionsList from '../components/dashboard/TransactionsList';
import AddAccountModal from '../components/dashboard/AddAccountModal';
import AddTransactionModal from '../components/dashboard/AddTransactionModal';
import { Category, CreateTransactionDto } from '../types';
import { Account, Transaction, CreateAccountDto } from '../types';
import BudgetOverview from '../components/dashboard/BudgetOverview';


const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddAccountModal, setIsAddAccountModal] = useState(false);
  const [isAddTransactionModal, setIsAddTransactionModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchDashboardData = async () => {
    try {
      const [accountsData, transactionsData, categoriesData] = await Promise.all([
        accountService.getAll(),
        transactionService.getAll(),
        categoryService.getAll()
      ]);
      setAccounts(accountsData);
      setTransactions(transactionsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddAccount = async (data: CreateAccountDto) => {
    try {
      const newAccount = await accountService.create(data);
      setAccounts([...accounts, newAccount]);
      await fetchDashboardData();
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  const handleAddTransaction = async (data: CreateTransactionDto) => {
    try {
      const newTransaction = await transactionService.create(data);
      setTransactions([...transactions, newTransaction]);
      setIsAddTransactionModal(false);
      await fetchDashboardData();
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <>
          <WelcomeSection userName={user?.name || ''} />
          <QuickStats transactions={transactions} />
          <div className="mt-6">
            <BudgetOverview onRefresh={refreshTrigger} />
          </div>
          <AccountsList 
            accounts={accounts} 
            onAddAccount={() => setIsAddAccountModal(true)} 
          />
          <TransactionsList 
            transactions={transactions} 
            accounts={accounts}
            onAddTransaction={() => setIsAddTransactionModal(true)}
          />

          <AddAccountModal
            isOpen={isAddAccountModal}
            onClose={() => setIsAddAccountModal(false)}
            onSubmit={handleAddAccount}
            isLoading={isLoading}
          />

          <AddTransactionModal
            isOpen={isAddTransactionModal}
            onClose={() => setIsAddTransactionModal(false)}
            onSubmit={handleAddTransaction}
            accounts={accounts}
            categories={categories}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;