import { Box, Typography, Card, CardContent, Divider, Alert } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import DateRangeIcon from '@mui/icons-material/DateRange'
import NightsStayIcon from '@mui/icons-material/NightsStay'
import PaymentsIcon from '@mui/icons-material/Payments'

interface MyBookingsTabProps {
  bookings: any[]
}

export default function MyBookingsTab({ bookings }: MyBookingsTabProps) {
  const sortedBookings = [...bookings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>הזמנות שלי</Typography>

      {sortedBookings.length === 0 ? (
        <Alert severity="info" variant="outlined" sx={{ borderRadius: 2 }}>
          אין הזמנות בחודשים האחרונים. ברגע שתבצעו הזמנה, היא תופיע כאן.
        </Alert>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 3 }}>
          {sortedBookings.map((booking) => (
            <Card 
              key={booking._id} 
              variant="outlined" 
              sx={{ 
                borderRadius: 3, 
                borderRight: 5, 
                borderColor: booking.status === 'Canceled' ? 'error.main' : getStatusColor(booking.status) 
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary', m: 0 }}>
                      {booking.apartmentId?.name || 'דירה לא זמינה'}
                    </Typography>
                    {booking.apartmentId?.address && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                        <LocationOnIcon fontSize="inherit" /> {booking.apartmentId.address}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ px: 1.5, py: 0.5, borderRadius: 1.5, fontSize: '12px', fontWeight: 600, color: 'white', bgcolor: getStatusColor(booking.status) }}>
                    {getStatusLabel(booking.status)}
                  </Box>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, mb: 1.5 }}>
                  <DetailRow icon={<DateRangeIcon fontSize="inherit" />} label="תאריך התחלה" value={new Date(booking.startDate).toLocaleDateString('he-IL')} />
                  <DetailRow icon={<DateRangeIcon fontSize="inherit" />} label="תאריך סיום" value={new Date(booking.endDate).toLocaleDateString('he-IL')} />
                  <DetailRow icon={<NightsStayIcon fontSize="inherit" />} label="סה״כ לילות" value={booking.numberOfNights} />
                  <DetailRow icon={<PaymentsIcon fontSize="inherit" />} label="סה\"כ לתשלום" value={`₪${booking.totalPrice?.toLocaleString()}`} isPrice />
                </Box>

                {booking.status === 'Canceled' && (
                  <Alert severity="error" icon={false} sx={{ py: 0, px: 1.5, borderRadius: 1.5 }}>הזמנה זו בוטלה</Alert>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  )
}

function DetailRow({ icon, label, value, isPrice }: { icon: React.ReactNode; label: string; value: string | number; isPrice?: boolean }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: 'inherit' }}>
        {icon} {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: isPrice ? '800' : '600', color: isPrice ? 'success.main' : 'text.primary', fontSize: 'inherit' }}>
        {value}
      </Typography>
    </Box>
  )
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'Approved': return '#10b981'
    case 'Pending Approval': return '#f59e0b'
    case 'Canceled': return '#ef4444'
    default: return '#6b7280'
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'Approved': return 'מאושר'
    case 'Pending Approval': return 'בהמתנה'
    case 'Canceled': return 'בוטל'
    default: return status
  }
}