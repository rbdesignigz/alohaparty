const { onRequest } = require("firebase-functions/v2/https");
const { MercadoPagoConfig, Preference } = require("mercadopago");
const cors = require("cors")({ origin: true });

exports.createPreference = onRequest({ cors: true }, async (req, res) => {
  // Handles CORS automatically when using onRequest({ cors: true }) in Firebase Functions v2
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const { items, email, firstName, lastName } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).send("Bad Request: missing items");
    }

    // Read Access Token from environment variables
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || "";
    
    if (!accessToken) {
      return res.status(500).json({ error: "Mercado Pago Access Token is not configured on the server." });
    }

    const client = new MercadoPagoConfig({
      accessToken: accessToken
    });

    const preference = new Preference(client);

    const mpItems = items.map(item => ({
      id: item.product.id,
      title: item.product.name,
      quantity: Number(item.quantity),
      unit_price: Number(item.product.price),
      currency_id: "ARS"
    }));

    const body = {
      items: mpItems,
      payer: {
        email: email,
        name: firstName,
        surname: lastName
      },
      back_urls: {
        success: "https://alohaparty-ig.web.app",
        failure: "https://alohaparty-ig.web.app",
        pending: "https://alohaparty-ig.web.app"
      },
      auto_return: "approved"
    };

    const response = await preference.create({ body });
    res.json({ id: response.id });
  } catch (error) {
    console.error("Error creating Mercado Pago preference:", error);
    res.status(500).json({ error: error.message });
  }
});
