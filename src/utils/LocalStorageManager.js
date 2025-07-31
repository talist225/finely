class LocalStorageManager {
  constructor() {
    this.KEY = "localSavings";
  }

  // שמירת נתונים מקומיים
  saveSavings(savings) {
    localStorage.setItem(this.KEY, JSON.stringify(savings));
  }

  // קבלת נתונים מקומיים
  getSavings() {
    return JSON.parse(localStorage.getItem(this.KEY) || "[]");
  }

  // סנכרון עם שרת לאחר התחברות
  async syncWithServer(token, apiUrl) {
    const localSavings = this.getSavings();
    if (localSavings.length > 0) {
      try {
        const response = await axios.post(
          `${apiUrl}/api/savings/sync`,
          localSavings,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        this.saveSavings(response.data); // עדכון לאחר סנכרון מוצלח
        return true;
      } catch (error) {
        console.error(
          "Sync error:",
          error.response?.data?.error || error.message
        );
        return false;
      }
    }
    return true; // אם אין מה לסנכרן
  }

  // ניקוי נתונים מקומיים
  clear() {
    localStorage.removeItem(this.KEY);
  }
}

export default new LocalStorageManager();
