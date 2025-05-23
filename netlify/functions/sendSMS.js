const fetch = require('node-fetch');
require('dotenv').config();

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { phone, order_link, affilia_link } = JSON.parse(event.body);

    const message = `Thank you for your Latina Guapa order! View your order: ${order_link}\n\nShare this link to earn: ${affilia_link}`;

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(
            `${process.env.TWILIO_SID}:${process.env.TWILIO_AUTH}`
          ).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          To: phone,
          From: process.env.TWILIO_PHONE,
          Body: message
        })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to send SMS');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'SMS sent successfully' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}; 