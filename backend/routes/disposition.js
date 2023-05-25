const express = require('express');
const multer = require('multer');
const router = express.Router();
const db = require('../db');
const path = require('path');
const fs = require('fs');
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


// Set up multer for file upload
const upload = multer({ dest: 'uploads/' });

// Route for registering a thesis
router.post('/registerDisposition', upload.single('disposition'), async (req, res) => {
  const disposition = req.file;

  // Instead of inserting data directly, let's just store the path to the .docx file
  const { candidateId, mentorId } = req.body;

  // First, insert the thesis proposal into the database
  db.query(
    'INSERT INTO diploma_status (disposition_status, candidate_id, mentor_id, disposition) VALUES (?, ?, ?, ?)',
    ['Disposition Submitted', candidateId, mentorId, disposition.path],
    async (error, results) => {
      if (error) {
        console.log('Database operation error:', error); // Log the error to the console
        return res.status(500).json({ error });
      }

      try {
        // Retrieve mentor's email from the users table
        const mentorEmail = await new Promise((resolve, reject) => {
          db.query('SELECT email FROM users WHERE id = ?', [mentorId], (error, results) => {
            if (error) {
              console.log('Error occurred while fetching mentor email:', error);
              reject(error);
            } else {
              const mentorEmail = results[0].email;
              resolve(mentorEmail);
            }
          });
        });
        const mentorName = await new Promise((resolve, reject) => {
          db.query('SELECT name FROM users WHERE id = ?', [mentorId], (error, results) => {
            if (error) {
              console.log('Error occurred while fetching mentor email:', error);
              reject(error);
            } else {
              const mentorName = results[0].name;
              resolve(mentorName);
            }
          });
        });

        // Send the proposal form to the mentor for approval
        const mailOptions = {
          from: process.env.GMAIL_USER,
          to: mentorEmail,
          subject: 'Thesis Proposal Submission',
          text: `Dear ${mentorName},\n\nStudent with id: ${candidateId} has submitted a disposition that is waiting your review and approval.\n\nPlease log in to the system to access the proposal form.\n`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log('Error occurred while sending email:', error);
          } else {
            console.log('Email sent:', info.response);
          }
        });

        // Send a success response
        res.json({ message: 'Thesis proposal submitted successfully!' });
      } catch (error) {
        console.error('Error occurred while submitting thesis proposal:', error);
        res.status(500).json({ error: 'An error occurred while submitting the thesis proposal.' });
      }
    }
  );
});
router.put('/updateDisposition/:id', upload.single('disposition'), async (req, res) => {
  const disposition = req.file;
  const { candidateId, mentorId } = req.body;
  const id = req.params.id;

  try {
    // Update the diploma status entry in the database
    db.query(
      'UPDATE diploma_status SET disposition_status = ?, candidate_id = ?, mentor_id = ?, disposition = ? WHERE id = ?',
      ['Disposition Updated', candidateId, mentorId, disposition.path, id],
      (error, results) => {
        if (error) {
          console.log('Database operation error:', error);
          return res.status(500).json({ error });
        }

        // Send an email to the mentor
        sendDispositionUpdateEmail(mentorId, candidateId);

        // Send a success response
        res.json({ message: 'Disposition updated successfully!' });
      }
    );
  } catch (error) {
    console.error('Error occurred while updating the disposition:', error);
    res.status(500).json({ error: 'An error occurred while updating the disposition.' });
  }
});

