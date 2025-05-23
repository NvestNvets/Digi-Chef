const fetch = require('node-fetch');
require('dotenv').config();

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { phone } = JSON.parse(event.body);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store verification code in Supabase
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/verifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_API_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_API_KEY}`
      },
      body: JSON.stringify({
        phone,
        code: verificationCode,
        created_at: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error('Failed to store verification code');
    }

    // Send verification code via SMS
    const twilioResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(
            `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
          ).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          To: phone,
          From: process.env.TWILIO_PHONE_NUMBER,
          Body: `Your DigiChef verification code is: ${verificationCode}`
        })
      }
    );

    if (!twilioResponse.ok) {
      throw new Error('Failed to send verification SMS');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Verification code sent' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}; 