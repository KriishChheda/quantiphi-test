const express = require('express');
const router = express.Router();

const foodLogRoutes = require('./foodLogRoutes');
const goalRoutes = require('./goalRoutes');

router.use('/food-log', foodLogRoutes);
router.use('/goal', goalRoutes);

module.exports = router;
