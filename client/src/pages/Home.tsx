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
  const [searchValue, setSearchValue] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState('all')
  const [maxPrice, setMaxPrice] = useState(10000)
  const [selectedBedrooms, setSelectedBedrooms] = useState<number | null>(null)
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  const [searchParams] = useSearchParams()
  const apartmentsSectionRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()

  const currentView = searchParams.get('view') === 'all' ? 'all' : 'recommended'

  useEffect(() => {
    dispatch(fetchAllApartments())
  }, [dispatch])

  const cities = useMemo(() => {
    const cityNames = allApartments
      .map((apt) => apt.city?.trim())
      .filter(Boolean) as string[]

    return ['all', ...Array.from(new Set(cityNames))]
  }, [allApartments])

  const visibleApartments = useMemo(() => {
    const baseApartments = currentView === 'recommended'
      ? allApartments.filter(hasFiveStarRating)
      : allApartments

    const search = searchTerm.trim().toLowerCase()

    return baseApartments.filter((apt: Apartment) => {
      const matchesText = !search || [
        apt.name,
        apt.city,
        apt.address,
        apt.location,
        apt.description
      ].some((value) => value?.toLowerCase().includes(search))

      const matchesCity = selectedCity === 'all' || apt.city === selectedCity
      const matchesPrice = typeof apt.price === 'number' ? apt.price <= maxPrice : true
      const matchesBedrooms = selectedBedrooms === null
        ? true
        : selectedBedrooms === 4
          ? (apt.bedrooms ?? 0) >= 4
          : apt.bedrooms === selectedBedrooms

      return matchesText && matchesCity && matchesPrice && matchesBedrooms
    })
  }, [allApartments, currentView, searchTerm, selectedCity, maxPrice, selectedBedrooms])

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
    setSearchTerm(searchValue.trim())
    scrollToApartments()
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchTerm(searchValue.trim())
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
              <div style={searchBarRow}>
                <input
                  type="text"
                  placeholder="חיפוש מהיר לפי עיר, אזור, כתובת או שם נכס"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  style={searchInputStyle}
                />
                <button type="button" onClick={handleSearchClick} style={searchButtonStyle}>חפש</button>
              </div>

              <div style={filterToggleRow}>
                <button
                  type="button"
                  onClick={() => setShowAdvancedSearch((prev) => !prev)}
                  style={filterToggleButtonStyle}
                >
                  {showAdvancedSearch ? 'הסתר פילטרים מתקדמים' : 'הצג פילטרים מתקדמים'}
                </button>
              </div>

              {showAdvancedSearch && (
                <div style={advancedPanelStyle}>
                <div style={searchFieldGroup}>
                  <label style={fieldLabel}>עיר</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    style={selectStyle}
                  >
                    <option value="all">כל הערים</option>
                    {cities.map((city) => (
                      city !== 'all' && <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div style={searchFieldGroup}>
                  <label style={fieldLabel}>טווח מחיר עד {maxPrice.toLocaleString('he-IL')} ₪</label>
                  <input
                    type="range"
                    min={0}
                    max={10000}
                    step={250}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    style={rangeStyle}
                  />
                </div>

                <div style={roomsGroup}>
                  <span style={fieldLabel}>חדרים</span>
                  <div style={roomsButtonWrapper}>
                    {[1, 2, 3, 4].map((rooms) => (
                      <button
                        key={rooms}
                        type="button"
                        onClick={() => setSelectedBedrooms(rooms === 4 ? 4 : rooms)}
                        style={selectedBedrooms === rooms || (rooms === 4 && selectedBedrooms === 4)
                          ? activeRoomButtonStyle
                          : roomButtonStyle}
                      >
                        {rooms === 4 ? '4+' : rooms}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setSelectedBedrooms(null)}
                      style={selectedBedrooms === null ? activeRoomButtonStyle : clearButtonStyle}
                    >
                      ללא הגבלה
                    </button>
                  </div>
                </div>
              </div>
            )}
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
            <div style={noResultsIcon}>🔎</div>
            <div style={noResultsText}>
              {currentView === 'recommended' && !searchTerm
                ? 'עוד לא נמצאו דירות עם דירוג 5 כוכבים.'
                : 'לא נמצאו דירות שתואמות לחיפוש שלך.'}
            </div>
            <div style={noResultsHelper}>נסו לשנות את העיר, להרחיב את טווח המחירים או לבחור מספר חדרים אחר.</div>
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
  flexDirection: 'column',
  width: '100%',
  maxWidth: '850px',
  backgroundColor: 'rgba(255, 255, 255, 0.96)',
  padding: '22px',
  borderRadius: '28px',
  border: '1px solid rgba(148, 163, 184, 0.25)',
  boxShadow: '0 24px 80px rgba(15, 23, 42, 0.12)',
  backdropFilter: 'blur(16px)',
  gap: '18px'
}

const searchBarRow: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1.5fr 0.5fr',
  gap: '12px',
  alignItems: 'center'
}

const filterToggleRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-start',
  marginTop: '12px'
}

const searchFieldGroup: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
}

const fieldLabel: React.CSSProperties = {
  fontSize: '14px',
  color: '#334155',
  fontWeight: 700
}

const selectStyle: React.CSSProperties = {
  borderRadius: '16px',
  padding: '12px 14px',
  border: '1px solid #cbd5e1',
  fontSize: '16px',
  outline: 'none',
  backgroundColor: 'white',
  color: '#0f172a'
}

const advancedPanelStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
  gap: '16px',
  padding: '18px',
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '22px'
}

