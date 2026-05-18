
import { Box, Typography, Alert, CircularProgress } from '@mui/material'
import ApartmentWithActions from '../apartment/ApartmentWithActions'
import type { Apartment } from '../../types/apartment.types'

interface AdminApartmentsTabProps {
  apartments: Apartment[]
  loading?: boolean
  userId?: string
  onEdit: (id: string) => void
  onDelete: (e: React.MouseEvent, id: string) => void
  onOpen: (id: string) => void
}

export default function AdminApartmentsTab({ apartments, loading = false, onEdit, onDelete, onOpen }: AdminApartmentsTabProps) {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, gap: 2, alignItems: 'center' }}>
        <CircularProgress size={24} />
        <Typography color="text.secondary">טוען נכסים...</Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>כל הנכסים במערכת</Typography>

      {apartments.length > 0 ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 3 }}>
          {apartments.map((apt) => {
            // חילוץ פרטי הבעלים מתוך האובייקט המוצמד (Populated ownerId)
            const ownerInfo = typeof apt.ownerId === 'object' ? apt.ownerId : null
            const ownerLabel = ownerInfo?.fullName || ownerInfo?.name

            return (
              <ApartmentWithActions
                key={apt._id}
                apartment={apt}
                ownerLabel={ownerLabel}
                onEdit={onEdit}
                onDelete={onDelete}
                onOpen={onOpen}
              />
            )
          })}
        </Box>
      ) : (
        <Alert severity="info" variant="outlined" sx={{ borderRadius: 2 }}>אין דירות להצגה.</Alert>
      )}
    </Box>
  )
}