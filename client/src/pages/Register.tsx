import { useForm, type SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { registerUser, clearError } from '../store/authSlice'
import { useEffect } from 'react'

type RegisterFormData = {
  fullName: string; email: string; password: string; confirmPassword: string;
  phone: string; role: string; adminCode?: string;
}

export default function Register() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.auth)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>({
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '', phone: '', role: 'Subscriber', adminCode: '' }
  })

  const password = watch('password')
  const role = watch('role')

  useEffect(() => {
    return () => { dispatch(clearError()) }
  }, [dispatch])

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    const result = await dispatch(registerUser({
      name: data.fullName, email: data.email, phone: data.phone,
      password: data.password, role: data.role, adminCode: data.adminCode
    }))
    if (registerUser.fulfilled.match(result)) {
      navigate('/login')
    }
  }

  return (
    <div style={pageWrapper}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>ליצור חשבון חדש</h1>
        <p style={subtitleStyle}>הצטרפו לקהילת הנדל"ן המובילה</p>

        {error && <div style={errorAlertStyle}>{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={inputGroup}>
            <label style={labelStyle}>שם מלא</label>
            <input type="text" style={inputStyle(!!errors.fullName)} placeholder="ישראל ישראלי"
              {...register('fullName', { required: 'שם מלא חובה', minLength: 2 })} />
            {errors.fullName && <span style={errorMessage}>{errors.fullName.message}</span>}
          </div>

          <div style={rowGrid}>
            <div style={inputGroup}>
              <label style={labelStyle}>אימייל</label>
              <input type="email" style={inputStyle(!!errors.email)} placeholder="name@company.com"
                {...register('email', { required: 'אימייל חובה' })} />
            </div>
            <div style={inputGroup}>
              <label style={labelStyle}>טלפון</label>
              <input type="text" style={inputStyle(!!errors.phone)} placeholder="05XXXXXXXX"
                {...register('phone', { required: 'טלפון חובה' })} />
            </div>
          </div>

          <div style={rowGrid}>
            <div style={inputGroup}>
              <label style={labelStyle}>סיסמה</label>
              <input type="password" style={inputStyle(!!errors.password)} placeholder="••••••••"
                {...register('password', { required: 'סיסמה חובה', minLength: 6 })} />
            </div>
            <div style={inputGroup}>
              <label style={labelStyle}>אימות סיסמה</label>
              <input type="password" style={inputStyle(!!errors.confirmPassword)} placeholder="••••••••"
                {...register('confirmPassword', { 
                  required: 'אימות חובה', 
                  validate: v => v === password || 'לא תואם' 
                })} />
            </div>
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>סוג חשבון</label>
            <select {...register('role')} style={selectStyle}>
              <option value="Subscriber">מנוי (מחפש דירה / מפרסם)</option>
              <option value="Admin">מנהל מערכת</option>
            </select>
          </div>

          {role === 'Admin' && (
            <div style={inputGroup}>
              <label style={labelStyle}>קוד מנהל מאובטח</label>
              <input type="password" style={inputStyle(true)} placeholder="Admin Token" {...register('adminCode')} />
            </div>
          )}

          <button type="submit" disabled={loading} style={submitBtnStyle}>
            {loading ? 'יוצר חשבון...' : 'להרשמה'}
          </button>
        </form>

        <div style={footerStyle}>
          כבר רשומים? <span onClick={() => navigate('/login')} style={linkAction}>התחברו כאן</span>
        </div>
      </div>
    </div>
  )
}
const pageWrapper: React.CSSProperties = {
  minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '20px', direction: 'rtl'
};

const cardStyle: React.CSSProperties = {
  width: '100%', maxWidth: '450px', backgroundColor: 'white', padding: '40px',
  borderRadius: '20px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', textAlign: 'center'
};

const titleStyle = { fontSize: '28px', fontWeight: 'bold', color: '#1a202c', marginBottom: '8px' };
const subtitleStyle = { color: '#718096', marginBottom: '30px', fontSize: '15px' };

const inputGroup = { textAlign: 'right' as const, marginBottom: '18px' };
const labelStyle = { display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: '#4a5568' };

const inputStyle = (isError: boolean): React.CSSProperties => ({
  width: '100%', padding: '12px 16px', borderRadius: '10px', border: `1px solid ${isError ? '#e53e3e' : '#e2e8f0'}`,
  fontSize: '15px', transition: '0.2s', outline: 'none', backgroundColor: '#f8fafc'
});

const selectStyle = { ...inputStyle(false), cursor: 'pointer' };

const submitBtnStyle: React.CSSProperties = {
  width: '100%', padding: '14px', backgroundColor: '#3182ce', color: 'white',
  border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold',
  cursor: 'pointer', transition: '0.3s', marginTop: '10px', boxShadow: '0 4px 6px rgba(49, 130, 206, 0.2)'
};

const footerStyle = { marginTop: '25px', color: '#718096', fontSize: '14px' };
const linkAction = { color: '#3182ce', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' };
const errorMessage = { color: '#e53e3e', fontSize: '12px', marginTop: '4px' };
const errorAlertStyle = { backgroundColor: '#fff5f5', color: '#c53030', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', border: '1px solid #feb2b2' };
const rowGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
