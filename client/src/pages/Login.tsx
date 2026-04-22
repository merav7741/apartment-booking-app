// ייבוא React Hook Form
import { useForm, type SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
// הגדרת טיפוס לשדות הטופס
type LoginFormData = {
  email: string
  password: string
}
export default function Login() {
    const navigate = useNavigate()


  // אתחול React Hook Form עם ערכי ברירת מחדל
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: ''
    }
  })
  // פונקציית התחברות - מקבלת את הנתונים ישירות מ-React Hook Form
  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      const response = await fetch('http://localhost:5500/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // data מגיע ישירות מ-React Hook Form
        body: JSON.stringify(data)
      })

      const resData = await response.json()

      if (response.ok) {
        console.log('התחברת בהצלחה!', resData)
        localStorage.setItem('token', resData.token)
        localStorage.setItem('user', JSON.stringify(resData.user))
        alert('התחברת בהצלחה!')
      } else {
        alert(resData.message || 'שגיאה בהתחברות')
      }
    } catch (error) {
      alert('שגיאה בחיבור לשרת')
    }
  }
  return (
    <div className="login">
      <h1>התחברות</h1>

      {/* handleSubmit עוטף את onSubmit ומונע רענון דף אוטומטית */}
      <form onSubmit={handleSubmit(onSubmit)}>

        {/* שדה אימייל - חובה, חייב להיות פורמט אימייל תקין */}
        <div>
          <label>אימייל:</label>
          <input
            type="email"
            placeholder="your@email.com"
            {...register('email', {
              required: 'אימייל הוא שדה חובה',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'פורמט אימייל לא תקין'
              }
            })}
          />
          {errors.email && <span style={{ color: 'red' }}>{errors.email.message}</span>}
        </div>

        {/* שדה סיסמה - חובה, מינימום 6 תווים */}
        <div>
          <label>סיסמה:</label>
          <input
            type="password"
            placeholder="הכנס סיסמה"
            {...register('password', {
              required: 'סיסמה היא שדה חובה',
              minLength: { value: 6, message: 'סיסמה חייבת להכיל לפחות 6 תווים' }
            })}
          />
          {errors.password && <span style={{ color: 'red' }}>{errors.password.message}</span>}
        </div>

        <button type="submit">התחבר</button>
      </form>

      
      
      <a>אין לך חשבון</a>
      <br></br>
    <button onClick={() => navigate('/register')}>להירשם לחץ כאן</button>


    </div>
  )
}

