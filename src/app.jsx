import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        <h1 className="finely-logo-home font-bold mb-8 text-center">Finely</h1>
        <div className="p-8 text-center max-w-lg">
          <p className="text-lg text-gray-700 dark:text-gray-300">
            ברוכים הבאים ל-Finely, הפלטפורמה החדשנית לניהול הכספים שלכם בצורה
            פשוטה וחכמה.
          </p>
          <button
            onClick={() => navigate("/transactions")}
            className="glassy-button mt-6 text-gray-900 dark:text-gray-100 hover:bg-blue-600 dark:hover:bg-indigo-600 hover:text-white dark:hover:text-white font-semibold py-2 px-6 rounded-lg"
          >
            התחילו עכשיו
          </button>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            מומלץ להתחבר לשמירת המידע
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
