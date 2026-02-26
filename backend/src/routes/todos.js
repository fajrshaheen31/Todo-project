const express = require('express');
const router = express.Router();

// placeholder route handlers
router.get('/', (req, res) => {
    res.send('List of todos');
});

router.post('/', (req, res) => {
    res.send('Create todo');
});

module.exports = router;
