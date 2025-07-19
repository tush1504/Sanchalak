// routes/dashboardRoutes.js

const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');
const { getLeaderDashboard, getMemberDashboard } = require('../controllers/dashboardController');

router.get('/leader', protect, restrictTo('leader'), getLeaderDashboard);
router.get('/member', protect, restrictTo('member'), getMemberDashboard);

module.exports = router;