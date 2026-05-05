import type { Apartment } from '../types/apartment.types'

interface ApartmentCardProps {
  apartment: Apartment
  onClick: (id: string) => void
}

export default function ApartmentCard({ apartment, onClick }: ApartmentCardProps) {
  
  const getDisplayImage = () => {
    const possibleImages = apartment.image;
    
    if (possibleImages && Array.isArray(possibleImages) && possibleImages.length > 0) {
      const firstImg = possibleImages[0];

      if (firstImg.startsWith('http')) {
        return firstImg;
      }

      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5500';
      return `${baseUrl}/${firstImg.replace(/\\/g, '/')}`;
    }
    return null;
  };

  const finalImageUrl = getDisplayImage();

  return (
    <div 
      onClick={() => onClick(apartment._id)}
      style={{
        border: '1px solid #ddd',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
      }}
    >
      <div style={{ width: '100%', height: '200px', backgroundColor: '#f3f4f6', position: 'relative' }}>
        {finalImageUrl ? (
          <img 
            src={finalImageUrl} 
            alt={apartment.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/300x200?text=Image+Not+Found';
            }}
          />
        ) : (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
            <span style={{ fontSize: '40px' }}>🖼️</span>
            <span>אין תמונה</span>
          </div>
        )}
      </div>

      <div style={{ padding: '16px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold' }}>{apartment.name}</h3>
        <p style={{ margin: '0 0 12px 0', color: '#666', fontSize: '14px' }}>
          📍 {apartment.address || apartment.location}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '12px' }}>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb' }}>
            ₪{apartment.price?.toLocaleString()}
          </span>
          {apartment.bedrooms !== undefined && (
            <span style={{ color: '#4b5563', fontSize: '13px' }}>
              🛏️ {apartment.bedrooms} חדרים
            </span>
          )}
        </div>
      </div>
    </div>
  )
}