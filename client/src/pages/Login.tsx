import { useEffect } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { loginUser, clearError } from '../store/authSlice'
import type { LoginCredentials } from '../types/user.types'

// MUI Core Imports
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Paper,
  Alert,
  Link,
  Avatar
} from '@mui/material'

// MUI Icons Imports
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'

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
    <Box 
      sx={{ 
        minHeight: '90vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', 
        p: 2, 
        direction: 'rtl' 
      }}
    >
      <Paper 
        elevation={0}
        sx={{ 
          width: '100%', 
          maxWidth: 450, 
          bgcolor: 'background.paper', 
          p: { xs: 3, sm: 5 }, 
          borderRadius: 5, 
          boxShadow: '0 15px 35px rgba(0,0,0,0.1)', 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* אייקון עגול בראש הדף */}
        <Avatar 
          sx={{ 
            bgcolor: 'primary.light', 
            color: 'primary.main', 
            width: 56, 
            height: 56, 
            mb: 2 
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: 28 }} />
        </Avatar>

        {/* כותרות */}
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
          ברוכים השבים
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
          התחברו כדי לנהל את הדירות שלכם
        </Typography>

        {/* שגיאות מהשרת */}
        {error && (
          <Alert severity="error" variant="outlined" sx={{ mb: 3, borderRadius: 2, textAlign: 'right', width: '100%' }}>
            {error}
          </Alert>
        )}

        {/* טופס */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, width: '100%' }}>
          
          {/* אימייל */}
          <TextField
            fullWidth
            label="אימייל"
            type="email"
            placeholder="you@example.com"
            variant="outlined"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email', { required: 'שדה חובה' })}
            InputProps={{ sx: { borderRadius: 2.5 } }}
          />

          {/* סיסמה */}
          <TextField
            fullWidth
            label="סיסמה"
            type="password"
            placeholder="••••••••"
            variant="outlined"
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register('password', { required: 'שדה חובה' })}
            InputProps={{ sx: { borderRadius: 2.5 } }}
          />

          {/* כפתור התחברות */}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ 
              py: 1.5, 
              borderRadius: 2.5, 
              fontSize: '16px', 
              fontWeight: 'bold', 
              mt: 1,
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
            }}
          >
            {loading ? 'מתחבר...' : 'כניסה למערכת'}
          </Button>
        </Box>

        {/* פוטר ומעבר להרשמה */}
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 4 }}>
          אין לך חשבון?{' '}
          <Link 
            component="span" 
            onClick={() => navigate('/register')} 
            sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
          >
            צור חשבון חדש
          </Link>
        </Typography>

      </Paper>
    </Box>
  )
}