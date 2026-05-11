import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import ApartmentCard from "../components/ApartmentCard"
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchAllApartments } from '../store/apartmentSlice'
import type { Apartment } from '../types/apartment.types'

export default function Home() {
  const dispatch = useAppDispatch()
  const { allApartments, loading } = useAppSelector((state) => state.apartments)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchAllApartments())
  }, [dispatch])

  const filteredApartments = allApartments.filter((apt: Apartment) => {
    const search = searchTerm.toLowerCase()
    return (
      apt.name?.toLowerCase().includes(search) ||
      apt.location?.toLowerCase().includes(search) ||
      apt.description?.toLowerCase().includes(search) ||
      apt.title?.toLowerCase().includes(search)
    )
  })

  if (loading) return <div style={loaderStyle}>טוען דירות יוקרה...</div>

  return (
    <div style={pageContainer}>
      <div style={heroSection}>
        <div style={heroOverlay}>
          <h1 style={heroTitle}>ברוכים הבאים ל-SuiteSpot</h1>
          <p style={heroSubtitle}>המקום המושלם למצוא את הבית הבא שלך</p>
          
          <div style={searchContainer}>
            <input
              type="text"
              placeholder="היכן אתה מחפש? (עיר, אזור או שם נכס)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={searchInputStyle}
            />
            <button style={searchButtonStyle}>חפש</button>
          </div>
        </div>
      </div>

      <div style={contentWrapper}>
        <h2 style={sectionTitle}>
          {searchTerm ? `תוצאות עבור: ${searchTerm}` : 'דירות מומלצות'}
        </h2>
        
        {filteredApartments.length > 0 ? (
          <div style={gridStyle}>
            {filteredApartments.map((apt: Apartment) => (
              <ApartmentCard
                key={apt._id}
                apartment={apt}
                onClick={(id) => navigate(`/apartment/${id}`)}
              />
            ))}
          </div>
        ) : (
          <div style={noResultsStyle}>לא נמצאו דירות התואמות לחיפוש שלך</div>
        )}
      </div>
    </div>
  )
}

const pageContainer: React.CSSProperties = {
  backgroundColor: '#f3f4f6',
  minHeight: '100vh',
  direction: 'rtl',
};

const heroSection: React.CSSProperties = {
  width: '100%',
  minHeight: '500px',
  backgroundImage: 'url("/hero-bg.png")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const heroOverlay: React.CSSProperties = {
  width: '100%',
  height: '100%',
  padding: '120px 20px',
  backgroundColor: 'rgba(15, 23, 42, 0.5)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backdropFilter: 'blur(2px)',
};

const heroTitle: React.CSSProperties = { 
  fontSize: '56px', 
  fontWeight: '900', 
  marginBottom: '20px', 
  color: '#ffffff',
  textShadow: '2px 4px 10px rgba(0,0,0,0.5)',
  textAlign: 'center'
};

const heroSubtitle: React.CSSProperties = { 
  fontSize: '24px', 
  opacity: 1, 
  marginBottom: '50px', 
  color: '#f8fafc',
  textShadow: '1px 2px 5px rgba(0,0,0,0.5)',
  textAlign: 'center',
  fontWeight: '500'
};

const searchContainer: React.CSSProperties = {
  display: 'flex',
  width: '100%',
  maxWidth: '750px',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  padding: '12px',
  borderRadius: '100px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
  backdropFilter: 'blur(10px)',
};

const searchInputStyle: React.CSSProperties = {
  flex: 1,
  border: 'none',
  padding: '15px 30px',
  fontSize: '18px',
  outline: 'none',
  borderRadius: '100px 0 0 100px',
  backgroundColor: 'transparent',
  color: '#1e293b'
};

const searchButtonStyle: React.CSSProperties = {
  backgroundColor: '#2563eb',
  color: 'white',
  border: 'none',
  padding: '0 45px',
  borderRadius: '100px',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '18px',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
};

const contentWrapper: React.CSSProperties = {
  maxWidth: '1300px',
  margin: '0 auto',
  padding: '80px 24px',
};

const sectionTitle: React.CSSProperties = { 
  fontSize: '32px', 
  fontWeight: '800', 
  marginBottom: '40px', 
  color: '#1e293b',
  textAlign: 'right',
  position: 'relative',
  paddingRight: '15px',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
  gap: '40px',
};

const noResultsStyle: React.CSSProperties = { 
  textAlign: 'center', 
  padding: '100px 20px', 
  fontSize: '20px', 
  color: '#94a3b8',
  backgroundColor: 'white',
  borderRadius: '24px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
};

const loaderStyle: React.CSSProperties = { 
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  fontSize: '24px', 
  color: '#2563eb',
  fontWeight: '700',
  backgroundColor: '#f8fafc'
};