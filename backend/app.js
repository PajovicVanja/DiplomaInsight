const express = require('express')
const cors = require('cors');
const app = express()
const port = 3000
const db = require('./db');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

app.use(cors());
app.use(bodyParser.json());


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
          
          // Compare submitted password with hashed password
          const match = await bcrypt.compare(password, user.password);
          if (match) {
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
//REGISTER

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
  
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(query, [name, email, hashedPassword], (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error occurred during registration');
      } else {
        console.log(results); // log the query results
        res.status(201).send('User registered successfully');
      }
    });
  });


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
