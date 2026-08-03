const express = require('express');
const router = express.Router();
const foodLogController = require('../controllers/foodLogController');

router.get('/', foodLogController.getFoodLog);
router.post('/', foodLogController.addFoodEntry);
router.delete('/:id', foodLogController.deleteFoodEntry);

module.exports = router;
