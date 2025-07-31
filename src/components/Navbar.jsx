import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ThemeContext from "../context/ThemeContext";
import Login from "./Login";
import Register from "./Register";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isLoginOpen) setIsLoginOpen(false);
    if (isRegisterOpen) setIsRegisterOpen(false);
  };

  const toggleLogin = () => {
    setIsLoginOpen(!isLoginOpen);
    if (isMenuOpen) setIsMenuOpen(false);
    if (isRegisterOpen) setIsRegisterOpen(false);
  };

  const toggleRegister = () => {
    setIsRegisterOpen(!isRegisterOpen);
    if (isMenuOpen) setIsMenuOpen(false);
    if (isLoginOpen) setIsLoginOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const getDisplayName = () => {
    if (user?.firstName) {
      return `ברוך הבא, ${user.firstName}${
        user.lastName ? ` ${user.lastName}` : ""
      }`;
    }
    return "ברוך הבא, משתמש";
  };

  useEffect(() => {
    const handleOpenLogin = () => setIsLoginOpen(true);
    const handleOpenRegister = () => setIsRegisterOpen(true);
    document.addEventListener("openLogin", handleOpenLogin);
    document.addEventListener("openRegister", handleOpenRegister);
    return () => {
      document.removeEventListener("openLogin", handleOpenLogin);
      document.removeEventListener("openRegister", handleOpenRegister);
    };
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-50 glassy p-4">
        <div className="container mx-auto flex items-center justify-between relative">
          <div className="flex items-center flex-row-reverse space-x-2 space-x-reverse order-1">
            {user ? (
              <>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="glassy-button p-3 border-radius-0.5rem text-gray-900 dark:text-gray-100 hover:bg-blue-600 dark:hover:bg-indigo-600 hover:text-white dark:hover:text-white font-semibold rounded-lg flex items-center"
                  aria-label="Go to dashboard"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 11a4 4 0 100-8 4 4 0 000 8zM12 13c-3.86 0-7 2.24-7 5v2h14v-2c0-2.76-3.14-5-7-5z"
                    />
                  </svg>
                </button>
                {getDisplayName() && (
                  <span className="text-gray-900 dark:text-gray-100 font-semibold ml-2">
                    {getDisplayName()}
                  </span>
                )}
              </>
            ) : (
              <button
                onClick={toggleLogin}
                className="glassy-button p-3 border-radius-0.5rem text-gray-900 dark:text-gray-100 hover:bg-blue-600 dark:hover:bg-indigo-600 hover:text-white dark:hover:text-white font-semibold rounded-lg flex items-center"
                aria-label="Toggle login"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>
            )}
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link to="/" className="finely-logo text-2xl text-center">
              Finely
            </Link>
          </div>
          <button
            onClick={toggleMenu}
            className="hamburger focus:outline-none order-0"
            aria-label="Toggle menu"
          >
            <span className={`bar ${isMenuOpen ? "open" : ""}`}></span>
            <span className={`bar ${isMenuOpen ? "open" : ""}`}></span>
            <span className={`bar ${isMenuOpen ? "open" : ""}`}></span>
          </button>
        </div>
      </nav>
      <div
        className={`fixed top-0 right-0 h-full w-72 max-sm:w-full glassy bg-opacity-90 backdrop-blur-lg shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6 relative">
          <div className="flex justify-end items-center mb-6">
            <button
              onClick={toggleMenu}
              className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
              aria-label="Close menu"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <ul className="flex flex-col items-center space-y-6 flex-grow">
            <li>
              <Link
                to="/"
                onClick={toggleMenu}
                className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 text-xl font-semibold transition-colors"
              >
                בית
              </Link>
            </li>
            <li>
              <Link
                to="/transactions"
                onClick={toggleMenu}
                className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 text-xl font-semibold transition-colors"
              >
                עסקאות
              </Link>
            </li>
            <li>
              <Link
                to="/savings"
                onClick={toggleMenu}
                className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 text-xl font-semibold transition-colors"
              >
                חסכונות
              </Link>
            </li>
            <li>
              <Link
                to="/insights"
                onClick={toggleMenu}
                className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 text-xl font-semibold transition-colors"
              >
                תובנות פיננסיות
              </Link>
            </li>
            {user ? (
              <>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 text-xl font-semibold transition-colors w-full text-center"
                  >
                    התנתק
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <button
                    onClick={toggleRegister}
                    className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 text-xl font-semibold transition-colors"
                  >
                    הרשמה
                  </button>
                </li>
              </>
            )}
          </ul>
          <button
            onClick={() => {
              toggleTheme();
              toggleMenu();
            }}
            className="glassy-button p-3 border-radius-0.5rem hover:bg-blue-600 dark:hover:bg-indigo-600 transition-all duration-300 absolute bottom-6 right-6"
            aria-label={theme === "light" ? "עבור למצב לילה" : "עבור למצב יום"}
          >
            <svg
              className="w-6 h-6 text-gray-900 dark:text-gray-100"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {theme === "light" ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      <div
        className={`fixed top-0 left-0 h-full w-80 glassy bg-opacity-90 backdrop-blur-lg shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isLoginOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end items-center p-6">
          <button
            onClick={toggleLogin}
            className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
            aria-label="Close login"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <Login onClose={toggleLogin} />
        </div>
      </div>
      <div
        className={`fixed top-0 left-0 h-full w-80 glassy bg-opacity-90 backdrop-blur-lg shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isRegisterOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end items-center p-6">
          <button
            onClick={toggleRegister}
            className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
            aria-label="Close register"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <Register onClose={toggleRegister} />
        </div>
      </div>
      {(isMenuOpen || isLoginOpen || isRegisterOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => {
            setIsMenuOpen(false);
            setIsLoginOpen(false);
            setIsRegisterOpen(false);
          }}
          aria-hidden="true"
        ></div>
      )}
    </>
  );
}

export default Navbar;
