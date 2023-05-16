const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const authRoutes = require('./routes/auth'); // Import the auth routes
const indexRoutes = require('./routes/index'); // Import the index routes
const universityRoutes = require('./routes/university');
const facultyRoutes = require('./routes/faculty');
const studyProgramRoutes = require('./routes/studyProgram');
const profileRoutes = require('./routes/profile');


const app = express();
const port = 3000;

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
      sameSite: 'lax',
      secure:false
    }
  }));
app.use('/', indexRoutes); // Use index routes
app.use('/', authRoutes); // Use auth routes
app.use('/university', universityRoutes);
app.use('/faculty', facultyRoutes);
app.use('/studyProgram', studyProgramRoutes);
app.use('/profile', profileRoutes);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
  })
