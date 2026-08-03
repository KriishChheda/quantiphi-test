const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// ===== In-Memory Store =====
let foodLog = [];

// ===== Fitness Goal Presets =====
const goalPresets = {
  weightloss: {
    label: 'Weight Loss',
    calories: 1500,
    protein: 130,
    carbs: 150,
    fats: 45,
  },
  maintenance: {
    label: 'Maintenance',
    calories: 2000,
    protein: 150,
    carbs: 250,
    fats: 65,
  },
  musclegain: {
    label: 'Muscle Gain',
    calories: 2800,
    protein: 200,
    carbs: 350,
    fats: 80,
  },
};

// Active goal (defaults to maintenance)
let activeGoal = 'maintenance';

// Nutrition data per 100g (will be replaced by DB/API later)
const nutritionPer100g = {
  'chicken breast': { calories: 165, protein: 31, carbs: 0, fats: 3.6 },
  'rice': { calories: 130, protein: 2.7, carbs: 28, fats: 0.3 },
  'banana': { calories: 89, protein: 1.1, carbs: 23, fats: 0.3 },
  'egg': { calories: 155, protein: 13, carbs: 1.1, fats: 11 },
  'bread': { calories: 265, protein: 9, carbs: 49, fats: 3.2 },
  'milk': { calories: 42, protein: 3.4, carbs: 5, fats: 1 },
  'apple': { calories: 52, protein: 0.3, carbs: 14, fats: 0.2 },
  'pasta': { calories: 131, protein: 5, carbs: 25, fats: 1.1 },
  'salmon': { calories: 208, protein: 20, carbs: 0, fats: 13 },
};
const defaultNutrition = { calories: 150, protein: 5, carbs: 20, fats: 5 };

// ===== Helper: Calculate nutrition for an entry =====
function calculateNutrition(foodName, portionWeight) {
  const key = foodName.toLowerCase();
  const nutrition = nutritionPer100g[key] || defaultNutrition;
  const multiplier = portionWeight / 100;

  return {
    calories: Math.round(nutrition.calories * multiplier),
    protein: Math.round(nutrition.protein * multiplier),
    carbs: Math.round(nutrition.carbs * multiplier),
    fats: Math.round(nutrition.fats * multiplier),
  };
}

// ===== Helper: Get budget status from current food log =====
function getBudgetStatus() {
  const limits = goalPresets[activeGoal];

  // Calculate running aggregate totals from all active items
  const totals = foodLog.reduce(
    (acc, item) => {
      acc.calories += item.nutrition.calories;
      acc.protein += item.nutrition.protein;
      acc.carbs += item.nutrition.carbs;
      acc.fats += item.nutrition.fats;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  // Calculate difference against active goal's limits
  const remaining = {
    calories: limits.calories - totals.calories,
    protein: limits.protein - totals.protein,
    carbs: limits.carbs - totals.carbs,
    fats: limits.fats - totals.fats,
  };

  // Calculate percentage consumed
  const percentage = {
    calories: limits.calories > 0 ? Math.round((totals.calories / limits.calories) * 100) : 0,
    protein: limits.protein > 0 ? Math.round((totals.protein / limits.protein) * 100) : 0,
    carbs: limits.carbs > 0 ? Math.round((totals.carbs / limits.carbs) * 100) : 0,
    fats: limits.fats > 0 ? Math.round((totals.fats / limits.fats) * 100) : 0,
  };

  // Validation status flag
  let status;
  if (totals.calories > limits.calories) {
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
    activeGoal,
    goalLabel: limits.label,
    status,
  };
}

// ===== Routes =====

// GET /api/food-log — Fetch all logged meals for today
app.get('/api/food-log', (req, res) => {
  const budget = getBudgetStatus();
  res.json({ success: true, data: foodLog, budget });
});

// GET /api/goal — Get current active goal
app.get('/api/goal', (req, res) => {
  const budget = getBudgetStatus();
  res.json({ success: true, activeGoal, goalLabel: goalPresets[activeGoal].label, budget });
});

// PUT /api/goal — Switch fitness goal (does NOT wipe meals)
app.put('/api/goal', (req, res) => {
  const { goal } = req.body;

  if (!goal || !goalPresets[goal]) {
    return res.status(400).json({
      success: false,
      error: `Invalid goal. Must be one of: ${Object.keys(goalPresets).join(', ')}`,
    });
  }

  activeGoal = goal;

  // Recalculate with new limits — meals untouched
  const budget = getBudgetStatus();

  res.json({ success: true, activeGoal, goalLabel: goalPresets[goal].label, budget });
});

// POST /api/food-log — Add a new food entry
app.post('/api/food-log', (req, res) => {
  const { foodName, portionWeight, mealTime } = req.body;

  // Validation
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

  foodLog.push(entry);

  const budget = getBudgetStatus();

  res.status(201).json({ success: true, data: entry, budget });
});

// DELETE /api/food-log/:id — Delete a food entry
app.delete('/api/food-log/:id', (req, res) => {
  const { id } = req.params;
  const index = foodLog.findIndex((entry) => entry.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Entry not found.' });
  }

  const deleted = foodLog.splice(index, 1)[0];

  const budget = getBudgetStatus();

  res.json({ success: true, deleted, budget });
});

// ===== Start Server =====
async function start() {
  await app.listen(PORT);
  console.log(`🚀 NutriTrack API running at http://localhost:${PORT}`);
}

start();
