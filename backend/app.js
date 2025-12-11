const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');

// ROUTES
const authRoutes = require('./routes/auth'); 
const indexRoutes = require('./routes/index'); 
const universityRoutes = require('./routes/university');
const facultyRoutes = require('./routes/faculty');
const studyProgramRoutes = require('./routes/studyProgram');
const profileRoutes = require('./routes/profile');
const candidateRoutes = require('./routes/candidate');
const dispositionRoutes = require('./routes/disposition');
const documentsRoutes = require('./routes/documents');
const statusRoutes = require('./routes/status');
const reminderRoutes = require('./routes/reminder');

const app = express();
const port = 3000;

/* ============================
   ✅ CORS
============================ */
app.use(cors({
  origin: 'https://diploma-insight.onrender.com',
  credentials: true,
  withCredentials: true
}));

app.use(bodyParser.json());

/* ============================
   ✅ SESSION SETUP
============================ */
const secretKey = crypto.randomBytes(64).toString('hex');

app.use(session({
  secret: secretKey, 
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000, // 1 hour
    sameSite: 'lax',
    secure: false
  }
}));

/* ============================
   ✅ A/B TEST – SKRIVENO U URL-u
============================ */

// 1️⃣ NASUMIČNO DODJELJIVANJE A ILI B
app.use((req, res, next) => {
  if (!req.session.abTestGroup) {
    req.session.abTestGroup = Math.random() < 0.5 ? 'A' : 'B';
  }
  next();
});

// 2️⃣ POSLUŽIVANJE ODABRANE VERZIJE
app.use((req, res, next) => {
  if (req.session.abTestGroup === 'A') {
    express.static(path.join(__dirname, 'dist'))(req, res, next);
  } else {
    express.static(path.join(__dirname, 'dist-b'))(req, res, next);
  }
});

/* ============================
   ✅ API ROUTES
============================ */
app.use('/', indexRoutes); 
app.use('/', authRoutes); 
app.use('/university', universityRoutes);
app.use('/faculty', facultyRoutes);
app.use('/studyProgram', studyProgramRoutes);
app.use('/profile', profileRoutes);
app.use('/candidate', candidateRoutes); 
app.use('/disposition', dispositionRoutes);
app.use('/document', documentsRoutes);
app.use('/status', statusRoutes);
app.use('/reminder', reminderRoutes);

/* ============================
   ✅ FRONTEND FALLBACK (SPA)
============================ */
app.get('*', (req, res) => {
  if (req.session.abTestGroup === 'A') {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  } else {
    res.sendFile(path.join(__dirname, 'dist-b/index.html'));
  }
});

/* ============================
   ✅ START SERVER
============================ */
app.listen(port, () => {
  console.log(`✅ App listening at https://diploma-insight.onrender.com/`);
});
