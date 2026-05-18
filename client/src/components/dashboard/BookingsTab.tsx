import { Box, Typography, Card, CardContent, Divider, CardActions, Button, Alert } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import DateRangeIcon from '@mui/icons-material/DateRange'
import NightsStayIcon from '@mui/icons-material/NightsStay'
import PaymentsIcon from '@mui/icons-material/Payments'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import type { Booking } from '../../store/bookingSlice'

import { DetailRow, getStatusColor, getStatusLabel } from './dashboardUtils'

interface BookingsTabProps {
  bookings: Booking[]
  onStatusChange: (bookingId: string, status: Booking['status']) => void
}

export default function BookingsTab({ bookings, onStatusChange }: BookingsTabProps) {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>הזמנות נכנסות</Typography>

      {bookings.length === 0 ? (
        <Alert severity="info" variant="outlined" sx={{ borderRadius: 2 }}>
          אין עדיין הזמנות נכנסות להצגה. ברגע שהאורחים שלך יבצעו הזמנות, הן יופיעו כאן.
        </Alert>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 3 }}>
          {bookings.map((booking) => (
            <Card variant="outlined" sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }} key={booking._id}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{booking.apartmentId?.name || 'דירה'}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                      <PersonIcon fontSize="inherit" /> לטובת: {booking.customerId?.name || 'אורח'}
                    </Typography>
                  </Box>
                  <Box sx={{ px: 1.5, py: 0.5, borderRadius: 1.5, fontSize: '12px', fontWeight: 600, color: 'white', bgcolor: getStatusColor(booking.status) }}>
                    {getStatusLabel(booking.status)}
                  </Box>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                  <DetailRow icon={<DateRangeIcon fontSize="inherit" />} label="תאריך התחלה" value={new Date(booking.startDate).toLocaleDateString('he-IL')} />
                  <DetailRow icon={<DateRangeIcon fontSize="inherit" />} label="תאריך סיום" value={new Date(booking.endDate).toLocaleDateString('he-IL')} />
                  <DetailRow icon={<NightsStayIcon fontSize="inherit" />} label="מספר לילות" value={booking.numberOfNights} />
                  <DetailRow icon={<PaymentsIcon fontSize="inherit" />} label='סה"כ תשלום' value={`₪${booking.totalPrice?.toLocaleString()}`} isPrice />
                  <DetailRow icon={<EmailIcon fontSize="inherit" />} label="אימייל האורח" value={booking.customerId?.email} />
                  <DetailRow icon={<PhoneIcon fontSize="inherit" />} label="טלפון האורח" value={booking.customerId?.phone || 'לא ידוע'} />
                </Box>
              </CardContent>

              {booking.status  === 'Pending Approval' &&(
                <>
                  <Divider sx={{ mx: 2 }} />
                  <CardActions sx={{ p: 2, gap: 1.5 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => onStatusChange(booking._id, 'Approved')}
                      sx={{ borderRadius: 2, fontWeight: 700, gap: 1, '& .MuiButton-startIcon': { m: 0 } }}
                    >
                      אשר הזמנה
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={() => onStatusChange(booking._id, 'Canceled')}
                      sx={{ borderRadius: 2, fontWeight: 700, gap: 1, '& .MuiButton-startIcon': { m: 0 } }}
                    >
                      דחה הזמנה
                    </Button>
                  </CardActions>
                </>
              )}
            </Card>
          ))}
        </Box>
      )}
    </Box>
  )
}