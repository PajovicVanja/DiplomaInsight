const express = require('express')
const cors = require('cors');
const session = require('express-session');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const app = express()
const port = 3000
const db = require('./db');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const crypto = require('crypto');


app.use(cors({
  origin: 'http://localhost:8080', // or your frontend url
  credentials: true,
  withCredentials: true
}));

app.use(bodyParser.json());

// Session middleware
const secretKey = crypto.randomBytes(64).toString('hex');
app.use(session({
  secret: secretKey, // Replace it with your own secret
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000, // 1 hour
  }
}));


app.get('/', (req, res) => {
  res.send('Hello Worldd!')
})
//LOGIN
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error occurred during login');
    } else {
      if (results.length > 0) {
        const user = results[0];
        
        // Check if the user's email is verified
        if (!user.verified) {
          return res.status(401).send('Please verify your email before logging in');
        }
        
        // Compare submitted password with hashed password
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          req.session.user = user; // Set user to the session
          console.log('Session ID:', req.sessionID); // Log session ID
          console.log('User:', req.session.user); // Log user object
          res.status(200).send('User logged in successfully');
        } else {
          res.status(401).send('Incorrect email or password');
        }
      } else {
        res.status(401).send('Incorrect email or password');
      }
    }
  });
});

//LOGOUT
app.post('/logout', (req, res) => {
  console.log('Logout route called'); // Add this
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        res.status(500).send('Could not log out');
      } else {
        res.status(200).send('User logged out successfully');
      }
    });
  } else {
    res.status(400).send('No active session');
  }
});
//REGISTER

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const query = 'INSERT INTO users (name, email, password, verified) VALUES (?, ?, ?, ?)';
  db.query(query, [name, email, hashedPassword, false], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error occurred during registration');
    } else {
      console.log(results); // log the query results

      // Get the id of the newly created user
      const userId = results.insertId;

      // Send verification email
      sendVerificationEmail(name, email, userId);
      
      res.status(201).send('User registered successfully, please verify your email');
    }
  });
});

function sendVerificationEmail(name, email, userId) {
  // Generate a token
  const token = jwt.sign({ userId }, secretKey, { expiresIn: '1h' });

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Please confirm your email',
    text: `Dear ${name},\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\nhttp://localhost:3000/verify?token=${token}\n\nIf you did not request this, please ignore this email.\n`
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

app.get('/verify', (req, res) => {
  const token = req.query.token;

  // Verify the token
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      // Token is invalid or expired
      return res.status(400).send('Invalid token');
    } else {
      // Token is valid, mark user's email as verified
      const userId = decoded.userId;

      // Code to mark user's email as verified in database
      const query = 'UPDATE users SET verified = ? WHERE id = ?';
      db.query(query, [true, userId], (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).send('Error occurred during email verification');
        } else {
          res.send('Email verified successfully');
        }
      });
    }
  });
});


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
