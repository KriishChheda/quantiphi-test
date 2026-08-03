import { useState, useEffect } from 'react';
import VisualDashboard from './components/VisualDashboard';
import FoodLoggingPanel from './components/FoodLoggingPanel';
import BudgetExceededModal from './components/BudgetExceededModal';
import DailyHistory from './components/DailyHistory';
import GoalToggle from './components/GoalToggle';

const API_URL = 'http://localhost:5001/api';

function App() {
  const [foodLog, setFoodLog] = useState([]);
  const [budget, setBudget] = useState(null);
  const [activeGoal, setActiveGoal] = useState('maintenance');
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [goalRes, logRes] = await Promise.all([
          fetch(`${API_URL}/goal`),
          fetch(`${API_URL}/food-log`)
        ]);
        
        const goalData = await goalRes.json();
        const logData = await logRes.json();
        
        if (goalData.success) {
          setActiveGoal(goalData.activeGoal);
          setBudget(goalData.budget);
        }
        
        if (logData.success) {
          setFoodLog(logData.data);
          setBudget(logData.budget); // We use the logData budget as it includes everything
        }
      } catch (err) {
        console.error("Failed to fetch initial data", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  const handleLogFood = async (entry) => {
    try {
      const res = await fetch(`${API_URL}/food-log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      const data = await res.json();
      
      if (data.success) {
        setFoodLog((prev) => [...prev, data.data]);
        
        // Detect if any new limit was crossed
        const previousExceededCount = budget?.exceededLimits?.length || 0;
        const newExceededCount = data.budget.exceededLimits?.length || 0;
        if (newExceededCount > previousExceededCount) {
          setTimeout(() => setShowBudgetModal(true), 500);
        }
        
        setBudget(data.budget);
      }
    } catch (err) {
      console.error("Failed to log food", err);
    }
  };

  const handleDeleteEntry = async (id) => {
    try {
      const res = await fetch(`${API_URL}/food-log/${id}`, { method: 'DELETE' });
      const data = await res.json();
      
      if (data.success) {
        setFoodLog((prev) => prev.filter((entry) => entry.id !== id));
        setBudget(data.budget);
      }
    } catch (err) {
      console.error("Failed to delete food", err);
    }
  };

  const handleGoalChange = async (goal) => {
    try {
      const res = await fetch(`${API_URL}/goal`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal }),
      });
      const data = await res.json();
      
      if (data.success) {
        setActiveGoal(data.activeGoal);
        
        // Detect if the new stricter limits push us over budget for new macros
        const previousExceededCount = budget?.exceededLimits?.length || 0;
        const newExceededCount = data.budget.exceededLimits?.length || 0;
        if (newExceededCount > previousExceededCount) {
          setTimeout(() => setShowBudgetModal(true), 300);
        }
        
        setBudget(data.budget);
      }
    } catch (err) {
      console.error("Failed to change goal", err);
    }
  };

  if (isLoading || !budget) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 font-medium">Loading NutriTrack...</p>
      </div>
    );
  }

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
          caloriesConsumed={budget.totals.calories}
          caloriesBudget={budget.limits.calories}
          protein={budget.totals.protein}
          proteinGoal={budget.limits.protein}
          carbs={budget.totals.carbs}
          carbsGoal={budget.limits.carbs}
          fats={budget.totals.fats}
          fatsGoal={budget.limits.fats}
        />

        {/* Food Logging Panel — below dashboard */}
        <FoodLoggingPanel onLogFood={handleLogFood} />

        {/* Daily History — logged meals list */}
        <DailyHistory
          foodLog={foodLog}
          onDeleteEntry={handleDeleteEntry}
        />

        {/* Budget Exceeded Warning Modal */}
        <BudgetExceededModal
          isOpen={showBudgetModal}
          onClose={() => setShowBudgetModal(false)}
          exceededLimits={budget.exceededLimits}
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
