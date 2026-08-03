import { useEffect, useState } from 'react';

function BudgetExceededModal({ isOpen, onClose, caloriesConsumed, caloriesBudget }) {
  const [isVisible, setIsVisible] = useState(false);
  const overBy = caloriesConsumed - caloriesBudget;

  useEffect(() => {
    if (isOpen) {
      // Small delay to trigger the enter animation
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200
        ${isVisible ? 'bg-black/40' : 'bg-black/0'}`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-xl border border-red-100 max-w-sm w-full p-6 text-center
          transition-all duration-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning Icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">Daily Budget Exceeded!</h2>

        {/* Message */}
        <p className="text-sm text-gray-500 mb-1">
          You've consumed <span className="font-semibold text-red-500">{caloriesConsumed} kcal</span>
        </p>
        <p className="text-sm text-gray-500 mb-5">
          That's <span className="font-semibold text-red-500">{overBy} kcal</span> over your {caloriesBudget} kcal daily limit.
        </p>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="w-full py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold text-sm
                     transition-colors duration-200 cursor-pointer active:scale-[0.98]"
        >
          I Understand
        </button>
      </div>
    </div>
  );
}

export default BudgetExceededModal;
