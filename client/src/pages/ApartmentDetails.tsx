import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useAppSelector } from '../store/hooks'
import type { Apartment } from '../types/apartment.types'
import ReviewsSection from '../components/ReviewsSection'


export default function ApartmentDetails() {
  const { id } = useParams()
  const { user, isAuthenticated, token } = useAppSelector((state) => state.auth)
  const navigate = useNavigate()

  // State לנתוני הדירה
  const [apartment, setApartment] = useState<Apartment | null>(null)
  const [loading, setLoading] = useState(true)

  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedRange, setSelectedRange] = useState<[Date, Date] | null>(null)
  const [updatingDates, setUpdatingDates] = useState(false)

  

  useEffect(() => {
    fetchApartment()
  }, [id])

  const fetchApartment = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/apartments/${id}`)
      const data = await response.json()
      setApartment(data)
    } catch (error) {
      console.error('Error fetching apartment:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async () => {
    if (!selectedRange || !apartment) return
    setUpdatingDates(true)
    const newDates: string[] = []
    let curr = new Date(selectedRange[0])
    while (curr <= selectedRange[1]) {
      newDates.push(new Date(curr).toISOString())
      curr.setDate(curr.getDate() + 1)
    }

    const updatedNotAvailable = [...(apartment.notAvailableDates || []), ...newDates]

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/apartments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...apartment, notAvailableDates: updatedNotAvailable })
      })

      if (response.ok) {
        alert('ההזמנה בוצעה בהצלחה!')
        setShowCalendar(false)
        fetchApartment()
      }
    } catch (error) {
      alert('שגיאה בעדכון התאריכים')
    } finally {
      setUpdatingDates(false)
    }
  }

 

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>טוען...</div>
  if (!apartment) return <div style={{ textAlign: 'center', padding: '50px' }}>דירה לא נמצאה</div>

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px', direction: 'rtl', textAlign: 'right' }}>

      <style>{`
        .booked-day { background-color: #ff4d4f !important; color: white !important; border-radius: 4px; }
        .react-calendar { width: 100%; border-radius: 10px; border: 1px solid #ddd; padding: 10px; }
        .main-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 40px; }
        @media (max-width: 800px) { .main-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="main-grid">

        <div>
          <img
            src={apartment.image?.[0]?.startsWith('http') ? apartment.image[0] : `${import.meta.env.VITE_API_BASE_URL}/${apartment.image?.[0]}`}
            style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '15px', marginBottom: '20px' }}
          />

          <h3>תיאור</h3>
          <p style={{ lineHeight: '1.7' }}>{apartment.description || "אין תיאור זמין לדירה זו."}</p>

          <div style={{ display: 'flex', gap: '20px', background: '#f8f9fa', padding: '15px', borderRadius: '10px', margin: '20px 0' }}>
            <div><strong>חדרי שינה:</strong> {apartment.bedrooms}</div>
            <div><strong>אזור:</strong> {apartment.location}</div>
          </div>
        </div>

        <div style={{ position: 'sticky', top: '20px', height: 'fit-content' }}>
          <div style={{ border: '1px solid #ddd', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <h2 style={{ margin: '0 0 20px 0' }}>₪{apartment.price} <span style={{ fontSize: '16px', fontWeight: 'normal' }}>/ לילה</span></h2>

            {!isAuthenticated ? (
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#666', marginBottom: '10px' }}>כדי להזמין עליך להתחבר</p>
                <button
                  onClick={() => navigate('/login')}
                  style={{ width: '100%', padding: '15px', backgroundColor: '#ff385c', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  התחבר להזמנה
                </button>
              </div>
            ) : !showCalendar ? (
              <button
                onClick={() => setShowCalendar(true)}
                style={{ width: '100%', padding: '15px', backgroundColor: '#ff385c', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                הזמן תאריכים
              </button>
            ) : (
              <div>
                <Calendar
                  onChange={(val: any) => setSelectedRange(val)}
                  selectRange={true}
                  minDate={new Date()}
                  tileClassName={({ date }) =>
                    apartment.notAvailableDates?.some((d: any) => new Date(d).toDateString() === date.toDateString()) ? 'booked-day' : ''
                  }
                />
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button onClick={handleBooking} disabled={!selectedRange || updatingDates} style={{ flex: 2, padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                    {updatingDates ? 'מעדכן...' : 'אשר הזמנה'}
                  </button>
                  <button onClick={() => setShowCalendar(false)} style={{ flex: 1, padding: '12px', backgroundColor: '#eee', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>ביטול</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
<ReviewsSection
  reviews={apartment.reviews || []}
  userId={user?._id || ''}
  apartmentId={id!}
  apartment={apartment}
  onReviewAdded={fetchApartment}
/>

    </div>
  )
}