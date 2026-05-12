import { useState } from 'react'
import type { Apartment, Review } from '../types/apartment.types'

interface ReviewsSectionProps {
  reviews: Review[]; userId: string; userName: string; apartmentId: string; apartment: Apartment; onReviewAdded: () => void;
}

export default function ReviewsSection({ reviews, userId, userName, apartmentId, onReviewAdded }: ReviewsSectionProps) {
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleAddReview = async () => {
    if (!userId) return alert('יש להתחבר כדי להוסיף ביקורת');
    if (!newComment.trim()) return alert('אנא כתוב ביקורת');
    setIsSubmittingReview(true);
    
    const newReview = { userId, userName, rating: newRating, comment: newComment };
    const updatedReviews = [
      ...(reviews || []).map((review) => ({
        userId: review.userId,
        userName: review.userName,
        rating: review.rating,
        comment: review.comment
      })),
      newReview
    ];

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/apartments/${apartmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ reviews: updatedReviews })
      });
      if (response.ok) { setNewComment(''); onReviewAdded(); }
    } finally { setIsSubmittingReview(false); }
  };

  return (
    <div style={{ marginTop: '60px', borderTop: '2px solid #f3f4f6', paddingTop: '40px' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>חוות דעת ({reviews?.length || 0})</h2>

      <div style={addReviewBoxStyle}>
        <h4 style={{ margin: '0 0 15px 0' }}>כתוב חוות דעת</h4>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
          <span>דרוג:</span>
          <select value={newRating} onChange={(e) => setNewRating(Number(e.target.value))} style={selectStyle}>
            {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} כוכבים</option>)}
          </select>
        </div>
        <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="שתף את החוויה שלך..." style={textareaStyle} />
        <button onClick={handleAddReview} disabled={isSubmittingReview} style={submitBtnStyle}>
          {isSubmittingReview ? 'שולח...' : 'פרסם תגובה'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {reviews?.map((rev, i) => (
          <div key={i} style={reviewCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <strong style={{ fontSize: '16px' }}>{rev.userName}</strong>
              <span style={{ color: '#f59e0b', fontSize: '18px' }}>{'★'.repeat(rev.rating)}</span>
            </div>
            <p style={{ margin: 0, color: '#4b5563', lineHeight: '1.5' }}>{rev.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const addReviewBoxStyle = { backgroundColor: '#f8fafc', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '40px' };
const textareaStyle = { width: '100%', height: '100px', padding: '15px', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '15px', resize: 'none' as const };
const selectStyle = { padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' };
const submitBtnStyle = { padding: '10px 25px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' };
const reviewCardStyle = { padding: '20px', borderRadius: '12px', backgroundColor: '#fff', border: '1px solid #f1f5f9', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' };
