import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";

function Transactions() {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("הוצאה");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  const [accordionState, setAccordionState] = useState({
    summary: true,
    form: true,
    history: true,
  });
  const [toast, setToast] = useState({ message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
    setIsFilterOpen(false);
  }, [user]);

  useEffect(() => {
    if (!isLoading && scrollPositionRef.current) {
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollPositionRef.current);
      });
    }
  }, [transactions, isLoading]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/transactions`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setTransactions(response.data);
    } catch (error) {
      setError(
        error.response?.data?.error ||
          "טעינת העסקאות נכשלה. אנא בדוק את חיבור השרת או את הגדרות ה-API."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    scrollPositionRef.current = window.scrollY;
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/transactions`,
        { description, amount, type, category, date },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setTransactions([...transactions, response.data]);
      setToast({ message: "העסקה נוספה בהצלחה", type: "success" });
      setDescription("");
      setAmount("");
      setType("הוצאה");
      setCategory("");
      setDate(new Date().toISOString().split("T")[0]);
    } catch (error) {
      setToast({
        message: error.response?.data?.error || "הוספת העסקה נכשלה",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async (id) => {
    scrollPositionRef.current = window.scrollY;
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/transactions/${id}`,
        { description, amount, type, category, date },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setTransactions(
        transactions.map((t) => (t._id === id ? response.data : t))
      );
      setEditingTransactionId(null);
      setToast({ message: "העסקה עודכנה בהצלחה", type: "success" });
      setDescription("");
      setAmount("");
      setType("הוצאה");
      setCategory("");
      setDate(new Date().toISOString().split("T")[0]);
    } catch (error) {
      setToast({
        message: error.response?.data?.error || "עדכון העסקה נכשל",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    scrollPositionRef.current = window.scrollY;
    setIsLoading(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/transactions/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setTransactions(transactions.filter((t) => t._id !== id));
      setToast({ message: "העסקה נמחקה בהצלחה", type: "success" });
    } catch (error) {
      setToast({
        message: error.response?.data?.error || "מחיקת העסקה נכשלה",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAccordion = (section) => {
    setAccordionState((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const income = transactions
    .filter((t) => t.type === "הכנסה")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const expenses = transactions
    .filter((t) => t.type === "הוצאה")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const balance = income - expenses;

  const filteredTransactions = transactions.filter((transaction) => {
    return (
      transaction.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) &&
      (filterCategory ? transaction.category === filterCategory : true) &&
      (filterDate
        ? new Date(transaction.date).toISOString().split("T")[0] === filterDate
        : true)
    );
  });

  const categories = [...new Set(transactions.map((t) => t.category))];

  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => setToast({ message: "", type: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.message]);

  const handleEdit = (transaction) => {
    setEditingTransactionId(transaction._id);
    setDescription(transaction.description);
    setAmount(transaction.amount);
    setType(transaction.type);
    setCategory(transaction.category);
    setDate(new Date(transaction.date).toISOString().split("T")[0]);
  };

  const cancelEdit = () => {
    setEditingTransactionId(null);
    setDescription("");
    setAmount("");
    setType("הוצאה");
    setCategory("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {toast.message && (
        <div
          className={`fixed top-20 right-4 p-4 glassy rounded-lg z-50 ${
            toast.type === "success"
              ? "bg-green-600 bg-opacity-10 text-green-400"
              : "bg-red-600 bg-opacity-10 text-red-400"
          }`}
          style={{ position: "fixed", top: "5rem", right: "1rem" }}
        >
          {toast.type === "success" && (
            <span
              className="inline-block scale-0 text-green-500 mr-2 transition-transform duration-500 ease-out"
              style={{ animation: "grow 0.5s forwards" }}
            >
              ✔
            </span>
          )}
          {toast.message}
        </div>
      )}
      <style>
        {`
          @keyframes grow {
            from {
              transform: scale(0);
            }
            to {
              transform: scale(1);
            }
          }
        `}
      </style>
      <div className="min-h-screen flex flex-col items-center py-8">
        <div className="glassy p-8 max-w-6xl w-full">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
            עסקאות
          </h2>
          {error && (
            <p className="text-red-400 mb-4 text-center bg-red-600 bg-opacity-10 p-3 rounded-lg">
              {error}
            </p>
          )}

          {/* Summary Accordion */}
          <div className="mb-6">
            <button
              onClick={() => toggleAccordion("summary")}
              className="w-full glassy-button p-3 text-lg font-semibold text-gray-900 dark:text-gray-100 flex justify-between items-center"
            >
              סיכום
              <svg
                className={`w-6 h-6 transform transition-transform ${
                  accordionState.summary ? "rotate-180" : ""
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
            {accordionState.summary && (
              <div className="glassy p-6 mt-2">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 text-center bg-green-400 bg-opacity-20 rounded-xl">
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      סך הכנסות
                    </p>
                    <p className="text-2xl text-green-600">
                      {income.toLocaleString()} ₪
                    </p>
                  </div>
                  <div className="p-4 text-center bg-red-400 bg-opacity-20 rounded-xl">
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      סך הוצאות
                    </p>
                    <p className="text-2xl text-red-600">
                      {expenses.toLocaleString()} ₪
                    </p>
                  </div>
                  <div className="p-4 text-center bg-blue-600 bg-opacity-20 rounded-xl">
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      מאזן
                    </p>
                    <p
                      className={`text-2xl ${
                        balance >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {balance.toLocaleString()} ₪
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Section */}
          <div className="mb-6">
            <button
              onClick={() => toggleAccordion("form")}
              className="w-full glassy-button p-3 text-lg font-semibold text-gray-900 dark:text-gray-100 flex justify-between items-center"
            >
              הוספת עסקה
              <svg
                className={`w-6 h-6 transform transition-transform ${
                  accordionState.form ? "rotate-180" : ""
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
            {accordionState.form && (
              <div className="glassy p-6 mt-2 overflow-hidden">
                <div className="space-y-4">
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="תיאור"
                    className="w-full p-4 glassy bg-opacity-20 border border-white border-opacity-30 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="סכום"
                    className="w-full p-4 glassy bg-opacity-20 border border-white border-opacity-30 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-4 glassy bg-opacity-20 border border-white border-opacity-30 rounded-lg text-gray-900 dark:text-gray-100"
                  >
                    <option value="הכנסה">הכנסה</option>
                    <option value="הוצאה">הוצאה</option>
                  </select>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="קטגוריה"
                    className="w-full p-4 glassy bg-opacity-20 border border-white border-opacity-30 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-4 glassy bg-opacity-20 border border-white border-opacity-30 rounded-lg text-gray-900 dark:text-gray-100"
                  />
                  <button
                    onClick={handleSubmit}
                    className="w-full glassy-button p-3 text-gray-900 dark:text-gray-100 font-semibold rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  >
                    הוסף עסקה
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* History Accordion with Filter */}
          <div className="mb-6">
            <button
              onClick={() => toggleAccordion("history")}
              className="w-full glassy-button p-3 text-lg font-semibold text-gray-900 dark:text-gray-100 flex justify-between items-center"
            >
              היסטוריית עסקאות
              <svg
                className={`w-6 h-6 transform transition-transform ${
                  accordionState.history ? "rotate-180" : ""
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
            {accordionState.history && (
              <div className="glassy p-6 mt-2">
                <button
                  onClick={() => setIsFilterOpen((prev) => !prev)}
                  className="glassy-button p-2 w-auto text-gray-900 dark:text-gray-100 font-semibold rounded-lg mb-4"
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
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                </button>
                {isFilterOpen && (
                  <div className="glassy p-4 mb-4 grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="חפש לפי תיאור"
                      className="w-full p-3 glassy bg-opacity-20 border border-white border-opacity-30 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full p-3 glassy bg-opacity-20 border border-white border-opacity-30 rounded-lg text-gray-900 dark:text-gray-100"
                    >
                      <option value="">כל הקטגוריות</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <input
                      type="date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      className="w-full p-3 glassy bg-opacity-20 border border-white border-opacity-30 rounded-lg text-gray-900 dark:text-gray-100 col-span-2"
                    />
                  </div>
                )}
                {filteredTransactions.length === 0 ? (
                  <p className="text-center text-gray-900 dark:text-gray-100">
                    לא נמצאו עסקאות.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full glassy">
                      <thead>
                        <tr className="text-gray-900 dark:text-gray-100 border-b border-black border-opacity-40">
                          <th className="p-3 text-right">תיאור</th>
                          <th className="p-3 text-right">סכום</th>
                          <th className="p-3 text-right">סוג</th>
                          <th className="p-3 text-right">קטגוריה</th>
                          <th className="p-3 text-right">תאריך</th>
                          <th className="p-3 text-right">פעולות</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTransactions.map((transaction) => (
                          <tr
                            key={transaction._id}
                            className="border-b border-grey border-opacity-80 last:border-b-0 box-shadow-lg hover:bg-blue-50 dark:hover:bg-indigo-800 transition duration-200"
                          >
                            <td className="p-3 text-right">
                              {editingTransactionId === transaction._id ? (
                                <input
                                  type="text"
                                  value={description}
                                  onChange={(e) =>
                                    setDescription(e.target.value)
                                  }
                                  className="w-full p-2 glassy bg-opacity-20 border border-white border-opacity-30 rounded-lg text-gray-900 dark:text-gray-100"
                                />
                              ) : (
                                transaction.description
                              )}
                            </td>
                            <td className="p-3 text-right">
                              {editingTransactionId === transaction._id ? (
                                <input
                                  type="number"
                                  value={amount}
                                  onChange={(e) => setAmount(e.target.value)}
                                  className="w-full p-2 glassy bg-opacity-20 border border-white border-opacity-30 rounded-lg text-gray-900 dark:text-gray-100"
                                />
                              ) : (
                                <span
                                  className={
                                    transaction.type === "הכנסה"
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }
                                >
                                  {Number(transaction.amount).toLocaleString()}{" "}
                                  ₪
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-right">
                              {editingTransactionId === transaction._id ? (
                                <select
                                  value={type}
                                  onChange={(e) => setType(e.target.value)}
                                  className="w-full p-2 glassy bg-opacity-20 border border-white border-opacity-30 rounded-lg text-gray-900 dark:text-gray-100"
                                >
                                  <option value="הכנסה">הכנסה</option>
                                  <option value="הוצאה">הוצאה</option>
                                </select>
                              ) : (
                                transaction.type
                              )}
                            </td>
                            <td className="p-3 text-right">
                              {editingTransactionId === transaction._id ? (
                                <input
                                  type="text"
                                  value={category}
                                  onChange={(e) => setCategory(e.target.value)}
                                  className="w-full p-2 glassy bg-opacity-20 border border-white border-opacity-30 rounded-lg text-gray-900 dark:text-gray-100"
                                />
                              ) : (
                                transaction.category
                              )}
                            </td>
                            <td className="p-3 text-right">
                              {editingTransactionId === transaction._id ? (
                                <input
                                  type="date"
                                  value={date}
                                  onChange={(e) => setDate(e.target.value)}
                                  className="w-full p-2 glassy bg-opacity-20 border border-white border-opacity-30 rounded-lg text-gray-900 dark:text-gray-100"
                                />
                              ) : (
                                new Date(transaction.date).toLocaleDateString(
                                  "he-IL"
                                )
                              )}
                            </td>
                            <td className="p-3 text-right flex space-x-2 space-x-reverse">
                              {editingTransactionId === transaction._id ? (
                                <>
                                  <button
                                    onClick={() =>
                                      handleEditSubmit(transaction._id)
                                    }
                                    className="glassy-button p-2 text-gray-900 dark:text-gray-100 font-semibold rounded-lg flex-1 min-w-[80px]"
                                  >
                                    עדכון
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    className="glassy-button p-2 text-gray-900 dark:text-gray-100 font-semibold rounded-lg flex-1 min-w-[80px]"
                                  >
                                    בטל
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleEdit(transaction)}
                                    className="glassy-button p-2 mr-2 text-gray-900 dark:text-gray-100 font-semibold rounded-lg flex-1 min-w-[80px]"
                                  >
                                    ערוך
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDelete(transaction._id)
                                    }
                                    className="glassy-button p-2 text-gray-900 dark:text-gray-100 font-semibold rounded-lg flex-1 min-w-[80px]"
                                  >
                                    מחק
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Transactions;
