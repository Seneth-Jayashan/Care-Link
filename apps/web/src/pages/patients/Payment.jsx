// src/pages/patient/Payment.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiCheckCircle, FiXCircle } from 'react-icons/fi';

// --- Mock Data (replace with API calls) ---
const mockPayments = [
  {
    _id: 'pay1',
    paidAt: '2025-10-15T11:00:00.000Z',
    appointment: {
      doctor: { user: { firstName: 'Nimali', lastName: 'Silva' } },
      reason: 'Cardiology Consultation',
    },
    amount: 5000,
    currency: 'LKR',
    status: 'success',
  },
  {
    _id: 'pay2',
    paidAt: '2025-09-22T14:30:00.000Z',
    appointment: {
      doctor: { user: { firstName: 'Saman', lastName: 'Perera' } },
      reason: 'Dermatology Follow-up',
    },
    amount: 3500,
    currency: 'LKR',
    status: 'success',
  },
  {
    _id: 'pay3',
    paidAt: '2025-09-05T10:00:00.000Z',
    appointment: {
      doctor: { user: { firstName: 'Priya', lastName: 'Fernando' } },
      reason: 'Pediatric Checkup',
    },
    amount: 4000,
    currency: 'LKR',
    status: 'failed',
  },
];

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

// --- Status Badge Component ---
const StatusBadge = ({ status }) => {
  const isSuccess = status === 'success';
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-semibold rounded-full ${
        isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}
    >
      {isSuccess ? <FiCheckCircle /> : <FiXCircle />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// --- Skeleton Row Component ---
const PaymentRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="p-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </td>
    <td className="p-4">
      <div className="h-8 bg-gray-200 rounded-full w-24"></div>
    </td>
    <td className="p-4">
      <div className="h-8 bg-gray-200 rounded-lg w-10"></div>
    </td>
  </tr>
);

// --- Main Component ---
const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setPayments(mockPayments);
      } catch (error) {
        console.error('Failed to fetch payment history:', error);
        setPayments([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h1 className="text-4xl font-bold text-care-dark mb-8">Payment History</h1>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-care-light border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Date</th>
                <th className="p-4 font-semibold text-gray-600">Service Description</th>
                <th className="p-4 font-semibold text-gray-600">Doctor</th>
                <th className="p-4 font-semibold text-gray-600">Amount</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading
                ? [...Array(3)].map((_, i) => <PaymentRowSkeleton key={i} />)
                : payments.map((payment) => (
                    <motion.tr
                      key={payment._id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      className="border-b border-gray-100 last:border-b-0"
                    >
                      <td className="p-4 text-gray-700 font-medium">
                        {new Date(payment.paidAt).toLocaleDateString('en-LK', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="p-4 text-gray-600">{payment.appointment.reason}</td>
                      <td className="p-4 text-gray-600">
                        Dr. {payment.appointment.doctor.user.firstName}{' '}
                        {payment.appointment.doctor.user.lastName}
                      </td>
                      <td className="p-4 text-gray-800 font-semibold">
                        {payment.currency} {payment.amount.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <StatusBadge status={payment.status} />
                      </td>
                      <td className="p-4">
                        {payment.status === 'success' && (
                          <motion.button
                            className="text-care-primary hover:text-care-dark transition-colors"
                            whileTap={{ scale: 0.9 }}
                            title="Download Receipt"
                            onClick={() =>
                              alert(`Downloading receipt for payment ID: ${payment._id}`)
                            }
                          >
                            <FiDownload size={20} />
                          </motion.button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
            </tbody>
          </table>
        </div>

        {!isLoading && payments.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl font-semibold text-gray-500">
              You have no payment history yet. 🧾
            </p>
            <p className="text-gray-400 mt-2">Completed appointments will appear here.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Payment;
