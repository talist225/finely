import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  FaPiggyBank,
  FaMoneyBillWave,
  FaChartLine,
  FaUniversity,
  FaWallet,
  FaBriefcase,
} from "react-icons/fa";
import Loader from "./Loader";
import InsightsComponent from "./InsightsComponent";

function Savings() {
  const { user } = useContext(AuthContext);
  const [savings, setSavings] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [yieldRate, setYieldRate] = useState("");
  const [status, setStatus] = useState("Active");
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  axios.defaults.baseURL = apiUrl;

  useEffect(() => {
    if (user) {
      fetchSavings();
    } else {
      setSavings([]);
      setIsLoading(false);
    }
  }, [user]);

  const fetchSavings = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const response = await axios.get("/api/savings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(response.data)) {
        setSavings(response.data);
        localStorage.setItem("localSavings", JSON.stringify(response.data));
      } else {
        setSavings([]);
        setError("התגובה מהשרת אינה מערך תקין");
      }
    } catch (err) {
      console.error("Fetch error:", err.response || err);
      setError(
        err.response?.data?.error ||
          "שגיאה בחיבור לשרת. בדוק שהשרת פועל על " +
            apiUrl +
            "/api/savings עם טוקן תקף"
      );
      setSavings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = {
      name,
      amount: parseFloat(amount),
      location,
      date: new Date(date),
      yieldRate: parseFloat(yieldRate) || 0,
      status,
    };
    if (user && user.id) {
      try {
        let response;
        if (editingId) {
          response = await axios.put(`/api/savings/${editingId}`, data, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setSavings(
            savings.map((s) => (s._id === editingId ? response.data : s))
          );
        } else {
          response = await axios.post("/api/savings", data, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setSavings([...savings, response.data]);
        }
        localStorage.setItem("localSavings", JSON.stringify(savings));
      } catch (err) {
        setError(err.response?.data?.error || "שגיאה בשמירת חיסכון");
      }
    } else {
      const newSaving = { ...data, id: Date.now().toString() };
      const updatedSavings = editingId
        ? savings.map((s) => (s.id === editingId ? newSaving : s))
        : [...savings, newSaving];
      setSavings(updatedSavings);
      localStorage.setItem("localSavings", JSON.stringify(updatedSavings));
    }
    resetForm();
    setIsModalOpen(false);
    setIsSubmitting(false);
    if (user) fetchSavings();
  };

  const handleDelete = async (id) => {
    if (user && user.id) {
      try {
        await axios.delete(`/api/savings/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setSavings(savings.filter((s) => s._id !== id));
        fetchSavings();
      } catch (err) {
        setError(err.response?.data?.error || "שגיאה במחיקת חיסכון");
      }
    } else {
      const updatedSavings = savings.filter((s) => s.id !== id);
      setSavings(updatedSavings);
      localStorage.setItem("localSavings", JSON.stringify(updatedSavings));
    }
  };

  const handleEdit = (saving) => {
    setEditingId(saving.id || saving._id);
    setName(saving.name);
    setAmount(saving.amount);
    setLocation(saving.location);
    setDate(new Date(saving.date).toISOString().split("T")[0]);
    setYieldRate(saving.yieldRate || "");
    setStatus(saving.status || "Active");
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setAmount("");
    setLocation("");
    setDate(new Date().toISOString().split("T")[0]);
    setYieldRate("");
    setStatus("Active");
  };

  const getIcon = (location) => {
    const icons = {
      "קרן השתלמות": <FaPiggyBank className="w-8 h-8" />,
      פנסיה: <FaMoneyBillWave className="w-8 h-8" />,
      "קופת גמל": <FaChartLine className="w-8 h-8" />,
      בנק: <FaUniversity className="w-8 h-8" />,
      חסכון: <FaWallet className="w-8 h-8" />,
      "תיק השקעות": <FaBriefcase className="w-8 h-8" />,
    };
    return icons[location] || <FaPiggyBank className="w-8 h-8" />;
  };

  const getButtonColorClass = (location) => {
    const colors = {
      "קרן השתלמות": "bg-green-500",
      פנסיה: "bg-blue-500",
      "קופת גמל": "bg-yellow-500",
      בנק: "bg-purple-500",
      חסכון: "bg-teal-500",
      "תיק השקעות": "bg-orange-500",
    };
    return colors[location] || "bg-gray-500";
  };

  const toggleAccordion = (id) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const totalSavings = savings.reduce(
    (sum, saving) => sum + (saving.amount || 0),
    0
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-8">
      <div className="glassy p-6 max-w-7xl w-full rounded-xl shadow-lg">
        <h2 className="text-4xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
          חסכונות שלי
        </h2>
        <div className="p-6 mb-6 rounded-lg bg-emerald-500 shadow-xl text-center h-24 flex items-center justify-center">
          <p className="text-2xl font-bold text-white">
            סך כל החסכונות: {totalSavings.toLocaleString()} ₪
          </p>
        </div>
        {error && (
          <p className="text-red-500 mb-4 text-center bg-red-100 p-3 rounded-lg">
            {error}
          </p>
        )}
        {user && (
          <>
            <button
              onClick={() => {
                setIsModalOpen(true);
                resetForm();
              }}
              className="glassy-button p-3 mb-6 text-black bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg transition-all duration-200 shadow-md"
            >
              הוסף חיסכון חדש
            </button>
            <div className="grid grid-cols-1 gap-6">
              {Array.isArray(savings) && savings.length > 0 ? (
                savings.map((saving) => (
                  <div
                    key={saving._id || saving.id}
                    className="glassy rounded-xl shadow-md"
                  >
                    <button
                      onClick={() => toggleAccordion(saving._id || saving.id)}
                      className={`w-full p-4 text-lg font-semibold text-white flex justify-between items-center rounded-xl ${getButtonColorClass(
                        saving.location
                      )} transition-none`}
                    >
                      <span>{saving.name}</span>
                      <span className="text-white font-bold">
                        {saving.amount.toLocaleString()} ₪
                      </span>
                      <svg
                        className={`w-6 h-6 ${
                          openAccordion === (saving._id || saving.id)
                            ? "rotate-180"
                            : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {openAccordion === (saving._id || saving.id) && (
                      <div className="p-4 bg-white dark:bg-gray-800 border-l-4 border-gray-200 rounded-t-xl">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center">
                            {getIcon(saving.location)}
                            <h3 className="text-2xl font-semibold ml-4 text-gray-900 dark:text-gray-100">
                              {saving.name}
                            </h3>
                          </div>
                          <div className="text-right">
                            <p className="text-base text-gray-600 dark:text-gray-400">
                              תאריך התחלה:{" "}
                              {new Date(saving.date).toLocaleDateString(
                                "he-IL"
                              )}
                            </p>
                          </div>
                        </div>
                        <table className="w-full mt-2 text-base text-gray-700 dark:text-gray-300">
                          <tbody>
                            <tr>
                              <td className="font-medium">סכום:</td>
                              <td className="text-right">
                                <span className="text-green-600 font-bold">
                                  {saving.amount.toLocaleString()}
                                </span>{" "}
                                ₪
                              </td>
                            </tr>
                            <tr>
                              <td className="font-medium">מיקום:</td>
                              <td className="text-right">{saving.location}</td>
                            </tr>
                            <tr>
                              <td className="font-medium">תשואה שנתית:</td>
                              <td className="text-right">
                                {saving.yieldRate || 0}%
                              </td>
                            </tr>
                            <tr>
                              <td className="font-medium">סטטוס:</td>
                              <td className="text-right">{saving.status}</td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="mt-4">
                          <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                            תובנות פיננסיות:
                          </h4>
                          <InsightsComponent
                            amount={saving.amount}
                            location={saving.location}
                            yieldRate={saving.yieldRate || 0}
                            date={saving.date}
                            status={saving.status}
                          />
                        </div>
                        <div className="mt-4 flex space-x-2 space-x-reverse">
                          <button
                            onClick={() => handleEdit(saving)}
                            className="glassy-button p-1 text-black bg-green-600 font-semibold rounded-lg min-w-[60px] text-sm"
                          >
                            ערוך
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(saving._id || saving.id)
                            }
                            className="glassy-button p-1 text-black bg-red-600 font-semibold rounded-lg min-w-[60px] text-sm"
                          >
                            מחק
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-xl text-gray-900 dark:text-gray-100">
                  אין חסכונות להצגה.
                </p>
              )}
            </div>
          </>
        )}
        {!user && (
          <p className="text-center text-xl text-gray-900 dark:text-gray-100">
            אנא התחבר כדי לראות את החסכונות שלך.
          </p>
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="glassy p-6 rounded-xl w-full max-w-md bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-out">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-900 dark:text-gray-100 hover:text-red-600 dark:hover:text-red-400"
            >
              <svg
                className="w-6 h-6"
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
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center">
              {editingId ? "עריכת חיסכון" : "הוספת חיסכון חדש"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="שם"
                className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100"
              />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="סכום"
                className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100"
              />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100"
              >
                <option value="">בחר מיקום/סוג</option>
                <option value="קרן השתלמות">קרן השתלמות</option>
                <option value="פנסיה">פנסיה</option>
                <option value="קופת גמל">קופת גמל</option>
                <option value="בנק">בנק</option>
                <option value="חסכון">חסכון</option>
                <option value="תיק השקעות">תיק השקעות</option>
              </select>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100"
              />
              <input
                type="number"
                value={yieldRate}
                onChange={(e) => setYieldRate(e.target.value)}
                placeholder="תשואה שנתית (%)"
                className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100"
              />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100"
              >
                <option value="Active">פעיל</option>
                <option value="Inactive">לא פעיל</option>
              </select>
              <button
                type="submit"
                className="w-full glassy-button p-3 text-white bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg transition-all duration-200 shadow-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader /> : editingId ? "עדכן" : "שמור"}
              </button>
            </form>
          </div>
        </div>
      )}
      {isSubmitting && <Loader />}
      <style>{`
        @keyframes slideIn {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .glassy {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 10px;
        }
        .glassy-button {
          // background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(5px);
        }
        .animate-pulse-glow {
          animation: pulse-glow 1.5s infinite ease-in-out;
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
      `}</style>
    </div>
  );
}

export default Savings;
