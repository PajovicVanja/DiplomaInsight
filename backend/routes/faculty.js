const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/create', (req, res) => {
    const { name, university_id } = req.body;

    const query = 'INSERT INTO faculties (name, university_id) VALUES (?, ?)';
    db.query(query, [name, university_id], (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error occurred during faculty creation');
        } else {
            res.status(201).send('Faculty created successfully');
        }
    });
});

router.get('/', (req, res) => {
    const query = 'SELECT * FROM faculties';
    db.query(query, (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error occurred while fetching faculties');
        } else {
            res.status(200).json(results);
        }
    });
});


router.put('/:id', (req, res) => {
    const { name, university_id } = req.body;
    const { id } = req.params;

    const query = 'UPDATE faculties SET name = ?, university_id = ? WHERE id = ?';
    db.query(query, [name, university_id, id], (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error occurred during faculty update');
        } else {
            res.status(200).send('Faculty updated successfully');
        }
    });
});

router.get('/faculty/:id', (req, res) => {
    const { id } = req.params;
  
    const query = 'SELECT name FROM faculties WHERE id = ?';
    db.query(query, [id], (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error occurred during fetching faculty name');
      } else {
        res.status(200).send(results[0].name); 
      }
    });
  });


router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const deleteFacultiesQuery = 'DELETE FROM faculties WHERE id = ?';
    const deleteStudyProgramsQuery = 'DELETE FROM study_programs WHERE faculty_id = ? ';

    db.query(deleteStudyProgramsQuery, [id], (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error occurred during deleting study programs');
            return;
        }
        db.query(deleteFacultiesQuery, [id], (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).send('Error occurred during deleting faculties');
            } else {
                res.status(200).send('University deleted successfully');
            }
        });
    });

});


module.exports = router;
