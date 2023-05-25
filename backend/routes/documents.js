const express = require('express');
const multer = require('multer');
const router = express.Router();
const db = require('../db');
const path = require('path');
const fs = require('fs');

const upload = multer({ dest: 'documents/' }); // Set the destination for uploaded files

// API endpoint for saving the documents
router.post('/create', upload.fields([
  { name: 'blank_theme', maxCount: 1 },
  { name: 'blank_disposition', maxCount: 1 }
]), (req, res) => {
  const { blank_theme, blank_disposition } = req.files;
  const query = 'INSERT INTO documents (blank_theme, blank_disposition) VALUES (?, ?)';

  db.query(query, [blank_theme[0].path, blank_disposition[0].path], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error occurred while saving the documents');
    } else {
      res.status(200).json({ message: 'Documents saved successfully!' });
    }
  });
});

// API endpoint for updating the documents
router.put('/update/:id', upload.fields([
  { name: 'blank_theme', maxCount: 1 },
  { name: 'blank_disposition', maxCount: 1 }
]), (req, res) => {
  const { blank_theme, blank_disposition } = req.files;
  const { id } = req.params;
  const query = 'UPDATE documents SET blank_theme = ?, blank_disposition = ? WHERE id = ?';

  db.query(query, [blank_theme[0].path, blank_disposition[0].path, id], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error occurred while updating the documents');
    } else {
      res.status(200).json({ message: 'Documents updated successfully!' });
    }
  });
});


// API endpoint for downloading the blank theme form
router.get('/download/theme', (req, res) => {
    const query = 'SELECT blank_theme FROM documents ORDER BY id DESC LIMIT 1';
  
    db.query(query, (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error occurred during fetching the blank theme form');
      } else {
        const filePath = results[0].blank_theme;
  
        // Check if file exists
        fs.access(filePath, fs.constants.F_OK, (err) => {
          if (err) {
            console.log(err);
            res.status(404).send('File not found');
          } else {
            // If file exists, set headers and send file
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', 'attachment; filename=blank_theme_form.docx');
            res.sendFile(path.resolve(filePath));
          }
        });
      }
    });
  });
  
  // API endpoint for downloading the blank disposition form
  router.get('/download/disposition', (req, res) => {
    const query = 'SELECT blank_disposition FROM documents ORDER BY id DESC LIMIT 1';
  
    db.query(query, (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error occurred during fetching the blank disposition form');
      } else {
        const filePath = results[0].blank_disposition;
  
        // Check if file exists
        fs.access(filePath, fs.constants.F_OK, (err) => {
          if (err) {
            console.log(err);
            res.status(404).send('File not found');
          } else {
            // If file exists, set headers and send file
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', 'attachment; filename=blank_disposition_form.docx');
            res.sendFile(path.resolve(filePath));
          }
        });
      }
    });
  });
  


module.exports = router;