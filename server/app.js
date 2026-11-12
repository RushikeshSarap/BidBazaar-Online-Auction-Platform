const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const asyncHandler = require('./asyncHandler');
const config = require('./config');
const db = require('./db_connection');

const app = express();
const uploadDirectory = path.join(__dirname, 'uploads');
const profileUpload = multer({ dest: uploadDirectory });
const productUpload = multer({
  storage: multer.diskStorage({
    destination: uploadDirectory,
    filename(req, file, callback) {
      callback(null, `${Date.now()}-${path.basename(file.originalname)}`);
    }
  })
});

app.use(helmet());
app.use((req, res, next) => {
  const startedAt = process.hrtime.bigint();
  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
    console.info(`${req.method} ${req.path} ${res.statusCode} ${durationMs.toFixed(1)}ms`);
  });
  next();
});
app.use(cors({
  credentials: true,
  origin(origin, callback) {
    if (!origin || config.clientOrigins.includes(origin)) {
      return callback(null, true);
    }

    const error = new Error('Origin not allowed');
    error.statusCode = 403;
    error.publicMessage = 'Origin not allowed';
    return callback(error);
  }
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));
app.use('/uploads', express.static(uploadDirectory));

app.get('/api/health', asyncHandler(async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.status(200).json({ status: 'ok', database: 'connected' });
  } catch (cause) {
    const error = new Error('Database health check failed');
    error.statusCode = 503;
    error.publicMessage = 'Database unavailable';
    error.code = cause.code;
    throw error;
  }
}));

app.post('/api/login', asyncHandler(async (req, res) => {
  const { username, password, usertype } = req.body;

  if (!username || !password || !usertype) {
    return res.status(400).json({ success: false, message: 'Missing credentials' });
  }

  const sql = 'SELECT "UserId", "UserPassword", "UserRole" FROM "User_dtls" WHERE "UserUserName" = $1';
  const result = await db.query(sql, [username]);

  if (result.rows.length === 0) {
    return res.json({ success: false, message: 'Invalid username' });
  }

  const { UserId, UserPassword, UserRole } = result.rows[0];
  if (UserPassword !== password) {
    return res.json({ success: false, message: 'Incorrect password' });
  }

  if (UserRole !== usertype) {
    return res.json({ success: false, message: 'Incorrect user type' });
  }

  const token = jwt.sign(
    { id: UserId || username, role: UserRole },
    config.jwtSecret,
    { expiresIn: '24h' }
  );

  return res.json({ success: true, token, role: UserRole });
}));

app.post('/api/register', profileUpload.single('photo'), asyncHandler(async (req, res) => {
  const {
    role,
    firstName,
    lastName,
    username,
    password,
    email,
    mobile,
    address,
    idnumber,
    captcha
  } = req.body;

  if (!role || !firstName || !lastName || !username || !password || !mobile || !captcha) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const sql = `
    INSERT INTO "User_dtls"
    ("UserUserName", "UserPassword", "UserRole", "UserFirstName", "UserLastName", "UserPhoneNumber", "UserEmail", "UserAddress", "UserIdentity", "PhotoPath")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  `;
  const photoPath = req.file ? req.file.path : null;
  const values = [
    username,
    password,
    role.charAt(0).toUpperCase() + role.slice(1),
    firstName,
    lastName,
    mobile,
    email,
    address,
    idnumber,
    photoPath
  ];

  try {
    await db.query(sql, values);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Username already exists' });
    }
    throw error;
  }

  return res.json({ success: true, message: 'User registered successfully' });
}));

function verifyToken(req, res, next) {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  const token = authorization.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : authorization;

  return jwt.verify(token, config.jwtSecret, (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: 'Failed to authenticate token.' });
    }
    req.userId = decoded.id;
    return next();
  });
}

app.post('/api/add-product', verifyToken, productUpload.single('image'), asyncHandler(async (req, res) => {
  const { title, category, price, description } = req.body;
  const imageUrl = req.file ? req.file.path : null;

  if (!title || !category || !price || !description || !imageUrl) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = `
    INSERT INTO products (title, category, image, price, description, seller_id)
    VALUES ($1, $2, $3, $4, $5, $6)
  `;
  const values = [title, category, imageUrl, price, description, req.userId];
  await db.query(query, values);

  return res.status(201).json({ message: 'Product added successfully' });
}));

app.use((req, res, next) => {
  const error = new Error('Route not found');
  error.statusCode = 404;
  error.publicMessage = 'Route not found';
  next(error);
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = Number.isInteger(error.statusCode)
    ? error.statusCode
    : Number.isInteger(error.status) ? error.status : 500;
  const code = error.code || 'unknown';
  console.error('Request failed', {
    method: req.method,
    path: req.path,
    statusCode,
    code
  });

  let message = error.publicMessage;
  if (!message) {
    if (statusCode === 400) message = 'Invalid request';
    else if (statusCode === 404) message = 'Route not found';
    else if (statusCode === 413) message = 'Request body too large';
    else if (statusCode < 500) message = 'Request failed';
    else message = 'Internal server error';
  }

  return res.status(statusCode).json({ success: false, message });
});

module.exports = app;
