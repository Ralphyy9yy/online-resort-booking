import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import gcashLogo from '../assets/gcash.png'; // Import the GCash logo
import cashLogo from '../assets/cash.png'; //Import the cash logo
const PaymentProcessing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingDetails } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!bookingDetails || !Array.isArray(bookingDetails.rooms)) {
      navigate('/booking');
    }
  }, [bookingDetails, navigate]);

  if (!bookingDetails || !Array.isArray(bookingDetails.rooms)) {
    return <p className="text-center mt-10">Redirecting to booking page...</p>;
  }

  // Calculate total nights between checkIn and checkOut
  const calculateTotalNights = (checkIn, checkOut) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = checkOutDate - checkInDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays > 0 ? diffDays : 1; // minimum 1 night
  };

  const totalNights = calculateTotalNights(bookingDetails.checkIn, bookingDetails.checkOut);

  // Calculate total amount considering total nights
  const totalAmount = bookingDetails.rooms.reduce(
    (sum, room) => sum + room.price * room.quantity * totalNights,
    0
  );

  const formatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  });

  const handlePaymentSelect = (method) => {
    setPaymentMethod(method);
    setError('');
  };

  const handleSubmitPayment = async () => {
    if (!paymentMethod) {
      setError('Please select a payment method.');
      return;
    }

    if (!bookingDetails.bookingId && !bookingDetails.id) {
      setError('Booking ID is missing. Please complete booking first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const bookingId = bookingDetails.bookingId || bookingDetails.id;

      const paymentPayload = {
        paymentMethod,
        bookingDetails: {
          bookingId,
          amount: totalAmount,
        },
      };

      console.log('Sending payment payload:', paymentPayload);

      const response = await axios.post('http://localhost:5000/api/payment', paymentPayload);

      if (response.status === 200) {
        navigate('/confirmation', {
          state: {
            paymentInfo: {
              paymentId: response.data.paymentId,
              transactionId: response.data.transactionId || null,
              status: response.data.status,
              paymentMethod,
              amount: totalAmount,
            },
          },
        });
      } else {
        setError('Payment failed. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Payment failed. Please try again.');
        console.error('Server response:', error.response.data);
      } else {
        setError('An error occurred during payment processing.');
      }
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">Payment Processing</h2>

      {error && (
        <p className="text-red-600 text-center mb-4">{error}</p>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Select Payment Method</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => handlePaymentSelect('gcash')}
            disabled={loading}
            aria-pressed={paymentMethod === 'gcash'}
            className={`flex-1 py-3 rounded border ${
              paymentMethod === 'gcash' ? 'border-blue-600 bg-blue-100' : 'border-gray-300'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <img
              src={gcashLogo} // Use the imported logo
              alt="GCash"
              className="mx-auto h-10 object-contain"
            />
            <span className="block mt-2 text-center font-medium">GCash</span>
          </button>

          <button
            onClick={() => handlePaymentSelect('paypal')}
            disabled={loading}
            aria-pressed={paymentMethod === 'paypal'}
            className={`flex-1 py-3 rounded border ${
              paymentMethod === 'paypal' ? 'border-blue-600 bg-blue-100' : 'border-gray-300'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
              alt="PayPal"
              className="mx-auto h-10"
            />
            <span className="block mt-2 text-center font-medium">PayPal</span>
          </button>

          <button 
          onClick={() => handlePaymentSelect('Cash')}
          disabled ={loading}
          aria-pressed={paymentMethod === 'Cash'}
          className = {`flex-1 py-3 rounded border ${
            paymentMethod === 'Cash' ? 'border-blue-600 bg-blue-100' : 'border-gray-300'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <img 
            src = {cashLogo}
            alt = "Cash"
            className = "mx-auto h-10 object-contain">

            </img>
            <span className = "block mt-2 text center font-medium">Cash</span>


          </button>
          
        </div>
      </div>

      <div className="mb-6 border p-4 rounded bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">Booking Summary</h3>
        <p>
          <strong>Check-in:</strong> {bookingDetails.checkIn}
        </p>
        <p>
          <strong>Check-out:</strong> {bookingDetails.checkOut}
        </p>
        <p>
          <strong>Total Nights:</strong> {totalNights}
        </p>
        <div className="mt-2">
          <strong>Rooms:</strong>
          <ul className="list-disc list-inside">
            {bookingDetails.rooms.map((room, idx) => (
              <li key={idx}>
                {room.name} x {room.quantity} &mdash; {formatter.format(room.price * room.quantity * totalNights)}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-4 text-lg font-bold">
          Total Amount: {formatter.format(totalAmount)}
        </p>
      </div>

      <button
        onClick={handleSubmitPayment}
        disabled={loading}
        aria-busy={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Submit Payment'}
      </button>
    </div>
  );
};

export default PaymentProcessing;
