const store = require('../data/store');

function calculateNutrition(foodName, portionWeight) {
  const key = foodName.toLowerCase();
  const nutrition = store.nutritionPer100g[key] || store.defaultNutrition;
  const multiplier = portionWeight / 100;

  return {
    calories: Math.round(nutrition.calories * multiplier),
    protein: Math.round(nutrition.protein * multiplier),
    carbs: Math.round(nutrition.carbs * multiplier),
    fats: Math.round(nutrition.fats * multiplier),
  };
}

function getBudgetStatus() {
  const limits = store.goalPresets[store.activeGoal];

  const totals = store.foodLog.reduce(
    (acc, item) => {
      acc.calories += item.nutrition.calories;
      acc.protein += item.nutrition.protein;
      acc.carbs += item.nutrition.carbs;
      acc.fats += item.nutrition.fats;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const remaining = {
    calories: limits.calories - totals.calories,
    protein: limits.protein - totals.protein,
    carbs: limits.carbs - totals.carbs,
    fats: limits.fats - totals.fats,
  };

  const percentage = {
    calories: limits.calories > 0 ? Math.round((totals.calories / limits.calories) * 100) : 0,
    protein: limits.protein > 0 ? Math.round((totals.protein / limits.protein) * 100) : 0,
    carbs: limits.carbs > 0 ? Math.round((totals.carbs / limits.carbs) * 100) : 0,
    fats: limits.fats > 0 ? Math.round((totals.fats / limits.fats) * 100) : 0,
  };

  const exceededLimits = [];
  if (totals.calories > limits.calories) exceededLimits.push({ name: 'Calories', overBy: totals.calories - limits.calories, unit: 'kcal' });
  if (totals.protein > limits.protein) exceededLimits.push({ name: 'Protein', overBy: totals.protein - limits.protein, unit: 'g' });
  if (totals.carbs > limits.carbs) exceededLimits.push({ name: 'Carbs', overBy: totals.carbs - limits.carbs, unit: 'g' });
  if (totals.fats > limits.fats) exceededLimits.push({ name: 'Fats', overBy: totals.fats - limits.fats, unit: 'g' });

  let status;
  if (exceededLimits.length > 0) {
    status = 'exceeded';
  } else if (totals.calories >= limits.calories * 0.8) {
    status = 'warning';
  } else {
    status = 'under';
  }

  return {
    totals,
    remaining,
    percentage,
    limits: { calories: limits.calories, protein: limits.protein, carbs: limits.carbs, fats: limits.fats },
    activeGoal: store.activeGoal,
    goalLabel: limits.label,
    status,
    exceededLimits,
  };
}

module.exports = {
  calculateNutrition,
  getBudgetStatus
};
