const express = require('express');
const multer = require('multer');
const router = express.Router();
const db = require('../db');
const path = require('path');
const fs = require('fs');

// Set up multer for file upload
const upload = multer({ dest: 'uploads/' });

// Route for registering a thesis
router.post('/registerDisposition', upload.single('disposition'), (req, res) => {
  const disposition = req.file;

  // Instead of inserting data directly, let's just store the path to the .docx file
  const { candidateId, mentorId } = req.body;
  
  // First, insert the thesis proposal into the database
  db.query(
    'INSERT INTO diploma_status (status, candidate_id, mentor_id, disposition) VALUES (?, ?, ?, ?)',
    [ "Disposition Submitted",  candidateId, mentorId, disposition.path],
    (error, results) => {
      if (error) {
        console.log('Database operation error:', error);  // Log the error to the console
        return res.status(500).json({ error });
      }

      // TODO: Send the proposal form to the mentor for approval.
      // For now, we'll just send a success response.
      res.json({ message: 'Thesis proposal submitted successfully!' });
    }
  );
});


router.get('/download-disposition/:dispositionId', (req, res) => {
  const { dispositionId } = req.params;

  const query = 'SELECT disposition FROM diploma_status WHERE id = ?';

  db.query(query, [dispositionId], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error occurred during fetching disposition');
    } else {
      const dispositionPath = results[0].disposition;

      // Check if file exists
      fs.access(dispositionPath, fs.constants.F_OK, (err) => {
        if (err) {
          console.log(err);
          res.status(404).send('File not found');
        } else {
          // If file exists, set headers and send file
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
          res.setHeader('Content-Disposition', 'attachment; filename=disposition.docx');
          res.sendFile(path.resolve(dispositionPath));
        }
      });
    }
  });
});




  router.get('/mentor', (req, res) => {
    const query = 'SELECT * FROM users WHERE role = "user"  ';
    db.query(query, (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error occurred during fetching candidates');
      } else {
        const mentor = results.map(mentor => ({
          id: mentor.id,
          name: mentor.name,
          email: mentor.email
          
        }));
        res.status(200).send(mentor);
      }
    });
  });

  router.get('/submitted-dispositions/:mentorId', (req, res) => {
    const { mentorId } = req.params;
  
    const query = 'SELECT * FROM diploma_status WHERE mentor_id = ? AND status = "Disposition Submitted"';
  
    db.query(query, [mentorId], (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error occurred during fetching submitted dispositions');
      } else {
        const dispositions = results.map(disposition => ({
          id: disposition.id,
          candidateId: disposition.candidate_id,
          mentorId: disposition.mentor_id,
          dispositionPath: disposition.disposition,
          status: disposition.status
        }));
        res.status(200).send(dispositions);
      }
    });
  });
  //FOR APPROVING AND DISAPPROVING DISPOSITIONS
  router.post('/approve-disposition/:dispositionId', (req, res) => {
    const { dispositionId } = req.params;
    const { mentorId } = req.body;
  
    const statusQuery = 'UPDATE diploma_status SET status = ? WHERE id = ?';
    const mentorQuery = 'UPDATE candidates SET mentor_id = ? WHERE id = (SELECT candidate_id FROM diploma_status WHERE id = ?)';
  
    db.query(statusQuery, ["Disposition Approved", dispositionId], (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error occurred during approving disposition');
      } else {
        db.query(mentorQuery, [mentorId, dispositionId], (error, results) => {
          if (error) {
            console.log(error);
            res.status(500).send('Error occurred during assigning mentor');
          } else {
            res.status(200).send('Disposition approved and mentor assigned successfully');
          }
        });
      }
    });
  });
  
  router.post('/disapprove-disposition/:dispositionId', (req, res) => {
    const { dispositionId } = req.params;
  
    const query = 'UPDATE diploma_status SET status = ? WHERE id = ?';
  
    db.query(query, ["Disposition Disapproved", dispositionId], (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error occurred during disapproving disposition');
      } else {
        res.status(200).send('Disposition disapproved successfully');
      }
    });
  });
  
  
  
  
  
module.exports = router;
