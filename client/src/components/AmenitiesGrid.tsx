import { Box, Typography } from '@mui/material'
import { AMENITY_TRANSLATIONS } from './amenities';

const AMENITY_ICONS: Record<string, string> = {
  wifi: '📶', ac: '❄️', heating: '🔥', elevator: '🛗', parking: '🅿️',
  kitchen: '🍳', microwave: '📡', fridge: '🧊', dishwasher: '🍽️', coffee_machine: '☕',
  garden: '🌿', balcony: '🏝️', pool: '🏊', jacuzzi: '♨️', nearbyAttractions: '🎡', nearbySynagogue: '✡️',
  gym: '🏋️', sauna: '🧖', security: '🛡️', cleaning_service: '🧹', wheelchair_accessible: '♿', baby_crib: '🛏️', high_chair: '🪑',
  pets_allowed: '🐾', sea_view: '🌊', mountain_view: '⛰️', city_view: '🏙️', fireplace: '🔥', workspace: '💻'
}

type AmenitiesGridProps = {
  characteristics?: string[]
}

export default function AmenitiesGrid({ characteristics }: AmenitiesGridProps) {
  if (!characteristics?.length) {
    return (
      <Box sx={{ color: '#64748b', p: 2, bgcolor: '#f8fafc', borderRadius: 2.25, textAlign: 'center' }}>
        לא נבחרו מתקנים לדירה זו
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 1.5,
        mb: 3.75,
      }}
    >
      {characteristics.map((item) => (
        <Box
          key={item}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            p: 1.75,
            borderRadius: 2,
            bgcolor: 'white',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 15px rgba(15,23,42,0.05)',
          }}
        >
          <Typography sx={{ fontSize: '18px' }}>
            {AMENITY_ICONS[item] || '✅'}
          </Typography>
          <Typography variant="body2">
            {AMENITY_TRANSLATIONS[item] || item}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}