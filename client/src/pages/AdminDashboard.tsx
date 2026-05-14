import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchAllBookings } from '../store/bookingSlice'
import type { Apartment } from '../types/apartment.types'
import { AdminApartments } from './UserDashboard'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user, token } = useAppSelector((state) => state.auth)
  const { allBookings } = useAppSelector((state) => state.bookings)
  const [allSystemApartments, setAllSystemApartments] = useState<Apartment[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAllApartmentsForAdmin = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/apartments`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setAllSystemApartments(data)
      }
    } catch (err) {
      console.error('Error fetching all apartments', err)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (user?.role === 'Admin') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchAllApartmentsForAdmin()
      dispatch(fetchAllBookings())
    } else {
      setLoading(false)
    }
  }, [fetchAllApartmentsForAdmin, user?.role, dispatch])

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!window.confirm('למחוק את הדירה לצמיתות?')) return

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/apartments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        fetchAllApartmentsForAdmin()
      }
    } catch {
      alert('אירעה שגיאה במחיקת הדירה')
    }
  }

  if (user?.role !== 'Admin') {
    return (
      <div style={pageStyle}>
        <h1 style={titleStyle}>אין הרשאה</h1>
        <p style={messageStyle}>לוח הבקרה מיועד למנהל בלבד.</p>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      <header style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>לוח מנהל</p>
          <h1 style={titleStyle}>ניהול הדירות במערכת</h1>
        </div>
      </header>

      {loading ? (
        <p style={messageStyle}>טוען דירות...</p>
      ) : (
        <>
          <AdminApartments
            apartments={allSystemApartments}
            userId={user?._id || ''}
            onEdit={(id) => navigate(`/dashboard/edit/${id}`)}
            onDelete={handleDelete}
            onOpen={(id) => navigate(`/apartment/${id}`)}
          />
          <section style={{ marginTop: '36px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '18px' }}>כל ההזמנות במערכת</h2>
            {allBookings.length === 0 ? (
              <div style={{ padding: '20px', borderRadius: '16px', background: '#f8fafc', color: '#475569' }}>אין הזמנות להצגה כרגע.</div>
            ) : (
              <div style={{ display: 'grid', gap: '18px' }}>
                {allBookings.map((booking: any) => (
                  <div key={booking._id} style={{ border: '1px solid #e2e8f0', borderRadius: '18px', padding: '20px', background: '#fff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '14px', flexWrap: 'wrap' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '20px', color: '#111827' }}>{booking.apartmentId?.name || 'דירה'}</h3>
                        <p style={{ margin: '8px 0 0', color: '#475569' }}>אורח: {booking.customerId?.name || 'לא ידוע'}</p>
                      </div>
                      <div style={{ padding: '8px 14px', borderRadius: '999px', fontSize: '14px', fontWeight: 700, color: '#fff', backgroundColor: booking.status === 'Approved' ? '#22c55e' : booking.status === 'Pending Approval' ? '#f59e0b' : '#ef4444' }}>
                        {booking.status}
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px', color: '#475569' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>🗓️ התחלה</span>
                        <span>{new Date(booking.startDate).toLocaleDateString('he-IL')}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>🗓️ סיום</span>
                        <span>{new Date(booking.endDate).toLocaleDateString('he-IL')}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>💰 סה"כ</span>
                        <span style={{ fontWeight: 700, color: '#10b981' }}>₪{booking.totalPrice.toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>📍 דירה</span>
                        <span>{booking.apartmentId?.address || 'לא זמין'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}

const pageStyle: React.CSSProperties = {
  padding: '32px 24px 60px',
  maxWidth: '1220px',
  margin: '0 auto',
  direction: 'rtl',
  textAlign: 'right'
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '20px',
  marginBottom: '24px',
  flexWrap: 'wrap'
}

const eyebrowStyle: React.CSSProperties = {
  margin: '0 0 6px',
  color: '#991b1b',
  fontWeight: 700,
  fontSize: '14px'
}

const titleStyle: React.CSSProperties = {
  margin: 0,
  color: '#111827',
  fontSize: '32px',
  fontWeight: 800
}

const messageStyle: React.CSSProperties = {
  color: '#475569',
  fontSize: '16px'
}
