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


module.exports = router;
