import type { Apartment } from '../types/apartment.types'

interface ApartmentCardProps {
  apartment: Apartment
  onClick: (id: string) => void
}

export default function ApartmentCard({ apartment, onClick }: ApartmentCardProps) {
  const getDisplayImage = () => {
    // בודק את שני השמות האפשריים לשדה התמונות
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
    <div 
      onClick={() => onClick(apartment._id)} 
      style={cardStyle} 
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={imgWrapperStyle}>
        {finalImageUrl ? (
          <img src={finalImageUrl} alt={ apartment.name} style={imgStyle} />
        ) : (
          <div style={noImgStyle}>🖼️ אין תמונה</div>
        )}
        <div style={priceTagStyle}>₪{apartment.price?.toLocaleString()}</div>
      </div>
כן ה
      <div style={{ padding: '16px' }}>
        <h3 style={titleStyle}>{apartment.name}</h3>
        <p style={locationStyle}>📍 {apartment.location}</p>
        <div style={infoRowStyle}>
          <span>🛏️ { apartment.bedrooms} חדרים</span>
          <span style={moreDetailStyle}>פרטים נוספים ←</span>
        </div>
      </div>
    </div>
  )
}
const cardStyle: React.CSSProperties = {
  backgroundColor: 'white',
  borderRadius: '16px',
  overflow: 'hidden',
  cursor: 'pointer',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  transition: '0.3s ease',
  position: 'relative',
  height: '100%'
};

const imgWrapperStyle: React.CSSProperties = { 
  height: '220px', 
  width: '100%', 
  position: 'relative' 
};

const imgStyle: React.CSSProperties = { 
  width: '100%', 
  height: '100%', 
  objectFit: 'cover' 
};

const noImgStyle: React.CSSProperties = { 
  height: '100%', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  backgroundColor: '#f3f4f6', 
  color: '#9ca3af' 
};

const priceTagStyle: React.CSSProperties = { 
  position: 'absolute', 
  bottom: '12px', 
  right: '12px', 
  backgroundColor: 'white', 
  padding: '6px 12px', 
  borderRadius: '8px', 
  fontWeight: 'bold', 
  fontSize: '18px', 
  color: '#1e40af', 
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
};

const titleStyle: React.CSSProperties = { 
  margin: '0 0 6px 0', 
  fontSize: '18px', 
  fontWeight: '700', 
  color: '#1f2937', 
  textAlign: 'right' 
};

const locationStyle: React.CSSProperties = { 
  margin: '0 0 15px 0', 
  color: '#6b7280', 
  fontSize: '14px', 
  textAlign: 'right' 
};

const infoRowStyle: React.CSSProperties = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  borderTop: '1px solid #f3f4f6', 
  paddingTop: '12px', 
  fontSize: '14px', 
  color: '#4b5563', 
  direction: 'rtl' // עכשיו זה יעבוד
};

const moreDetailStyle: React.CSSProperties = { 
  color: '#2563eb', 
  fontWeight: '600' 
};