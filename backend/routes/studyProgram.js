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


module.exports = router;
