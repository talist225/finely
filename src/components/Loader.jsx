import React from "react";

function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <div className="flex space-x-2 space-x-reverse">
          <div className="w-3 h-3 bg-blue-500 dark:bg-indigo-400 rounded-full animate-pulse-glow"></div>
          <div className="w-3 h-3 bg-blue-500 dark:bg-indigo-400 rounded-full animate-pulse-glow animation-delay-200"></div>
          <div className="w-3 h-3 bg-blue-500 dark:bg-indigo-400 rounded-full animate-pulse-glow animation-delay-400"></div>
        </div>
        <p className="mt-4 text-gray-900 dark:text-gray-100 font-semibold text-lg animate-pulse">
          טוען...
        </p>
      </div>
    </div>
  );
}

export default Loader;
