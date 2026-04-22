import { useState } from "react"

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit =async (e: any) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5500/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
        })
      })

      const data = await response.json()

      if (response.ok) {
        console.log('התחברת בהצלחה!', data)
        localStorage.setItem('token', data.token)
        alert('התחברת בהצלחה!')
      } else {
        alert(data.message || 'שגיאה בהתחברות')
      }
    } catch (error) {
      alert('שגיאה בחיבור לשרת')
    }

  }

  return (
    <div className="login">
      <h1>התחברות</h1>

      <form onSubmit={handleSubmit}>
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
