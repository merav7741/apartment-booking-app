import type { Apartment } from '../types/apartment.types'

interface ApartmentCardProps {
  apartment: Apartment
  onClick: (id: string) => void
}

export default function ApartmentCard({ apartment, onClick }: ApartmentCardProps) {
  const imageUrl = apartment.images && apartment.images.length > 0 
    ? apartment.images[0] 
    : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%23ddd" width="300" height="200"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E'

  return (
    <div 
      onClick={() => onClick(apartment._id)}
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        backgroundColor: 'white'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <img 
        src={imageUrl} 
        alt={apartment.name}
        style={{
          width: '100%',
          height: '200px',
          objectFit: 'cover'
        }}
      />
      <div style={{ padding: '16px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{apartment.name}</h3>
        <p style={{ margin: '0 0 8px 0', color: '#666' }}>📍 {apartment.location || apartment.address}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb' }}>
            ₪{apartment.pricePerNight?.toLocaleString()} / לילה
          </span>
          {apartment.bedrooms && (
            <span style={{ color: '#666' }}>🛏️ {apartment.bedrooms} חדרים</span>
          )}
        </div>
      </div>
    </div>
  )
}
