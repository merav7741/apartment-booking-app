import { useState } from 'react'
import type { Review } from '../types/apartment.types'


interface ReviewsSectionProps {
  reviews: Review[]
  userId: string
  apartmentId: string
  apartment: any
  onReviewAdded: () => void
}

export default function ReviewsSection({ reviews, userId, apartmentId, apartment, onReviewAdded }: ReviewsSectionProps) {
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState('')
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  const handleAddReview = async () => {
    if (!userId) return alert('יש להתחבר כדי להוסיף ביקורת')
    if (!newComment.trim()) return alert('אנא כתוב ביקורת')
    setIsSubmittingReview(true)

    const newReview = {
      userId,
      rating: newRating,
      comment: newComment,
    }

    const updatedReviews = [...(reviews || []).map(({ _id, ...r }) => r), newReview]

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/apartments/${apartmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...apartment, reviews: updatedReviews })
      })

      if (response.ok) {
        setNewComment('')
        onReviewAdded()
        alert('תודה על הדירוג!')
      }
    } catch (error) {
      console.error('Error adding review', error)
    } finally {
      setIsSubmittingReview(false)
    }
  }

  return (
    <div style={{ marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '30px' }}>
      <h2>משוב ({reviews?.length || 0})</h2>

      <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', margin: '20px 0' }}>
        <h4>הוסף חוות דעת</h4>
        <div style={{ marginBottom: '10px' }}>
          <label>דירוג: </label>
          <select value={newRating} onChange={(e) => setNewRating(Number(e.target.value))}>
            {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} כוכבים</option>)}
          </select>
        </div>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="איך הייתה השהייה שלכם?"
          style={{ width: '100%', height: '80px', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '10px' }}
        />
        <button onClick={handleAddReview} disabled={isSubmittingReview} style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          {isSubmittingReview ? 'שולח...' : 'שלח משוב'}
        </button>
      </div>

      {reviews?.map((rev, i) => (
        <div key={i} style={{ borderBottom: '1px solid #eee', padding: '15px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {/* <strong>{rev._id}</strong> */}
            <span style={{ color: '#f59e0b' }}>{'★'.repeat(rev.rating)}</span>
          </div>
          <p style={{ margin: '5px 0', color: '#444' }}>{rev.comment}</p>
          <small style={{ color: '#999' }}>{rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : ''}</small>

        </div>
      ))}
    </div>
  )
}
