import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { createBooking, fetchBookedDates, fetchMyBookings } from '../store/bookingSlice'
import type { Apartment } from '../types/apartment.types'
import { Box, Typography, Button, CircularProgress, Paper, IconButton, Chip } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { useBookingCalendar } from '../hooks/useBookingCalendar'

export default function BookingPage() {
  const { apartmentId } = useParams<{ apartmentId: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { bookedDates, loading } = useAppSelector((state) => state.bookings)
  const [apartment, setApartment] = useState<Apartment | null>(null)

  const calendar = useBookingCalendar(apartment?.price || 0, bookedDates)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (!apartmentId) return

    const fetchApartment = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/apartments/${apartmentId}`
        )
        const data = await response.json()
        setApartment(data)
      } catch (err) {
        console.error('Error fetching apartment:', err)
      }
    }

    fetchApartment()
    dispatch(fetchBookedDates(apartmentId))
  }, [apartmentId, isAuthenticated, dispatch, navigate])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const totalDays = new Date(year, month + 1, 0).getDate()
    
    const days: (Date | null)[] = Array(firstDay).fill(null)
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }

  const changeMonth = (offset: number) => {
    const next = new Date(calendar.currentMonth)
    next.setMonth(next.getMonth() + offset)
    calendar.setCurrentMonth(next)
  }

  const handleBooking = async () => {
    if (!calendar.startDate || !calendar.endDate || !apartmentId) return

    try {
      await dispatch(createBooking({
        apartmentId,
        startDate: calendar.startDate.toISOString(),
        endDate: calendar.endDate.toISOString()
      })).unwrap()

      await dispatch(fetchMyBookings()).unwrap()

      alert('ביצוע ההזמנה בהצלחה!, ההזמנה נשלחה לאישור המארח')
      navigate('/dashboard', { state: { activeTab: 'myBookings' } })
    } catch (err) {
      alert('שגיאה בביצוע ההזמנה')
    }
  }

  if (loading && !apartment) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!apartment) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">הדירה לא נמצאה או שאינה זמינה.</Typography>
      </Box>
    )
  }

  const days = getDaysInMonth(calendar.currentMonth)
  const weekdays = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש']

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3, direction: 'rtl' }}>
      {/* כותרת עליונה */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary' }}>
          הזמנת חופשה ב{apartment.name}
        </Typography>
        <Button 
          variant="outlined" 
          color="inherit" 
          startIcon={<ArrowBackIcon sx={{ transform: 'rotate(180deg)' }} />}
          onClick={() => navigate(-1)}
          sx={{ px: 3, py: 1.2, borderRadius: 2, fontWeight: 700, gap: 1, '& .MuiButton-startIcon': { m: 0 } }}
        >
          חזרה
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 4 }}>
        {/* לוח השנה */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, bgcolor: '#fafafa' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, textAlign: 'center' }}>
            בחר תאריכי השהייה
          </Typography>
          
          {/* ניווט חודשים */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <IconButton 
              onClick={() => changeMonth(1)} 
              sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {calendar.currentMonth.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' })}
            </Typography>
            <IconButton 
              onClick={() => changeMonth(-1)}
              sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* ימי השבוע */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mb: 2 }}>
            {weekdays.map((day) => (
              <Box key={day} sx={{ textAlign: 'center', py: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.secondary' }}>
                  {day}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* ימי החודש */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1.5 }}>
            {days.map((date, index) => {
              if (!date) return <Box key={`empty-${index}`} sx={{ height: 45 }} />

              const isBooked = calendar.isDateBooked(date)
              const isSelectedStart = calendar.startDate?.toDateString() === date.toDateString()
              const isSelectedEnd = calendar.endDate?.toDateString() === date.toDateString()
              const isInRange = calendar.isDateInRange(date)
              const isPast = date < new Date(new Date().setHours(0,0,0,0))

              let bg = '#e8f5e8' // ירוק בהיר - פנוי
              let color = '#2e7d32' // ירוק כהה
              let borderColor = '#4caf50'
              
              if (isBooked || isPast) {
                bg = '#ffebee' // אדום בהיר - תפוס
                color = '#c62828' // אדום כהה
                borderColor = '#f44336'
              } else if (isSelectedStart || isSelectedEnd) {
                bg = '#1976d2'
                color = 'white'
                borderColor = '#1565c0'
              } else if (isInRange) {
                bg = '#bbdefb'
                color = '#1565c0'
                borderColor = '#2196f3'
              }

              return (
                <Button
                  key={date.toISOString()}
                  fullWidth
                  disabled={isBooked || isPast}
                  onClick={() => calendar.handleDateClick(date)}
                  sx={{
                    minWidth: 0,
                    height: 45,
                    borderRadius: 2,
                    bgcolor: bg,
                    color: color,
                    border: `2px solid ${borderColor}`,
                    fontWeight: (isSelectedStart || isSelectedEnd) ? 900 : 600,
                    fontSize: '14px',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: isBooked || isPast ? 'none' : 'scale(1.05)',
                      boxShadow: isBooked || isPast ? 'none' : '0 4px 12px rgba(0,0,0,0.15)'
                    },
                    '&:disabled': {
                      bgcolor: bg,
                      color: color,
                      opacity: 0.7
                    }
                  }}
                >
                  {date.getDate()}
                </Button>
              )
            })}
          </Box>

          {/* מקרא */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 3, flexWrap: 'wrap' }}>
            <Chip 
              label="פנוי" 
              sx={{ bgcolor: '#e8f5e8', color: '#2e7d32', fontWeight: 700, px: 1 }}
            />
            <Chip 
              label="תפוס" 
              sx={{ bgcolor: '#ffebee', color: '#c62828', fontWeight: 700, px: 1 }}
            />
            <Chip 
              label="נבחר" 
              sx={{ bgcolor: '#1976d2', color: 'white', fontWeight: 700, px: 1 }}
            />
          </Box>
        </Paper>
        
        {/* פאנל סיכום */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, height: 'fit-content', bgcolor: '#f8f9fa' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: 'primary.main' }}>
            סיכום ההזמנה
          </Typography>
          
          {calendar.startDate && calendar.endDate ? (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>כניסה:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  {calendar.startDate.toLocaleDateString('he-IL')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>יציאה:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  {calendar.endDate.toLocaleDateString('he-IL')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>לילות:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {calendar.numberOfNights}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, pt: 2, borderTop: '2px solid #e0e0e0' }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>סה"כ:</Typography>
                <Typography variant="h6" sx={{ fontWeight: 900, color: 'success.main' }}>
                  ₪{calendar.totalPrice.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center', fontStyle: 'italic' }}>
              בחר תאריכי כניסה ויציאה
            </Typography>
          )}
          
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth
            disabled={!calendar.startDate || !calendar.endDate}
            onClick={handleBooking}
            startIcon={<CalendarMonthIcon />}
            sx={{ 
              py: 2, 
              borderRadius: 2.5, 
              fontWeight: 800, 
              fontSize: '16px',
              gap: 1,
              '& .MuiButton-startIcon': { m: 0 },
              boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                boxShadow: '0 8px 25px rgba(25, 118, 210, 0.4)'
              }
            }}
          >
            אשר ובצע הזמנה
          </Button>
        </Paper>
      </Box>
    </Box>
  )
}