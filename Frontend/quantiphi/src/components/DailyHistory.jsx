function DailyHistory({ foodLog, onDeleteEntry }) {
  if (foodLog.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-gray-400">No meals logged yet today.</p>
          <p className="text-xs text-gray-300 mt-1">Use the form above to add your first meal.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Today's Meals</h2>
          <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            {foodLog.length} item{foodLog.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Meal List */}
        <ul className="divide-y divide-gray-100">
          {[...foodLog].sort((a, b) => a.mealTime.localeCompare(b.mealTime)).map((entry) => {
            const { calories, protein, carbs, fats } = entry.nutrition;

            return (
              <li
                key={entry.id}
                className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors duration-150 group"
              >
                {/* Left: Food info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-800 truncate">{entry.foodName}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-400">{entry.portionWeight}g</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-400">{entry.mealTime}</span>
                  </div>
                  {/* Macro chips */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                      {calories} kcal
                    </span>
                    <span className="text-xs text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">
                      P {protein}g
                    </span>
                    <span className="text-xs text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded">
                      C {carbs}g
                    </span>
                    <span className="text-xs text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">
                      F {fats}g
                    </span>
                  </div>
                </div>

                {/* Right: Delete button */}
                <button
                  onClick={() => onDeleteEntry(entry.id)}
                  className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50
                             transition-colors duration-150 cursor-pointer opacity-0 group-hover:opacity-100"
                  title="Delete this entry"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default DailyHistory;
