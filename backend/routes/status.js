const express = require('express');
const router = express.Router();
const db = require('../db');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});


router.get('/statusForBar/:candidateId', (req, res) => {
  const { candidateId } = req.params;

  const query = 'SELECT disposition_status, theme_status FROM diploma_status WHERE candidate_id = ? ORDER BY id DESC LIMIT 1';

  db.query(query, [candidateId], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error occurred during fetching status');
    } else {
      if (results.length === 0) {
        
        res.status(404).send('No status found for this candidate');
      } else {
        const dispositionStatus = results[0].disposition_status;
        const themeStatus = results[0].theme_status;
        console.log(dispositionStatus);
        console.log(themeStatus);

        
        let response = {
          text: 'Submit your Disposition and Theme Form',
          color: 'red',
          percentage: 0,
        };

        
        if (dispositionStatus !== '' || themeStatus !== '') {
          if (dispositionStatus === 'Disposition Submitted' && themeStatus === 'Theme Submitted') {
            response = {
              text: 'Disposition and theme are submitted, wait for mentors response',
              color: 'orange',
              percentage: 40,
            };
          } else if (dispositionStatus === 'Disposition Disapproved' && themeStatus === 'Theme Submitted') {
            response = {
              text: 'Disposition disapproved, check under Diploma => Disapproved to see mentors comment and update your disposition',
              color: 'red',
              percentage: 30,
            };
          } else if (dispositionStatus === 'Disposition Submitted' && themeStatus === 'Theme Declined') {
            response = {
              text: 'Theme declined, update your theme in Diploma => Disapproved',
              color: 'red',
              percentage: 30,
            };
          } else if (dispositionStatus === 'Disposition Updated' && themeStatus === 'Theme Declined') {
            response = {
              text: 'Theme declined, update your theme in Diploma => Disapproved',
              color: 'red',
              percentage: 30,
            };
          } else if (dispositionStatus === 'Disposition Updated' && themeStatus === 'Theme Submitted') {
            response = {
              text: 'Disposition and theme are submitted. please wait for mentors response',
              color: 'orange',
              percentage: 50,
            };
          } else if (dispositionStatus === 'Disposition Approved' && themeStatus === 'Theme Declined') {
            response = {
              text: 'Theme declined, update your theme in Diploma => Disapproved',
              color: 'red',
              percentage: 40,
            };
          } else if (dispositionStatus === 'Disposition Approved' && themeStatus === 'Theme Submitted') {
            response = {
              text: 'You are almost there! Just wait for your mentor to send you signed document',
              color: 'blue',
              percentage: 70,
            };
          } else if (dispositionStatus === 'Disposition Approved' && themeStatus === 'Theme Accepted') {
            response = {
              text: 'Your mentor has sent you signed document, you can go and download it under Diploma => Download',
              color: 'lightseagreen',
              percentage: 90,
            };
          } else if (dispositionStatus === 'Disposition Downloaded' && themeStatus === 'Theme Accepted') {
            response = {
              text: 'Congratulations! Now start working on your diploma, watch out for deadlines!',
              color: 'green',
              percentage: 100,
            };
          } else {
            response = {
              text: 'Submit your Disposition and Theme Form',
              color: 'red',
              percentage: 0,
            };
          }
        }

        res.status(200).json(response);
      }
    }
  });
});
router.get('/diploma-status/current-user/:userId', async (req, res) => {

  const userId = req.params.userId;
  const query = `
      SELECT * FROM diploma_status WHERE candidate_id = ? AND progress_status IN ("Thesis Submitted", "Thesis Reviewed", "Thesis Defended", "Diploma Issued")`;
  db.query(query, [userId], (error, results) => {
    console.log(results)
    if (error) {
      console.log(error);
      res.status(500).send('Error occurred during fetching submitted dispositions');
    } else {
      const dispositions = results.map(disposition => ({
        id: disposition.id,
        mentorId: disposition.mentor_id,
        progressStatus: disposition.progress_status,
        deadline: disposition.deadline,
      }));
      res.status(200).send(dispositions);
    }
  });

});

