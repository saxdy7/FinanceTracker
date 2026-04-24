import React from 'react';

const BudgetCard = ({ budget, spending }) => {
  const percentage = spending?.percentage || 0;
  const isExceeded = percentage > 100;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900 capitalize">{budget.category}</h3>
          <p className="text-sm text-gray-500">Budget: ${budget.limit.toFixed(2)}</p>
        </div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          isExceeded ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {percentage.toFixed(0)}%
        </span>
      </div>
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              isExceeded ? 'bg-red-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-gray-500">Spent</p>
          <p className="text-lg font-semibold text-gray-900">${spending?.total.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Remaining</p>
          <p className={`text-lg font-semibold ${isExceeded ? 'text-red-500' : 'text-green-500'}`}>
            ${spending?.remaining.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Transactions</p>
          <p className="text-lg font-semibold text-gray-900">{spending?.expenses}</p>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
