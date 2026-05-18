import { useState } from 'react'
import { Box, Typography, Paper, Select, MenuItem, TextField, Button, Divider } from '@mui/material'
import type { Review } from '../../types/apartment.types'

interface ReviewsSectionProps {
  reviews: Review[];
   userId: string; 
   userName: string; 
   apartmentId: string; 
   onReviewAdded: () => void;
}

export default function ReviewsSection({ reviews, userId, userName, apartmentId, onReviewAdded }: ReviewsSectionProps) {
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState('')
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  const handleAddReview = async () => {
    if (!userId) return alert('יש להתחבר כדי להוסיף ביקורת')
    if (!newComment.trim()) return alert('אנא כתוב ביקורת')
    setIsSubmittingReview(true)

    const newReview = { userId, userName, rating: newRating, comment: newComment }
    const updatedReviews = [
      ...(reviews || []).map((review) => ({
        userId: review.userId,
        userName: review.userName,
        rating: review.rating,
        comment: review.comment
      })),
      newReview
    ]

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/apartments/${apartmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ reviews: updatedReviews })
      })
      if (response.ok) { setNewComment(''); onReviewAdded() }
    } finally { setIsSubmittingReview(false) }
  }

  return (
    <Box sx={{ mt: 7.5, borderTop: 2, borderColor: 'grey.100', pt: 5 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2.5 }}>
        חוות דעת ({reviews?.length || 0})
      </Typography>

      <Paper elevation={0} sx={{ bgcolor: 'grey.50', p: 3, borderRadius: 4, border: 1, borderColor: 'divider', mb: 5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>כתוב חוות דעת</Typography>

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mb: 2 }}>
          <Typography variant="body2">דרוג:</Typography>
          <Select value={newRating} onChange={(e) => setNewRating(Number(e.target.value))} size="small" sx={{ borderRadius: 2 }}>
            {[5, 4, 3, 2, 1].map(n => <MenuItem key={n} value={n}>{n} כוכבים</MenuItem>)}
          </Select>
        </Box>

        <TextField
          multiline
          rows={4}
          fullWidth
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="שתף את החוויה שלך..."
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
        />

        <Button
          onClick={handleAddReview}
          disabled={isSubmittingReview}
          variant="contained"
          color="primary"
          sx={{ borderRadius: 2.5, fontWeight: 700, textTransform: 'none', px: 3 }}
        >
          {isSubmittingReview ? 'שולח...' : 'פרסם תגובה'}
        </Button>
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {reviews?.map((rev, i) => (
          <Paper key={i} elevation={0} sx={{ p: 2.5, borderRadius: 3, border: 1, borderColor: 'grey.100', boxShadow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>{rev.userName}</Typography>
              <Typography sx={{ color: 'warning.light', fontSize: 18 }}>{'★'.repeat(rev.rating)}</Typography>
            </Box>
            <Divider sx={{ mb: 1.5 }} />
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>{rev.comment}</Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  )
}
