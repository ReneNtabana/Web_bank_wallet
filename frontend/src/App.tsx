import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

// Lazy load pages
const Welcome = React.lazy(() => import('./pages/Welcome'));

const App = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {user && <Navbar />}
          <main className="py-4">
            <Routes>
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
              <Route path="*" element={<Login />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
};

export default App; 