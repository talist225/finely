import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ThemeContext from "./context/ThemeContext";
import App from "./App";
import HomePage from "./components/HomePage";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import Transactions from "./components/Transactions";
import Navbar from "./components/Navbar";
import BackgroundAnimation from "./components/BackgroundAnimation";
import Savings from "./components/Savings";
import Insights from "./components/Insights";
import "./index.css";
import { useState } from "react";

function Root() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      return newTheme;
    });
  };

  return (
    <AuthProvider>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <div className="relative min-h-screen flex flex-col">
          <BackgroundAnimation theme={theme} />
          <Navbar />
          <main className="flex-grow relative">
            <Outlet />
          </main>
          <footer className="p-4 text-center text-gray-900 dark:text-gray-100">
            <p>&copy; {new Date().getFullYear()} Finely. כל הזכויות שמורות.</p>
          </footer>
        </div>
      </ThemeContext.Provider>
    </AuthProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route index element={<App />} />
          <Route path="home" element={<HomePage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="savings" element={<Savings />} />
          <Route path="insights" element={<Insights />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