function sendDispositionUpdateEmail(mentorId, candidateId) {
  db.query('SELECT email, name FROM users WHERE id = ?', [mentorId], (error, results) => {
    if (error) {
      console.log('Error occurred while fetching mentor email:', error);
      return;
    }

    const mentorEmail = results[0].email;
    const mentorName = results[0].name;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: mentorEmail,
      subject: 'Disposition Update',
      text: `Dear ${mentorName},\n\nThe disposition for candidate ID ${candidateId} has been updated.\n\nPlease log in to the system to review the updated disposition.\n`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error occurred while sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  });
}



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
  
    const query = 'SELECT * FROM diploma_status WHERE mentor_id = ? AND disposition_status = "Disposition Submitted"';
  
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
          dispositionStatus: disposition.disposition_status
        }));
        res.status(200).send(dispositions);
      }
    });
  });
  router.get('/submitted-dispositionsUpdated/:mentorId', (req, res) => {
    const { mentorId } = req.params;
  
    const query = 'SELECT * FROM diploma_status WHERE mentor_id = ? AND disposition_status = "Disposition Updated"';
  
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
          dispositionStatus: disposition.disposition_status
        }));
        res.status(200).send(dispositions);
      }
    });
  });
  

  router.get('/themed-dispositions/:mentorId', (req, res) => {
    const { mentorId } = req.params;
  
    const query = 'SELECT * FROM diploma_status WHERE mentor_id = ? AND theme_status = "Theme Submitted"';
  
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
          themeStatus: disposition.theme_status
        }));
        res.status(200).send(dispositions);
      }
    });
  });

  //FOR APPROVING AND DISAPPROVING DISPOSITIONS
  router.post('/approve-disposition/:dispositionId', (req, res) => {
    const { dispositionId } = req.params;
    const { mentorId } = req.body;
  
    const statusQuery = 'UPDATE diploma_status SET disposition_status = ? WHERE id = ?';
    const mentorQuery = 'UPDATE candidates SET mentor_id = ? WHERE id = (SELECT candidate_id FROM diploma_status WHERE id = ?)';
  
    db.query(statusQuery, ['Disposition Approved', dispositionId], (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error occurred during approving disposition');
      } else {
        db.query(mentorQuery, [mentorId, dispositionId], (error, results) => {
          if (error) {
            console.log(error);
            res.status(500).send('Error occurred during assigning mentor');
          } else {
            // Fetch the candidate's ID using the disposition ID
            db.query('SELECT candidate_id FROM diploma_status WHERE id = ?', [dispositionId], (error, results) => {
              if (error) {
                console.log('Error occurred while fetching candidate ID:', error);
                return;
              }
  
              const candidateId = results[0].candidate_id;
  
              // Fetch the candidate's email using the candidate ID
              db.query('SELECT email,name FROM candidates WHERE id = ?', [candidateId], (error, results) => {
                if (error) {
                  console.log('Error occurred while fetching candidate email:', error);
                  return;
                }
  
                const candidateEmail = results[0].email;
                const candidateName = results[0].name;
  
                // Send an email to the candidate
                sendApprovalEmail(candidateEmail,candidateName);
  
                // Send a success response
                res.status(200).send('Disposition approved and mentor assigned successfully');
                
              });
            });
          }
        });
      }
    });
  });
  
  function sendApprovalEmail(candidateEmail,candidateName) {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: candidateEmail,
      subject: 'Disposition Approval',
      text: `Dear ${candidateName},\n\nYour disposition has been approved.\n\nCongratulations on this achievement!\n`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error occurred while sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  }
  
  router.post('/disapprove-disposition/:dispositionId', (req, res) => {
    const { dispositionId } = req.params;
  
    const query = 'UPDATE diploma_status SET disposition_status = ? WHERE id = ?';
  
    db.query(query, ['Disposition Disapproved', dispositionId], (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error occurred during disapproving disposition');
      } else {
        // Fetch the candidate's ID using the disposition ID
        db.query('SELECT candidate_id FROM diploma_status WHERE id = ?', [dispositionId], (error, results) => {
          if (error) {
            console.log('Error occurred while fetching candidate ID:', error);
            return;
          }
  
          const candidateId = results[0].candidate_id;
  
          // Fetch the candidate's email using the candidate ID
          db.query('SELECT email,name FROM candidates WHERE id = ?', [candidateId], (error, results) => {
            if (error) {
              console.log('Error occurred while fetching candidate email:', error);
              return;
            }
  
            const candidateEmail = results[0].email;
            const candidateName = results[0].name;
  
            // Send an email to the candidate
            sendDisapprovalEmail(candidateEmail,candidateName);
  
            // Send a success response
            res.status(200).send('Disposition disapproved successfully');
          });
        });
      }
    });
  });
  
  function sendDisapprovalEmail(candidateEmail,candidateName) {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: candidateEmail,
      subject: 'Disposition Disapproval',
      text: `Dear ${candidateName},\n\nYour disposition has been disapproved.\n\nPlease log in and check disapproved list for further information.\n`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error occurred while sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  }
  
  
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
router.post('/submitTheme/:dispositionId', uploadT.single('dissertationTheme'), async (req, res) => {
  const theme = req.file;
  const { candidateId } = req.body;
  const dispositionId = req.params.dispositionId; // Updated to use req.params.dispositionId

  try {
    // Retrieve mentor's ID from the diploma_status table
    const mentorId = await new Promise((resolve, reject) => {
      db.query('SELECT mentor_id FROM diploma_status WHERE candidate_id = ? AND id = ?', [candidateId, dispositionId], (error, results) => {
        if (error) {
          console.log('Error occurred while fetching mentor ID:', error);
          reject(error);
        } else {
          const mentorId = results[0].mentor_id;
          resolve(mentorId);
        }
      });
    });
    const mentorName = await new Promise((resolve, reject) => {
      db.query('SELECT name FROM users WHERE id = ?', [mentorId], (error, results) => {
        if (error) {
          console.log('Error occurred while fetching mentor ID:', error);
          reject(error);
        } else {
          const mentorName = results[0].name;
          resolve(mentorName);
        }
      });
    });

    // Update the diploma_status table to set the theme status as "Theme Submitted" for the specific disposition and candidate
    db.query(
      'UPDATE diploma_status SET theme_status = ?, theme = ? WHERE candidate_id = ? AND id = ?',
      ['Theme Submitted', theme.path, candidateId, dispositionId],
      (error, results) => {
        if (error) {
          console.log('Database operation error:', error);
          return res.status(500).json({ error });
        }

        // Send an email to the mentor
        sendThemeSubmissionEmail(mentorId, candidateId, mentorName);

        // Send a success response
        res.json({ message: 'Dissertation theme submitted successfully!' });
      }
    );
  } catch (error) {
    console.error('Error occurred while submitting dissertation theme:', error);
    res.status(500).json({ error: 'An error occurred while submitting the dissertation theme.' });
  }
});

