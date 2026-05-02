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
  adminCode?: string
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
      role: 'Guest',
      adminCode: ''
    }
  })

  const password = watch('password')
  const role = watch('role')

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
      role: data.role,
      adminCode: data.adminCode
    }))
    
    if (registerUser.fulfilled.match(result)) {
      alert('נרשמת בהצלחה!')
      navigate('/login')
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', direction: 'rtl' }}>
      <h1>הרשמה</h1>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block' }}>שם מלא:</label>
          <input
            type="text"
            style={{ width: '100%', padding: '8px' }}
            placeholder="הכנס שם מלא"
            {...register('fullName', {
              required: 'שם מלא הוא שדה חובה',
              minLength: { value: 2, message: 'שם חייב להכיל לפחות 2 תווים' }
            })}
          />
          {errors.fullName && <span style={{ color: 'red', fontSize: '12px' }}>{errors.fullName.message}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block' }}>אימייל:</label>
          <input
            type="email"
            style={{ width: '100%', padding: '8px' }}
            placeholder="your@email.com"
            {...register('email', {
              required: 'אימייל הוא שדה חובה',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'פורמט אימייל לא תקין'
              }
            })}
          />
          {errors.email && <span style={{ color: 'red', fontSize: '12px' }}>{errors.email.message}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block' }}>סיסמה:</label>
          <input
            type="password"
            style={{ width: '100%', padding: '8px' }}
            placeholder="הכנס סיסמה"
            {...register('password', {
              required: 'סיסמה היא שדה חובה',
              minLength: { value: 6, message: 'סיסמה חייבת להכיל לפחות 6 תווים' }
            })}
          />
          {errors.password && <span style={{ color: 'red', fontSize: '12px' }}>{errors.password.message}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block' }}>אשר סיסמה:</label>
          <input
            type="password"
            style={{ width: '100%', padding: '8px' }}
            placeholder="אשר סיסמה"
            {...register('confirmPassword', {
              required: 'אישור סיסמה הוא שדה חובה',
              validate: (value) => value === password || 'הסיסמאות לא תואמות'
            })}
          />
          {errors.confirmPassword && <span style={{ color: 'red', fontSize: '12px' }}>{errors.confirmPassword.message}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block' }}>פלאפון:</label>
          <input
            type="text"
            style={{ width: '100%', padding: '8px' }}
            placeholder="05xxxxxxxx"
            {...register('phone', {
              required: 'טלפון הוא שדה חובה',
              pattern: {
                value: /^05\d{8}$/,
                message: 'מספר טלפון לא תקין'
              }
            })}
          />
          {errors.phone && <span style={{ color: 'red', fontSize: '12px' }}>{errors.phone.message}</span>}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block' }}>סוג מנוי:</label>
          <select
            {...register('role')}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="Guest">אורח (Guest)</option>
            <option value="Subscriber">מנוי (Subscriber)</option>
            <option value="Admin">מנהל (Admin)</option>
          </select>
        </div>

        {role === 'Admin' && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block' }}>קוד מנהל:</label>
            <input
              type="password"
              style={{ width: '100%', padding: '8px' }}
              placeholder="הכנס קוד מנהל"
              {...register('adminCode', {
                required: 'קוד מנהל הוא שדה חובה'
              })}
            />
            {errors.adminCode && <span style={{ color: 'red', fontSize: '12px' }}>{errors.adminCode.message}</span>}
          </div>
        )}

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
          {loading ? 'נרשם...' : 'הירשם'}
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <span>כבר יש לך חשבון? </span>
        <button 
          onClick={() => navigate('/login')} 
          style={{ background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
        >
          התחבר כאן
        </button>
      </div>
    </div>
  )
}
