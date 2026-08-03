const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');

router.get('/', goalController.getGoal);
router.put('/', goalController.updateGoal);

module.exports = router;
