import { Box, Typography } from '@mui/material'

const AMENITY_LABELS: Record<string, string> = {
  wifi: 'וואי-פיי', ac: 'מזגן', heating: 'חימום', elevator: 'מעלית', parking: 'חניה',
  kitchen: 'מטבח', microwave: 'מיקרוגל', fridge: 'מקרר', dishwasher: 'מדיח כלים', coffee_machine: 'מכונת קפה',
  garden: 'גינה', balcony: 'מרפסת', pool: 'בריכה', jacuzzi: 'גקוזי', nearbyAttractions: 'אטרקציות בקרבת מקום', nearbySynagogue: 'בית כנסת קרוב',
  gym: 'חדר כושר', sauna: 'סאונה', security: 'אבטחה', cleaning_service: 'שירותי ניקיון',
  wheelchair_accessible: 'נגישות לכיסא גלגלים', baby_crib: 'עריסת תינוק', high_chair: 'כיסא אוכל לתינוק',
  pets_allowed: 'חיות מחמד מותרות', sea_view: 'נוף לים', mountain_view: 'נוף להרים', city_view: 'נוף עירוני', fireplace: 'קמין', workspace: 'פינת עבודה'
}

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
            {AMENITY_LABELS[item] || item}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}
