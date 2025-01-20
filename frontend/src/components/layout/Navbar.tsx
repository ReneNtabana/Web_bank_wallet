import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { logout } from '../../redux/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import useClickOutside from '../../hooks/useClickOutside';
import NotificationList from '../notifications/NotificationList';
import { BellIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useClickOutside(notificationsRef, () => setShowNotifications(false));
  useClickOutside(profileRef, () => setIsProfileOpen(false));

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-gray-800">FinanceTracker</span>
            </Link>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/dashboard"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300"
              >
                Dashboard
              </Link>
              <Link
                to="/budgets"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:border-gray-300"
              >
                Budgets
              </Link>
              <Link
                to="/transactions"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:border-gray-300"
              >
                Transactions
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notification Button */}
            <div className="relative">
              <button
                title="Notifications"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full hover:bg-gray-100 relative"
              >
                <BellIcon className="h-6 w-6" />
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium">Notifications</h3>
                  </div>
                  <NotificationList onClose={() => setShowNotifications(false)} />
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="hidden md:block text-sm font-medium">{user.name}</span>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                  >
                    <div className="py-1" role="menu">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Your Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Settings
                      </Link>
                      <button
                        type='button'
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 