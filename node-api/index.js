const express = require('express');
const promClient = require('prom-client');
const redis = require('redis');
const app = express();
const port = 3000;

// Create a Registry to store metrics
const register = new promClient.Registry();

// Add default metrics
promClient.collectDefaultMetrics({ register });

// Define a Counter metric to track the number of HTTP requests
const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route'],
});

// Define a Histogram metric for request duration
const responseDurationHistogram = new promClient.Histogram({
  name: 'http_response_duration_seconds',
  help: 'Histogram of HTTP request durations',
  labelNames: ['method', 'route'],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
});

// Define a /metrics endpoint that Prometheus can scrape
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Example API endpoint
app.get('/api', (req, res) => {
  const end = responseDurationHistogram.startTimer();

  // Simulate some processing
  setTimeout(() => {
    httpRequestsTotal.inc({ method: req.method, route: '/api' });
    end({ method: req.method, route: '/api' });
    res.send('Hello, World!');
  }, Math.random() * 1000);
});

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
});

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Start the server
app.listen(port, () => console.log(`App listening on port ${port}`));
