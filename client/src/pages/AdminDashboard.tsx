import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchAllBookings } from '../store/bookingSlice'
import type { Booking } from '../store/bookingSlice'
import type { Apartment } from '../types/apartment.types'

// התיקון כאן: מייבאים את הקומפוננטה החדשה מהקובץ החדש שלה כ-default import
import AdminApartmentsTab from '../components/dashboard/AdminApartmentsTab'

import { Box, Card, CardContent, Chip, CircularProgress, Divider, Paper, Typography } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

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
          {/* התיקון כאן: שינוי שם התגית ל-AdminApartmentsTab */}
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

function AdminBookingCard({ booking }: { booking: Booking }) {
  const statusStyle = getBookingStatusStyle(booking.status)

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        bgcolor: 'background.paper',
        boxShadow: '0 8px 18px rgba(15, 23, 42, 0.05)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 12px 26px rgba(15, 23, 42, 0.09)'
        }
      }}
    >
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '8px 1fr', md: '8px minmax(220px, 0.75fr) minmax(0, 1.9fr) auto' },
            minHeight: { md: 86 }
          }}
        >
          <Box sx={{ bgcolor: statusStyle.color }} />
          <Box sx={{ px: 1.75, py: 1.25, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'text.primary', lineHeight: 1.2, mb: 0.25 }}>
              {booking.apartmentId?.name || 'דירה'}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
              אורח: {booking.customerId?.name || 'לא ידוע'}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25, fontWeight: 600 }}>
              {booking.customerId?.email || 'אין אימייל'}
            </Typography>
            <Chip
              label={statusStyle.label}
              size="small"
              sx={{
                alignSelf: 'flex-start',
                mt: 0.75,
                height: 22,
                bgcolor: statusStyle.bg,
                color: statusStyle.color,
                fontWeight: 900,
                borderRadius: 999
              }}
            />
          </Box>

          <Box sx={{ px: { xs: 1.75, md: 1.25 }, py: { xs: 1.25, md: 1.25 }, pt: { xs: 0, md: 1.25 }, gridColumn: { xs: '2', md: 'auto' } }}>
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <Divider sx={{ mb: 1 }} />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: 0.75 }}>
              <InfoCell label="התחלה" value={new Date(booking.startDate).toLocaleDateString('he-IL')} />
              <InfoCell label="סיום" value={new Date(booking.endDate).toLocaleDateString('he-IL')} />
              <InfoCell label='סה"כ לתשלום' value={`₪${booking.totalPrice.toLocaleString('he-IL')}`} strong />
              <InfoCell label="כתובת" value={booking.apartmentId?.address || 'לא זמין'} />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', pl: 1.75, pr: 1.25, gridColumn: { xs: '2', md: 'auto' }, pb: { xs: 1.25, md: 0 } }}>
            <CheckCircleIcon sx={{ fontSize: 26, color: statusStyle.color }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

function InfoCell({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <Box
      sx={{
        minHeight: 34,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        bgcolor: '#f8fafc',
        borderRadius: 1.5,
        px: 1.25,
        py: 0.75,
        border: '1px solid #eef2f7'
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography variant="caption" sx={{ fontWeight: strong ? 900 : 700, color: strong ? 'success.dark' : 'text.primary', textAlign: 'left' }}>
        {value}
      </Typography>
    </Box>
  )
}

function getBookingStatusStyle(status: Booking['status']) {
  if (status === 'Approved') {
    return { label: 'אושרה', color: '#16a34a', bg: 'rgba(22, 163, 74, 0.1)' }
  }

  if (status === 'Canceled') {
    return { label: 'בוטלה', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.1)' }
  }

  return { label: 'מחכה לאישור', color: '#d97706', bg: 'rgba(217, 119, 6, 0.12)' }
}