function sendThemeSubmissionEmail(mentorId, candidateId, mentorName) {
  db.query('SELECT email FROM users WHERE id = ?', [mentorId], (error, results) => {
    if (error) {
      console.log('Error occurred while fetching mentor email:', error);
      return;
    }

    const mentorEmail = results[0].email;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: mentorEmail,
      subject: 'Dissertation Theme Submission',
      text: `Dear ${mentorName},\n\nTheme form has been submitted by candidate ID ${candidateId} for your review and signature.\n\nPlease log in to the system to access the theme.\n`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error occurred while sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  });
}


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
router.get('/download-themeSigned/:themeId', (req, res) => {
  const { themeId } = req.params;

  const selectQuery = 'SELECT signed_theme FROM diploma_status WHERE id = ?';
  const updateQuery = 'UPDATE diploma_status SET disposition_status = ? WHERE id = ?';

  db.query(selectQuery, [themeId], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error occurred during fetching theme');
    } else {
      const themePath = results[0].signed_theme;

      // Check if file exists
      fs.access(themePath, fs.constants.F_OK, (err) => {
        if (err) {
          console.log(err);
          res.status(404).send('File not found');
        } else {
          // If file exists, set headers and send file
          res.setHeader('Content-Type', 'application/octet-stream');
          res.setHeader('Content-Disposition', 'attachment; filename=themeSigned.docx');
          res.sendFile(path.resolve(themePath));

          // Update the disposition status to "Disposition Downloaded"
          db.query(updateQuery, ['Disposition Downloaded', themeId], (error) => {
            if (error) {
              console.log(error);
            }
          });
        }
      });
    }
  });
});

