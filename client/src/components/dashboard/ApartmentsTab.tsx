import { Box, Typography, Alert, CircularProgress } from '@mui/material'
import ApartmentWithActions from '../apartment/ApartmentWithActions'
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