router.put('/updateDeadline/:id', (req, res) => {
  const { deadline, candidateId } = req.body;
  const id = req.params.id;

  db.query(
    'UPDATE diploma_status SET deadline = ? WHERE id = ?',
    [deadline, id],
    (error, results) => {
      if (error) {
        console.log('Database operation error:', error);
        return res.status(500).json({ error });
      }

      
      db.query('SELECT email,name FROM candidates WHERE id = ?', [candidateId], (error, results) => {
        if (error) {
          console.log('Database operation error:', error);
          return res.status(500).json({ error });
        }

        const candidateEmail = results[0].email;  
        const candidateName = results[0].name;  

        const mailOptions = {
          from: process.env.GMAIL_USER,
          to: candidateEmail,
          subject: 'Deadline Update',
          text: `Dear ${candidateName},\n\nYour deadline has been updated to ${deadline}.\n\nPlease log in to the system to check the details.\n`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log('Error occurred while sending email:', error);
          } else {
            console.log('Email sent:', info.response);
          }
        });

        res.json({ message: 'Deadline updated successfully!' });
      });
    }
  );
});

router.put('/updateDefending/:id', async (req, res) => {
  const { deadline, candidateId } = req.body;
  const id = req.params.id;

  db.query(
    'UPDATE diploma_status SET defending = ? WHERE id = ?',
    [deadline, id],
    (error, results) => {
      if (error) {
        console.log('Database operation error:', error);
        return res.status(500).json({ error });
      }

      
      db.query('SELECT email, name FROM candidates WHERE id = ?', [candidateId], (error, results) => {
        if (error) {
          console.log('Database operation error:', error);
          return res.status(500).json({ error });
        }

        const candidateEmail = results[0].email;  
        const candidateName = results[0].name;  

        const mailOptions = {
          from: process.env.GMAIL_USER,
          to: candidateEmail,
          subject: 'Defending Deadline Update',
          text: `Dear ${candidateName},\n\nYour defending deadline has been updated to ${deadline}.\n\nPlease log in to the system to check the details.\n`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log('Error occurred while sending email:', error);
          } else {
            console.log('Email sent:', info.response);
          }
        });

        res.json({ message: 'Defending deadline updated successfully!' });
      });
    }
  );
});

router.put('/updateProgress/:dispositionId', async (req, res) => {
  try {
    const dispositionId = req.params.dispositionId;
    const { candidateId, mentorId, progressStatus } = req.body;
    
    let deadline = null;
    let defending = null;

    if (progressStatus === 'Thesis Reviewed') {
      const currentDate = new Date();
      const oneMonthFromNow = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000); 
      deadline = oneMonthFromNow.toISOString().slice(0, 10); 
    } else if (progressStatus === 'Thesis Defended') {
      
      deadline = null;
      defending = null;
    }

    
    const updateQuery = 'UPDATE diploma_status SET progress_status = ?, deadline = ?, defending = ? WHERE id = ?';
    await db.query(updateQuery, [progressStatus, deadline, defending, dispositionId]);

    res.json({ message: 'Disposition status updated successfully.' });
  } catch (error) {
    console.error('Error updating disposition status: ', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/accepted-themes/:candidateId', (req, res) => {
  const { candidateId } = req.params;

  const query = 'SELECT * FROM diploma_status WHERE candidate_id = ? AND theme_status = ?';

  db.query(query, [candidateId, "Theme Accepted"], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error occurred during fetching accepted themes');
    } else {
      const dispositions = results.map(disposition => ({
        id: disposition.id,
        candidateId: disposition.candidate_id,
        mentorId: disposition.mentor_id,
        dispositionPath: disposition.disposition,
        progressStatus: disposition.progress_status,
        deadline: disposition.deadline,
        defending: disposition.defending
      }));
      res.status(200).send(dispositions);
    }
  });
});

router.put('/diploma-status/update/:userId', async (req, res) => {
  const { userId } = req.params;
  const { progression_status } = req.body;
  let deadline = null;
  const currentDate = new Date();
  const oneYearFromNow = new Date(currentDate.setFullYear(currentDate.getFullYear() + 1));
  deadline = oneYearFromNow.toISOString().slice(0, 10);
  try {
    
    await db.query('UPDATE diploma_status SET progress_status = ? , deadline = ? WHERE candidate_id = ?', [progression_status, deadline, userId]);

    
    res.status(200).json({ message: 'Progression status updated successfully' });
  } catch (error) {
    
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating the progression status' });
  }
});

