// routes/teamRoutes.js

const express = require('express');
const router = express.Router();

const { addMember, removeMember, getTeamMembers, getAllActivityLogs } = require('../controllers/leaderController');

const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');


router.use(protect, restrictTo('leader'));

router.post('/add', addMember);
router.delete('/remove/:id', removeMember);
router.get('/all', getTeamMembers);
router.get('/log', getAllActivityLogs);

module.exports = router;
