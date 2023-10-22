const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const crypto = require('crypto');
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
const path = require('path');

const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, 'dist')));
app.use(cors({
    origin: 'https://diploma-insight.onrender.com', 
    credentials: true,
    withCredentials: true
  }));
  
  app.use(bodyParser.json());
  
  // Session middleware
  const secretKey = crypto.randomBytes(64).toString('hex');
  app.use(session({
    secret: secretKey, 
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000, // 1 hour
      sameSite: 'lax',
      secure:false
    }
  }));
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
// app.listen(port, () => {
//     console.log(`App listening at https://diplomainsight.onrender.com/`)
//   })
module.exports = app;