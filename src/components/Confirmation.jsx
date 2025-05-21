import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Expecting payment info passed via React Router state
  const { paymentInfo } = location.state || {};

  // If no payment info, redirect to home or booking page
  React.useEffect(() => {
    if (!paymentInfo) {
      navigate('/booking');
    }
  }, [paymentInfo, navigate]);

  if (!paymentInfo) {
    return <p className="text-center mt-10">Redirecting...</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10 text-center">
      <h1 className="text-3xl font-bold mb-6 text-green-600">Payment Successful!</h1>

      <p className="mb-4">
        Thank you for your payment. Your booking has been confirmed.
      </p>

      <div className="text-left border p-4 rounded bg-gray-50 mb-6">
        <h2 className="text-xl font-semibold mb-3">Payment Details</h2>
        <p><strong>Payment ID:</strong> {paymentInfo.paymentId}</p>
        {paymentInfo.transactionId && (
          <p><strong>Transaction ID:</strong> {paymentInfo.transactionId}</p>
        )}
        <p><strong>Status:</strong> {paymentInfo.status}</p>
        <p><strong>Payment Method:</strong> {paymentInfo.paymentMethod}</p>
        <p><strong>Amount Paid:</strong> ₱{paymentInfo.amount?.toLocaleString()}</p>
      </div>

      <button
        onClick={() => navigate('/')}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded"
      >
        Back to Home
      </button>
    </div>
  );
};

export default Confirmation;
