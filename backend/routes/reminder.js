const express = require('express');
const router = express.Router();
const db = require('../db');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const moment = require('moment');
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


cron.schedule('0 0 1 * *', function() {
  console.log('Running the monthly email notifier.');

  
  db.query('SELECT * FROM diploma_status JOIN candidates ON diploma_status.candidate_id = candidates.id WHERE deadline IS NOT NULL', (error, results) => {
    if (error) {
      console.log('Database operation error:', error);
      return;
    }

    
    results.forEach(row => {
      const now = moment();
      const deadline = moment(row.deadline);
      const monthsRemaining = deadline.diff(now, 'months');

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: row.email,
        subject: 'Deadline Reminder',
        text: `Dear ${row.name},\n\nYou have ${monthsRemaining} months remaining until your deadline.\n\nPlease log in to the system to check the details.\n`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error occurred while sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    });
  });
});

cron.schedule('0 0 * * 1', () => {
    
    console.log('Running the task every minute');
  
    let query = 'SELECT * FROM diploma_status JOIN users ON diploma_status.mentor_id = users.id WHERE defending IS NOT NULL';
  
    db.query(query, function(error, results, fields) {
      if (error) {
        console.log("An error occurred executing the query.");
        return console.log(error.message);
      }
      console.log(`Query returned ${results.length} rows`);

  
      results.forEach((result) => {
        const { email, defending } = result;
    
        if (!email || !defending) {
          console.log('Missing necessary field');
          return;
        }
    
        const defendingDate = moment(defending);
        const now = moment();
    
        if (defendingDate.diff(now, 'days') <= 7) {
          console.log(`Sending email to ${email}`);
          const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Defending Reminder',
            text: `Hello, you have a defending coming up on ${defendingDate.format('YYYY-MM-DD')}. Please prepare accordingly.`,
          };
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log('Error occurred while sending email:', error);
            } else {
              console.log('Email sent:', info.response);
            }
          });
        }
      });
    });
  });

module.exports = router;
