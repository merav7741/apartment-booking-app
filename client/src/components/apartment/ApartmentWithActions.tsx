import { Box, Button, Card } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ApartmentCard from './ApartmentCard' // מאחר שהם באותה תיקייה עכשיו, זה רק ./
import type { Apartment } from '../../types/apartment.types'

// הגדרת ה-Props של הקומפוננטה
interface ApartmentWithActionsProps {
  apartment: Apartment
  onEdit: (id: string) => void
  onDelete: (e: React.MouseEvent, id: string) => void
  onOpen: (id: string) => void
  ownerLabel?: string
}

// הקומפוננטה עצמה - שימי לב שהוספנו export default בתחילה
export default function ApartmentWithActions({ apartment, onEdit, onDelete, onOpen, ownerLabel }: ApartmentWithActionsProps) {
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