import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <motion.h1 
          className="text-5xl md:text-6xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Welcome to Bank Wallet
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl mb-12 text-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Manage your finances with ease and security
        </motion.p>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <Link 
            to="/register" 
            className="inline-block px-8 py-3 bg-white text-black rounded-full font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200"
          >
            Get Started
          </Link>
          
          <div className="mt-4">
            <Link 
              to="/login" 
              className="text-white hover:text-gray-200 underline"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Animated features section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="mt-20 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
      >
        {[
          {
            title: 'Track Expenses',
            description: 'Monitor your spending habits with detailed analytics',
            icon: '📊'
          },
          {
            title: 'Multiple Accounts',
            description: 'Manage all your accounts in one place',
            icon: '💳'
          },
          {
            title: 'Secure Platform',
            description: 'Your financial data is protected with encryption',
            icon: '🔒'
          }
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 + index * 0.2, duration: 0.5 }}
            className="bg-black/30 backdrop-blur-lg rounded-xl p-6 text-center"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-200">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Welcome; 