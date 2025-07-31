import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Loader from "./Loader";

function Insights() {
  const { user } = useContext(AuthContext);
  const [savings, setSavings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  axios.defaults.baseURL = apiUrl;

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setSavings([]);
      setTransactions([]);
      setIsLoading(false);
    }
  }, [user]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      // Fetch savings
      const savingsResponse = await axios.get("/api/savings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(savingsResponse.data)) {
        setSavings(savingsResponse.data);
      } else {
        setSavings([]);
        setError("נתוני החסכונות אינם תקינים");
      }

      // Fetch transactions
      const transactionsResponse = await axios.get("/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(transactionsResponse.data);
    } catch (err) {
      console.error("Fetch error:", err.response || err);
      setError(
        err.response?.data?.error || "שגיאה בטעינת הנתונים. בדוק את חיבור השרת."
      );
      setSavings([]);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate financial insights
  const totalSavings = savings.reduce(
    (sum, saving) => sum + (saving.amount || 0),
    0
  );
  const totalIncome = transactions
    .filter((t) => t.type === "הכנסה")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "הוצאה")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const balance = totalIncome - totalExpenses;
  const averageYieldRate =
    savings.length > 0
      ? (
          savings.reduce((sum, s) => sum + (s.yieldRate || 0), 0) /
          savings.length
        ).toFixed(2)
      : 0;
  const activeSavingsCount = savings.filter(
    (s) => s.status === "Active"
  ).length;
  const categories = [...new Set(transactions.map((t) => t.category))];
  const expenseByCategory = categories.reduce((acc, cat) => {
    acc[cat] = transactions
      .filter((t) => t.category === cat && t.type === "הוצאה")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    return acc;
  }, {});
  const topExpenseCategory = Object.entries(expenseByCategory).reduce(
    (max, curr) => (curr[1] > max[1] ? curr : max),
    ["", 0]
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-8">
      <div className="glassy p-6 max-w-7xl w-full rounded-xl shadow-lg">
        <h2 className="text-4xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
          תובנות פיננסיות
        </h2>
        {error && (
          <p className="text-red-500 mb-4 text-center bg-red-100 p-3 rounded-lg">
            {error}
          </p>
        )}
        {user ? (
          <div className="space-y-6">
            {/* Financial Summary */}
            <div className="glassy p-6 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                סיכום פיננסי
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-600 bg-opacity-20 rounded-lg text-center">
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    סך חסכונות
                  </p>
                  <p className="text-2xl text-green-600">
                    {totalSavings.toLocaleString()} ₪
                  </p>
                </div>
                <div className="p-4 bg-blue-600 bg-opacity-20 rounded-lg text-center">
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    מאזן (הכנסות - הוצאות)
                  </p>
                  <p
                    className={`text-2xl ${
                      balance >= 0 ? "text-green-600" : "text-red-400"
                    }`}
                  >
                    {balance.toLocaleString()} ₪
                  </p>
                </div>
                <div className="p-4 bg-yellow-600 bg-opacity-20 rounded-lg text-center">
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    תשואה שנתית ממוצעת
                  </p>
                  <p className="text-2xl text-yellow-600">
                    {averageYieldRate}%
                  </p>
                </div>
              </div>
            </div>

            {/* Positive Feedback */}
            <div className="glassy p-6 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                כל הכבוד על ההתקדמות!
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {totalSavings > 0
                  ? `כל הכבוד! הצלחת לחסוך ${totalSavings.toLocaleString()} ₪! זה הישג מדהים שמראה על משמעת פיננסית.`
                  : "נראה שאתה בתחילת הדרך עם החסכונות שלך. כל צעד קטן קדימה הוא התחלה נהדרת!"}
                {balance > 0
                  ? ` המאזן החיובי שלך (${balance.toLocaleString()} ₪) מראה שאתה שולט בהוצאות לעומת ההכנסות. תמשיך כך!`
                  : balance < 0
                  ? ` המאזן שלך (${balance.toLocaleString()} ₪) מראה שיש מקום לשיפור. בוא נמצא דרכים לצמצם הוצאות!`
                  : " המאזן שלך מאוזן כרגע – זו נקודת פתיחה מעולה להתקדם!"}
              </p>
            </div>

            {/* Financial Insights */}
            <div className="glassy p-6 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                תובנות והמלצות
              </h3>
              <ul className="list-disc list-inside space-y-2 text-lg text-gray-700 dark:text-gray-300">
                {totalSavings > 0 ? (
                  <li>
                    החסכונות שלך כוללים {activeSavingsCount} חסכונות פעילים.
                    שקול לבדוק אפשרויות להגדלת התשואה, כמו השקעה בקרנות עם תשואה
                    גבוהה יותר אם התשואה הממוצעת ({averageYieldRate}%) נמוכה
                    מהשוק.
                  </li>
                ) : (
                  <li>
                    עדיין לא הוספת חסכונות. התחל עם חיסכון קטן, כמו קרן השתלמות
                    או חשבון חיסכון בבנק, כדי לבנות הרגל חיסכון.
                  </li>
                )}
                {topExpenseCategory[1] > 0 && (
                  <li>
                    הקטגוריה עם ההוצאה הגבוהה ביותר היא "{topExpenseCategory[0]}
                    " ({topExpenseCategory[1].toLocaleString()} ₪). שקול לבדוק
                    אם יש דרכים לצמצם הוצאות בקטגוריה זו, כמו תכנון תקציב או
                    חיפוש חלופות זולות יותר.
                  </li>
                )}
                {totalExpenses > totalIncome * 0.8 && (
                  <li>
                    ההוצאות שלך ({totalExpenses.toLocaleString()} ₪) קרובות או
                    גבוהות מההכנסות ({totalIncome.toLocaleString()} ₪). כדאי
                    ליצור תקציב חודשי כדי לעקוב אחר ההוצאות ולהפחית הוצאות לא
                    הכרחיות.
                  </li>
                )}
                <li>
                  כדי להמשיך להתקדם, קבע יעד חיסכון חודשי (למשל, 10% מההכנסות)
                  והשתמש בכלים כמו תזכורות או אפליקציות תקציב כדי לשמור על
                  המשמעת.
                </li>
                {balance < 0 && (
                  <li>
                    המאזן השלילי שלך ({balance.toLocaleString()} ₪) עשוי לרמז על
                    יחס חובות גבוה (Debt-to-Income Ratio). חשב את היחס על ידי
                    חלוקת ההוצאות השנתיות ב-{totalIncome * 12} והשווה ל-36% (סף
                    מקובל). שקול פירעון חובות בעדיפות גבוהה עם ריבית גבוהה.
                  </li>
                )}
                {averageYieldRate > 0 && averageYieldRate < 5 && (
                  <li>
                    התשואה השנתית הממוצעת שלך ({averageYieldRate}%) נמוכה
                    מהממוצע בשוק (כ-5%). שקול להיוועץ ביועץ השקעות או לבחון
                    אפיקים כמו מניות או אג"ח ממשלתי עם תשואה משתפרת.
                  </li>
                )}
                {transactions.length > 0 && (
                  <li>
                    תדירות ההוצאות שלך מראה{" "}
                    {transactions.filter((t) => t.type === "הוצאה").length}{" "}
                    עסקאות הוצאה. אם יש יותר מ-20% מהן מעל{" "}
                    {(totalExpenses * 0.2) /
                      (transactions.filter((t) => t.type === "הוצאה").length ||
                        1)}{" "}
                    ₪, ייתכן שיש הוצאות חריגות. בדוק עסקאות בולטות וצמצם אותן.
                  </li>
                )}
                {totalIncome > 0 && (
                  <li>
                    פוטנציאל החיסכון השנתי שלך עשוי להגיע ל-
                    {(totalIncome * 0.1).toLocaleString()} ₪ אם תחסוך 10%
                    מההכנסות ({totalIncome.toLocaleString()} ₪). שקול פתיחת
                    תוכנית חיסכון לטווח ארוך עם ריבית מובטחת כדי למקסם את הערך
                    העתידי.
                  </li>
                )}
              </ul>
            </div>

            {/* Motivation */}
            <div className="glassy p-6 rounded-lg text-center">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                המשך קדימה!
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                אתה עושה עבודה נהדרת בניהול הכספים שלך! כל צעד שאתה לוקח – בין
                אם זה מעקב אחר עסקאות או בניית חסכונות – מקרב אותך לחופש פיננסי.
                המשך לעקוב אחר ההוצאות וההכנסות שלך, ותראה איך ההתקדמות הקטנה
                מצטברת להצלחה גדולה! 💪
              </p>
              <p className="text-lg font-semibold mt-4 text-gray-900 dark:text-gray-100">
                הצעד הבא: קבע פגישה עם עצמך פעם בחודש לבדיקת התקדמות, וחפש דרכים
                להגדיל את החסכונות שלך ב-5% בחודשים הקרובים!
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-xl text-gray-900 dark:text-gray-100">
            אנא התחבר כדי לראות את התובנות הפיננסיות שלך.
          </p>
        )}
      </div>
      <style>{`
        .glassy {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 10px;
        }
        .glassy-button {
        //   background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(5px);
        }
      `}</style>
    </div>
  );
}

export default Insights;
