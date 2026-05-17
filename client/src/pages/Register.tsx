import { useEffect } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { registerUser, clearError } from '../store/authSlice'

// MUI Core Imports
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  TextField, 
  MenuItem, 
  Paper,
  Alert,
  Link
} from '@mui/material'

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
          textAlign: 'center' 
        }}
      >
        {/* כותרת */}
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
          ליצור חשבון חדש
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
          הצטרפו לקהילת הנדל"ן המובילה
        </Typography>

        {/* שגיאות מהשרת */}
        {error && (
          <Alert severity="error" variant="outlined" sx={{ mb: 3, borderRadius: 2, textAlign: 'right' }}>
            {error}
          </Alert>
        )}

        {/* טופס */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          
          {/* שם מלא */}
          <TextField
            fullWidth
            label="שם מלא"
            placeholder="ישראל ישראלי"
            variant="outlined"
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
            {...register('fullName', { required: 'שם מלא חובה', minLength: { value: 2, message: 'שם קצר מדי' } })}
            InputProps={{ sx: { borderRadius: 2.5 } }}
          />

          <Grid container spacing={2}>
            {/* אימייל */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="אימייל"
                type="email"
                placeholder="name@company.com"
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register('email', { required: 'אימייל חובה' })}
                InputProps={{ sx: { borderRadius: 2.5 } }}
              />
            </Grid>
            {/* טלפון */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="טלפון"
                placeholder="05XXXXXXXX"
                variant="outlined"
                error={!!errors.phone}
                helperText={errors.phone?.message}
                {...register('phone', { required: 'טלפון חובה' })}
                InputProps={{ sx: { borderRadius: 2.5 } }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            {/* סיסמה */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="סיסמה"
                type="password"
                placeholder="••••••••"
                variant="outlined"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register('password', { required: 'סיסמה חובה', minLength: { value: 6, message: 'לפחות 6 תווים' } })}
                InputProps={{ sx: { borderRadius: 2.5 } }}
              />
            </Grid>
            {/* אימות סיסמה */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="אימות סיסמה"
                type="password"
                placeholder="••••••••"
                variant="outlined"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                {...register('confirmPassword', { 
                  required: 'אימות חובה', 
                  validate: v => v === password || 'הסיסמאות לא תואמות' 
                })}
                InputProps={{ sx: { borderRadius: 2.5 } }}
              />
            </Grid>
          </Grid>

          {/* סוג חשבון */}
          <TextField
            select
            fullWidth
            label="סוג חשבון"
            variant="outlined"
            defaultValue="Subscriber"
            inputProps={register('role')}
            InputProps={{ sx: { borderRadius: 2.5, textAlign: 'right' } }}
          >
            <MenuItem value="Subscriber">מנוי (מחפש דירה / מפרסם)</MenuItem>
            <MenuItem value="Admin">מנהל מערכת</MenuItem>
          </TextField>

          {/* קוד מנהל - מוצג רק אם נבחר אדמין */}
          {role === 'Admin' && (
            <TextField
              fullWidth
              label="קוד מנהל מאובטח"
              type="password"
              placeholder="Admin Token"
              variant="outlined"
              {...register('adminCode')}
              InputProps={{ sx: { borderRadius: 2.5 } }}
            />
          )}

          {/* כפתור הרשמה */}
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
            {loading ? 'יוצר חשבון...' : 'להרשמה'}
          </Button>
        </Box>

        {/* פוטר */}
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 4 }}>
          כבר רשומים?{' '}
          <Link 
            component="span" 
            onClick={() => navigate('/login')} 
            sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
          >
            התחברו כאן
          </Link>
        </Typography>

      </Paper>
    </Box>
  )
}