const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); // serve uploaded images

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'SQLpassword',
  database: 'MPRSEM4'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

app.post('/api/login', (req, res) => {
  const { username, password, usertype } = req.body;

  if (!username || !password || !usertype) {
    return res.json({ success: false, message: 'Missing credentials' });
  }

  const sql = 'SELECT UserPassword, UserRole FROM User_dtls WHERE UserUserName = ?';
  db.query(sql, [username], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Server error' });

    if (results.length === 0) {
      return res.json({ success: false, message: 'Invalid username' });
    }

    const { UserPassword, UserRole } = results[0];
    if (UserPassword !== password) {
      return res.json({ success: false, message: 'Incorrect password' });
    }

    if (UserRole !== usertype) {
      return res.json({ success: false, message: 'Incorrect user type' });
    }

    return res.json({ success: true });
  });
});


const upload = multer({ dest: path.join(__dirname, 'uploads/') });

app.post('/api/register', upload.single('photo'), (req, res) => {
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
    INSERT INTO User_dtls 
    (UserUserName, UserPassword, UserRole, UserFirstName, UserLastName, UserPhoneNumber, UserEmail, UserAddress, UserIdentity, PhotoPath)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const photoPath = req.file ? req.file.path : null;

  db.query(
    sql,
    [username, password, role.charAt(0).toUpperCase() + role.slice(1), firstName, lastName, mobile, email, address, idnumber, photoPath],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.json({ success: false, message: 'Username already exists' });
        }
        return res.status(500).json({ success: false, message: 'Server error' });
      }
      return res.json({ success: true, message: 'User registered successfully' });
    }
  );
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
app.post('/add-product', verifyToken, upload1.single('image'), (req, res) => {
  const { title, category, price, description } = req.body;
  const imageUrl = req.file ? req.file.path : null;
  const sellerId = req.userId; // from JWT

  if (!title || !category || !price || !description || !imageUrl) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = `
    INSERT INTO products (title, category, image, price, description, seller_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [title, category, imageUrl, price, description, sellerId];

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.status(201).json({ message: 'Product added successfully' });
  });
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


