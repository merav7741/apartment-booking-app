import { Box, IconButton, Paper } from '@mui/material'
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
  return (
    <Box sx={{ position: 'relative', mb: 3 }}>
      <Box
        component="img"
        src={imageUrls[activeIndex] || 'https://via.placeholder.com/1200x700?text=No+Image'}
        sx={{ width: '100%', height: 500, objectFit: 'cover', borderRadius: 6, boxShadow: 4 }}
      />

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
