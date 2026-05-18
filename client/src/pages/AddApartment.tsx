import { useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { useAppSelector } from '../store/hooks'
import CharacteristicsSelector from '../components/apartment/CharacteristicsSelector'

import { Box, Button, Card, CardContent, IconButton, MenuItem, Paper, TextField, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/apartments`

type ApartmentFormData = {
  name: string
  price: number
  pricePerNight: number
  address: string
  city: string
  location: string
  bedrooms: number
  description: string
}

export default function AddApartment() {
  const navigate = useNavigate()
  const { user, token, isAuthenticated } = useAppSelector((state) => state.auth)
  const [images, setImages] = useState<string[]>([])
  const [characteristics, setCharacteristics] = useState<Record<string, boolean>>({})
  
  // --- השינוי ההכרחי: ניהול ערך תיבת הטקסט של הקישור ---
  const [imageUrlInput, setImageUrlInput] = useState<string>('')

  const { register, handleSubmit, formState: { errors } } = useForm<ApartmentFormData>({
    defaultValues: {
      location: 'Center',
      bedrooms: 1
    }
  })

  if (!isAuthenticated || !token) {
    navigate('/login')
    return null
  }

  if (user?.role !== 'Admin' && user?.role !== 'Subscriber') {
    navigate('/')
    return null
  }

  const onSubmit: SubmitHandler<ApartmentFormData> = async (data) => {
    try {
      if (!token) {
        alert('אין הרשאה - נדרש להתחבר מחדש')
        navigate('/login')
        return
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...data,
          image: images,
          characteristics: Object.keys(characteristics).filter((key) => characteristics[key])
        })
      })

      const resData = await response.json()

      if (response.ok) {
        alert('הדירה נוספה בהצלחה!')
        navigate('/dashboard')
      } else {
        alert(resData.message || 'שגיאה ביצירת הדירה')
      }
    } catch (error) {
      console.error(error)
      alert('שגיאה בחיבור לשרת')
    }
  }

  // --- תיקון הפונקציה לשימוש ב-State ושינוי הטיפוס החוזה של MUI ---
  const handleImageKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Enter') return

    e.preventDefault()
    
    const url = imageUrlInput.trim()
    if (!url) return

    setImages((current) => [...current, url])
    setImageUrlInput('') // מוחק את הקישור מהתיבה לאחר ההוספה
  }

  if (!user) {
    return (
      <Box sx={{ py: 10, textAlign: 'center', direction: 'rtl' }}>
        <Typography color="text.secondary" sx={{ fontWeight: 700 }}>טוען...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 820, mx: 'auto', px: { xs: 2, md: 4 }, py: 5, textAlign: 'right', direction: 'rtl' }}>
      <Card variant="outlined" sx={{ borderRadius: 4, boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)', overflow: 'hidden' }}>
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#f8fafc', mx: { xs: -2.5, md: -4 }, mt: { xs: -2.5, md: -4 }, mb: 3, px: { xs: 2.5, md: 4 }, py: 3 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 900, color: 'text.primary' }}>
              הוסף דירה חדשה
            </Typography>
            <Typography color="text.secondary" sx={{ fontWeight: 600, mt: 0.75 }}>
              שלום {user.name}, מלא את פרטי הדירה שלך כדי לפרסם אותה במערכת.
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              fullWidth
              label="שם הדירה"
              error={!!errors.name}
              helperText={errors.name?.message}
              slotProps={{ input: { sx: { borderRadius: 2.5 } } }}
              {...register('name', {
                required: 'שם הדירה הוא שדה חובה',
                minLength: { value: 2, message: 'שם חייב להכיל לפחות 2 תווים' }
              })}
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              <TextField
                fullWidth
                type="number"
                label="מחיר לחודש (₪)"
                error={!!errors.price}
                helperText={errors.price?.message}
                slotProps={{ input: { sx: { borderRadius: 2.5 } } }}
                {...register('price', {
                  required: 'מחיר לחודש הוא שדה חובה',
                  min: { value: 1, message: 'מחיר חייב להיות גדול מ-0' },
                  valueAsNumber: true
                })}
              />
              <TextField
                fullWidth
                type="number"
                label="מחיר ללילה (₪)"
                error={!!errors.pricePerNight}
                helperText={errors.pricePerNight?.message}
                slotProps={{ input: { sx: { borderRadius: 2.5 } } }}
                {...register('pricePerNight', {
                  required: 'מחיר ללילה הוא שדה חובה',
                  min: { value: 1, message: 'מחיר חייב להיות גדול מ-0' },
                  valueAsNumber: true
                })}
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              <TextField fullWidth label="עיר" error={!!errors.city} helperText={errors.city?.message} slotProps={{ input: { sx: { borderRadius: 2.5 } } }} {...register('city', { required: 'עיר היא שדה חובה' })} />
              <TextField fullWidth label="כתובת" error={!!errors.address} helperText={errors.address?.message} slotProps={{ input: { sx: { borderRadius: 2.5 } } }} {...register('address', { required: 'כתובת היא שדה חובה' })} />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              <TextField select fullWidth label="אזור" defaultValue="Center" slotProps={{ input: { sx: { borderRadius: 2.5 } } }} {...register('location', { required: true })}>
                <MenuItem value="Center">מרכז</MenuItem>
                <MenuItem value="North">צפון</MenuItem>
                <MenuItem value="South">דרום</MenuItem>
                <MenuItem value="East">מזרח</MenuItem>
                <MenuItem value="West">מערב</MenuItem>
              </TextField>
              <TextField
                fullWidth
                type="number"
                label="מספר חדרי שינה"
                error={!!errors.bedrooms}
                helperText={errors.bedrooms?.message}
                slotProps={{ input: { sx: { borderRadius: 2.5 } } }}
                {...register('bedrooms', {
                  required: 'מספר חדרי שינה הוא שדה חובה',
                  min: { value: 0, message: 'מספר חדרים לא יכול להיות שלילי' },
                  valueAsNumber: true
                })}
              />
            </Box>

            <TextField fullWidth multiline rows={4} label="תיאור" slotProps={{ input: { sx: { borderRadius: 2.5 } } }} {...register('description')} />

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: '#f8fafc' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1 }}>תמונות (URLs)</Typography>
              
              {/* --- עדכון השדה לרכיב מנוהל (Controlled) --- */}
              <TextField
                fullWidth
                label="הכנס קישור לתמונה ולחץ Enter"
                placeholder="https://example.com/image.jpg"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                onKeyDown={handleImageKeyDown}
                slotProps={{ input: { sx: { borderRadius: 2.5, bgcolor: 'background.paper' } } }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.75 }}>
                לחץ Enter לאחר הזנת כל קישור להוספת התמונה לרשימה
              </Typography>

              {images.length > 0 && (
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
                    תמונות שנוספו ({images.length})
                  </Typography>
                  {images.map((img, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5, bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 2, p: 1 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{img}</Typography>
                      <IconButton size="small" color="error" onClick={() => setImages(images.filter((_, i) => i !== index))}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>

            <Box sx={{ pt: 1 }}>
              <CharacteristicsSelector selectedCharacteristics={characteristics} onChange={setCharacteristics} />
            </Box>

            <Button type="submit" variant="contained" fullWidth sx={{ py: 1.6, borderRadius: 2.5, fontWeight: 900, fontSize: '1rem', boxShadow: '0 14px 30px rgba(37, 99, 235, 0.22)' }}>
              פרסם דירה
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}