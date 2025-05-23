const fetch = require('node-fetch');
require('dotenv').config();

// Log environment variables for verification
console.log("Supabase URL:", process.env.SUPABASE_URL);
console.log("Supabase Key:", process.env.SUPABASE_API_KEY);
console.log("Twilio SID:", process.env.TWILIO_ACCOUNT_SID);

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { product_name, contact, affiliate_code, app_url } = JSON.parse(event.body);
    
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/purchases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_API_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_API_KEY}`
      },
      body: JSON.stringify({
        product_name,
        contact,
        affiliate_code,
        app_url,
        created_at: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error('Failed to log purchase');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Purchase logged successfully' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}; 