const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const requiredVariables = [
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'JWT_SECRET',
  'COOKIE_SECRET',
  'CLIENT_URL'
];

const missingVariables = requiredVariables.filter((name) => !process.env[name]?.trim());
if (missingVariables.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVariables.join(', ')}`);
}

function parsePort(name, value, fallback) {
  const port = value === undefined ? fallback : Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`${name} must be an integer between 1 and 65535`);
  }
  return port;
}

const clientOrigins = process.env.CLIENT_URL.split(',').map((value) => {
  let parsed;
  try {
    parsed = new URL(value.trim());
  } catch {
    throw new Error('CLIENT_URL must contain valid HTTP or HTTPS origins');
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('CLIENT_URL must contain valid HTTP or HTTPS origins');
  }

  return parsed.origin;
});

module.exports = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parsePort('PORT', process.env.PORT, 3000),
  clientOrigins: Object.freeze(clientOrigins),
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
  database: Object.freeze({
    host: process.env.DB_HOST,
    port: parsePort('DB_PORT', process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })
});
