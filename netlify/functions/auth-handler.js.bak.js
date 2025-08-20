// Netlify serverless function for authentication
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Initialize Next.js app
const app = next({
  dev: false,
  dir: process.cwd(),
  conf: {
    distDir: '../../.next',
    generateBuildId: async () => process.env.BUILD_ID || 'netlify-build',
  }
});

exports.handler = async (event, context) => {
  await app.prepare();
  
  const { path, queryStringParameters } = event;
  const query = queryStringParameters || {};
  const url = parse(path, true);
  
  // Create a mock request object
  const req = {
    method: event.httpMethod,
    headers: event.headers,
    url: path,
    query: { ...url.query, ...query },
    body: event.body ? JSON.parse(event.body) : null,
    cookies: event.headers.cookie ? parseCookies(event.headers.cookie) : {},
  };
  
  // Create a mock response object
  const res = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': [],
    },
    body: '',
    
    setHeader(name, value) {
      if (name === 'Set-Cookie') {
        this.headers[name] = Array.isArray(value) ? value : [value];
      } else {
        this.headers[name] = value;
      }
    },
    
    end(body) {
      this.body = body;
    },
    
    json(data) {
      this.setHeader('Content-Type', 'application/json');
      this.body = JSON.stringify(data);
    },
    
    status(code) {
      this.statusCode = code;
      return this;
    },
    
    redirect(url) {
      this.statusCode = 302;
      this.setHeader('Location', url);
    },
  };
  
  try {
    // Handle the request with Next.js
    const handler = app.getRequestHandler();
    await handler(req, res);
    
    return {
      statusCode: res.statusCode,
      headers: res.headers,
      body: res.body,
      multiValueHeaders: res.headers['Set-Cookie'] ? {
        'Set-Cookie': res.headers['Set-Cookie']
      } : undefined,
    };
  } catch (error) {
    console.error('Auth handler error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Authentication Error',
        message: error.message,
      }),
    };
  }
};

function parseCookies(cookieString) {
  const cookies = {};
  if (cookieString) {
    cookieString.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      cookies[name] = value;
    });
  }
  return cookies;
}