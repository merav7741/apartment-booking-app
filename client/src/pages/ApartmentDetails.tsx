import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Button, CircularProgress, Divider, Paper, Typography, Rating, Chip } from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon,
  CalendarMonth as CalendarMonthIcon,
  LocationOn as LocationOnIcon
} from '@mui/icons-material';
import { useAppSelector } from '../store/hooks'
import type { Apartment } from '../types/apartment.types'
import ReviewsSection from '../components/ReviewsSection'
import ImageCarousel from '../components/ImageCarousel'
import OwnerProfileCard from '../components/apartment/OwnerProfileCard'
import AmenitiesGrid from '../components/apartment/AmenitiesGrid'

export default function ApartmentDetails() {
  const { id } = useParams<{ id: string }>()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const navigate = useNavigate()
  const [apartment, setApartment] = useState<Apartment | null>(null)
  const [activeImage, setActiveImage] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchApartment = async () => {
    if (!id) return

    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/apartments/${id}`)

      if (!response.ok) {
        setApartment(null)
        return
      }

      const data = await response.json()
      setApartment(data)
      setActiveImage(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApartment()
  }, [id])

  const getImageUrl = (src: string) => (
    src.startsWith('http') ? src : `${import.meta.env.VITE_API_BASE_URL}/${src}`
  )

  const ownerInfo = typeof apartment?.ownerId === 'object' ? apartment.ownerId : null
  const ownerName = ownerInfo?.fullName || ownerInfo?.name || 'בעל/ת הנכס'
  const imageUrls = apartment?.image?.map(getImageUrl) ?? []
  const apartmentLocation = apartment?.city || apartment?.location || apartment?.address || 'לא צוין'
  const apartmentPrice = apartment?.price ?? apartment?.pricePerNight

  const detailItems = [
    { icon: '🛏️', label: 'חדרים', value: apartment?.bedrooms ?? 'לא צוין' },
    { icon: '📍', label: 'מיקום', value: apartmentLocation },
    { icon: '💸', label: 'מחיר ללילה', value: apartmentPrice ? `₪${apartmentPrice}` : 'לא צוין' },
    { icon: '🏡', label: 'כתובת', value: apartment?.address || 'לא צוינה' },
  ]

  const downloadApartmentDetails = () => {
    if (!apartment) return

    const details = [
      `שם הנכס: ${apartment.name}`,
      `עיר: ${apartment.city || 'לא צוינה'}`,
      `כתובת: ${apartment.address || 'לא צוינה'}`,
      `מחיר ללילה: ₪${apartmentPrice}`,
      `חדרים: ${apartment.bedrooms}`,
      `תיאור: ${apartment.description || 'אין תיאור זמין.'}`,
      '',
      'קישורים לתמונות:',
      ...(imageUrls.length > 0 ? imageUrls : ['אין תמונות זמינות.']),
    ].join('\n')

    const blob = new Blob([details], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${apartment.name || 'apartment'}-details.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const prevImage = () => {
    if (!imageUrls.length) return
    setActiveImage((current) => (current - 1 + imageUrls.length) % imageUrls.length)
  }

  const nextImage = () => {
    if (!imageUrls.length) return
    setActiveImage((current) => (current + 1) % imageUrls.length)
  }

  if (loading) {
    return (
      <Box sx={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, direction: 'rtl' }}>
        <CircularProgress size={28} />
        <Typography color="text.secondary" sx={{ fontWeight: 700 }}>טוען חוויה...</Typography>
      </Box>
    )
  }

  if (!apartment) {
    return (
      <Box sx={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', direction: 'rtl' }}>
        <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 800 }}>הדירה לא נמצאה</Typography>
      </Box>
    )
  }

  const averageRating = apartment.reviews && apartment.reviews.length > 0
    ? apartment.reviews.reduce((acc, rev) => acc + rev.rating, 0) / apartment.reviews.length
    : 5;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 3 }, py: 5, direction: 'rtl' }}>
      <Button
        type="button"
        variant="outlined"
        color="inherit"
        startIcon={<ArrowBackIcon sx={{ transform: 'rotate(180deg)' }} />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3, borderRadius: 2, fontWeight: 800, gap: 1, '& .MuiButton-startIcon': { m: 0 } }}
      >
        חזרה
      </Button>

      {/* החלק העליון החדש והמעוצב - גרסה מתוקנת ומיושרת לימין */}
      <Box sx={{ mb: 4, pb: 3, borderBottom: '1px dashed', borderColor: 'divider' }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          gap: 3 
        }}>
          
          {/* צד ימין: כותרת, מיקום ותיאור הנכס מיושרים פיקס לימין */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'right' }}>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 900, fontSize: { xs: 28, sm: 36, md: 42 }, mb: 1.5, color: 'text.primary' }}>
              {apartment.name}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 3 }}>
              <Chip 
                icon={<LocationOnIcon sx={{ fontSize: '16px !important' }} />} 
                label={apartmentLocation} 
                size="small" 
                color="primary" 
                sx={{ fontWeight: 700, borderRadius: '6px' }} 
              />
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                {apartment.address}
              </Typography>
            </Box>

            {/* תיאור הנכס - עכשיו הוא חלק אינטגרלי מהצד הימני ומיושר מושלם */}
            <Box sx={{ width: '100%', maxWidth: '800px' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 0.5, color: 'text.primary', fontSize: 18 }}>
                תיאור הנכס
              </Typography>
              <Typography color="text.secondary" sx={{ lineHeight: 1.8, fontSize: 16 }}>
                {apartment.description || 'אין תיאור זמין לדירה זו.'}
              </Typography>
            </Box>
          </Box>

          {/* צד שמאל: קופסת הדירוג המעוצבת */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5, 
            bgcolor: '#f8fafc', 
            p: '10px 16px', 
            borderRadius: 3, 
            border: '1px solid #e2e8f0',
            alignSelf: { xs: 'stretch', sm: 'auto' },
            justifyContent: 'center',
            mt: { xs: 0, sm: 1 }
          }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1, color: 'text.primary' }}>
                {averageRating.toFixed(1)}
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Rating
                value={averageRating}
                readOnly
                precision={0.5}
                size="small"
                sx={{ mb: 0.2 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700, fontSize: 12 }}>
                {apartment.reviews?.length || 0} חוות דעת
              </Typography>
            </Box>
          </Box>

        </Box>
      </Box>

      {/* שאר חלקי העמוד (תמונות, גריד, וכרטיס בעלים) */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.75fr 1fr' }, gap: { xs: 3, md: 5 } }}>
        <Box>
          <ImageCarousel imageUrls={imageUrls} activeIndex={activeImage} onPrev={prevImage} onNext={nextImage} onSelect={setActiveImage} />

          <Paper variant="outlined" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 1.5, p: 2.5, borderRadius: 3, boxShadow: '0 8px 24px rgba(15,23,42,0.06)', mb: 3 }}>
            {detailItems.map((item) => (
              <Box key={item.label} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, p: 1.5, bgcolor: '#f8fafc', borderRadius: 2 }}>
                <Typography sx={{ fontSize: 22 }}>{item.icon}</Typography>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 700, mb: 0.5 }}>
                    {item.label}
                  </Typography>
                  <Typography sx={{ fontWeight: 900, color: 'text.primary' }}>{item.value}</Typography>
                </Box>
              </Box>
            ))}
          </Paper>

          <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>מתקנים ושירותים</Typography>
          <AmenitiesGrid characteristics={apartment.characteristics} />
        </Box>

        <Box>
          <OwnerProfileCard ownerName={ownerName} />
          <Button
            type="button"
            fullWidth
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={downloadApartmentDetails}
            sx={{ my: 2, py: 1.4, borderRadius: 2.5, fontWeight: 800, gap: 1, '& .MuiButton-startIcon': { m: 0 } }}
          >
            הורד מפרט
          </Button>

          <Paper variant="outlined" sx={{ position: { md: 'sticky' }, top: 100, p: 3, borderRadius: 3, boxShadow: '0 20px 40px rgba(15,23,42,0.08)' }}>
            <Box sx={{ mb: 2 }}>
              <Typography component="span" sx={{ fontSize: 30, fontWeight: 900 }}>₪{apartmentPrice}</Typography>
              <Typography component="span" color="text.secondary"> / לילה</Typography>
            </Box>
            <Divider sx={{ mb: 2.5 }} />

            {!isAuthenticated ? (
              <Button type="button" fullWidth variant="contained" onClick={() => navigate('/login')} sx={{ py: 1.7, borderRadius: 2.5, fontWeight: 900 }}>
                התחבר להזמנה
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  startIcon={<CalendarMonthIcon />}
                  onClick={() => navigate(`/booking/${id}`)}
                  sx={{ py: 1.7, borderRadius: 2.5, fontWeight: 900, gap: 1, '& .MuiButton-startIcon': { m: 0 } }}
                >
                  בצע הזמנה
                </Button>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, lineHeight: 1.6 }}>
                  לחץ על הכפתור כדי לבחור תאריכים ולהזמין את הדירה
                </Typography>
              </>
            )}
          </Paper>
        </Box>
      </Box>

      <ReviewsSection
        reviews={apartment.reviews || []}
        userId={user?._id || ''}
        userName={user?.name || ''}
        apartmentId={id!}
        onReviewAdded={fetchApartment}
      />
    </Box>
  )
}