import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { createBooking, fetchBookedDates } from '../store/bookingSlice'
import type { Apartment } from '../types/apartment.types'

// MUI Core Imports
import { Box, Typography, Button, Grid, CircularProgress, Paper } from '@mui/material'

// MUI Icons Imports
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import InfoIcon from '@mui/icons-material/Info'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

export default function BookingPage() {
  const { apartmentId } = useParams<{ apartmentId: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { bookedDates, loading, error } = useAppSelector((state) => state.bookings)

  const [apartment, setApartment] = useState<Apartment | null>(null)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [numberOfNights, setNumberOfNights] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [currentMonth, setCurrentMonth] = useState(new Date())

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

  useEffect(() => {
    if (startDate && endDate) {
      const nights = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      )
      setNumberOfNights(nights)
      setTotalPrice(nights * (apartment?.price || 0))
    }
  }, [startDate, endDate, apartment?.price])

  const isDateBooked = (date: Date) => {
    return bookedDates.some((booking) => {
      const start = new Date(booking.start)
      const end = new Date(booking.end)
      return date >= start && date <= end
    })
  }

  const isDateInRange = (date: Date) => {
    if (!startDate || !endDate) return false
    return date > startDate && date < endDate
  }

  const handleDateClick = (date: Date) => {
    if (isDateBooked(date)) return

    if (!startDate) {
      setStartDate(date)
      setEndDate(null)
    } else if (!endDate) {
      if (date > startDate) {
        setEndDate(date)
      } else {
        setStartDate(date)
        setEndDate(null)
      }
    } else {
      setStartDate(date)
      setEndDate(null)
    }
  }

  const handleBooking = async () => {
    if (!startDate || !endDate || !apartmentId) {
      alert('אנא בחר תאריכים')
      return
    }

    const result = await dispatch(
      createBooking({
        apartmentId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      })
    )

    if (createBooking.fulfilled.match(result)) {
      alert('הזמנה נוצרה בהצלחה! בהמתנה לאישור בעל הנכס.')
      navigate('/dashboard')
    }
  }

  const renderCalendar = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const days = renderCalendar()
  const monthName = currentMonth.toLocaleDateString('he-IL', {
    month: 'long',
    year: 'numeric'
  })

  if (!apartment) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column', gap: 2 }}>
        <CircularProgress color="inherit" />
        <Typography variant="body1" color="text.secondary">טוען פרטי דירה...</Typography>
      </Box>
    )
  }

  if (!isAuthenticated) return null

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 3, direction: 'rtl' }}>
      
      {/* כפתור חזרה */}
      <Button
        variant="outlined"
        color="inherit"
        startIcon={<ArrowBackIcon sx={{ transform: 'rotate(180deg)' }} />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3, borderRadius: 2, fontWeight: 'medium', textTransform: 'none', gap: 1, '& .MuiButton-startIcon': { m: 0 } }}
      >
        חזרה
      </Button>

      {/* גריד תוכן ראשי */}
      <Grid container spacing={4} sx={{ maxWidth: '1200px', mx: 'auto' }}>
        
        {/* עמודה שמאלית - לוח שנה */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
                בחר תאריכים להזמנה
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {apartment.name}
              </Typography>
            </Box>

            {/* קוביית לוח שנה */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, bgcolor: 'background.paper' }}>
              
              {/* כותרת לוח השנה והניווט */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Button
                  color="inherit"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  sx={{ minWidth: 'auto', p: 1 }}
                >
                  <ArrowForwardIosIcon fontSize="small" />
                </Button>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', width: 150, textAlign: 'center' }}>
                  {monthName}
                </Typography>
                <Button
                  color="inherit"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  sx={{ minWidth: 'auto', p: 1 }}
                >
                  <ArrowBackIosNewIcon fontSize="small" />
                </Button>
              </Box>

              {/* ימי השבוע */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mb: 1.5 }}>
                {['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'].map((day) => (
                  <Typography key={day} variant="caption" sx={{ textAlign: 'center', fontWeight: 'bold', color: 'text.secondary', p: 1 }}>
                    {day}
                  </Typography>
                ))}
              </Box>

              {/* גריד הימים */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mb: 3 }}>
                {days.map((date, idx) => {
                  if (!date) {
                    return <Box key={`empty-${idx}`} />
                  }

                  const isBooked = isDateBooked(date)
                  const isStart = startDate && date.toDateString() === startDate.toDateString()
                  const isEnd = endDate && date.toDateString() === endDate.toDateString()
                  const isInRange = isDateInRange(date)
                  const today = new Date()
                  const isPast = date < today && !isStart && !isEnd

                  // קביעת צבעים וסגנונות מבוססי סטייט
                  let btnBg = 'action.hover'
                  let btnColor = 'text.primary'
                  let btnBorder = '1px solid'
                  let btnBorderColor = 'divider'

                  if (isBooked) {
                    btnBg = 'error.light'
                    btnColor = 'error.dark'
                    btnBorderColor = 'error.light'
                  } else if (isPast) {
                    btnBg = 'action.disabledBackground'
                    btnColor = 'text.disabled'
                  } else if (isStart || isEnd) {
                    btnBg = 'primary.main'
                    btnColor = 'primary.contrastText'
                    btnBorderColor = 'primary.dark'
                  } else if (isInRange) {
                    btnBg = 'info.light'
                    btnColor = 'info.dark'
                    btnBorderColor = 'info.main'
                  }

                  return (
                    <Button
                      key={date.toISOString()}
                      disabled={isBooked || isPast}
                      onClick={() => handleDateClick(date)}
                      sx={{
                        p: 1.5,
                        minWidth: 'auto',
                        aspectRatio: '1/1',
                        border: btnBorder,
                        borderColor: btnBorderColor,
                        borderRadius: 2,
                        fontSize: '14px',
                        fontWeight: isStart || isEnd ? 'bold' : 'medium',
                        bgcolor: btnBg,
                        color: btnColor,
                        opacity: isBooked || isPast ? 0.5 : 1,
                        '&:hover': {
                          bgcolor: isBooked || isPast ? btnBg : 'primary.light',
                          color: isBooked || isPast ? btnColor : 'primary.contrastText'
                        }
                      }}
                    >
                      {date.getDate()}
                    </Button>
                  )
                })}
              </Box>

              {/* מקרא לוח השנה */}
              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, borderRadius: 1, bgcolor: 'action.hover', border: 1, borderColor: 'divider' }} />
                  <Typography variant="caption" color="text.secondary">זמין</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, borderRadius: 1, bgcolor: 'error.light' }} />
                  <Typography variant="caption" color="text.secondary">תפוס</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, borderRadius: 1, bgcolor: 'primary.main' }} />
                  <Typography variant="caption" color="text.secondary">נבחר</Typography>
                </Box>
              </Box>

            </Paper>
          </Box>
        </Grid>

        {/* עמודה ימנית - סיכום הזמנה ומידע */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            {/* כרטיס סיכום */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, bgcolor: 'background.paper' }}>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: 'text.primary', pb: 2, mb: 2, borderBottom: 2, borderColor: 'action.hover' }}>
                סיכום הזמנה
              </Typography>

              {/* שורות סיכום דינמיות */}
              {[
                { label: 'שם הדירה', value: apartment.name, highlight: false },
                { label: 'תאריך התחלה', value: startDate ? startDate.toLocaleDateString('he-IL') : 'לא נבחר', highlight: false },
                { label: 'תאריך סיום', value: endDate ? endDate.toLocaleDateString('he-IL') : 'לא נבחר', highlight: false },
                { label: 'מחיר ללילה', value: `₪${apartment.price}`, highlight: false }
              ].map((row) => (
                <Box key={row.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, borderBottom: 1, borderColor: 'action.hover' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>{row.label}</Typography>
                  <Typography variant="body2" color="text.primary" sx={{ fontWeight: 'bold' }}>{row.value}</Typography>
                </Box>
              ))}

              {numberOfNights > 0 && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, borderBottom: 1, borderColor: 'action.hover' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>מספר לילות</Typography>
                    <Typography variant="body2" color="text.primary" sx={{ fontWeight: 'bold' }}>{numberOfNights}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, borderBottom: 1, borderColor: 'action.hover' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>סה"כ תשלום</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                      ₪{totalPrice.toLocaleString()}
                    </Typography>
                  </Box>
                </>
              )}

              {error && (
                <Typography variant="body2" sx={{ bgcolor: 'error.light', color: 'error.dark', p: 1.5, borderRadius: 1.5, mt: 2, fontWeight: 'medium' }}>
                  {error}
                </Typography>
              )}

              {/* כפתורי פעולה */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 3 }}>
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  fullWidth
                  onClick={handleBooking}
                  disabled={!startDate || !endDate || loading}
                  startIcon={!loading && <CalendarMonthIcon />}
                  sx={{ py: 1.5, borderRadius: 2, fontWeight: 'bold', boxShadow: 'none', gap: 1, '& .MuiButton-startIcon': { m: 0 } }}
                >
                  {loading ? 'בעיבוד...' : 'אשר הזמנה'}
                </Button>

                <Button
                  variant="outlined"
                  color="inherit"
                  fullWidth
                  onClick={() => {
                    setStartDate(null)
                    setEndDate(null)
                  }}
                  sx={{ py: 1.2, borderRadius: 2, fontWeight: 'medium' }}
                >
                  נקה בחירה
                </Button>
              </Box>
            </Paper>

            {/* כרטיס מידע / מדיניות ביטולים */}
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, bgcolor: '#eff6ff', borderColor: '#bfdbfe', display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="subtitle2" sx={{ color: '#1e40af', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <InfoIcon fontSize="small" /> כללי ביטול
              </Typography>
              <Typography variant="caption" sx={{ color: '#1e40af', lineHeight: 1.6 }}>
                • ניתן לבטל את ההזמנה עד 7 ימים לפני תאריך ההגעה וקבלת השיבוט המלא.
              </Typography>
              <Typography variant="caption" sx={{ color: '#1e40af', lineHeight: 1.6 }}>
                • בביטול בפחות מ-7 ימים, יחויב 50% מהתשלום.
              </Typography>
            </Paper>

          </Box>
        </Grid>

      </Grid>
    </Box>
  )
}
