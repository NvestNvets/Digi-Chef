const fetch = require('node-fetch');
require('dotenv').config();

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { product_name, contact, affiliate_code, app_url } = JSON.parse(event.body);
    
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_KEY}`
      },
      body: JSON.stringify({
        product_name,
        contact,
        affiliate_code,
        app_url,
        created_at: new Date().toISOString(),
        status: 'pending'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to log order');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Order logged successfully' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}; 