const express = require('express');
const router = express.Router();
const db = require('../db');

// Create a new university
router.post('/create', (req, res) => {
    const { name, location } = req.body;

    const query = 'INSERT INTO universities (name, location) VALUES (?, ?)';
    db.query(query, [name, location], (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error occurred during university creation');
        } else {
            res.status(201).send('University created successfully');
        }
    });
});

// Get a list of all universities
router.get('/', (req, res) => {
    const query = 'SELECT * FROM universities';
    db.query(query, (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error occurred during fetching universities');
        } else {
            res.status(200).send(results);
        }
    });
});

// Get a university by id
router.get('/:id', (req, res) => {
    const { id } = req.params;

    const query = 'SELECT * FROM universities WHERE id = ?';
    db.query(query, [id], (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error occurred during fetching university');
        } else {
            res.status(200).send(results);
        }
    });
});

// Update a university by id
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, location } = req.body;

    const query = 'UPDATE universities SET name = ?, location = ? WHERE id = ?';
    db.query(query, [name, location, id], (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error occurred during updating university');
        } else {
            res.status(200).send('University updated successfully');
        }
    });
});

// Delete a university by id
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM universities WHERE id = ?';
    db.query(query, [id], (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error occurred during deleting university');
        } else {
            res.status(200).send('University deleted successfully');
        }
    });
});

module.exports = router;
