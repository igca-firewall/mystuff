import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { items } = req.body;  // Items from the frontend

      // Create a checkout session with Stripe
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: items.map((item: { name: string; price: number; quantity: number }) => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
            },
            unit_amount: item.price * 100,  // Price in cents
          },
          quantity: item.quantity,
        })),
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
      });

      res.status(200).json({ id: session.id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
