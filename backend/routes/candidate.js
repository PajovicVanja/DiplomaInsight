const express = require('express');
const router = express.Router();
const db = require('../db');

const bcrypt = require('bcrypt');

router.post('/create', async (req, res) => {
  if (req.session) {
    console.log('Session exists');

    if (req.session.user) {
      console.log('User exists in the session');
    } else {
      console.log('User does NOT exist in the session');
    }
  } else {
    console.log('Session does NOT exist');
  }

  let candidates = req.body;

  if (!Array.isArray(candidates)) {
    candidates = [candidates];
  }

  const checkCandidateQuery = 'SELECT * FROM candidates WHERE email = ?';
  const insertQuery = 'INSERT INTO candidates (name, study_direction, university, faculty, enrollment_number, email, password,study_program) VALUES ?';

  for (let candidate of candidates) {
    db.query(checkCandidateQuery, [candidate.email], async (error, existingCandidates) => {
      if (error) {
        return res.status(500).send('Error occurred during candidate creation');
      }

      if (existingCandidates.length > 0) {
        return res.status(400).send(`Candidate with email ${candidate.email} already exists`);
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(candidate.email, salt);

        const values = [[
          candidate.name,
          candidate.studyDirection,
          candidate.university,
          candidate.faculty,
          candidate.enrollmentNumber,
          candidate.email,
          hashedPassword,
          candidate.studyProgram
        ]];

        db.query(insertQuery, [values], (error, results) => {
          if (error) {
            return res.status(500).send('Error occurred during candidate creation');
          } else {
            return res.status(201).send('Candidate created successfully');
          }
        });
      }
    });
  }
});

module.exports = router;







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

// Get candidates by user ID
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;

  const query = 'SELECT * FROM candidates WHERE mentor_id = ?';
  db.query(query, [userId], (error, results) => {
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
        email: candidate.email,
        studyProgram: candidate.study_program
      }));
      res.status(200).send(candidates);
    }
  });
});


// Get candidates by user ID
router.get('/', (req, res) => {
  if (req.session && req.session.user) {
    const mentorId = req.session.user.id; // Retrieve mentor ID from the session
    console.log('Mentor ID:', mentorId); // Log the mentor ID

    const query = 'SELECT * FROM candidates WHERE mentor_id = ?';
    db.query(query, [mentorId], (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error occurred during fetching candidates');
      } else {
        console.log('Query Results:', results); // Log the query results

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
  } else {
    res.status(401).send('Unauthorized');
  }
});

// Select all candidates
router.get('/user', (req, res) => {
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



module.exports = router;