import { motion } from 'framer-motion';

export function Logo() {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center space-x-2"
    >
      <div className="relative w-8 h-8">
        <motion.div
          className="absolute inset-0 bg-primary-500 rounded-lg"
          animate={{
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-white font-bold"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          $
        </motion.div>
      </div>
      <span className="text-xl font-bold text-primary-600">FinanceFlow</span>
    </motion.div>
  );
}