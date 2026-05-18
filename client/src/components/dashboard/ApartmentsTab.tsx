import { Box, Typography, Button, Card, Alert, CircularProgress } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ApartmentCard from '../ApartmentCard'
import type { Apartment } from '../../types/apartment.types'

interface ApartmentsTabProps {
  apartments: Apartment[]
  loading: boolean
  onEdit: (id: string) => void
  onDelete: (e: React.MouseEvent, id: string) => void
  onOpen: (id: string) => void
}

export default function ApartmentsTab({ apartments, loading, onEdit, onDelete, onOpen }: ApartmentsTabProps) {
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
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>הנכסים שפרסמת</Typography>

      {apartments.length > 0 ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 3 }}>
          {apartments.map((apt) => (
            <ApartmentWithActions
              key={apt._id}
              apartment={apt}
              onEdit={onEdit}
              onDelete={onDelete}
              onOpen={onOpen}
            />
          ))}
        </Box>
      ) : (
        <Alert severity="info" variant="outlined" sx={{ borderRadius: 2 }}>עדיין לא פרסמת דירות.</Alert>
      )}
    </Box>
  )
}

interface ApartmentWithActionsProps {
  apartment: Apartment
  onEdit: (id: string) => void
  onDelete: (e: React.MouseEvent, id: string) => void
  onOpen: (id: string) => void
  ownerLabel?: string
}

function ApartmentWithActions({ apartment, onEdit, onDelete, onOpen, ownerLabel }: ApartmentWithActionsProps) {
  return (
    <Card variant="outlined" sx={{ position: 'relative', borderRadius: 3, display: 'flex', flexDirection: 'column', overflow: 'visible' }}>
      <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 10, display: 'flex', gap: 1 }}>
        <Button 
          size="small" 
          variant="contained" 
          color="primary" 
          onClick={(e) => { e.stopPropagation(); onEdit(apartment._id) }}
          sx={{ px: 1.5, minWidth: 0, height: 32, borderRadius: 1.5 }}
        >
          <EditIcon fontSize="small" />
        </Button>
        <Button 
          size="small" 
          variant="contained" 
          color="error" 
          onClick={(e) => onDelete(e, apartment._id)}
          sx={{ px: 1.5, minWidth: 0, height: 32, borderRadius: 1.5 }}
        >
          <DeleteIcon fontSize="small" />
        </Button>
      </Box>

      {ownerLabel && (
        <Box sx={{ position: 'absolute', bottom: 120, right: 12, zIndex: 10, bgcolor: '#334155', color: 'white', px: 1.5, py: 0.5, borderRadius: 1.5, fontSize: '12px', fontWeight: 700 }}>
          בעלים: {ownerLabel}
        </Box>
      )}

      <ApartmentCard apartment={apartment} onClick={onOpen} />
    </Card>
  )
}

interface AdminApartmentsProps {
  apartments: Apartment[]
  loading?: boolean
  userId?: string
  onEdit: (id: string) => void
  onDelete: (e: React.MouseEvent, id: string) => void
  onOpen: (id: string) => void
}

export function AdminApartments({ apartments, loading = false, onEdit, onDelete, onOpen }: AdminApartmentsProps) {
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
