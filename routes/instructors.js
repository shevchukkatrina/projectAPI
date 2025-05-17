const express = require('express');
const {
    getInstructors,
    addInstructor,
    deleteInstructor,
} = require('../controllers/instructor.controller');

const router = express.Router();

router.get('/', getInstructors);

router.post('/', addInstructor);

router.delete('/:id', deleteInstructor);

module.exports = router;
