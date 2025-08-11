// Netlify serverless function handler for Next.js API routes
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

// Handle the request
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
  };
  
  // Create a mock response object
  const res = {
    statusCode: 200,
    headers: {},
    body: '',
    
    setHeader(name, value) {
      this.headers[name] = value;
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
  };
  
  try {
    // Handle the request with Next.js
    const handler = app.getRequestHandler();
    await handler(req, res);
    
    return {
      statusCode: res.statusCode,
      headers: res.headers,
      body: res.body,
    };
  } catch (error) {
    console.error('API handler error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: error.message,
      }),
    };
  }
};