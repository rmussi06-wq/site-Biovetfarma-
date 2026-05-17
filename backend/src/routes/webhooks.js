const express = require('express');
const { sendOrderNotification } = require('../services/mailer');
const { invalidateCache } = require('../services/cache');

const router = express.Router();

router.post('/pagamento', async (req, res) => {
  try {
    const payload = req.body;

    if (payload.type === 'payment' && payload.data?.status === 'approved') {
      await sendOrderNotification({
        productTitle: payload.data?.description,
        customerName: payload.data?.payer?.first_name,
        customerEmail: payload.data?.payer?.email,
        amount: `R$ ${(payload.data?.transaction_amount || 0).toFixed(2)}`,
      });
      invalidateCache();
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

module.exports = router;
