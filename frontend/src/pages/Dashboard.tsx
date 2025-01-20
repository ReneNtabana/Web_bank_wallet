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
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSelector((state: RootState) => state.auth);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(false);
        const [accountsData, transactionsData, categoriesData] = await Promise.all([
          accountService.getAll(),
          transactionService.getAll({ limit: 5 }),
          categoryService.getAll()
        ]);
        console.log('Dashboard data:', { accountsData, transactionsData, categoriesData });

        setAccounts(accountsData);
        setRecentTransactions(transactionsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleAddAccount = async (data: CreateAccountDto) => {
    try {
      const newAccount = await accountService.create(data);
      setAccounts([...accounts, newAccount]);
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  const handleAddTransaction = async (data: CreateTransactionDto) => {
    try {
      const newTransaction = await transactionService.create(data);
      setRecentTransactions([newTransaction, ...recentTransactions.slice(0, 4)]);
      
      // Update account balance
      const updatedAccounts = accounts.map(account => {
        if (account._id === data.accountId) {
          const balanceChange = data.type === 'expense' ? -data.amount : data.amount;
          return { ...account, balance: account.balance + balanceChange };
        }
        return account;
      });
      setAccounts(updatedAccounts);
      
      setIsAddTransactionModalOpen(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <WelcomeSection userName={user?.name || ''} />
      <QuickStats accounts={accounts} recentTransactions={recentTransactions} />
      
      <div className="mt-6">
        <BudgetOverview />
      </div>

      <AccountsList 
        accounts={accounts} 
        onAddAccount={() => setIsAddAccountModalOpen(true)} 
      />
      <TransactionsList 
        transactions={recentTransactions} 
        accounts={accounts}
        onNewTransaction={() => setIsAddTransactionModalOpen(true)} 
      />

      <AddAccountModal
        isOpen={isAddAccountModalOpen}
        onClose={() => setIsAddAccountModalOpen(false)}
        onSubmit={handleAddAccount}
        isLoading={isLoading}
      />

      <AddTransactionModal
        isOpen={isAddTransactionModalOpen}
        onClose={() => setIsAddTransactionModalOpen(false)}
        onSubmit={handleAddTransaction}
        accounts={accounts}
        categories={categories}
      />
    </div>
  );
};

export default Dashboard; 