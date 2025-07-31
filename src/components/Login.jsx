import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Loader from "./Loader";

function Login({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  if (isLoading) {
    return <Loader />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      onClose();
      navigate("/transactions");
    } catch (err) {
      setError("התחברות נכשלה. בדוק את הפרטים.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        התחבר
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-gray-700 dark:text-gray-300 mb-1"
          >
            דוא"ל
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full glassy bg-opacity-50 text-gray-900 dark:text-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-gray-700 dark:text-gray-300 mb-1"
          >
            סיסמה
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full glassy bg-opacity-50 text-gray-900 dark:text-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full glassy-button text-gray-900 dark:text-gray-100 hover:bg-blue-600 dark:hover:bg-indigo-600 hover:text-white dark:hover:text-white font-semibold py-3 rounded-lg"
        >
          התחבר
        </button>
      </form>
      <p className="mt-4 text-gray-700 dark:text-gray-300">
        אין לך חשבון?{" "}
        <button
          onClick={() => {
            onClose();
            document.dispatchEvent(new CustomEvent("openRegister"));
          }}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          הרשם
        </button>
      </p>
    </div>
  );
}

export default Login;