router.post('/accept-theme/:themeId', (req, res) => {
  const { themeId } = req.params;

  const query = 'UPDATE diploma_status SET theme_status = ? WHERE id = ?';

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

  const query = 'UPDATE diploma_status SET theme_status = ? WHERE id = ?';

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

  const query = 'SELECT theme_status FROM diploma_status WHERE candidate_id = ? ORDER BY id DESC LIMIT 1';

  db.query(query, [candidateId], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error occurred during fetching theme status');
    } else {
      if (results.length === 0) {
        // No theme_status found for the candidateId
        res.status(404).send('No theme status found for this candidate');
      } else {
        const themeStatus = results[0].theme_status;
        // Send the current theme_status as a response
        res.status(200).json({ currentThemeStatus: themeStatus });
      }
    }
  });
});

router.post('/uploadSignedTheme/:dispositionId', upload.single('signedTheme'), (req, res) => {
  const signedTheme = req.file;
  const dispositionId = req.params.dispositionId;

  console.log(signedTheme.path);
  console.log(dispositionId);

  db.query(
    'UPDATE diploma_status SET signed_theme = ? WHERE id = ?',
    [signedTheme.path, dispositionId],
    (error, results) => {
      if (error) {
        console.log('Database operation error:', error);
        return res.status(500).json({ error });
      }

      // Fetch the student's email using the disposition ID
      db.query('SELECT candidate_id FROM diploma_status WHERE id = ?', [dispositionId], (error, results) => {
        if (error) {
          console.log('Error occurred while fetching student ID:', error);
          return;
        }

        const candidateId = results[0].candidate_id;

        // Fetch the student's email using the candidate ID
        db.query('SELECT email,name FROM candidates WHERE id = ?', [candidateId], (error, results) => {
          if (error) {
            console.log('Error occurred while fetching student email:', error);
            return;
          }

          const studentEmail = results[0].email;
          const studentName = results[0].name;

          // Send an email to the student
          sendSignedThemeEmail(studentEmail,studentName);

          res.json({ message: 'Signed theme submitted successfully!' });
        });
      });
    }
  );
});

function sendSignedThemeEmail(studentEmail,studentName) {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: studentEmail,
    subject: 'Signed Theme Submission',
    text: `Dear ${studentName},\n\nYour signed theme documents are now available for download.\n\nPlease log in to the system to download them and make sure to submit them to the faculty before the submission deadline.\n`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error occurred while sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

router.post('/comment/:dispositionId', (req, res) => {
  const { comment } = req.body; // Extract the comment from the request body
  const { dispositionId } = req.params; // Extract the dispositionId from the request parameters

  db.query(
    'UPDATE diploma_status SET comment = ? WHERE id = ?',
    [comment, dispositionId],
    (error, results) => {
      if (error) {
        console.log('Database operation error:', error);
        return res.status(500).json({ error });
      }

      res.json({ message: 'Comment successfully added!' });
    }
  );
});

router.get('/comment/:candidateId', (req, res) => {
  const { candidateId } = req.params;

  db.query(
    'SELECT comment FROM diploma_status WHERE candidate_id = ?',
    [candidateId],
    (error, results) => {
      if (error) {
        console.log('Database operation error:', error);
        return res.status(500).json({ error });
      }

      res.json({ comment: results[0].comment });
    }
  );
});
router.get('/accepted-themes/:candidateId', (req, res) => {
  const { candidateId } = req.params;

  const query = 'SELECT * FROM diploma_status WHERE candidate_id = ? AND theme_status = ?';

  db.query(query, [candidateId, "Theme Accepted"], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error occurred during fetching accepted themes');
    } else {
      if (results.length === 0) {
        // No accepted themes found for the candidateId
        res.status(404).send('No accepted themes found for this candidate');
      } else {
        // Send the accepted themes as a response
        res.status(200).json(results);
      }
    }
  });
});

router.get('/statuss/:candidateId', (req, res) => {
  const { candidateId } = req.params;

  const query = 'SELECT disposition_status, theme_status FROM diploma_status WHERE candidate_id = ?';

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





module.exports = router;
