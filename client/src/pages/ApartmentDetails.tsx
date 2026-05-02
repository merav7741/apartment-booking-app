import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useAppSelector } from '../store/hooks' // הנחה שיש לך Redux לניהול משתמש

export default function ApartmentDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth) // המשתמש המחובר

  // State לנתוני הדירה
  const [apartment, setApartment] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  
  // State להזמנת תאריכים
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedRange, setSelectedRange] = useState<[Date, Date] | null>(null)
  const [updatingDates, setUpdatingDates] = useState(false)

  // State למערכת ביקורות
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState('')
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

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

  // --- פונקציה לעדכון תאריכים (הזמנה) ---
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
          'Authorization': `Bearer ${localStorage.getItem('token')}`
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

  // --- פונקציה להוספת ביקורת ---
  const handleAddReview = async () => {
    if (!newComment.trim()) return alert("אנא כתוב ביקורת")
    setIsSubmittingReview(true)

    const newReview = {
      userName: user?.name || "אורח",
      rating: newRating,
      comment: newComment,
      createdAt: new Date().toISOString()
    }

    const updatedReviews = [...(apartment.reviews || []), newReview]

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/apartments/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...apartment, reviews: updatedReviews })
      })

      if (response.ok) {
        setNewComment('')
        fetchApartment()
        alert('תודה על הדירוג!')
      }
    } catch (error) {
      console.error("Error adding review", error)
    } finally {
      setIsSubmittingReview(false)
    }
  }

  // חישוב ממוצע כוכבים
  const avgRating = apartment?.reviews?.length > 0
    ? (apartment.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / apartment.reviews.length).toFixed(1)
    : "חדש"

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

      {/* כותרת ומיקום */}
      <h1>{apartment.name}</h1>
      <div style={{ display: 'flex', gap: '15px', color: '#666', marginBottom: '20px' }}>
        <span>📍 {apartment.city}, {apartment.address}</span>
        <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>★ {avgRating}</span>
      </div>

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
            
            {!showCalendar ? (
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

      <div style={{ marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '30px' }}>
        <h2>ביקורות ({apartment.reviews?.length || 0})</h2>
        
        <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', margin: '20px 0' }}>
          <h4>הוסף חוות דעת</h4>
          <div style={{ marginBottom: '10px' }}>
            <label>דירוג: </label>
            <select value={newRating} onChange={(e) => setNewRating(Number(e.target.value))}>
              {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} כוכבים</option>)}
            </select>
          </div>
          <textarea 
            value={newComment} 
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="איך הייתה השהייה שלכם?"
            style={{ width: '100%', height: '80px', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '10px' }}
          />
          <button onClick={handleAddReview} disabled={isSubmittingReview} style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            {isSubmittingReview ? 'שולח...' : 'שלח ביקורת'}
          </button>
        </div>

        {apartment.reviews?.map((rev: any, i: number) => (
          <div key={i} style={{ borderBottom: '1px solid #eee', padding: '15px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{rev.userName}</strong>
              <span style={{ color: '#f59e0b' }}>{'★'.repeat(rev.rating)}</span>
            </div>
            <p style={{ margin: '5px 0', color: '#444' }}>{rev.comment}</p>
            <small style={{ color: '#999' }}>{new Date(rev.createdAt).toLocaleDateString()}</small>
          </div>
        ))}
      </div>
    </div>
  )
}