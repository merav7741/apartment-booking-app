import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import ApartmentCard from "../components/apartment/ApartmentCard";
import SearchFilters from "../components/apartment/SearchFilters"; // היבוא של הקומפוננטה החדשה
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAllApartments } from '../store/apartmentSlice';
import type { Apartment } from '../types/apartment.types';

// MUI Core Imports
import { 
  Box, 
  Typography, 
  Grid, 
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Paper
} from '@mui/material';


import { FindInPage as FindInPageIcon } from '@mui/icons-material';

const hasFiveStarRating = (apartment: Apartment) =>
  apartment.reviews?.some((review) => Number(review.rating) === 5) ?? false;

export default function Home() {
  const dispatch = useAppDispatch();
  const { allApartments, loading } = useAppSelector((state) => state.apartments);
  const [searchValue, setSearchValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [selectedBedrooms, setSelectedBedrooms] = useState<number | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchParams] = useSearchParams();
  const apartmentsSectionRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const currentView = searchParams.get('view') === 'all' ? 'all' : 'recommended';

  useEffect(() => {
    dispatch(fetchAllApartments());
  }, [dispatch]);

  // חילוץ ערים ייחודיות עבור תיבת הבחירה
  const cities = useMemo(() => {
    const cityNames = allApartments
      .map((apt) => apt.city?.trim())
      .filter(Boolean) as string[];

    return ['all', ...Array.from(new Set(cityNames))];
  }, [allApartments]);

  // לוגיקת הסינון המקצועית שומרת על ביצועים בזכות useMemo
  const visibleApartments = useMemo(() => {
    const baseApartments = currentView === 'recommended'
      ? allApartments.filter(hasFiveStarRating)
      : allApartments;

    const search = searchTerm.trim().toLowerCase();

    return baseApartments.filter((apt: Apartment) => {
      const matchesText = !search || [
        apt.name,
        apt.city,
        apt.address,
        apt.location,
        apt.description
      ].some((value) => value?.toLowerCase().includes(search));

      const matchesCity = selectedCity === 'all' || apt.city === selectedCity;
      const matchesPrice = typeof apt.price === 'number' ? apt.price <= maxPrice : true;
      const matchesBedrooms = selectedBedrooms === null
        ? true
        : selectedBedrooms === 4
          ? (apt.bedrooms ?? 0) >= 4
          : apt.bedrooms === selectedBedrooms;
      const matchesAmenities = selectedAmenities.length === 0 ||
        selectedAmenities.every((amenity) => apt.characteristics?.includes(amenity));

      return matchesText && matchesCity && matchesPrice && matchesBedrooms && matchesAmenities;
    });
  }, [allApartments, currentView, searchTerm, selectedCity, maxPrice, selectedBedrooms, selectedAmenities]);

  const title = searchTerm
    ? `תוצאות עבור: ${searchTerm}`
    : currentView === 'recommended'
      ? 'דירות מומלצות'
      : 'כל הדירות';

  const scrollToApartments = () => {
    apartmentsSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleSearchSubmit = () => {
    setSearchTerm(searchValue.trim());
    scrollToApartments();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column', gap: 2, bgcolor: 'background.default' }}>
        <CircularProgress color="primary" size={50} />
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'bold' }}>טוען דירות...</Typography>
      </Box>
    );
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

          {/* קריאה לקומפוננטת הפילטרים החדשה והעברת ה-Props הדרושים */}
          <SearchFilters 
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            onSearchSubmit={handleSearchSubmit}
            showAdvancedSearch={showAdvancedSearch}
            setShowAdvancedSearch={setShowAdvancedSearch}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            cities={cities}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            selectedBedrooms={selectedBedrooms}
            setSelectedBedrooms={setSelectedBedrooms}
            selectedAmenities={selectedAmenities}
            setSelectedAmenities={setSelectedAmenities}
          />
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
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={apt._id}>
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
              {!searchTerm && currentView === 'recommended'
                ? 'עוד לא נמצאו דירות מומלצות.'
                : 'לא נמצאו דירות שתואמות לחיפוש שלך.'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 520, lineHeight: 1.7 }}>
              נסו לשנות את העיר, להרחיב את טווח המחירים או לבחור מספר חדרים אחר.
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
}