import { useState, useRef } from 'react';

function FoodLoggingPanel({ onLogFood }) {
  const [foodName, setFoodName] = useState('');
  const [portionWeight, setPortionWeight] = useState('');
  const [mealTime, setMealTime] = useState(() => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  });
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setTimeout(() => {
        setFoodName('Detected: ' + file.name.split('.')[0]);
      }, 500);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!foodName.trim() || !portionWeight) return;

    setIsSubmitting(true);

    const entry = {
      id: Date.now(),
      foodName: foodName.trim(),
      portionWeight: parseFloat(portionWeight),
      mealTime,
      timestamp: new Date().toISOString(),
    };

    setTimeout(() => {
      onLogFood(entry);
      setIsSubmitting(false);
      setShowSuccess(true);
      setFoodName('');
      setPortionWeight('');
      setUploadedFileName('');
      setMealTime(new Date().toTimeString().slice(0, 5));
      setTimeout(() => setShowSuccess(false), 2000);
    }, 400);
  };

  const isFormValid = foodName.trim() && portionWeight && parseFloat(portionWeight) > 0;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Log Your Meal</h2>
            <p className="text-sm text-gray-400">What did you eat?</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Food Name */}
          <div>
            <label htmlFor="food-name" className="block text-sm font-medium text-gray-600 mb-1.5">
              Food Item
            </label>
            <input
              id="food-name"
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="e.g. Chicken Breast, Rice, Banana..."
              className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400
                         focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20
                         transition-all duration-200 ease-in-out text-sm"
            />
          </div>

          {/* Weight & Time side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="portion-weight" className="block text-sm font-medium text-gray-600 mb-1.5">
                Weight (g)
              </label>
              <input
                id="portion-weight"
                type="number"
                min="1"
                max="5000"
                value={portionWeight}
                onChange={(e) => setPortionWeight(e.target.value)}
                placeholder="250"
                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400
                           focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20
                           transition-all duration-200 ease-in-out text-sm
                           [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div>
              <label htmlFor="meal-time" className="block text-sm font-medium text-gray-600 mb-1.5">
                Time
              </label>
              <input
                id="meal-time"
                type="time"
                value={mealTime}
                onChange={(e) => setMealTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-800
                           focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20
                           transition-all duration-200 ease-in-out text-sm"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400 uppercase tracking-wider">or scan food</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Image Upload */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="food-image-upload"
            />
            <button
              type="button"
              onClick={handleImageUpload}
              className="w-full py-3 rounded-lg border border-dashed border-gray-300
                         hover:border-green-400 hover:bg-green-50
                         transition-all duration-200 ease-in-out group cursor-pointer flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
              <span className="text-sm text-gray-500 group-hover:text-green-600 transition-colors duration-200">
                {uploadedFileName || 'Upload a food photo'}
              </span>
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`w-full py-3 rounded-lg font-semibold text-sm tracking-wide transition-all duration-200 ease-in-out cursor-pointer
              ${isFormValid && !isSubmitting
                ? 'bg-green-600 hover:bg-green-500 text-white shadow-sm active:scale-[0.98]'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Logging...
              </span>
            ) : (
              'Log This Meal'
            )}
          </button>
        </form>

        {/* Success Toast */}
        <div
          className={`mt-4 py-2.5 px-4 rounded-lg flex items-center gap-2 transition-all duration-500
            ${showSuccess ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
            bg-green-50 border border-green-200`}
        >
          <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-green-700">Meal logged successfully!</span>
        </div>
      </div>
    </div>
  );
}

export default FoodLoggingPanel;
