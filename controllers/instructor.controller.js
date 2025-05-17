const Instructor = require('../db/models/instructor.model');

/**
 * @swagger
 * definitions:
 *   Instructor:
 *     type: object
 *     required:
 *       - id
 *       - firstName
 *       - lastName
 *       - email
 *     properties:
 *       id:
 *         type: integer
 *       firstName:
 *         type: string
 *       lastName:
 *         type: string
 *       email:
 *         type: string
 */

/**
 * @swagger
 * /instructors:
 *   get:
 *     summary: Get all instructors
 *     tags:
 *       - Instructors
 *     responses:
 *       200:
 *         description: A list of instructors
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Instructor'
 *       500:
 *         description: Server error
 */

const getInstructors = async (req, res) => {
    const instructors = await Instructor.getAll();
    console.log(instructors);
    res.status(200).json(instructors);
};

/**
 * @swagger
 * /instructors:
 *   post:
 *     summary: Add a new instructor
 *     tags:
 *       - Instructors
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: instructor
 *         description: Instructor object
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Instructor'
 *     responses:
 *       201:
 *         description: Instructor created
 *         schema:
 *           $ref: '#/definitions/Instructor'
 *       500:
 *         description: Error while creating new instructor
 */

const addInstructor = async (req, res) => {
    const payload = req.body;

    try {
        const [data] = await Instructor.count();
        const newUser = {
            id: data.count + 1,
            ...payload,
        };
        const result = await Instructor.create(newUser);
        console.log(result);
        if (result.affectedRows === 1) {
            res.status(201).json({ message: 'New instructor created', data: newUser });
        } else {
            throw new Error('Something went wrong');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error while creating new instructor' });
    }
};

/**
 * @swagger
 * /instructors/{id}:
 *   delete:
 *     summary: Delete an instructor by ID
 *     tags:
 *       - Instructors
 *     parameters:
 *       - in: path
 *         name: id
 *         type: integer
 *         required: true
 *         description: ID of the instructor
 *     responses:
 *       200:
 *         description: Instructor deleted successfully
 *       404:
 *         description: Instructor not found
 *       500:
 *         description: Error deleting instructor
 */

const deleteInstructor = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Instructor.delete(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Instructor not found' });
        }

        return res.status(200).json({ message: 'Instructor deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error deleting instructor' });
    }
};

module.exports = {
    getInstructors,
    addInstructor,
    deleteInstructor,
};
