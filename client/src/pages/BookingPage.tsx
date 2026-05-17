import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { createBooking, fetchBookedDates } from '../store/bookingSlice'
import type { Apartment } from '../types/apartment.types'

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

    // Fetch apartment details
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
  }, [apartmentId, isAuthenticated, dispatch])

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

  if (!apartment) return <div style={loaderStyle}>טוען פרטי דירה...</div>
  if (!isAuthenticated) return null

  return (
    <div style={containerStyle}>
      <button
        type="button"
        onClick={() => navigate(-1)}
        style={backButtonStyle}
      >
        ← חזרה
      </button>

      <div style={contentStyle}>
        <div style={leftColumnStyle}>
          <h1 style={titleStyle}>בחר תאריכים להזמנה</h1>
          <p style={apartmentNameStyle}>{apartment.name}</p>

          <div style={calendarContainerStyle}>
            <div style={calendarHeaderStyle}>
              <button
                type="button"
                onClick={() =>
                  setCurrentMonth(
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
                  )
                }
                style={navButtonStyle}
              >
                ›
              </button>
              <h2 style={{ margin: '0', fontSize: '18px', width: '150px', textAlign: 'center' }}>
                {monthName}
              </h2>
              <button
                type="button"
                onClick={() =>
                  setCurrentMonth(
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
                  )
                }
                style={navButtonStyle}
              >
                ‹
              </button>
            </div>

            <div style={weekDaysStyle}>
              {['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'].map((day) => (
                <div key={day} style={weekDayStyle}>
                  {day}
                </div>
              ))}
            </div>

            <div style={daysGridStyle}>
              {days.map((date, idx) => {
                if (!date) {
                  return <div key={`empty-${idx}`} style={emptyDayStyle} />
                }

                const isBooked = isDateBooked(date)
                const isStart = startDate && date.toDateString() === startDate.toDateString()
                const isEnd = endDate && date.toDateString() === endDate.toDateString()
                const isInRange = isDateInRange(date)
                const today = new Date()
                const isPast = date < today && !isStart && !isEnd

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => handleDateClick(date)}
                    disabled={isBooked || isPast}
                    style={{
                      ...dayButtonStyle,
                      ...(isBooked && bookedStyle),
                      ...(isPast && pastStyle),
                      ...(isStart && selectedStyle),
                      ...(isEnd && selectedStyle),
                      ...(isInRange && rangeStyle),
                      cursor: isBooked || isPast ? 'not-allowed' : 'pointer'
                    }}
                    type="button"
                  >
                    {date.getDate()}
                  </button>
                )
              })}
            </div>

            <div style={legendStyle}>
              <div style={legendItemStyle}>
                <div style={{ ...legendColorStyle, backgroundColor: '#10b981' }}></div>
                <span>זמין</span>
              </div>
              <div style={legendItemStyle}>
                <div style={{ ...legendColorStyle, backgroundColor: '#ef4444' }}></div>
                <span>תפוס</span>
              </div>
              <div style={legendItemStyle}>
                <div style={{ ...legendColorStyle, backgroundColor: '#3b82f6' }}></div>
                <span>נבחר</span>
              </div>
            </div>
          </div>
        </div>

        <div style={rightColumnStyle}>
          <div style={bookingSummaryStyle}>
            <h2 style={summaryTitleStyle}>סיכום הזמנה</h2>

            <div style={summaryRowStyle}>
              <span style={labelStyle}>שם הדירה</span>
              <span style={valueStyle}>{apartment.name}</span>
            </div>

            <div style={summaryRowStyle}>
              <span style={labelStyle}>תאריך התחלה</span>
              <span style={valueStyle}>
                {startDate ? startDate.toLocaleDateString('he-IL') : 'לא נבחר'}
              </span>
            </div>

            <div style={summaryRowStyle}>
              <span style={labelStyle}>תאריך סיום</span>
              <span style={valueStyle}>
                {endDate ? endDate.toLocaleDateString('he-IL') : 'לא נבחר'}
              </span>
            </div>

            <div style={summaryRowStyle}>
              <span style={labelStyle}>מחיר ללילה</span>
              <span style={valueStyle}>₪{apartment.price}</span>
            </div>

            {numberOfNights > 0 && (
              <>
                <div style={summaryRowStyle}>
                  <span style={labelStyle}>מספר לילות</span>
                  <span style={valueStyle}>{numberOfNights}</span>
                </div>

                <div style={summaryRowStyle}>
                  <span style={labelStyle}>סה"כ תשלום</span>
                  <span style={{ ...valueStyle, fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                    ₪{totalPrice.toLocaleString()}
                  </span>
                </div>
              </>
            )}

            {error && <div style={errorStyle}>{error}</div>}

            <button
              onClick={handleBooking}
              disabled={!startDate || !endDate || loading}
              style={{
                ...bookingButtonStyle,
                opacity: !startDate || !endDate || loading ? 0.5 : 1,
                cursor: !startDate || !endDate || loading ? 'not-allowed' : 'pointer'
              }}
              type="button"
            >
              {loading ? 'בעיבוד...' : 'אשר הזמנה'}
            </button>

            <button
              onClick={() => {
                setStartDate(null)
                setEndDate(null)
              }}
              style={resetButtonStyle}
              type="button"
            >
              נקה בחירה
            </button>
          </div>

          <div style={infoCardStyle}>
            <h3 style={{ marginTop: 0, marginBottom: '12px', color: '#374151' }}>
              📋 כללי ביטול
            </h3>
            <p style={infoTextStyle}>
              ניתן לבטל את ההזמנה עד 7 ימים לפני תאריך ההגעה וקבלת השיבוט המלא.
            </p>
            <p style={infoTextStyle}>
              בביטול בפחות מ-7 ימים, יחויב 50% מהתשלום.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#f9fafb',
  padding: '20px',
  direction: 'rtl'
}

const backButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  marginBottom: '20px',
  backgroundColor: '#f3f4f6',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  color: '#374151',
  transition: 'all 0.2s'
}

