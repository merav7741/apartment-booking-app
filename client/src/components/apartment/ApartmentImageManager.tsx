import { useState } from 'react'
import { Box, Typography, Button, TextField, IconButton } from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material';

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'

interface ApartmentImageManagerProps {
  images: string[]
  onChange: (newImages: string[]) => void
}

export default function ApartmentImageManager({ images, onChange }: ApartmentImageManagerProps) {
  const [imageUrl, setImageUrl] = useState('')

  const handleAddImage = () => {
    if (!imageUrl.trim()) return
    const updatedImages = [...images, imageUrl.trim()]
    onChange(updatedImages)
    setImageUrl('') 
  }

  const handleDeleteImage = (indexToRemove: number) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove)
    onChange(updatedImages)
  }

  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', p: 3, borderRadius: 3, bgcolor: 'background.paper' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
        ניהול תמונות הנכס ({images.length})
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          label="הוסף כתובת תמונה (URL)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
        <Button
          variant="outlined"
          color="primary"
          onClick={handleAddImage}
          startIcon={<AddPhotoAlternateIcon />}
          sx={{ minWidth: 120 }}
        >
          הוסף
        </Button>
      </Box>

      {images.length === 0 ? (
        <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
          טרם הועלו תמונות לנכס זה.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {images.map((url, index) => (
            <Box
              key={`${url}-${index}`}
              sx={{
                position: 'relative',
                width: 120,
                height: 90,
                borderRadius: 2,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover .delete-btn': { opacity: 1 } // מציג את כפתור המחיקה בריחופו של העכבר
              }}
            >
              <img
                src={url}
                alt={`Apartment preview ${index + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/120x90?text=Error'
                }}
              />
              
              <IconButton
                className="delete-btn"
                onClick={() => handleDeleteImage(index)}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  color: 'error.main',
                  opacity: 0.7,
                  transition: 'opacity 0.2s',
                  '&:hover': { bgcolor: 'error.main', color: 'white', opacity: 1 }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}