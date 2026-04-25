import { useForm, type SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { registerUser, clearError } from '../store/authSlice'
import { useEffect } from 'react'

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
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    watch,
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

  const password = watch('password')

  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    const result = await dispatch(registerUser({
      name: data.fullName,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: data.role
    }))
    
    if (registerUser.fulfilled.match(result)) {
      alert('נרשמת בהצלחה!')
      navigate('/login')
    }
  }

  return (
    <div>
      <h1>הרשמה</h1>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
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

        <div>
          <label>אשר סיסמה:</label>
          <input
            type="password"
            placeholder="אשר סיסמה"
            {...register('confirmPassword', {
              required: 'אישור סיסמה הוא שדה חובה',
              validate: (value) => value === password || 'הסיסמאות לא תואמות'
            })}
          />
          {errors.confirmPassword && <span style={{ color: 'red' }}>{errors.confirmPassword.message}</span>}
        </div>

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

        <button type="submit" disabled={loading}>
          {loading ? 'מרשם...' : 'הירשם'}
        </button>
      </form>

      <a>כבר יש לך חשבון?</a>
      <button onClick={() => navigate(-1)}>התחבר כאן</button>
    </div>
  )
}
