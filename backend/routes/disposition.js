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
  

  router.get('/themed-dispositions/:mentorId', (req, res) => {
    const { mentorId } = req.params;
  
    const query = 'SELECT * FROM diploma_status WHERE mentor_id = ? AND status = "Theme Submitted"';
  
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
  
  
  router.get('/:candidateId', (req, res) => {
    const { candidateId } = req.params;
    const query = 'SELECT * FROM diploma_status WHERE candidate_id = ? ORDER BY id DESC ';
    db.query(query, [candidateId], (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error occurred during fetching current disposition');
      } else {
        if (results.length === 0) {
          // No current disposition found for the candidateId
          res.status(404).send('No current disposition found');
        } else {
          const currentDisposition = results[0];
          // Send the current disposition data as a response
          res.status(200).json(currentDisposition);
        }
      }
    });
  });
  
  
  const uploadT = multer({ dest: 'uploads/' });
// Route for submitting a dissertation theme for a specific disposition
router.post('/submitTheme/:dispositionId', uploadT.single('dissertationTheme'), (req, res) => {
  const theme = req.file;
  const { candidateId } = req.body;
  const id = req.params.dispositionId; // Updated to use req.params.dispositionId
  
  console.log(theme.path);
  console.log(candidateId);
  console.log(id);

  // Update the diploma_status table to set the status as "Theme Submitted" for the specific disposition and candidate
  db.query(
    'UPDATE diploma_status SET status = ?, theme = ? WHERE candidate_id = ? AND id = ?',
    ['Theme Submitted', theme.path, candidateId, id],
    (error, results) => {
      if (error) {
        console.log('Database operation error:', error);
        return res.status(500).json({ error });
      }

      // TODO: Perform any additional actions or notifications based on the theme submission.
      // For now, we'll just send a success response.
      res.json({ message: 'Dissertation theme submitted successfully!' });
    }
  );
});

router.get('/download-theme/:themeId', (req, res) => {
  const { themeId } = req.params;

  const query = 'SELECT theme FROM diploma_status WHERE id = ?';

  db.query(query, [themeId], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error occurred during fetching theme');
    } else {
      const themePath = results[0].theme;

      // Check if file exists
      fs.access(themePath, fs.constants.F_OK, (err) => {
        if (err) {
          console.log(err);
          res.status(404).send('File not found');
        } else {
          // If file exists, set headers and send file
          res.setHeader('Content-Type', 'application/octet-stream');
          res.setHeader('Content-Disposition', 'attachment; filename=theme.docx');
          res.sendFile(path.resolve(themePath));
        }
      });
    }
  });
});

router.post('/accept-theme/:themeId', (req, res) => {
  const { themeId } = req.params;

  const query = 'UPDATE diploma_status SET status = ? WHERE id = ?';

  db.query(query, ['Theme Accepted', themeId], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error occurred during accepting theme');
    } else {
      res.status(200).send('Theme accepted successfully');
    }
  });
});

router.post('/decline-theme/:themeId', (req, res) => {
  const { themeId } = req.params;

  const query = 'UPDATE diploma_status SET status = ? WHERE id = ?';

  db.query(query, ['Theme Declined', themeId], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error occurred during declining theme');
    } else {
      res.status(200).send('Theme declined successfully');
    }
  });
});  

//check current diploma
router.get('/status/:candidateId', (req, res) => {
  const { candidateId } = req.params;

  const query = 'SELECT status FROM diploma_status WHERE candidate_id = ? ORDER BY id DESC LIMIT 1';

  db.query(query, [candidateId], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error occurred during fetching status');
    } else {
      if (results.length === 0) {
        // No status found for the candidateId
        res.status(404).send('No status found for this candidate');
      } else {
        const status = results[0].status;
        // Send the current status as a response
        res.status(200).json({ currentStatus: status });
      }
    }
  });
});

module.exports = router;
