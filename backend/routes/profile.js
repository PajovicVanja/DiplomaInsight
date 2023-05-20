const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

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

// Updating user profile data
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

// Fetching all user profiles
router.get('/', async (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error occurred during fetching user profiles');
    } else {
      res.status(200).json(results);
    }
  });
});

// Delete a user by ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const queryDeleteCandidates = 'DELETE FROM candidates WHERE mentor_id = ?';
  db.query(queryDeleteCandidates, [id], (error) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error occurred during deleting candidates');
    } else {
      const queryDeleteUser = 'DELETE FROM users WHERE id = ?';
      db.query(queryDeleteUser, [id], (error) => {
        if (error) {
          console.log(error);
          res.status(500).send('Error occurred during deleting user');
        } else {
          res.status(200).send('User and associated candidates deleted successfully');
        }
      });
    }
  });
});


router.put('/:id', async (req, res) => {
  const userId = req.params.id;
  const { password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Update the user's password in the database
  const updatePasswordQuery = 'UPDATE users SET password = ? WHERE id = ?';
  db.query(updatePasswordQuery, [hashedPassword, userId], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error occurred during updating user password');
    } else {
      res.status(200).send('User password updated successfully');
    }
  });
});


module.exports = router;
