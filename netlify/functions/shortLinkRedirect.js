exports.handler = async function(event, context) {
  const path = event.path.replace('/.netlify/functions/shortLinkRedirect', '');
  
  // Map of short codes to full URLs
  const redirects = {
    '/sofrito': '/digichef/chefstorefront.html',
    '/recipe': '/digichef/recipe.pdf',
    '/tshirt': '/digichef/tshirt.html',
    '/thankyou': '/digichef/thankyou.html'
  };

  const targetUrl = redirects[path];
  
  if (!targetUrl) {
    return {
      statusCode: 404,
      body: 'Not Found'
    };
  }

  return {
    statusCode: 302,
    headers: {
      Location: targetUrl
    }
  };
}; 