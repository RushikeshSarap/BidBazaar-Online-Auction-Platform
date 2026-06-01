const express = require('express');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend'))); // serve frontend statically
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // serve uploaded images relative to backend

const db = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'auction_platform'
});

db.connect((err, client, release) => {
  if (err) {
    console.error('PostgreSQL connection error', err);
    throw err;
  }
  console.log('Connected to PostgreSQL');
  release();
});

app.post('/api/login', async (req, res) => {
  const { username, password, usertype } = req.body;

  if (!username || !password || !usertype) {
    return res.json({ success: false, message: 'Missing credentials' });
  }

  const sql = 'SELECT "UserPassword", "UserRole" FROM "User_dtls" WHERE "UserUserName" = $1';
  try {
    const result = await db.query(sql, [username]);

    if (result.rows.length === 0) {
      return res.json({ success: false, message: 'Invalid username' });
    }

    const { UserPassword, UserRole } = result.rows[0];
    if (UserPassword !== password) {
      return res.json({ success: false, message: 'Incorrect password' });
    }

    if (UserRole !== usertype) {
      return res.json({ success: false, message: 'Incorrect user type' });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});


const upload = multer({ dest: path.join(__dirname, 'uploads/') });

app.post('/api/register', upload.single('photo'), async (req, res) => {
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
    return res.json({ success: false, message: 'All fields are required' });
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
    return res.json({ success: true, message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.json({ success: false, message: 'Username already exists' });
    }
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload1 = multer({ storage: storage });


function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'No token provided.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Failed to authenticate token.' });
    req.userId = decoded.id;
    next();
  });
}

// POST /add-product route
app.post('/add-product', verifyToken, upload1.single('image'), async (req, res) => {
  const { title, category, price, description } = req.body;
  const imageUrl = req.file ? req.file.path : null;
  const sellerId = req.userId; // from JWT

  if (!title || !category || !price || !description || !imageUrl) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = `
    INSERT INTO products (title, category, image, price, description, seller_id)
    VALUES ($1, $2, $3, $4, $5, $6)
  `;
  const values = [title, category, imageUrl, price, description, sellerId];

  try {
    await db.query(query, values);
    res.status(201).json({ message: 'Product added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error', error: err });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
