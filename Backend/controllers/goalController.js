const store = require('../data/store');
const { getBudgetStatus } = require('../services/budgetService');

const getGoal = (req, res) => {
  const budget = getBudgetStatus();
  res.json({ 
    success: true, 
    activeGoal: store.activeGoal, 
    goalLabel: store.goalPresets[store.activeGoal].label, 
    budget 
  });
};

const updateGoal = (req, res) => {
  const { goal } = req.body;

  if (!goal || !store.goalPresets[goal]) {
    return res.status(400).json({
      success: false,
      error: `Invalid goal. Must be one of: ${Object.keys(store.goalPresets).join(', ')}`,
    });
  }

  store.activeGoal = goal;
  const budget = getBudgetStatus();

  res.json({ 
    success: true, 
    activeGoal: store.activeGoal, 
    goalLabel: store.goalPresets[store.activeGoal].label, 
    budget 
  });
};

module.exports = {
  getGoal,
  updateGoal
};
