import React, { useEffect } from 'react';
        
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import { store } from './redux/store';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Budgets from './pages/Budgets';
import Navbar from './components/layout/Navbar';
import PrivateRoute from "./components/auth/PrivateRoute";
import Transactions from './pages/Transactions';
import Welcome from './pages/Welcome';
import { setFavicon } from './utils/favicon';
import Account from './pages/Account';

// Separate the routes into a new component that can use hooks
const AppRoutes = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const isWelcomePage = location.pathname === '/';

  return (
    <div className="h-screen bg-gray-50">
      {!isWelcomePage && <div className="mb-16"><Navbar /></div>}
      <main>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <PrivateRoute>
                <Transactions />
              </PrivateRoute>
            }
          />
          <Route
            path="/budgets"
            element={
              <PrivateRoute>
                <Budgets />
              </PrivateRoute>
            }
          />
          <Route
            path="/accounts"
            element={
              <PrivateRoute>
                <Account />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

// Main App component wraps everything with providers
const App = () => {
  useEffect(() => {
    setFavicon();
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <AppRoutes />
      </Router>
    </Provider>
  );
};

export default App; 
