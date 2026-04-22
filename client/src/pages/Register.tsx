import { useState } from "react"

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')

  return (
    <div >
      <h1>הרשמה</h1>

      <form>
        <div>
          <label>שם מלא:</label>
          <input
            type="text" placeholder="הכנס שם מלא" value={fullName}
            onChange={(e) => setFullName(e.target.value)} />
        </div>

        <div>
          <label>אימייל:</label>
          <input type="email"
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
            onChange={(e) => setPassword(e.target.value)} />
        </div>

        <div>
          <label>אשר סיסמה:</label>
          <input
            type="password"
            placeholder="אשר סיסמה"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div>
          <label> פלאפון:</label>
          <input
            type="number"
            placeholder="פלאפון"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <button type="submit">הירשם</button>
      </form>

      <p>כבר יש לך חשבון? <a href="/login">התחבר כאן</a></p>
    </div>
  )
}