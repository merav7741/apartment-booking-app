export default function Register() {
  return (
    <div >
      <h1>הרשמה</h1>

      <form>
        <div>
          <label>שם מלא:</label>
          <input type="text" placeholder="הכנס שם מלא" />
        </div>

        <div>
          <label>אימייל:</label>
          <input type="email" placeholder="your@email.com" />
        </div>

        <div>
          <label>סיסמה:</label>
          <input type="password" placeholder="הכנס סיסמה" />
        </div>

        <div>
          <label>אשר סיסמה:</label>
          <input type="password" placeholder="אשר סיסמה" />
        </div>

        <button type="submit">הירשם</button>
      </form>

      <p>כבר יש לך חשבון? <a href="/login">התחבר כאן</a></p>
    </div>
  )
}