import { Box, IconButton, Paper, Typography } from '@mui/material'
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

type ImageCarouselProps = {
  imageUrls: string[]
  activeIndex: number
  onPrev: () => void
  onNext: () => void
  onSelect: (index: number) => void
}

export default function ImageCarousel({ imageUrls, activeIndex, onPrev, onNext, onSelect }: ImageCarouselProps) {
  const activeImage = imageUrls[activeIndex]

  return (
    <Box sx={{ position: 'relative', mb: 3 }}>
      {activeImage ? (
        <Box
          component="img"
          src={activeImage}
          sx={{ width: '100%', height: 500, objectFit: 'cover', borderRadius: 6, boxShadow: 4 }}
        />
      ) : (
        <Paper
          variant="outlined"
          sx={{
            height: 500,
            borderRadius: 6,
            boxShadow: 4,
            bgcolor: '#f8fafc',
            borderColor: '#e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            textAlign: 'center',
            color: 'text.secondary',
          }}
        >
          <ImageNotSupportedIcon sx={{ fontSize: 64, color: 'primary.main', opacity: 0.8 }} />
          <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary' }}>
            אין תמונה זמינה
          </Typography>
          <Typography variant="body2" sx={{ maxWidth: 360, lineHeight: 1.7 }}>
            בעל הנכס עדיין לא העלה תמונות לדירה הזו.
          </Typography>
        </Paper>
      )}

      {imageUrls.length > 1 && (
        <Box sx={{ position: 'absolute', top: '50%', left: 0, right: 0, display: 'flex', justifyContent: 'space-between', transform: 'translateY(-50%)', px: 1.5, pointerEvents: 'none' }}>
          <IconButton onClick={onPrev} sx={{ pointerEvents: 'auto', bgcolor: 'rgba(15,23,42,0.78)', color: 'common.white', boxShadow: 3, '&:hover': { bgcolor: 'rgba(15,23,42,0.92)' } }}>
            <NavigateBeforeIcon fontSize="large" />
          </IconButton>
          <IconButton onClick={onNext} sx={{ pointerEvents: 'auto', bgcolor: 'rgba(15,23,42,0.78)', color: 'common.white', boxShadow: 3, '&:hover': { bgcolor: 'rgba(15,23,42,0.92)' } }}>
            <NavigateNextIcon fontSize="large" />
          </IconButton>
        </Box>
      )}

      {imageUrls.length > 1 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: 1.5, mt: 2 }}>
          {imageUrls.map((src, index) => (
            <Paper
              key={`${src}-${index}`}
              component="button"
              onClick={() => onSelect(index)}
              elevation={0}
              sx={{
                border: 2,
                borderColor: index === activeIndex ? 'primary.main' : 'divider',
                borderRadius: 4,
                overflow: 'hidden',
                p: 0,
                cursor: 'pointer',
                bgcolor: 'background.paper',
                transition: 'border-color 0.2s'
              }}
            >
              <Box component="img" src={src} sx={{ width: '100%', height: 80, objectFit: 'cover', display: 'block' }} />
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  )
}
