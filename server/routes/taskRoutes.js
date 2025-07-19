// routes/taskRoutes.js

const express = require('express');
const router = express.Router();

const { createTask, deleteTask, getAllTasks, getMyTasks, updateTaskStatus } = require('../controllers/taskController');

const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

// Routes accessible to team leader
router.post('/create', protect, restrictTo('leader'), createTask);
router.delete('/delete/:id', protect, restrictTo('leader'), deleteTask);
router.get('/all', protect, restrictTo('leader'), getAllTasks);

// Routes accessible to team members
router.get('/mytask', protect, restrictTo('member'), getMyTasks);
router.patch('/status/:id', protect, restrictTo('member'), updateTaskStatus);

module.exports = router;
