const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/create', (req, res) => {
    const { name, faculty_id } = req.body;

    const query = 'INSERT INTO study_programs (name, faculty_id) VALUES (?, ?)';
    db.query(query, [name, faculty_id], (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error occurred during study program creation');
        } else {
            res.status(201).send('Study program created successfully');
        }
    });
});

router.get('/', (req, res) => {
    const query = 'SELECT * FROM study_programs';
    db.query(query, (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error occurred while fetching study programs');
        } else {
            res.status(200).json(results);
        }
    });
});

router.get('/studyProgram/:id', (req, res) => {
    const { id } = req.params;
  
    const query = 'SELECT name FROM study_programs WHERE id = ?';
    db.query(query, [id], (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error occurred during fetching university name');
      } else {
        res.status(200).send(results[0].name); 
      }
    });
  });


router.put('/:id', (req, res) => {
    const { name, faculty_id } = req.body;
    const { id } = req.params;

    const query = 'UPDATE study_programs SET name = ?, faculty_id = ? WHERE id = ?';
    db.query(query, [name, faculty_id, id], (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error occurred during study program update');
        } else {
            res.status(200).send('Study program updated successfully');
        }
    });
});


router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM study_programs WHERE id = ?';
    db.query(query, [id], (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error occurred during study program deletion');
        } else {
            res.status(200).send('Study program deleted successfully');
        }
    });
});

module.exports = router;
