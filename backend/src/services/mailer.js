const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendOrderNotification(order) {
  await transporter.sendMail({
    from: `"Biovetfarma" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `Novo pedido recebido — ${order.productTitle || 'Produto'}`,
    html: `
      <h2>Novo pedido recebido!</h2>
      <p><strong>Produto:</strong> ${order.productTitle || '—'}</p>
      <p><strong>Cliente:</strong> ${order.customerName || '—'}</p>
      <p><strong>E-mail:</strong> ${order.customerEmail || '—'}</p>
      <p><strong>Valor:</strong> ${order.amount || '—'}</p>
      <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
      <hr />
      <p style="color:#888;font-size:12px">Biovetfarma — Manipulação Veterinária</p>
    `,
  });
}

module.exports = { sendOrderNotification };
