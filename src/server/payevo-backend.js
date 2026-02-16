
/**
 * ⚠️ PRODUCTION BACKEND CODE ⚠️
 * Deploy this file to your Node.js server (AWS, Heroku, DigitalOcean, Vercel).
 * 
 * DEPENDENCIES:
 * npm install express cors dotenv axios pg body-parser
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
// const { Client } = require('pg'); // PostgreSQL Client (Uncomment for real DB)

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Configure strict CORS in production
app.use(express.json());

// 🔒 SECURE CONFIGURATION
const PAYEVO_SECRET_KEY = process.env.PAYEVO_SECRET_KEY || 'sk_like_B2F9PTs9d7XURxM9ByT1oQ33Tr8SFNbgxWMA6ndCCUPQ9AYx';
const PAYEVO_API_URL = 'https://api.payevo.com/v2'; // Official V2 Endpoint

/**
 * 1️⃣ ROUTE: CREATE PIX CHARGE
 * Receives data from Frontend -> Calls PayEvo -> Returns QR Code
 */
app.post('/api/pix/create', async (req, res) => {
  try {
    const { name, cpf, phone, email, amount, description } = req.body;

    // 1. Validation (Security Layer)
    if (!cpf || !amount || amount < 100) { // Min R$ 1,00
      return res.status(400).json({ error: 'Dados inválidos ou valor abaixo do mínimo.' });
    }

    // 2. Create Order in your Database (Pseudo-code)
    // const order = await db.query('INSERT INTO payments (user_id, amount, status) VALUES (...) RETURNING id');
    const internalOrderId = 'ORD-' + Date.now(); 

    // 3. Call PayEvo API
    // Documentation: https://payevov2.readme.io/reference/criar-transacao
    const payevoPayload = {
      amount: amount, // Value in cents (e.g., 9405 for R$ 94,05)
      currency: 'BRL',
      paymentMethod: 'PIX',
      description: description || 'Compra MaxFitness',
      customer: {
        name: name,
        email: email,
        document: {
          type: 'CPF',
          number: cpf.replace(/\D/g, '') // Remove formatting
        },
        phone: phone.replace(/\D/g, '')
      },
      metadata: {
        internal_order_id: internalOrderId
      }
    };

    const response = await axios.post(`${PAYEVO_API_URL}/transaction`, payevoPayload, {
      headers: {
        'Authorization': `Bearer ${PAYEVO_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const data = response.data;

    // 4. Return secure data to Frontend
    // We only send what is necessary. We do NOT send the full payload or keys.
    res.status(200).json({
      txid: data.id, // PayEvo Transaction ID
      status: data.status,
      qrcode: data.paymentMethod.qrCode.image, // Base64 Image
      pix_code: data.paymentMethod.qrCode.text  // Copy & Paste Code
    });

  } catch (error) {
    console.error('PayEvo Error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Erro ao gerar pagamento.',
      details: error.response?.data?.message || 'Contact support.' 
    });
  }
});

/**
 * 2️⃣ ROUTE: CHECK STATUS (POLLING)
 * Frontend calls this to check if payment is confirmed
 */
app.post('/api/pix/status', async (req, res) => {
  try {
    const { txid } = req.body;

    if (!txid) return res.status(400).json({ error: 'TXID required' });

    // Option A: Check your internal database (Faster/Cheaper)
    // const order = await db.query('SELECT status FROM payments WHERE txid = $1', [txid]);
    // if (order.status === 'paid') return res.json({ status: 'paid' });

    // Option B: Check PayEvo API (Real-time authority)
    const response = await axios.get(`${PAYEVO_API_URL}/transaction/${txid}`, {
      headers: { 'Authorization': `Bearer ${PAYEVO_SECRET_KEY}` }
    });

    res.json({
      txid: txid,
      status: response.data.status // 'pending', 'paid', 'expired', 'failed'
    });

  } catch (error) {
    console.error('Status Check Error:', error.message);
    res.status(500).json({ status: 'unknown' });
  }
});

/**
 * 3️⃣ ROUTE: WEBHOOK
 * PayEvo calls this automatically when status changes.
 */
app.post('/webhook/payevo', bodyParser.raw({type: 'application/json'}), async (req, res) => {
  const signature = req.headers['x-payevo-signature'];
  const event = req.body;

  try {
    // 1. Verify Signature (Crucial for Security)
    // const isValid = verifySignature(signature, process.env.WEBHOOK_SECRET, event);
    // if (!isValid) return res.status(400).send('Invalid Signature');

    // 2. Process Event
    if (event.type === 'transaction.succeeded') {
      const txid = event.data.id;
      const internalId = event.data.metadata.internal_order_id;

      console.log(`💰 Payment Confirmed: ${txid} for Order ${internalId}`);

      // 3. Update Database
      // await db.query('UPDATE payments SET status = $1, updated_at = NOW() WHERE txid = $2', ['paid', txid]);
      
      // 4. Trigger fulfillment (Email, Logistics, etc.)
    }

    res.json({ received: true });

  } catch (err) {
    console.error('Webhook Error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 PayEvo Integration Backend running on port ${PORT}`);
});
