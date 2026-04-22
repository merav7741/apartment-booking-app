interface ApartmentCardProps {
  apartment: {
    _id: string
    name: string
    location: string
    price: number
    images?: string[]
    rooms?: number
    size?: number
  }
  onClick: (id: string) => void
}

export default function ApartmentCard({ apartment, onClick }: ApartmentCardProps) {
  const imageUrl = apartment.images && apartment.images.length > 0 
    ? apartment.images[0] 
    : 'https://via.placeholder.com/300x200?text=No+Image'

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
        <p style={{ margin: '0 0 8px 0', color: '#666' }}>📍 {apartment.location}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb' }}>
            ₪{apartment.price?.toLocaleString()}
          </span>
          {apartment.rooms && (
            <span style={{ color: '#666' }}>🛏️ {apartment.rooms} חדרים</span>
          )}
        </div>
      </div>
    </div>
  )
}
