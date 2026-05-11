import { useForm, type SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { loginUser, clearError } from '../store/authSlice'
import type { LoginCredentials } from '../types/user.types'
import { useEffect } from 'react'

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.auth)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>()

  useEffect(() => {
    return () => { dispatch(clearError()) }
  }, [dispatch])

  const onSubmit: SubmitHandler<LoginCredentials> = async (data) => {
    const result = await dispatch(loginUser(data))
    if (loginUser.fulfilled.match(result)) navigate('/')
  }

  return (
    <div style={pageWrapper}>
      <div style={cardStyle}>
        <div style={iconCircle}>🔑</div>
        <h1 style={titleStyle}>ברוכים השבים</h1>
        <p style={subtitleStyle}>התחברו כדי לנהל את הדירות שלכם</p>

        {error && <div style={errorAlertStyle}>{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={inputGroup}>
            <label style={labelStyle}>אימייל</label>
            <input type="email" style={inputStyle(!!errors.email)} placeholder="you@example.com"
              {...register('email', { required: 'שדה חובה' })} />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>סיסמה</label>
            <input type="password" style={inputStyle(!!errors.password)} placeholder="••••••••"
              {...register('password', { required: 'שדה חובה' })} />
          </div>

          <button type="submit" disabled={loading} style={submitBtnStyle}>
            {loading ? 'מתחבר...' : 'כניסה למערכת'}
          </button>
        </form>

        <div style={footerStyle}>
          אין לך חשבון? <span onClick={() => navigate('/register')} style={linkAction}>צור חשבון חדש</span>
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
const iconCircle = { width: '60px', height: '60px', backgroundColor: '#ebf8ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '24px' };