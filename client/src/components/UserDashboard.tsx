import { useEffect, useMemo, useState } from 'react'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchMyApartments } from '../store/apartmentSlice'
import { fetchMyBookings, fetchIncomingBookings, updateBookingStatus } from '../store/bookingSlice'

// ייבוא תתי-הכרטיסיות החדשות שיצרנו בצעדים הקודמים
import ApartmentsTab from '../components/dashboard/ApartmentsTab'
import MyBookingsTab from '../components/dashboard/MyBookingsTab'
import BookingsTab from '../components/dashboard/BookingsTab'
import ProfileTab from '../components/dashboard/ProfileTab'

// MUI Imports
import { Box, Container, Typography, Button, Tabs, Tab, Card, CardContent, Badge, Paper } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import HomeIcon from '@mui/icons-material/Home'
import StarIcon from '@mui/icons-material/Star'
import DateRangeIcon from '@mui/icons-material/DateRange'
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

type DashboardTab = 'apartments' | 'myBookings' | 'bookings' | 'profile'

export default function UserDashboard() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { myApartments, loading } = useAppSelector((state) => state.apartments)
  const { user, isAuthenticated, token } = useAppSelector((state) => state.auth)
  const { incomingBookings, myBookings } = useAppSelector((state) => state.bookings)

  const [activeTab, setActiveTab] = useState<DashboardTab>('apartments')
  
  const pendingCount = incomingBookings.filter((b) => b.status === 'Pending Approval').length
  const publishedCount = myApartments.length

  const recentBookings = useMemo(() => {
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
    return myBookings.filter((booking) => new Date(booking.startDate) >= ninetyDaysAgo)
  }, [myBookings])

  const recommendedCount = useMemo(
    () => myApartments.filter((apt) => apt.reviews?.some((review) => Number(review.rating) === 5)).length,
    [myApartments]
  )

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMyApartments())
      dispatch(fetchIncomingBookings())
      dispatch(fetchMyBookings())
    }
  }, [dispatch, isAuthenticated])

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!window.confirm('למחוק את הדירה לצמיתות?')) return

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/apartments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        await dispatch(fetchMyApartments())
      }
    } catch {
      alert('אירעה שגיאה במחיקת הדירה')
    }
  }

  const isEditingOrAdding = location.pathname.includes('/edit/') || location.pathname.includes('/addApartment')
  if (isEditingOrAdding) return <Outlet />

  return (
    <Container maxWidth="lg" sx={{ py: 4, direction: 'rtl', textAlign: 'right' }}>
      
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 700 }}>אזור אישי</Typography>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: 'text.primary' }}>שלום {user?.name}</Typography>
        </Box>
        <Button 
          variant="contained" 
          color="success" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/dashboard/addApartment')}
          sx={{ borderRadius: 2, fontWeight: 700, px: 3, py: 1, gap: 1, '& .MuiButton-startIcon': { m: 0 } }}
        >
          הוסף דירה חדשה
        </Button>
      </Box>

      {/* Stats Section */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 4 }}>
        <StatCard title="נכסים פעילים" value={publishedCount} icon={<HomeIcon color="primary" />} />
        <StatCard title="נכסים עם 5 כוכבים" value={recommendedCount} icon={<StarIcon sx={{ color: '#ffb703' }} />} />
        <StatCard title="הזמנות אחרונות" value={recentBookings.length} icon={<DateRangeIcon color="info" />} />
        <StatCard title="הזמנות נכנסות" value={incomingBookings.length} icon={<MoveToInboxIcon color="warning" />} />
        <StatCard title="סוג חשבון" value={user?.role === 'Admin' ? 'מנהל' : 'מנוי'} icon={<AccountCircleIcon color="action" />} />
      </Box>

      {/* Tabs Menu */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, bgcolor: '#f8fafc', borderRadius: 2, p: 0.5 }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue: DashboardTab) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab value="apartments" label="הנכסים שלי" sx={{ fontWeight: 700 }} />
          <Tab value="myBookings" label="הזמנות שלי" sx={{ fontWeight: 700 }} />
          <Tab 
            value="bookings" 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>הזמנות נכנסות</span>
                {pendingCount > 0 && <Badge badgeContent={pendingCount} color="error" sx={{ mr: 1 }} />}
              </Box>
            } 
            sx={{ fontWeight: 700 }} 
          />
          <Tab value="profile" label="פרופיל" sx={{ fontWeight: 700 }} />
        </Tabs>
      </Box>

      {/* Dynamic Tab Rendering Layer */}
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: { xs: 2, sm: 4 }, bgcolor: 'background.paper', boxShadow: '0 10px 28px rgba(15, 23, 42, 0.03)' }}>
        {activeTab === 'apartments' && (
          <ApartmentsTab
            apartments={myApartments}
            loading={loading}
            onEdit={(id) => navigate(`/dashboard/edit/${id}`)}
            onDelete={handleDelete}
            onOpen={(id) => navigate(`/apartment/${id}`)}
          />
        )}

        {activeTab === 'myBookings' && <MyBookingsTab bookings={myBookings} />}

        {activeTab === 'bookings' && (
          <BookingsTab bookings={incomingBookings} onStatusChange={(bookingId, status) => {
            dispatch(updateBookingStatus({ bookingId, status }))
          }} />
        )}

        {activeTab === 'profile' && <ProfileTab user={user} />}
      </Paper>
    </Container>
  )
}

function StatCard({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', '&:last-child': { pb: 2 } }}>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>{title}</Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>{value}</Typography>
        </Box>
        <Box sx={{ display: 'flex', p: 1, bgcolor: '#f1f5f9', borderRadius: 2 }}>{icon}</Box>
      </CardContent>
    </Card>
  )
}
