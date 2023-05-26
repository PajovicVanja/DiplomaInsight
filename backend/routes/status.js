const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/statusForBar/:candidateId', (req, res) => {
  const { candidateId } = req.params;

  const query = 'SELECT disposition_status, theme_status FROM diploma_status WHERE candidate_id = ? ORDER BY id DESC LIMIT 1';

  db.query(query, [candidateId], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error occurred during fetching status');
    } else {
      if (results.length === 0) {
        // No status found for the candidateId
        res.status(404).send('No status found for this candidate');
      } else {
        const dispositionStatus = results[0].disposition_status;
        const themeStatus = results[0].theme_status;
        console.log(dispositionStatus);
        console.log(themeStatus);

        // Initialize the response with default values
        let response = {
          text: 'Submit your Disposition and Theme Form',
          color: 'red',
          percentage: 0,
        };

        // Update the response based on the actual statuses
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
          }  else if (dispositionStatus === 'Disposition Approved' && themeStatus === 'Theme Submitted') {
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
          } else  {
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
  const { deadline } = req.body;
  const id = req.params.id;

  // Update the diploma status entry in the database
  db.query(
    'UPDATE diploma_status SET deadline = ? WHERE id = ?',
    [deadline, id],
    (error, results) => {
      if (error) {
        console.log('Database operation error:', error);
        return res.status(500).json({ error });
      }

      // TODO: Send the updated disposition information to the appropriate recipients.
      // For now, we'll just send a success response.
      res.json({ message: 'Disposition deadline updated successfully!' });
    }
  );
});

router.put('/updateProgress/:dispositionId', async (req, res) => {
  try {
    const dispositionId = req.params.dispositionId;
    const { candidateId, mentorId, progressStatus } = req.body;
// Calculate the deadline based on the progress status
let deadline = null;
if (progressStatus === 'Thesis Reviewed') {
  const currentDate = new Date();
  const oneMonthFromNow = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000); // Add one month (30 days) to the current date
  deadline = oneMonthFromNow.toISOString().slice(0, 10); // Convert the deadline to YYYY-MM-DD format
} else if (progressStatus === 'Thesis Defended') {
  const currentDate = new Date();
  const oneMonthFromNow = new Date(currentDate.getTime() + 15 * 24 * 60 * 60 * 1000); // Add one month (30 days) to the current date
  deadline = oneMonthFromNow.toISOString().slice(0, 10); // Convert the deadline to YYYY-MM-DD format

} else if (progressStatus === 'Diploma Issued') {
  // Calculate and set the deadline for 'Diploma Issued' status
}

// Update the disposition status and deadline in the database
const updateQuery = 'UPDATE diploma_status SET progress_status = ?, deadline = ? WHERE id = ?';
await db.query(updateQuery, [progressStatus, deadline, dispositionId]);

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
        deadline:disposition.deadline
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
  const oneMonthFromNow = new Date(currentDate.getTime() + 240 * 24 * 60 * 60 * 1000); // Add one month (30 days) to the current date
  deadline = oneMonthFromNow.toISOString().slice(0, 10); // Convert the deadline to YYYY-MM-DD format
  try {
    // Update the progression_status in the diploma_status table
    await db.query('UPDATE diploma_status SET progress_status = ? , deadline = ? WHERE candidate_id = ?', [progression_status, deadline, userId]);

    // Send a success response
    res.status(200).json({ message: 'Progression status updated successfully' });
  } catch (error) {
    // Send an error response
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating the progression status' });
  }
});

router.get('/diploma-status/thesis-submitted/:mentorId', (req, res) => {
  const { mentorId } = req.params;
  const query = 'SELECT * FROM diploma_status WHERE mentor_id = ? AND progress_status = "Thesis Submitted" OR progress_status = "Thesis Reviewed" OR progress_status = "Thesis Defended" OR progress_status = "Diploma Issued"';
  
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
        deadline:disposition.deadline
      }));
      res.status(200).send(dispositions);
    }
  });
});

module.exports = router;
