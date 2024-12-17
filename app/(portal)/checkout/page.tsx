"use client"
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [items] = useState([
    { name: 'Scratch Card 1', price: 5, quantity: 1 },
    { name: 'Scratch Card 2', price: 10, quantity: 1 },
  ]);
  const router = useRouter();

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // Call the backend to create a checkout session
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      const { id } = await res.json();

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe?.redirectToCheckout({ sessionId: id });

      if (error) {
        console.error('Error during redirect:', error);
      }
    } catch (error) {
      console.error('Error during checkout session creation:', error);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Checkout</h1>

      {/* Items List */}
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="p-4 border rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">{item.name}</h2>
            <p>Price: ${item.price}</p>
            <p>Quantity: {item.quantity}</p>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-8 text-xl font-medium">
        <p>Total: ${items.reduce((total, item) => total + item.price * item.quantity, 0)}</p>
      </div>

      {/* Checkout Button */}
      <div className="mt-12 text-center">
        <button
          className={`px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Proceed to Checkout'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
