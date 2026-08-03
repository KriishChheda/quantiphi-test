const store = require('../data/store');
const { calculateNutrition, getBudgetStatus } = require('../services/budgetService');

const getFoodLog = (req, res) => {
  const budget = getBudgetStatus();
  res.json({ success: true, data: store.foodLog, budget });
};

const addFoodEntry = (req, res) => {
  const { foodName, portionWeight, mealTime } = req.body;

  if (!foodName || !portionWeight) {
    return res.status(400).json({ success: false, error: 'foodName and portionWeight are required.' });
  }

  if (typeof portionWeight !== 'number' || portionWeight <= 0) {
    return res.status(400).json({ success: false, error: 'portionWeight must be a positive number.' });
  }

  const nutrition = calculateNutrition(foodName, portionWeight);

  const entry = {
    id: Date.now().toString(),
    foodName: foodName.trim(),
    portionWeight,
    mealTime: mealTime || new Date().toTimeString().slice(0, 5),
    timestamp: new Date().toISOString(),
    nutrition,
  };

  store.foodLog.push(entry);
  const budget = getBudgetStatus();
  res.status(201).json({ success: true, data: entry, budget });
};

const deleteFoodEntry = (req, res) => {
  const { id } = req.params;
  const index = store.foodLog.findIndex((entry) => entry.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Entry not found.' });
  }

  const deleted = store.foodLog.splice(index, 1)[0];
  const budget = getBudgetStatus();

  res.json({ success: true, deleted, budget });
};

module.exports = {
  getFoodLog,
  addFoodEntry,
  deleteFoodEntry
};
