import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchAllBookings } from '../store/bookingSlice'
import type { Booking } from '../store/bookingSlice'
import type { Apartment } from '../types/apartment.types'

// התיקון כאן: מייבאים את הקומפוננטה החדשה מהקובץ החדש שלה כ-default import
import AdminApartmentsTab from '../components/dashboard/AdminApartmentsTab'
import AdminBookingCard from '../components/AdminBookingCard'

import { Box, Chip, CircularProgress, Paper, Typography } from '@mui/material'

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
      <Box sx={{ maxWidth: 900, mx: 'auto', px: 3, py: 10, textAlign: 'center', direction: 'rtl' }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: 'error.main', mb: 1 }}>
          אין הרשאה
        </Typography>
        <Typography color="text.secondary">לוח הבקרה מיועד למנהל בלבד.</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, py: 5, textAlign: 'right', direction: 'rtl' }}>
      <Box sx={{ pb: 3, mb: 4, borderBottom: 1, borderColor: 'divider' }}>
        <Typography
          variant="h1"
          sx={{
            color: 'error.dark',
            fontWeight: 950,
            fontSize: { xs: 32, md: 40 },
            lineHeight: 0.95,
            mb: 1
          }}
        >
          לוח מנהל
        </Typography>
        <Typography variant="h5" component="p" sx={{ fontWeight: 800, color: 'text.primary' }}>
          ניהול הדירות במערכת
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, py: 8 }}>
          <CircularProgress size={26} />
          <Typography color="text.secondary" sx={{ fontWeight: 700 }}>טוען דירות...</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <AdminApartmentsTab
            apartments={allSystemApartments}
            userId={user?._id || ''}
            onEdit={(id) => navigate(`/dashboard/edit/${id}`)}
            onDelete={handleDelete}
            onOpen={(id) => navigate(`/apartment/${id}`)}
          />

          <Box component="section">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2.5, flexWrap: 'wrap' }}>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 900, color: 'text.primary' }}>
                כל ההזמנות במערכת
              </Typography>
              <Chip label={`${allBookings.length} הזמנות`} color="primary" variant="outlined" sx={{ fontWeight: 800, borderRadius: 999 }} />
            </Box>
            
            {allBookings.length === 0 ? (
              <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: 3, bgcolor: '#f8fafc' }}>
                <Typography color="text.secondary" sx={{ fontWeight: 700 }}>
                  אין הזמנות להצגה כרגע.
                </Typography>
              </Paper>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {allBookings.map((booking: Booking) => (
                  <AdminBookingCard key={booking._id} booking={booking} />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  )
}

