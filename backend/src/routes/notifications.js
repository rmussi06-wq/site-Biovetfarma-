const express = require('express');
const { sendOrderNotification } = require('../services/mailer');

const router = express.Router();

router.post('/pedido', async (req, res) => {
  try {
    const { productTitle, customerName, customerEmail, amount } = req.body;
    await sendOrderNotification({ productTitle, customerName, customerEmail, amount });
    res.json({ sent: true });
  } catch (err) {
    console.error('Notification error:', err);
    res.status(500).json({ error: 'Erro ao enviar notificação.' });
  }
});

module.exports = router;
