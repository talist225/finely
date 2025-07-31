import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Loader from "./Loader";

function Dashboard() {
  const { user, logout, updateUser, isLoading } = useContext(AuthContext);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [error, setError] = useState("");

  const handleUpdateName = async (e) => {
    e.preventDefault();
    try {
      await updateUser(firstName, lastName);
      setError("");
    } catch (err) {
      setError("עדכון השם נכשל. נסה שוב.");
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glassy p-8 max-w-2xl w-full">
        <h2 className="text-3xl font-bold mb-6 text-center">אזור אישי</h2>
        <p className="text-lg text-center">ברוך הבא ללוח הבקרה שלך!</p>
        <p className="text-lg text-center mb-6">
          כדי שנכיר טוב יותר, נשמח לדעת את שמך:
        </p>
        <div className="space-y-4">
          {error && <p className="text-red-400 text-center">{error}</p>}
          <div>
            <label
              htmlFor="firstName"
              className="block text-gray-700 dark:text-gray-300 mb-1"
            >
              שם פרטי
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full glassy bg-opacity-50 text-gray-900 dark:text-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="הזן שם פרטי"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-gray-700 dark:text-gray-300 mb-1"
            >
              שם משפחה
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full glassy bg-opacity-50 text-gray-900 dark:text-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="הזן שם משפחה"
            />
          </div>
          <button
            onClick={handleUpdateName}
            className="w-full glassy-button text-gray-900 dark:text-gray-100 hover:bg-blue-600 dark:hover:bg-indigo-600 hover:text-white dark:hover:text-white text-sm py-2 rounded-lg"
          >
            עדכן שם
          </button>
          <button
            onClick={handleLogout}
            className="w-full glassy-button text-gray-900 dark:text-gray-100 hover:bg-red-600 dark:hover:bg-red-700 hover:text-white dark:hover:text-white text-sm py-2 rounded-lg"
          >
            התנתק
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
