import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useSearchParams } from 'react-router-dom'
import ApartmentCard from "../components/ApartmentCard"
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchAllApartments } from '../store/apartmentSlice'
import type { Apartment } from '../types/apartment.types'

const hasFiveStarRating = (apartment: Apartment) =>
  apartment.reviews?.some((review) => Number(review.rating) === 5) ?? false

export default function Home() {
  const dispatch = useAppDispatch()
  const { allApartments, loading } = useAppSelector((state) => state.apartments)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchParams] = useSearchParams()
  const apartmentsSectionRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()

  const currentView = searchParams.get('view') === 'all' ? 'all' : 'recommended'

  useEffect(() => {
    dispatch(fetchAllApartments())
  }, [dispatch])

  const visibleApartments = useMemo(() => {
    const baseApartments = currentView === 'recommended'
      ? allApartments.filter(hasFiveStarRating)
      : allApartments

    const search = searchTerm.trim().toLowerCase()
    if (!search) return baseApartments

    return baseApartments.filter((apt: Apartment) => (
      apt.name?.toLowerCase().includes(search) ||
      apt.city?.toLowerCase().includes(search) ||
      apt.address?.toLowerCase().includes(search) ||
      apt.location?.toLowerCase().includes(search) ||
      apt.description?.toLowerCase().includes(search)
    ))
  }, [allApartments, currentView, searchTerm])

  const title = searchTerm
    ? `תוצאות עבור: ${searchTerm}`
    : currentView === 'recommended'
      ? 'דירות מומלצות'
      : 'כל הדירות'

  const scrollToApartments = () => {
    apartmentsSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }

  const handleSearchClick = () => {
    scrollToApartments()
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      scrollToApartments()
    }
  }

  if (loading) return <div style={loaderStyle}>טוען דירות...</div>

  return (
    <div style={pageContainer}>
      <div style={heroSection}>
        <div style={heroOverlay}>
          <h1 style={heroTitle}>SuiteSpot</h1>
          <p style={heroSubtitle}>המקום למצוא בו דירת נופש שמתאימה בדיוק לחופשה שלך</p>

          <div style={searchContainer}>
            <input
              type="text"
              placeholder="חיפוש לפי עיר, אזור, כתובת או שם נכס"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              style={searchInputStyle}
            />
            <button type="button" onClick={handleSearchClick} style={searchButtonStyle}>חפש</button>
          </div>
        </div>
      </div>

      <div ref={apartmentsSectionRef} style={contentWrapper}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitle}>{title}</h2>
          <div style={viewToggleStyle}>
            <button
              type="button"
              style={currentView === 'recommended' ? activeToggleStyle : toggleButtonStyle}
              onClick={() => navigate('/?view=recommended')}
            >
              דירות מומלצות
            </button>
            <button
              type="button"
              style={currentView === 'all' ? activeToggleStyle : toggleButtonStyle}
              onClick={() => navigate('/?view=all')}
            >
              כל הדירות
            </button>
          </div>
        </div>

        {visibleApartments.length > 0 ? (
          <div style={gridStyle}>
            {visibleApartments.map((apt: Apartment) => (
              <ApartmentCard
                key={apt._id}
                apartment={apt}
                onClick={(id) => navigate(`/apartment/${id}`)}
              />
            ))}
          </div>
        ) : (
          <div style={noResultsStyle}>
            {currentView === 'recommended' && !searchTerm
              ? 'עדיין אין דירות עם דירוג 5 כוכבים.'
              : 'לא נמצאו דירות שתואמות לחיפוש שלך.'}
          </div>
        )}
      </div>
    </div>
  )
}

const pageContainer: React.CSSProperties = {
  backgroundColor: '#f3f4f6',
  minHeight: '100vh',
  direction: 'rtl'
}

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
  alignItems: 'center'
}

const heroOverlay: React.CSSProperties = {
  width: '100%',
  height: '100%',
  padding: '120px 20px',
  backgroundColor: 'rgba(15, 23, 42, 0.5)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backdropFilter: 'blur(2px)'
}

const heroTitle: React.CSSProperties = {
  fontSize: '56px',
  fontWeight: 900,
  marginBottom: '20px',
  color: '#ffffff',
  textShadow: '2px 4px 10px rgba(0,0,0,0.5)',
  textAlign: 'center'
}

const heroSubtitle: React.CSSProperties = {
  fontSize: '24px',
  opacity: 1,
  marginBottom: '50px',
  color: '#f8fafc',
  textShadow: '1px 2px 5px rgba(0,0,0,0.5)',
  textAlign: 'center',
  fontWeight: 500
}

const searchContainer: React.CSSProperties = {
  display: 'flex',
  width: '100%',
  maxWidth: '750px',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  padding: '12px',
  borderRadius: '100px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
  backdropFilter: 'blur(10px)'
}

const searchInputStyle: React.CSSProperties = {
  flex: 1,
  border: 'none',
  padding: '15px 30px',
  fontSize: '18px',
  outline: 'none',
  borderRadius: '100px',
  backgroundColor: 'transparent',
  color: '#1e293b'
}

const searchButtonStyle: React.CSSProperties = {
  backgroundColor: '#2563eb',
  color: 'white',
  border: 'none',
  padding: '0 45px',
  borderRadius: '100px',
  cursor: 'pointer',
  fontWeight: 700,
  fontSize: '18px',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
}

const contentWrapper: React.CSSProperties = {
  maxWidth: '1300px',
  margin: '0 auto',
  padding: '64px 24px 80px'
}

const sectionHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '20px',
  marginBottom: '36px',
  flexWrap: 'wrap'
}

const sectionTitle: React.CSSProperties = {
  fontSize: '32px',
  fontWeight: 800,
  margin: 0,
  color: '#1e293b',
  textAlign: 'right'
}

const viewToggleStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '5px'
}

const toggleButtonStyle: React.CSSProperties = {
  border: 'none',
  backgroundColor: 'transparent',
  color: '#475569',
  padding: '9px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 600
}

const activeToggleStyle: React.CSSProperties = {
  ...toggleButtonStyle,
  backgroundColor: '#2563eb',
  color: '#ffffff',
  boxShadow: '0 4px 10px rgba(37, 99, 235, 0.2)'
}

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: '40px'
}

const noResultsStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '90px 20px',
  fontSize: '20px',
  color: '#64748b',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
}

const loaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  fontSize: '24px',
  color: '#2563eb',
  fontWeight: 700,
  backgroundColor: '#f8fafc'
}
