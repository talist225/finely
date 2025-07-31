import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(
      "useEffect started, checking token:",
      token ? "Exists" : "Missing"
    );
    if (token) {
      setUser({ id: null, email: null, firstName: "משתמש", lastName: "" });
      console.log(
        "Checking token, isLoading:",
        true,
        "URL:",
        `${import.meta.env.VITE_API_URL}/api/auth/me`
      );
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log("GET /api/auth/me response:", response.data);
          setUser({
            id: response.data.id,
            email: response.data.email,
            firstName: response.data.firstName || "משתמש",
            lastName: response.data.lastName || "",
          });
        })
        .catch((error) => {
          console.error(
            "Failed to verify token:",
            error.response?.status,
            error.response?.data?.error || error.message
          );
          localStorage.removeItem("token"); // הסר טוקן פג תוקף
          setUser(null);
        })
        .finally(() => {
          console.log("Finished token check, isLoading:", false);
          setTimeout(() => setIsLoading(false), 1000);
        });
    } else {
      console.log("No token found, isLoading:", false);
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, []);

  const login = async (email, password) => {
    console.log("Login started, isLoading:", true, "Email:", email);
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/login`,
        { email, password }
      );
      console.log("POST /api/login response:", response.data);
      localStorage.setItem("token", response.data.token);
      setUser({
        id: response.data.user.id,
        email: response.data.user.email,
        firstName: response.data.user.firstName || "משתמש",
        lastName: response.data.user.lastName || "",
      });
    } catch (error) {
      console.error(
        "Login error:",
        error.response?.status,
        error.response?.data?.error || error.message
      );
      throw error;
    } finally {
      console.log("Login finished, isLoading:", false);
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  const register = async (email, password) => {
    console.log("Register started, isLoading:", true, "Email:", email);
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/register`,
        { email, password }
      );
      console.log("POST /api/register response:", response.data);
      localStorage.setItem("token", response.data.token);
      setUser({
        id: response.data.user.id,
        email: response.data.user.email,
        firstName: response.data.user.firstName || "משתמש",
        lastName: response.data.user.lastName || "",
      });
    } catch (error) {
      console.error(
        "Register error:",
        error.response?.status,
        error.response?.data?.error || error.message
      );
      throw error;
    } finally {
      console.log("Register finished, isLoading:", false);
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  const updateUser = async (firstName, lastName) => {
    console.log(
      "Update user started, isLoading:",
      true,
      "Name:",
      firstName,
      lastName
    );
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
        { firstName, lastName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("PUT /api/auth/me response:", response.data);
      setUser({
        ...user,
        firstName: response.data.firstName || "משתמש",
        lastName: response.data.lastName || "",
      });
    } catch (error) {
      console.error(
        "Update user error:",
        error.response?.status,
        error.response?.data?.error || error.message
      );
      throw error;
    } finally {
      console.log("Update user finished, isLoading:", false);
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  const logout = () => {
    console.log("Logout started, isLoading:", true);
    setIsLoading(true);
    try {
      localStorage.removeItem("token");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error.message);
    } finally {
      console.log("Logout finished, isLoading:", false);
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, updateUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
