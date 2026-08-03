function VisualDashboard({ caloriesConsumed, caloriesBudget, protein, proteinGoal, carbs, carbsGoal, fats, fatsGoal }) {
  // Calculate percentages (capped at 100 for the bar width, but show actual value)
  const caloriePercent = caloriesBudget > 0 ? (caloriesConsumed / caloriesBudget) * 100 : 0;
  const proteinPercent = proteinGoal > 0 ? (protein / proteinGoal) * 100 : 0;
  const carbsPercent = carbsGoal > 0 ? (carbs / carbsGoal) * 100 : 0;
  const fatsPercent = fatsGoal > 0 ? (fats / fatsGoal) * 100 : 0;

  const isOverBudget = caloriesConsumed > caloriesBudget;
  const caloriesRemaining = caloriesBudget - caloriesConsumed;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

        {/* ===== Calorie Budget Section ===== */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-900">Daily Calorie Budget</h2>
            <span className={`text-sm font-semibold ${isOverBudget ? 'text-red-500' : 'text-green-600'}`}>
              {caloriesConsumed} / {caloriesBudget} kcal
            </span>
          </div>

          {/* Large Progress Bar */}
          <div className="w-full h-5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                isOverBudget
                  ? 'bg-red-500'
                  : caloriePercent > 80
                    ? 'bg-amber-400'
                    : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(caloriePercent, 100)}%` }}
            ></div>
          </div>

          {/* Remaining / Over label */}
          <p className={`mt-1.5 text-xs font-medium ${isOverBudget ? 'text-red-500' : 'text-gray-400'}`}>
            {isOverBudget
              ? `⚠️ Over budget by ${Math.abs(caloriesRemaining)} kcal`
              : `${caloriesRemaining} kcal remaining`
            }
          </p>
        </div>

        {/* ===== Divider ===== */}
        <div className="h-px bg-gray-100 mb-5"></div>

        {/* ===== Macronutrient Breakdowns ===== */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Macronutrient Breakdown</h3>

          <div className="space-y-4">
            {/* Protein */}
            <MacroBar
              label="Protein"
              current={protein}
              goal={proteinGoal}
              percent={proteinPercent}
              color="bg-blue-500"
              textColor="text-blue-600"
              bgColor="bg-blue-50"
              unit="g"
            />

            {/* Carbs */}
            <MacroBar
              label="Carbs"
              current={carbs}
              goal={carbsGoal}
              percent={carbsPercent}
              color="bg-amber-400"
              textColor="text-amber-600"
              bgColor="bg-amber-50"
              unit="g"
            />

            {/* Fats */}
            <MacroBar
              label="Fats"
              current={fats}
              goal={fatsGoal}
              percent={fatsPercent}
              color="bg-rose-400"
              textColor="text-rose-600"
              bgColor="bg-rose-50"
              unit="g"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Reusable Macro Progress Bar ===== */
function MacroBar({ label, current, goal, percent, color, textColor, bgColor, unit }) {
  const isOver = current > goal;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className={`inline-block w-2 h-2 rounded-full ${color}`}></span>
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <span className={`text-xs font-semibold ${isOver ? 'text-red-500' : textColor}`}>
          {current}{unit} / {goal}{unit}
        </span>
      </div>
      <div className={`w-full h-2.5 rounded-full overflow-hidden ${bgColor}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${isOver ? 'bg-red-500' : color}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        ></div>
      </div>
    </div>
  );
}

export default VisualDashboard;
