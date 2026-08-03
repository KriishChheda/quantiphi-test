// Backend/data/store.js

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
  'tofu': { calories: 76, protein: 8, carbs: 1.9, fats: 4.8 },
  'lentils': { calories: 116, protein: 9, carbs: 20, fats: 0.4 },
  'paneer': { calories: 265, protein: 18, carbs: 1.2, fats: 20.8 },
  'spinach': { calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4 },
  'broccoli': { calories: 34, protein: 2.8, carbs: 6.6, fats: 0.4 },
  'avocado': { calories: 160, protein: 2, carbs: 8.5, fats: 14.7 },
  'almonds': { calories: 579, protein: 21, carbs: 22, fats: 50 },
};

const defaultNutrition = { calories: 150, protein: 5, carbs: 20, fats: 5 };

const store = {
  foodLog: [],
  activeGoal: 'maintenance',
  goalPresets,
  nutritionPer100g,
  defaultNutrition
};

module.exports = store;
