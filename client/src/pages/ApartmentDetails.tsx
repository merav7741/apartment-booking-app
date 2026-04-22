import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function ApartmentDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [apartment, setApartment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const fetchApartment = async () => {
      try {
        const response = await fetch(`http://localhost:5500/api/apartments/${id}`)
        const data = await response.json()
        setApartment(data)
      } catch (error) {
        console.error('Error fetching apartment:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchApartment()
  }, [id])

  const nextImage = () => {
    if (apartment?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % apartment.images.length)
    }
  }

  const prevImage = () => {
    if (apartment?.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? apartment.images.length - 1 : prev - 1
      )
    }
  }

  if (loading) return <div style={{ padding: '20px' }}>טוען...</div>
  if (!apartment) return <div style={{ padding: '20px' }}>דירה לא נמצאה</div>

  const images = apartment.images && apartment.images.length > 0
    ? apartment.images
    : ['https://via.placeholder.com/800x500?text=No+Image']

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <button
        onClick={() => navigate('/')}
        style={{
          marginBottom: '20px',
          padding: '10px 20px',
          cursor: 'pointer',
          border: '1px solid #ddd',
          borderRadius: '4px',
          backgroundColor: 'white'
        }}
      >
        ← חזרה לדף הבית
      </button>

      {/* סליידר תמונות */}
      <div style={{ position: 'relative', marginBottom: '30px' }}>
        <img
          src={images[currentImageIndex]}
          alt={apartment.name}
          style={{
            width: '100%',
            height: '500px',
            objectFit: 'cover',
            borderRadius: '8px'
          }}
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255,255,255,0.8)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                fontSize: '20px'
              }}
            >
              ❮
            </button>
            <button
              onClick={nextImage}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255,255,255,0.8)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                fontSize: '20px'
              }}
            >
              ❯
            </button>
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '4px'
            }}>
              {currentImageIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* פרטי הדירה */}
      <h1>{apartment.name}</h1>
      <p style={{ fontSize: '18px', color: '#666' }}>📍 {apartment.location}</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        margin: '30px 0',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px'
      }}>
        <div>
          <strong>מחיר:</strong> ₪{apartment.price?.toLocaleString()}
        </div>
        {apartment.rooms && (
          <div>
            <strong>חדרים:</strong> {apartment.rooms}
          </div>
        )}
        {apartment.size && (
          <div>
            <strong>גודל:</strong> {apartment.size} מ"ר
          </div>
        )}
        {apartment.floor && (
          <div>
            <strong>קומה:</strong> {apartment.floor}
          </div>
        )}
      </div>

      {apartment.description && (
        <div style={{ marginTop: '30px' }}>
          <h2>תיאור</h2>
          <p style={{ lineHeight: '1.6' }}>{apartment.description}</p>
        </div>
      )}

      {apartment.characteristics && apartment.characteristics.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h2>מאפיינים</h2>
          <ul>
            {apartment.characteristics.map((char: string, index: number) => (
              <li key={index}>{char}</li>
            ))}
          </ul>
        </div>
      )}


    </div>
  )
}
