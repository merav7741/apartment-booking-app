import { useState } from "react"

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')

  const handleSubmit = async (e :any) => {

    e.preventDefault()
    if (password !== confirmPassword) {
      alert('הסיסמאות לא תואמות')
      return
    }

    try {
      const response = await fetch('http://localhost:5500/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: fullName,
          email: email,
          phone: phone,
          password: password,
          role: 'Guest'
        })
      })

      const data = await response.json()

      if (response.ok) {
        console.log('נרשמת בהצלחה!', data)
        localStorage.setItem('token', data.token)
        alert('נרשמת בהצלחה!')
      } else {
        alert(data.message || 'שגיאה ברישום')
      }
    } catch (error) {
      alert('שגיאה בחיבור לשרת')
    }
  }

  return (
    <div >
      <h1>הרשמה</h1>

      <form onSubmit={handleSubmit}>

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
            type="text"
            placeholder="05xxxxxxxx"
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