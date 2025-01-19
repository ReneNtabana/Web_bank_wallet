import { motion } from 'framer-motion';

interface WelcomeSectionProps {
  userName: string;
}

const WelcomeSection = ({ userName }: WelcomeSectionProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-lg mb-8"
    >
      <h1 className="text-2xl font-bold text-gray-800">
        Welcome back, {userName}!
      </h1>
    </motion.div>
  );
};

export default WelcomeSection; 