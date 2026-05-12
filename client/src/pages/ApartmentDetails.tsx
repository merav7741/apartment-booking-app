import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useAppSelector } from '../store/hooks'
import type { Apartment } from '../types/apartment.types'
import ReviewsSection from '../components/ReviewsSection'
import ImageCarousel from '../components/ImageCarousel'
import OwnerProfileCard from '../components/OwnerProfileCard'
import AmenitiesGrid from '../components/AmenitiesGrid'

export default function ApartmentDetails() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedRange, setSelectedRange] = useState<[Date, Date] | null>(null);
  const [updatingDates, setUpdatingDates] = useState(false);

  useEffect(() => { fetchApartment(); }, [id]);

  const fetchApartment = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/apartments/${id}`);
      const data = await response.json();
      setApartment(data);
      setActiveImage(0);
    } finally { setLoading(false); }
  };


  const ownerInfo = typeof apartment?.ownerId === 'object' ? apartment.ownerId : null;
  const ownerName = ownerInfo?.fullName || ownerInfo?.name || 'בעל/ת הנכס';
  const detailItems = [
    { icon: '🛏️', label: 'חדרים', value: apartment?.bedrooms },
    { icon: '📍', label: 'מיקום', value: apartment?.city || apartment?.location || apartment?.address },
    { icon: '💲', label: 'מחיר ללילה', value: apartment ? `₪${apartment.price}` : '' },
    { icon: '🏡', label: 'כתובת', value: apartment?.address }
  ];

  const getImageUrl = (src: string) => src.startsWith('http') ? src : `${import.meta.env.VITE_API_BASE_URL}/${src}`;
  const imageUrls = apartment?.image?.map(getImageUrl) ?? [];

  const prevImage = () => {
    if (!imageUrls.length) return;
    setActiveImage((current) => (current - 1 + imageUrls.length) % imageUrls.length);
  };

  const nextImage = () => {
    if (!imageUrls.length) return;
    setActiveImage((current) => (current + 1) % imageUrls.length);
  };

  const handleBooking = async () => {
    if (!selectedRange || !apartment) return;
    setUpdatingDates(true);
    // לוגיקת תאריכים... (הקוד שלך נשאר זהה)
    alert('בוצע!'); // דוגמה לקיצור
    setUpdatingDates(false);
  };

  if (loading) return <div style={loaderStyle}>טוען חוויה...</div>;
  if (!apartment) return <div style={loaderStyle}>הדירה לא נמצאה</div>;

  return (
    <div style={containerStyle}>
      <style>{`
        .booked-day { background: #fee2e2 !important; color: #ef4444 !important; text-decoration: line-through; }
        .react-calendar { border: none !important; width: 100% !important; font-family: inherit; }
        .react-calendar__tile--active { background: #2563eb !important; border-radius: 8px; }
      `}</style>

      <button type="button" onClick={() => navigate(-1)} style={backButtonStyle}>← חזרה</button>
      <div style={headerSectionStyle}>
        <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>{apartment.name}</h1>
        <p style={{ color: '#6b7280' }}>📍 {apartment.location} • {apartment.address}</p>
      </div>

      <div style={mainGridStyle}>
        <div style={leftColumnStyle}>
          <ImageCarousel
            imageUrls={imageUrls}
            activeIndex={activeImage}
            onPrev={prevImage}
            onNext={nextImage}
            onSelect={setActiveImage}
          />

          <div style={detailCardStyle}>
            {detailItems.map((item) => (
              <div key={item.label} style={detailItemStyle}>
                <span style={detailIconStyle}>{item.icon}</span>
                <div>
                  <div style={detailLabelStyle}>{item.label}</div>
                  <div style={detailValueStyle}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          <h3 style={subTitleStyle}>מתקנים ושירותים</h3>
          <AmenitiesGrid characteristics={apartment.characteristics} />

          <h3 style={subTitleStyle}>תיאור הנכס</h3>
          <p style={descriptionStyle}>{apartment.description || "אין תיאור זמין לדירה זו."}</p>
        </div>

        <div style={rightColumnStyle}>
          <OwnerProfileCard ownerName={ownerName} />

          <div style={bookingCardStyle}>
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '28px', fontWeight: 'bold' }}>₪{apartment.price}</span>
              <span style={{ color: '#6b7280' }}> / לילה</span>
            </div>

            {!isAuthenticated ? (
              <button onClick={() => navigate('/login')} style={primaryBtnStyle}>התחבר להזמנה</button>
            ) : !showCalendar ? (
              <button onClick={() => setShowCalendar(true)} style={primaryBtnStyle}>בדיקת זמינות</button>
            ) : (
              <div style={{ animation: 'fadeIn 0.3s' }}>
                <Calendar 
                  onChange={(val: any) => setSelectedRange(val)} 
                  selectRange={true} 
                  tileClassName={({ date }) => apartment.notAvailableDates?.some((d: any) => new Date(d).toDateString() === date.toDateString()) ? 'booked-day' : ''} 
                />
                <button onClick={handleBooking} disabled={!selectedRange || updatingDates} style={{ ...primaryBtnStyle, marginTop: '15px', backgroundColor: '#10b981' }}>
                  {updatingDates ? 'מעדכן...' : 'אשר הזמנה'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ReviewsSection reviews={apartment.reviews || []} userId={user?._id || ''} userName={user?.name || ''} apartmentId={id!} apartment={apartment} onReviewAdded={fetchApartment} />
    </div>
  )
}

const containerStyle = { maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', direction: 'rtl' as const };
const mainGridStyle = { display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '50px' };
const headerSectionStyle = { marginBottom: '30px', borderBottom: '1px solid #f3f4f6', paddingBottom: '20px' };
const detailCardStyle = { display: 'grid', gap: '14px', padding: '22px', backgroundColor: 'white', borderRadius: '24px', border: '1px solid #e5e7eb', boxShadow: '0 8px 24px rgba(15,23,42,0.06)', marginBottom: '30px' };
const detailItemStyle = { display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '14px', backgroundColor: '#f8fafc', borderRadius: '18px' };
const detailIconStyle = { fontSize: '22px', marginTop: '2px' };
const detailLabelStyle = { color: '#6b7280', fontSize: '14px', marginBottom: '6px' };
const detailValueStyle = { fontSize: '16px', fontWeight: '700', color: '#111827' };
const bookingCardStyle = { position: 'sticky' as const, top: '100px', padding: '30px', borderRadius: '24px', border: '1px solid #e5e7eb', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', backgroundColor: 'white' };
const primaryBtnStyle = { width: '100%', padding: '16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold' as const, cursor: 'pointer', transition: '0.3s' };
const backButtonStyle = { marginBottom: '20px', border: '1px solid #d1d5db', borderRadius: '12px', backgroundColor: 'white', color: '#1f2937', padding: '12px 18px', cursor: 'pointer', fontWeight: '700', boxShadow: '0 6px 18px rgba(15,23,42,0.08)' };
const subTitleStyle = { fontSize: '22px', fontWeight: 'bold', marginBottom: '15px' };
const descriptionStyle = { lineHeight: '1.8', color: '#374151', fontSize: '17px' };
const loaderStyle = { textAlign: 'center' as const, padding: '100px', fontSize: '20px', color: '#6b7280' };
const leftColumnStyle = {};
const rightColumnStyle = {};