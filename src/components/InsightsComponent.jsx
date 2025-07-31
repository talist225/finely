import React from "react";

const InsightsComponent = ({ amount, location, yieldRate, date, status }) => {
  const currentDate = new Date();
  const startDate = new Date(date);
  const monthsPassed = Math.floor(
    (currentDate - startDate) / (1000 * 60 * 60 * 24 * 30)
  );
  let insights = [];

  switch (location) {
    case "קרן השתלמות":
      insights.push(
        `קרן השתלמות מתאימה לטווח בינוני עם פטור ממס לאחר 6 שנים. עם ${amount.toLocaleString()} ₪, תרומה קבועה תגדיל את הקרן.`
      );
      if (yieldRate > 3)
        insights.push(
          `תשואה של ${yieldRate}% מעל הממוצע. בדוק את ההשקעות עם מומחה.`
        );
      if (amount < 5000)
        insights.push(
          `סכום נמוך (${amount.toLocaleString()} ₪). התחל חיסכון אוטומטי של 200-500 ₪ חודשית.`
        );
      if (monthsPassed > 12 && yieldRate < 2)
        insights.push(
          `תשואה נמוכה (${yieldRate}%) לאחר ${monthsPassed} חודשים. שקול העברה לקרן עם ביצועים טובים יותר.`
        );
      break;
    case "פנסיה":
      insights.push(
        `פנסיה היא השקעה ארוכה. עם ${amount.toLocaleString()} ₪, שאף ל-15% מההכנסה החודשית.`
      );
      if (monthsPassed < 12)
        insights.push(
          `חיסכון חדש (${monthsPassed} חודשים). הגדל תרומות ליציבות עתידית.`
        );
      if (amount > 20000 && yieldRate < 3)
        insights.push(
          `תשואה נמוכה (${yieldRate}%) עבור ${amount.toLocaleString()} ₪. שקול העברה או גיוון.`
        );
      if (status === "Inactive")
        insights.push("חיסכון לא פעיל עלול לפגוע בתוכנית הפרישה שלך.");
      break;
    case "קופת גמל":
      insights.push(
        `קופת גמל גמישה עם משיכה חלקית. ${amount.toLocaleString()} ₪ טוב, אך תשואה של ${yieldRate}% דורשת מעקב.`
      );
      if (amount < 5000)
        insights.push(
          `סכום נמוך (${amount.toLocaleString()} ₪). הוסף תרומות חודשיות קבועות.`
        );
      if (yieldRate > 6)
        insights.push(
          `תשואה גבוהה (${yieldRate}%) מצביעה על ניהול טוב. שמור לטווח ארוך.`
        );
      if (monthsPassed > 24 && yieldRate < 3)
        insights.push(
          `תשואה נמוכה (${yieldRate}%) לאחר ${monthsPassed} חודשים. בדוק העברה.`
        );
      break;
    case "בנק":
      insights.push(
        `חיסכון בבנק בטוח אך עם תשואה נמוכה. ${amount.toLocaleString()} ₪ דורש חלוקה חכמה.`
      );
      if (yieldRate < 1)
        insights.push(
          `תשואה של ${yieldRate}% נמוכה. שקול חשבון High-Yield או השקעה.`
        );
      if (amount > 85000)
        insights.push(
          `סכום גבוה (${amount.toLocaleString()} ₪). חלק בין בנקים להגנה מלאה.`
        );
      if (status === "Inactive" && monthsPassed > 6)
        insights.push(
          `חיסכון לא פעיל ${monthsPassed} חודשים מאבד ערך עקב אינפלציה.`
        );
      break;
    case "חסכון":
      insights.push(
        `חיסכון כללי מתאים לקרן חירום. ${amount.toLocaleString()} ₪, שאף ל-3-6 חודשי הוצאות.`
      );
      if (amount < 10000 && status === "Active")
        insights.push(
          `סכום נמוך (${amount.toLocaleString()} ₪) לקרן חירום. הגדל עם חיסכון אוטומטי.`
        );
      if (monthsPassed > 12 && yieldRate < 2)
        insights.push(
          `תשואה נמוכה (${yieldRate}%) לאחר ${monthsPassed} חודשים פוגעת בערך. שקול אפשרויות.`
        );
      if (amount > 50000)
        insights.push(
          `סכום גבוה (${amount.toLocaleString()} ₪) דורש השקעה חכמה במקום חיסכון נזיל.`
        );
      break;
    case "תיק השקעות":
      insights.push(
        `תיק השקעות פוטנציאלי לתשואה גבוהה. ${amount.toLocaleString()} ₪ עם ${yieldRate}% דורש גיוון.`
      );
      if (yieldRate > 7)
        insights.push(
          `תשואה גבוהה (${yieldRate}%) מצוינת. בדוק סיכונים ופזר למניות/אגרות חוב.`
        );
      if (amount < 1000)
        insights.push(
          `סכום נמוך (${amount.toLocaleString()} ₪). התחל השקעה קבועה במניות צמיחה.`
        );
      if (monthsPassed > 18 && yieldRate < 4)
        insights.push(
          `תשואה נמוכה (${yieldRate}%) לאחר ${monthsPassed} חודשים. שקול שינוי אסטרטגיה.`
        );
      break;
    default:
      insights.push("התייעץ עם יועץ פיננסי לבחירת אסטרטגיה מתאימה.");
  }

  if (amount < 1000)
    insights.push(
      `סכום נמוך (${amount.toLocaleString()} ₪) מתאים קצר טווח. התחל עם 200-500 ₪ חודשית.`
    );
  else if (amount >= 1000 && amount < 5000)
    insights.push(
      `סכום של ${amount.toLocaleString()} ₪ טוב לקרן חירום. הוסף 10% מההכנסה החודשית.`
    );
  else if (amount >= 5000 && amount < 20000)
    insights.push(
      `סכום של ${amount.toLocaleString()} ₪ מאפשר תכנון. שקול קרן השתלמות או השקעה.`
    );
  else if (amount >= 20000)
    insights.push(
      `סכום גבוה (${amount.toLocaleString()} ₪) מצליח. הגן עם ביטוח או השקעה בנכסים יציבים.`
    );

  if (yieldRate > 5 && status === "Active")
    insights.push(`תשואה של ${yieldRate}% עם חיסכון פעיל מצוינת. המשך לעקוב.`);
  if (status === "Inactive" && monthsPassed > 12)
    insights.push(
      `חיסכון לא פעיל ${monthsPassed} חודשים מאבד ערך (אינפלציה 2-3%). הפעל או העבר.`
    );
  if (amount > 85000)
    insights.push(
      `סכום גבוה (${amount.toLocaleString()} ₪) דורש חלוקה בין מוסדות להגנה.`
    );
  if (yieldRate < 2 && monthsPassed > 6)
    insights.push(
      `תשואה נמוכה (${yieldRate}%) לאחר ${monthsPassed} חודשים. שקול העברה.`
    );
  if (amount > 100000 && yieldRate > 8)
    insights.push(
      `תשואה גבוהה (${yieldRate}%) על ${amount.toLocaleString()} ₪ מצוינת. בדוק סיכונים וגיוון.`
    );
  if (monthsPassed > 36 && status === "Active")
    insights.push(
      `חיסכון פעיל ${monthsPassed} חודשים. הערך עשוי להפסיד לאינפלציה אם התשואה נמוכה.`
    );
  if (amount < 500 && status === "Active")
    insights.push(
      `סכום זעיר (${amount.toLocaleString()} ₪). התחל חיסכון קטן וקבוע להרגל פיננסי.`
    );

  return (
    <ul className="pl-5 mt-2 space-y-1 text-base">
      {insights.map((insight, index) => (
        <li
          key={index}
          className="text-gray-700 dark:text-gray-300 flex items-start"
        >
          <span className="mr-2 text-green-500">✔&nbsp;&nbsp;&nbsp;</span>
          {insight}
        </li>
      ))}
    </ul>
  );
};

export default InsightsComponent;
