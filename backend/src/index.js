require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { rateLimiter } = require('./middleware/rateLimiter');
const webhookRoutes = require('./routes/webhooks');
const notificationRoutes = require('./routes/notifications');
const { getProducts } = require('./services/cache');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || 'https://www.biovetfarma.com.br' }));
app.use(express.json());
app.use(rateLimiter);

app.use('/api/webhook', webhookRoutes);
app.use('/api/notify', notificationRoutes);

app.get('/api/produtos/cache', async (req, res) => {
  try {
    const produtos = await getProducts();
    res.json({ data: produtos, cached: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar produtos.' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', ts: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Biovetfarma API rodando na porta ${PORT}`);
});