const rangeStyle: React.CSSProperties = {
  width: '100%',
  appearance: 'none',
  height: '10px',
  borderRadius: '999px',
  background: 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 65%, #e2e8f0 100%)',
  outline: 'none',
  cursor: 'pointer'
}

const roomsGroup: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
}

const roomsButtonWrapper: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px'
}

const roomButtonStyle: React.CSSProperties = {
  border: '1px solid #cbd5e1',
  backgroundColor: 'white',
  color: '#334155',
  borderRadius: '16px',
  padding: '10px 14px',
  cursor: 'pointer',
  minWidth: '72px',
  fontWeight: 700
}

const activeRoomButtonStyle: React.CSSProperties = {
  ...roomButtonStyle,
  borderColor: '#2563eb',
  backgroundColor: '#eff6ff',
  color: '#1d4ed8'
}

const clearButtonStyle: React.CSSProperties = {
  ...roomButtonStyle,
  backgroundColor: '#f8fafc',
  color: '#475569'
}

const searchInputStyle: React.CSSProperties = {
  width: '100%',
  height: '52px',
  border: '1px solid #cbd5e1',
  padding: '0 18px',
  fontSize: '16px',
  outline: 'none',
  borderRadius: '18px',
  backgroundColor: 'white',
  color: '#0f172a'
}

const searchButtonStyle: React.CSSProperties = {
  backgroundColor: '#2563eb',
  color: 'white',
  border: 'none',
  borderRadius: '18px',
  padding: '14px 20px',
  cursor: 'pointer',
  fontWeight: 700,
  fontSize: '16px',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  boxShadow: '0 12px 28px rgba(37, 99, 235, 0.18)'
}

const filterToggleButtonStyle: React.CSSProperties = {
  border: '1px solid #c7d2fe',
  backgroundColor: '#f8fafc',
  color: '#2563eb',
  borderRadius: '18px',
  padding: '12px 18px',
  cursor: 'pointer',
  fontWeight: 700,
  fontSize: '15px'
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
  padding: '80px 24px',
  fontSize: '18px',
  color: '#475569',
  backgroundColor: 'white',
  borderRadius: '24px',
  boxShadow: '0 18px 40px rgba(15, 23, 42, 0.06)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '18px'
}

const noResultsIcon: React.CSSProperties = {
  fontSize: '48px'
}

const noResultsText: React.CSSProperties = {
  fontSize: '26px',
  fontWeight: 800,
  color: '#0f172a'
}

const noResultsHelper: React.CSSProperties = {
  color: '#64748b',
  maxWidth: '520px',
  lineHeight: 1.7
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
