import React from 'react'
import { motion } from 'framer-motion'

const LoadingPopup = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div className="bg-white p-6 rounded-lg text-center">
        <h2 className="text-xl mb-4">경기침체확률을 분석중입니다</h2>
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
      </div>
    </motion.div>
  )
}

export default LoadingPopup

