const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const { publishUserSubscription } = require('../utils/rabbitmq'); // your RabbitMQ publisher

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Webhook signing secret from Stripe Dashboard
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payment event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const customerEmail = session.customer_email;

    console.log(`✅ Payment successful for email: ${customerEmail}`);

    // You can look up the user by email and publish their ID
    // If you passed metadata during session creation (e.g. userId), use that:
    const userId = session.metadata?.userId;

    if (userId) {
      publishUserSubscription(userId);
    }
  }

  res.status(200).json({ received: true });
});

module.exports = router;
