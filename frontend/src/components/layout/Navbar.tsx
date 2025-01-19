import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { RootState } from '../../redux/store';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  // Hide navbar on welcome page
  if (location.pathname === '/') return null;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-primary-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
            <h1 className="text-xl font-bold">Wallet Bank</h1>
          </div>
          
          <div className="flex space-x-4">
            {user ? (
              <>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="text-white hover:bg-primary-700 px-3 py-2 rounded-md"
                >
                  Dashboard
                </button>
                <button 
                  onClick={handleLogout}
                  className="text-white hover:bg-primary-700 px-3 py-2 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/login')}
                  className="text-white hover:bg-primary-700 px-3 py-2 rounded-md"
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate('/register')}
                  className="text-white hover:bg-primary-700 px-3 py-2 rounded-md"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 