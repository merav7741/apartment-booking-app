import { Card, CardMedia, CardContent, Typography, Box, Chip } from '@mui/material'
import type { Apartment } from '../../types/apartment.types'

interface ApartmentCardProps {
  apartment: Apartment
  onClick: (id: string) => void
}

export default function ApartmentCard({ apartment, onClick }: ApartmentCardProps) {
  const getDisplayImage = () => {
    const possibleImages = apartment.image;
    if (possibleImages && Array.isArray(possibleImages) && possibleImages.length > 0) {
      const firstImg = possibleImages[0];
      if (firstImg.startsWith('http')) return firstImg;
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5500';
      return `${baseUrl}/${firstImg.replace(/\\/g, '/')}`;
    }
    return null;
  };

  const finalImageUrl = getDisplayImage();

  return (
    <Card
      onClick={() => onClick(apartment._id)}
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        height: '100%',
        borderRadius: 4,
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: 8
        }
      }}
    >
      <Box sx={{ position: 'relative', height: 220 }}>
        {finalImageUrl ? (
          <CardMedia component="img" height="220" image={finalImageUrl} alt={apartment.name} sx={{ objectFit: 'cover' }} />
        ) : (
          <Box sx={{ height: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100', color: 'text.disabled', gap: 1 }}>
            <Typography sx={{ fontSize: 40 }}>🖼️</Typography>
            <Typography variant="body2">אין תמונה</Typography>
          </Box>
        )}
        <Chip
          label={`₪${apartment.price?.toLocaleString()}`}
          sx={{ position: 'absolute', bottom: 12, right: 12, bgcolor: 'background.paper', fontWeight: 'bold', fontSize: 16, color: 'primary.dark', boxShadow: 2, borderRadius: 2 }}
        />
      </Box>

      <CardContent sx={{ direction: 'rtl', p: 2, '&:last-child': { pb: 2 } }}>
        <Typography variant="h6" color="text.primary" gutterBottom sx={{ fontWeight: 700 }}>
          {apartment.name}
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          📍 {apartment.address || apartment.location}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: 1, borderColor: 'divider', pt: 1.5 }}>
          <Typography variant="body2" color="text.secondary">
            🛏️ {apartment.bedrooms} חדרים
          </Typography>
          <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
            פרטים נוספים ←
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
