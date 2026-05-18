import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { createBooking, fetchBookedDates } from '../store/bookingSlice'
import type { Apartment } from '../types/apartment.types'
import { useBookingCalendar } from '../hooks/useBookingCalendar' 

import { Box, Typography, Button, CircularProgress, Paper, IconButton } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

export default function BookingPage() {
  const { apartmentId } = useParams<{ apartmentId: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { bookedDates, loading, error } = useAppSelector((state) => state.bookings)
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

      alert('ההזמנה בוצעה בהצלחה!')
      navigate('/dashboard')
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
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, direction: 'rtl' }}>
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 3 }}>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            הזמנת חופשה ב{apartment.name}
          </Typography>
          <Button 
            variant="outlined" 
            color="inherit" 
            startIcon={<ArrowBackIcon sx={{ transform: 'rotate(180deg)' }} />}
            onClick={() => navigate(-1)}
          >
            חזרה
          </Button>
        </Box>

        <Box sx={{ maxWidth: 450, mx: 'auto', mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <IconButton onClick={() => changeMonth(1)} color="primary">
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {calendar.currentMonth.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' })}
            </Typography>
            <IconButton onClick={() => changeMonth(-1)} color="primary">
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mb: 1, textAlign: 'center' }}>
            {weekdays.map((day) => (
              <Typography key={day} variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                {day}
              </Typography>
            ))}
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
            {days.map((date, index) => {
              if (!date) return <Box key={`empty-${index}`} />

              const isBooked = calendar.isDateBooked(date)
              const isSelectedStart = calendar.startDate?.toDateString() === date.toDateString()
              const isSelectedEnd = calendar.endDate?.toDateString() === date.toDateString()
              const isInRange = calendar.isDateInRange(date)
              const isPast = date < new Date(new Date().setHours(0,0,0,0))

              let bg = 'transparent'
              let color = 'text.primary'
              
              if (isBooked || isPast) {
                color = 'text.disabled'
                bg = 'action.disabledBackground'
              } else if (isSelectedStart || isSelectedEnd) {
                bg = 'primary.main'
                color = 'primary.contrastText'
              } else if (isInRange) {
                bg = 'action.hover'
              }

              return (
                <Button
                  key={date.toISOString()}
                  fullWidth
                  disabled={isBooked || isPast}
                  onClick={() => calendar.handleDateClick(date)}
                  sx={{
                    minWidth: 0,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: bg,
                    color: color,
                    fontWeight: (isSelectedStart || isSelectedEnd) ? 'bold' : 'normal',
                  }}
                >
                  {date.getDate()}
                </Button>
              )
            })}
          </Box>
        </Box>
        
        <Box sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body1">סה"כ לילות: <strong>{calendar.numberOfNights}</strong></Typography>
            <Typography variant="h6" color="primary.main">מחיר כולל: <strong>₪{calendar.totalPrice.toLocaleString()}</strong></Typography>
          </Box>
          <Button 
            variant="contained" 
            color="primary" 
            disabled={!calendar.startDate || !calendar.endDate}
            onClick={handleBooking}
            startIcon={<CalendarMonthIcon />}
            sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
          >
            אשר ובצע הזמנה
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}