const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/create', (req, res) => {
    let candidates = req.body;
  
    // If a single candidate object is sent, convert it to an array
    if (!Array.isArray(candidates)) {
      candidates = [candidates];
    }
  
    const query = 'INSERT INTO candidates (name, study_direction, university, faculty, enrollment_number, email) VALUES ?';
  
    const values = candidates.map(candidate => [
      candidate.name,
      candidate.studyDirection,
      candidate.university,
      candidate.faculty,
      candidate.enrollmentNumber,
      candidate.email
    ]);
  
    db.query(query, [values], (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error occurred during candidate creation');
      } else {
        res.status(201).send('Candidates created successfully');
      }
    });
  });
  

// Select all candidates
router.get('/', (req, res) => {
    const query = 'SELECT * FROM candidates';
    db.query(query, (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error occurred during fetching candidates');
      } else {
        const candidates = results.map(candidate => ({
          id: candidate.id,
          name: candidate.name,
          studyDirection: candidate.study_direction,
          university: candidate.university,
          faculty: candidate.faculty,
          enrollmentNumber: candidate.enrollment_number,
          email: candidate.email
        }));
        res.status(200).send(candidates);
      }
    });
  });
  
  
  
  // Get a candidate by ID
  router.get('/:id', (req, res) => {
    const { id } = req.params;
  
    const query = 'SELECT * FROM candidates WHERE id = ?';
    db.query(query, [id], (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error occurred during fetching candidate');
      } else {
        res.status(200).send(results);
      }
    });
  });
  
  // Update a candidate by ID
  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, studyDirection, university, faculty, enrollmentNumber, email } = req.body;
  
    const query = 'UPDATE candidates SET name = ?, study_direction = ?, university = ?, faculty = ?, enrollment_number = ?, email = ? WHERE id = ?';
    db.query(query, [name, studyDirection, university, faculty, enrollmentNumber, email, id], (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error occurred during updating candidate');
      } else {
        res.status(200).send('Candidate updated successfully');
      }
    });
  });
  
  // Delete a candidate by ID
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
  
    const query = 'DELETE FROM candidates WHERE id = ?';
    db.query(query, [id], (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error occurred during deleting candidate');
      } else {
        res.status(200).send('Candidate deleted successfully');
      }
    });
  });
  
  module.exports = router;