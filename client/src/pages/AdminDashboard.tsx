import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import type { Apartment } from '../types/apartment.types'
import { AdminApartments } from './UserDashboard'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user, token } = useAppSelector((state) => state.auth)
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
      fetchAllApartmentsForAdmin()
    } else {
      setLoading(false)
    }
  }, [fetchAllApartmentsForAdmin, user?.role])

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
        <AdminApartments
          apartments={allSystemApartments}
          userId={user?._id || ''}
          onEdit={(id) => navigate(`/dashboard/edit/${id}`)}
          onDelete={handleDelete}
          onOpen={(id) => navigate(`/apartment/${id}`)}
        />
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
