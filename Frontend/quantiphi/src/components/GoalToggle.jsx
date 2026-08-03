function GoalToggle({ activeGoal, onGoalChange }) {
  const goals = [
    { key: 'weightloss', label: 'Weight Loss', icon: '🔥', cals: '1500 kcal' },
    { key: 'maintenance', label: 'Maintenance', icon: '⚖️', cals: '2000 kcal' },
    { key: 'musclegain', label: 'Muscle Gain', icon: '💪', cals: '2800 kcal' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 text-center">
          Fitness Goal
        </p>
        <div className="flex gap-2">
          {goals.map((goal) => {
            const isActive = activeGoal === goal.key;
            return (
              <button
                key={goal.key}
                onClick={() => onGoalChange(goal.key)}
                className={`flex-1 py-3 px-2 rounded-xl text-center transition-all duration-200 cursor-pointer border
                  ${isActive
                    ? 'bg-green-50 border-green-500 shadow-sm'
                    : 'bg-gray-50 border-transparent hover:bg-gray-100 hover:border-gray-200'
                  }`}
              >
                <span className="block text-lg mb-0.5">{goal.icon}</span>
                <span className={`block text-xs font-semibold ${isActive ? 'text-green-700' : 'text-gray-600'}`}>
                  {goal.label}
                </span>
                <span className={`block text-[10px] mt-0.5 ${isActive ? 'text-green-500' : 'text-gray-400'}`}>
                  {goal.cals}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default GoalToggle;
