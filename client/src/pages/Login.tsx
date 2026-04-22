import { useState } from "react"

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="login">
      <h1>התחברות</h1>

      <form>
        <div>
          <label>אימייל:</label>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>סיסמה:</label>
          <input
            type="password"
            placeholder="הכנס סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">התחבר</button>
      </form>

      <p>אין לך חשבון? <a href="/register">הירשם כאן</a></p>
    </div>
  )
}
