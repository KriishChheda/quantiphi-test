import { useState, useRef } from 'react';
import VisualDashboard from './components/VisualDashboard';
import FoodLoggingPanel from './components/FoodLoggingPanel';
import BudgetExceededModal from './components/BudgetExceededModal';
import DailyHistory from './components/DailyHistory';
import GoalToggle from './components/GoalToggle';

function App() {
  const [foodLog, setFoodLog] = useState([]);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [activeGoal, setActiveGoal] = useState('maintenance');
  const prevCaloriesRef = useRef(0);

  // Goal presets — mirrors backend
  const goalPresets = {
    weightloss: { calories: 1500, protein: 130, carbs: 150, fats: 45 },
    maintenance: { calories: 2000, protein: 150, carbs: 250, fats: 65 },
    musclegain: { calories: 2800, protein: 200, carbs: 350, fats: 80 },
  };

  // Dynamic daily goals based on active goal
  const dailyGoals = goalPresets[activeGoal];

  // Mock nutrition lookup — simulates what the backend will return per 100g
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
    'default': { calories: 150, protein: 5, carbs: 20, fats: 5 },
  };

  // Calculate totals from food log
  const totals = foodLog.reduce(
    (acc, entry) => {
      const key = entry.foodName.toLowerCase();
      const nutrition = nutritionPer100g[key] || nutritionPer100g['default'];
      const multiplier = entry.portionWeight / 100;

      acc.calories += Math.round(nutrition.calories * multiplier);
      acc.protein += Math.round(nutrition.protein * multiplier);
      acc.carbs += Math.round(nutrition.carbs * multiplier);
      acc.fats += Math.round(nutrition.fats * multiplier);
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  // Track previous calories to detect the crossing moment
  prevCaloriesRef.current = totals.calories;

  const handleLogFood = (entry) => {
    // Calculate what the new total will be after adding this entry
    const key = entry.foodName.toLowerCase();
    const nutrition = nutritionPer100g[key] || nutritionPer100g['default'];
    const multiplier = entry.portionWeight / 100;
    const newCalories = prevCaloriesRef.current + Math.round(nutrition.calories * multiplier);

    // Detect the crossing moment: was under, now over
    if (prevCaloriesRef.current <= dailyGoals.calories && newCalories > dailyGoals.calories) {
      setTimeout(() => setShowBudgetModal(true), 500);
    }

    setFoodLog((prev) => [...prev, entry]);
  };

  const handleDeleteEntry = (id) => {
    setFoodLog((prev) => prev.filter((entry) => entry.id !== id));
  };

  const handleGoalChange = (goal) => {
    setActiveGoal(goal);

    // Check if switching goals causes budget to be exceeded
    const newLimits = goalPresets[goal];
    if (totals.calories > newLimits.calories) {
      setTimeout(() => setShowBudgetModal(true), 300);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="w-full py-5 px-6 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-gray-900">NutriTrack</h1>
          </div>
          <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">
            Daily Food Journal
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 space-y-6 max-w-6xl mx-auto w-full">
        {/* Goal Toggle — at the top */}
        <GoalToggle activeGoal={activeGoal} onGoalChange={handleGoalChange} />

        {/* Visual Dashboard — below goal toggle */}
        <VisualDashboard
          caloriesConsumed={totals.calories}
          caloriesBudget={dailyGoals.calories}
          protein={totals.protein}
          proteinGoal={dailyGoals.protein}
          carbs={totals.carbs}
          carbsGoal={dailyGoals.carbs}
          fats={totals.fats}
          fatsGoal={dailyGoals.fats}
        />

        {/* Food Logging Panel — below dashboard */}
        <FoodLoggingPanel onLogFood={handleLogFood} />

        {/* Daily History — logged meals list */}
        <DailyHistory
          foodLog={foodLog}
          onDeleteEntry={handleDeleteEntry}
          nutritionPer100g={nutritionPer100g}
        />

        {/* Budget Exceeded Warning Modal */}
        <BudgetExceededModal
          isOpen={showBudgetModal}
          onClose={() => setShowBudgetModal(false)}
          caloriesConsumed={totals.calories}
          caloriesBudget={dailyGoals.calories}
        />
      </main>

      {/* Footer */}
      {foodLog.length > 0 && (
        <footer className="w-full py-3 px-6 bg-white border-t border-gray-200">
          <div className="max-w-6xl mx-auto text-center">
            <span className="text-xs text-gray-400">
              {foodLog.length} meal{foodLog.length !== 1 ? 's' : ''} logged today
            </span>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
