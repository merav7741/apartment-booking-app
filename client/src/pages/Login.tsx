export default function Login() {
  return (
    <div className="login">
      <h1>התחברות</h1>

      <form>
        <div>
          <label>אימייל:</label>
          <input type="email" placeholder="your@email.com" />
        </div>

        <div>
          <label>סיסמה:</label>
          <input type="password" placeholder="הכנס סיסמה" />
        </div>

        <button type="submit">התחבר</button>
      </form>

      <p>אין לך חשבון? <a href="/register">הירשם כאן</a></p>
    </div>
  )
}