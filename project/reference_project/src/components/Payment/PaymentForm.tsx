import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { apiService } from '../../services/api';
import { CreditCard, Shield, IndianRupee, Check } from 'lucide-react';

interface PaymentFormProps {
  event: any; // Define the event prop
}

const PaymentForm: React.FC<PaymentFormProps> = ({ event }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Remove the old way of finding the event
  // const { eventId } = useParams<{ eventId: string }>();
  // const { fests } = useApp();
  // const event = fests.find(f => f.id === parseInt(eventId || '0'));

  const handlePayment = async () => {
    if (!event) return;
    setLoading(true);

    try {
      if (event.ticketPrice === 0) {
        // FREE EVENT: Direct booking, no payment
        const booking = await apiService.createBooking(event.id, "");
        navigate('/dashboard'); // or navigate('/payment/success', { state: { booking } });
      } else {
        // PAID EVENT: Get real Razorpay order from backend
        const paymentOrder = await apiService.createPayment(event.id);

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY',
          amount: event.ticketPrice * 100, // Razorpay expects paise
          currency: "INR",
          name: 'FestPortal',
          description: event.title,
          order_id: paymentOrder.orderId, // <-- Use real orderId from backend!
          handler: async function (response: any) {
            try {
              const booking = await apiService.createBooking(event.id, response.razorpay_payment_id);
              navigate('/dashboard'); // or navigate('/payment/success', { state: { booking } });
            } catch (error) {
              console.error('Booking failed:', error);
              alert('Booking failed. Please contact support.');
            }
          },
          prefill: {
            name: 'User Name',
            email: 'user@example.com'
          },
          theme: {
            color: '#3B82F6'
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error('Payment/Booking failed:', error);
      alert('Payment/Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Event not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <h2 className="text-2xl font-bold mb-2">Complete Your Booking</h2>
        <p className="text-blue-100">Secure payment for {event.title}</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Event Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Event Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Event:</span>
              <span className="font-medium">{event.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{new Date(event.date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Venue:</span>
              <span className="font-medium">{event.college.name}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold border-t pt-2">
              <span>Total Amount:</span>
              <span className="text-green-600">₹{event.ticketPrice}</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        {event.ticketPrice > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-blue-600"
                />
                <CreditCard className="h-5 w-5 text-gray-600" />
                <span>Credit/Debit Card</span>
              </label>
              <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-blue-600"
                />
                <IndianRupee className="h-5 w-5 text-gray-600" />
                <span>UPI</span>
              </label>
              <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="netbanking"
                  checked={paymentMethod === 'netbanking'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-blue-600"
                />
                <Shield className="h-5 w-5 text-gray-600" />
                <span>Net Banking</span>
              </label>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-800">Secure Payment</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            Your payment information is encrypted and secure. Powered by Razorpay.
          </p>
        </div>

        {/* Payment Button */}
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/events')}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Back to Events
          </button>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
          >
            {loading
              ? 'Processing...'
              : event.ticketPrice === 0
                ? 'Get Free Ticket'
                : `Pay ₹${event.ticketPrice}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;