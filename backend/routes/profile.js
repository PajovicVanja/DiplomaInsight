const express = require('express');
const router = express.Router();
const db = require('../db');

// Fetching user profile data
router.get('/current', async (req, res) => {
    // Check if user is logged in
    if (!req.session.user) {
      return res.status(401).send('Please log in');
    }
  
    const userId = req.session.user.id; // Get user id from session
  
    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, [userId], (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error occurred during fetching user profile');
      } else {
        res.status(200).json(results[0]);
      }
    });
  });

  router.put('/current', async (req, res) => {
    if (!req.session.user) {
      return res.status(401).send('Please log in');
    }  
    const userId = req.session.user.id; // Get user id from session
    const { name, email } = req.body;
  
    const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
    db.query(query, [name, email, userId], (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error occurred during updating user profile');
      } else {
        res.status(200).send('User profile updated successfully');
      }
    });
  });


  module.exports = router;

  