router.get('/diploma-status/thesis-submitted/:mentorId', (req, res) => {
  const { mentorId } = req.params;
  const query = `SELECT * FROM diploma_status WHERE mentor_id = ? AND (progress_status = "Thesis Submitted" OR progress_status = "Thesis Reviewed" OR progress_status = "Thesis Defended" OR progress_status = "Diploma Issued")`;

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
        progressStatus: disposition.progress_status,
        deadline: disposition.deadline
      }));
      res.status(200).send(dispositions);
    }
  });
});


router.get('/mentor/dispositionsCount/:mentorId', (req, res) => {
  const { mentorId } = req.params;
  const query = `SELECT COUNT(*) AS dispositionsCount FROM diploma_status 
                 WHERE mentor_id = ? AND 
                 (disposition_status = 'Disposition Submitted' OR disposition_status = 'Disposition Updated')`;
  db.query(query, [mentorId], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error occurred during fetching dispositions count');
    } else {
      res.status(200).send(results[0]);
    }
  });
});


router.get('/mentor/themesCount/:mentorId', (req, res) => {
  const { mentorId } = req.params;
  const query = `SELECT COUNT(*) AS themesCount FROM diploma_status 
                 WHERE mentor_id = ? AND theme_status = 'Theme Submitted'`;
  db.query(query, [mentorId], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error occurred during fetching themes count');
    } else {
      res.status(200).send(results[0]);
    }
  });
});


router.get('/mentor/candidates/:mentorId', (req, res) => {
  const { mentorId } = req.params;
  const query = 'SELECT id, name FROM candidates WHERE mentor_id = ?';
  db.query(query, [mentorId], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error occurred during fetching candidates');
    } else {
      const candidates = results.map(candidate => ({
        id: candidate.id,
        name: candidate.name
      }));
      const candidatesCount = candidates.length;
      res.status(200).send({ candidatesCount, candidates });
    }
  });
});

router.get('/calendar/:mentorId', (req, res) => {
  const { mentorId } = req.params;
  const query = 'SELECT candidate_id, name, deadline, defending FROM diploma_status INNER JOIN candidates ON diploma_status.candidate_id = candidates.id WHERE diploma_status.mentor_id = ?';;

  db.query(query, [mentorId], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error occurred during fetching calendar events');
    } else {
      const events = [];
      results.forEach((result) => {
        if (result.deadline) {
          events.push({
            title: result.name,
            start: formatDate(result.deadline),
            description: "Deadline",
            color: '#00080',
          });
        }
        if (result.defending) {
          events.push({
            title: result.name,
            start: formatDate(result.defending),
            description: "Defending date",
            color: '#800000',
          });
        }
      });

      function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
      console.log(events)
      res.status(200).send(events);
    }
  });
});

router.get('/mentorName/:mentorId', (req, res) => {
  const { mentorId } = req.params;
  const query = 'SELECT name FROM users WHERE id = ? ' ;

  db.query(query, [mentorId], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error occurred during fetching mentor name');
    } else {
      if (results.length > 0) {
        const mentorName = results[0].name;
        console.log("mentors name is"+mentorName)
        res.status(200).send({ name: mentorName });
      } else {
        res.status(404).send('No mentor with this id found');
      }
    }
  });
});

router.get('/mentor/data/:mentorId', (req, res) => {
  const { mentorId } = req.params;
  const query = 'SELECT progress_status, candidates.name FROM candidates inner join diploma_status on candidates.id = diploma_status.candidate_id WHERE diploma_status.mentor_id = ?';
  db.query(query, [mentorId], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error occurred during fetching candidates');
    } else {
      const candidates = results.map(candidate => ({
        id: candidate.id,
        name: candidate.name
      }));
      const candidatesCount = candidates.length;
      res.status(200).send({ candidatesCount, candidates });
    }
  });
});




module.exports = router;
