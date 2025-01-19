import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import accountService from '../services/account.service';
import { Account } from '../types';
import AccountHistory from '../components/accounts/AccountHistory';

const AccountPage = () => {
  const { id } = useParams<{ id: string }>();
  const [account, setAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const data = await accountService.getAccount(parseInt(id!));
        setAccount(data);
      } catch (error) {
        console.error('Error fetching account:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchAccount();
    }
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!account) {
    return <div>Account not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">{account.name}</h2>
        <p className="text-gray-600">{account.type}</p>
      </div>

      <AccountHistory account={account} />
    </div>
  );
};

export default AccountPage; 