// ייבוא React Hook Form
import { useForm, type SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

// הגדרת טיפוס לכל שדות הטופס
type RegisterFormData = {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  role: string
}

export default function Register() {
  const navigate = useNavigate()

  // אתחול React Hook Form עם ערכי ברירת מחדל לכל השדות
  const {
    register,
    handleSubmit,
    watch,          // נצטרך אותו לבדיקת התאמת סיסמאות
    formState: { errors }
  } = useForm<RegisterFormData>({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      role: 'Guest'
    }
  })

  // watch עוקב אחרי ערך הסיסמה בזמן אמת - לצורך השוואה עם אישור הסיסמה
  const password = watch('password')

  // פונקציית הרשמה - מקבלת את הנתונים ישירות מ-React Hook Form
  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    try {
      const response = await fetch('http://localhost:5500/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // שולחים רק את השדות הנדרשים, בלי confirmPassword
        body: JSON.stringify({
          name: data.fullName,
          email: data.email,
          phone: data.phone,
          password: data.password,
          role: data.role
        })
      })

      const resData = await response.json()

      if (response.ok) {
        console.log('נרשמת בהצלחה!', resData)
        localStorage.setItem('token', resData.token)
        alert('נרשמת בהצלחה!')
        navigate('/login')
      } else {
        alert(resData.message || 'שגיאה ברישום')
      }
    } catch (error) {
      alert('שגיאה בחיבור לשרת')
    }
  }

  return (
    <div>
      <h1>הרשמה</h1>

      {/* handleSubmit עוטף את onSubmit ומונע רענון דף אוטומטית */}
      <form onSubmit={handleSubmit(onSubmit)}>

        {/* שדה שם מלא - חובה, מינימום 2 תווים */}
        <div>
          <label>שם מלא:</label>
          <input
            type="text"
            placeholder="הכנס שם מלא"
            {...register('fullName', {
              required: 'שם מלא הוא שדה חובה',
              minLength: { value: 2, message: 'שם חייב להכיל לפחות 2 תווים' }
            })}
          />
          {errors.fullName && <span style={{ color: 'red' }}>{errors.fullName.message}</span>}
        </div>

        {/* שדה אימייל - חובה, פורמט תקין */}
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

        {/* שדה אישור סיסמה - חובה, חייב להיות זהה לסיסמה */}
        <div>
          <label>אשר סיסמה:</label>
          <input
            type="password"
            placeholder="אשר סיסמה"
            {...register('confirmPassword', {
              required: 'אישור סיסמה הוא שדה חובה',
              // validate משווה את הערך הנוכחי לסיסמה שעוקבים אחריה עם watch
              validate: (value) => value === password || 'הסיסמאות לא תואמות'
            })}
          />
          {errors.confirmPassword && <span style={{ color: 'red' }}>{errors.confirmPassword.message}</span>}
        </div>

        {/* שדה טלפון - חובה, פורמט ישראלי */}
        <div>
          <label>פלאפון:</label>
          <input
            type="text"
            placeholder="05xxxxxxxx"
            {...register('phone', {
              required: 'טלפון הוא שדה חובה',
              pattern: {
                value: /^05\d{8}$/,
                message: 'מספר טלפון לא תקין'
              }
            })}
          />
          {errors.phone && <span style={{ color: 'red' }}>{errors.phone.message}</span>}
        </div>

        {/* שדה סוג מנוי - ברירת מחדל Guest */}
        <div>
          <label>סוג מנוי:</label>
          <select
            {...register('role')}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="Guest">אורח (Guest)</option>
            <option value="Subscriber">מנוי (Subscriber)</option>
            <option value="Admin">מנהל (Admin)</option>
          </select>
        </div>

        <button type="submit">הירשם</button>
      </form>

      <a>כבר יש לך חשבון?</a>
      <button onClick={() => navigate(-1)}>התחבר כאן</button>

    </div>
  )
}
