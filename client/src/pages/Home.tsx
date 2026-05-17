import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useSearchParams } from 'react-router-dom'
import ApartmentCard from "../components/ApartmentCard"
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchAllApartments } from '../store/apartmentSlice'
import type { Apartment } from '../types/apartment.types'

// MUI Core Imports
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  TextField, 
  MenuItem, 
  Slider, 
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Paper
} from '@mui/material'

// MUI Icons Imports
import SearchIcon from '@mui/icons-material/Search'
import TuneIcon from '@mui/icons-material/Tune'
import FindInPageIcon from '@mui/icons-material/FindInPage'

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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column', gap: 2, bgcolor: 'background.default' }}>
        <CircularProgress color="primary" size={50} />
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'bold' }}>טוען דירות...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', direction: 'rtl' }}>
      
      {/* אזור ה-Hero הראשי */}
      <Box 
        sx={{ 
          width: '100%', 
          minHeight: 500, 
          backgroundImage: 'url("/hero-bg.png")', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          backgroundAttachment: 'fixed', 
          position: 'relative', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}
      >
        <Box 
          sx={{ 
            width: '100%', 
            height: '100%', 
            py: { xs: 8, md: 15 }, 
            px: 2, 
            bgcolor: 'rgba(15, 23, 42, 0.5)', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            backdropFilter: 'blur(2px)' 
          }}
        >
          <Typography variant="h1" sx={{ fontSize: { xs: '42px', md: '56px' }, fontWeight: 900, mb: 2, color: 'common.white', textShadow: '2px 4px 10px rgba(0,0,0,0.5)', textAlign: 'center' }}>
            SuiteSpot
          </Typography>
          <Typography variant="h5" component="p" sx={{ fontSize: { xs: '18px', md: '24px' }, mb: 6, color: 'grey.100', textShadow: '1px 2px 5px rgba(0,0,0,0.5)', textAlign: 'center', fontWeight: 500 }}>
            המקום למצוא בו דירת נופש שמתאימה בדיוק לחופשה שלך
          </Typography>

          {/* תיבת החיפוש */}
          <Paper 
            elevation={0}
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              width: '100%', 
              maxWidth: 850, 
              bgcolor: 'rgba(255, 255, 255, 0.96)', 
              p: 3, 
              borderRadius: 5, 
              border: 1, 
              borderColor: 'rgba(148, 163, 184, 0.25)', 
              boxShadow: '0 24px 80px rgba(15, 23, 42, 0.12)', 
              backdropFilter: 'blur(16px)', 
              gap: 2 
            }}
          >
            {/* שורת קלט ראשית */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr auto' }, gap: 1.5, alignItems: 'center' }}>
              <TextField 
                fullWidth
                placeholder="חיפוש מהיר לפי עיר, אזור, כתובת או שם נכס"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: 3, bgcolor: 'background.paper' }
                }}
              />
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSearchClick}
                startIcon={<SearchIcon />}
                sx={{ height: 56, px: 4, borderRadius: 3, fontWeight: 'bold', fontSize: '16px', boxShadow: '0 12px 28px rgba(37, 99, 235, 0.18)' }}
              >
                חפש
              </Button>
            </Box>

            {/* כפתור פילטרים מתקדמים */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setShowAdvancedSearch((prev) => !prev)}
                startIcon={<TuneIcon />}
                sx={{ borderRadius: 3, fontWeight: 'bold', py: 1, px: 2.5 }}
              >
                {showAdvancedSearch ? 'הסתר פילטרים מתקדמים' : 'הצג פילטרים מתקדמים'}
              </Button>
            </Box>

            {/* פאנל מתקדם */}
            {showAdvancedSearch && (
              <Box 
                sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
                  gap: 3, 
                  p: 2.5, 
                  bgcolor: 'action.hover', 
                  border: 1, 
                  borderColor: 'divider', 
                  borderRadius: 4 
                }}
              >
                {/* פילטר עיר */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>עיר</Typography>
                  <TextField
                    select
                    fullWidth
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    InputProps={{ sx: { borderRadius: 3, bgcolor: 'background.paper' } }}
                  >
                    <MenuItem value="all">כל הערים</MenuItem>
                    {cities.map((city) => (
                      city !== 'all' && <MenuItem key={city} value={city}>{city}</MenuItem>
                    ))}
                  </TextField>
                </Box>

                {/* פילטר מחיר */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                    טווח מחיר עד ₪{maxPrice.toLocaleString('he-IL')}
                  </Typography>
                  <Box sx={{ px: 1, pt: 1 }}>
                    <Slider
                      min={0}
                      max={10000}
                      step={250}
                      value={maxPrice}
                      onChange={(_, value) => setMaxPrice(value as number)}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                </Box>

                {/* פילטר חדרים */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>חדרים</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {[1, 2, 3, 4].map((rooms) => (
                      <Button
                        key={rooms}
                        variant={selectedBedrooms === rooms ? "contained" : "outlined"}
                        color={selectedBedrooms === rooms ? "primary" : "inherit"}
                        onClick={() => setSelectedBedrooms(rooms)}
                        sx={{ borderRadius: 3, minWidth: 50, fontWeight: 'bold' }}
                      >
                        {rooms === 4 ? '4+' : rooms}
                      </Button>
                    ))}
                    <Button
                      variant={selectedBedrooms === null ? "contained" : "outlined"}
                      color={selectedBedrooms === null ? "primary" : "inherit"}
                      onClick={() => setSelectedBedrooms(null)}
                      sx={{ borderRadius: 3, fontWeight: 'bold' }}
                    >
                      ללא הגבלה
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>

      {/* אזור תוכן הדירות */}
      <Box ref={apartmentsSectionRef} sx={{ maxWidth: 1300, mx: 'auto', px: 3, py: { xs: 5, md: 8 } }}>
        
        {/* כותרת הסקשן וטוגל תצוגה */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 4.5, flexWrap: 'wrap' }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 800, color: 'text.primary' }}>
            {title}
          </Typography>
          
          <ToggleButtonGroup
            value={currentView}
            exclusive
            onChange={(_, value) => value && navigate(`/?view=${value}`)}
            sx={{ bgcolor: 'background.paper', p: 0.5, border: 1, borderColor: 'divider', borderRadius: 2 }}
          >
            <ToggleButton value="recommended" sx={{ px: 2.5, py: 1, borderRadius: 1.5, fontWeight: 600, border: 'none', '&.Mui-selected': { bgcolor: 'primary.main', color: 'primary.contrastText', boxShadow: '0 4px 10px rgba(37, 99, 235, 0.2)', '&:hover': { bgcolor: 'primary.dark' } } }}>
              דירות מומלצות
            </ToggleButton>
            <ToggleButton value="all" sx={{ px: 2.5, py: 1, borderRadius: 1.5, fontWeight: 600, border: 'none', '&.Mui-selected': { bgcolor: 'primary.main', color: 'primary.contrastText', boxShadow: '0 4px 10px rgba(37, 99, 235, 0.2)', '&:hover': { bgcolor: 'primary.dark' } } }}>
              כל הדירות
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* גריד רשימת הדירות / הודעת אין תוצאות */}
        {visibleApartments.length > 0 ? (
          <Grid container spacing={4}>
            {visibleApartments.map((apt: Apartment) => (
              <Grid item xs={12} sm={6} md={4} key={apt._id}>
                <ApartmentCard
                  apartment={apt}
                  onClick={(id) => navigate(`/apartment/${id}`)}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper 
            variant="outlined"
            sx={{ 
              textAlign: 'center', 
              py: 10, 
              px: 3, 
              borderRadius: 5, 
              boxShadow: '0 18px 40px rgba(15, 23, 42, 0.06)', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: 2 
            }}
          >
            <FindInPageIcon sx={{ fontSize: 56, color: 'text.secondary' }} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
              {currentView === 'recommended' && !searchTerm
                ? 'עוד לא נמצאו דירות עם דירוג 5 כוכבים.'
                : 'לא נמצאו דירות שתואמות לחיפוש שלך.'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 520, lineHeight: 1.7 }}>
              נסו לשנות את העיר, להרחיב את טווח המחירים או לבחור מספר חדרים אחר.
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  )
}