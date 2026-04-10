import { motion } from 'framer-motion';

const HomeView = () => (
  <motion.div
    className="p-8 text-center"
    initial={{ y: -50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.8 }}
  >
    <motion.h1
      className="text-4xl font-bold mb-4"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2 }}
    >
      Welcome to PAKWIESS
    </motion.h1>
    <motion.img
      src="/assets/home-hero.jpg"
      alt="Pets"
      className="mx-auto w-96 h-64 object-cover rounded-lg shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    />
    <motion.p
      className="mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
    >
      Find the perfect pet sitter for your furry friend!
    </motion.p>
    <motion