const contentStyle: any = {
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '30px',
  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr'
  }
}

const leftColumnStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
}

const titleStyle: React.CSSProperties = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: 0,
  marginBottom: '8px'
}

const apartmentNameStyle: React.CSSProperties = {
  fontSize: '16px',
  color: '#6b7280',
  margin: 0,
  marginBottom: '20px'
}

const calendarContainerStyle: React.CSSProperties = {
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  border: '1px solid #e5e7eb'
}

const calendarHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px'
}

const navButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: '24px',
  cursor: 'pointer',
  color: '#6b7280',
  padding: '4px 8px',
  transition: 'color 0.2s'
}

const weekDaysStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '8px',
  marginBottom: '12px'
}

const weekDayStyle: React.CSSProperties = {
  textAlign: 'center',
  fontWeight: '600',
  fontSize: '12px',
  color: '#6b7280',
  padding: '8px'
}

const daysGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '8px',
  marginBottom: '20px'
}

const dayButtonStyle: React.CSSProperties = {
  padding: '12px',
  border: '1px solid #e5e7eb',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: '500',
  backgroundColor: '#f9fafb',
  color: '#1f2937',
  cursor: 'pointer',
  transition: 'all 0.2s'
}

const bookedStyle: React.CSSProperties = {
  backgroundColor: '#fee2e2',
  borderColor: '#fecaca',
  color: '#991b1b',
  opacity: 0.6
}

const pastStyle: React.CSSProperties = {
  backgroundColor: '#f3f4f6',
  color: '#9ca3af',
  opacity: 0.5
}

const selectedStyle: React.CSSProperties = {
  backgroundColor: '#3b82f6',
  borderColor: '#1d4ed8',
  color: 'white',
  fontWeight: 'bold'
}

const rangeStyle: React.CSSProperties = {
  backgroundColor: '#dbeafe',
  borderColor: '#93c5fd',
  color: '#1e40af'
}

const emptyDayStyle: React.CSSProperties = {}

const legendStyle: React.CSSProperties = {
  display: 'flex',
  gap: '20px',
  justifyContent: 'center',
  paddingTop: '16px',
  borderTop: '1px solid #e5e7eb'
}

const legendItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '13px',
  color: '#6b7280'
}

const legendColorStyle: React.CSSProperties = {
  width: '16px',
  height: '16px',
  borderRadius: '4px'
}

const rightColumnStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
}

const bookingSummaryStyle: React.CSSProperties = {
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  border: '1px solid #e5e7eb'
}

const summaryTitleStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: '0 0 20px 0',
  paddingBottom: '16px',
  borderBottom: '2px solid #f3f4f6'
}

const summaryRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px',
  padding: '12px 0',
  borderBottom: '1px solid #f3f4f6'
}

const labelStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: '500',
  color: '#6b7280'
}

const valueStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#1f2937'
}

const errorStyle: React.CSSProperties = {
  backgroundColor: '#fee2e2',
  color: '#991b1b',
  padding: '12px',
  borderRadius: '6px',
  fontSize: '14px',
  marginBottom: '12px'
}

const bookingButtonStyle: React.CSSProperties = {
  backgroundColor: '#10b981',
  color: 'white',
  border: 'none',
  padding: '14px 20px',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  marginBottom: '12px',
  transition: 'background-color 0.2s'
}

const resetButtonStyle: React.CSSProperties = {
  backgroundColor: '#f3f4f6',
  color: '#374151',
  border: '1px solid #d1d5db',
  padding: '12px 20px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'background-color 0.2s'
}

const infoCardStyle: React.CSSProperties = {
  backgroundColor: '#eff6ff',
  borderRadius: '12px',
  padding: '16px',
  border: '1px solid #bfdbfe'
}

const infoTextStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#1e40af',
  margin: '8px 0',
  lineHeight: '1.5'
}

const loaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  fontSize: '18px',
  color: '#6b7280'
}
