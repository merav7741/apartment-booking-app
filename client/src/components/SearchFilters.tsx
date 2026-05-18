// src/components/SearchFilters.tsx
import { Box, TextField, Button, MenuItem, Slider, Typography, Paper, Divider, FormControlLabel, Checkbox, Chip } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import TuneIcon from '@mui/icons-material/Tune'

// העתקת המשתנים הקבועים שהיו בדף הבית
const AMENITY_LABELS: Record<string, string> = {
  wifi: 'וואי-פיי', ac: 'מזגן', heating: 'חימום', elevator: 'מעלית', parking: 'חניה',
  kitchen: 'מטבח', microwave: 'מיקרוגל', fridge: 'מקרר', dishwasher: 'מדיח כלים', coffee_machine: 'מכונת קפה',
  garden: 'גינה', balcony: 'מרפסת', pool: 'בריכה', jacuzzi: 'גקוזי', nearbyAttractions: 'אטרקציות בקרבת מקום', nearbySynagogue: 'בית כנסת קרוב',
  gym: 'חדר כושר', sauna: 'סאונה', security: 'אבטחה', cleaning_service: 'שירותי ניקיון',
  wheelchair_accessible: 'נגישות לכיסא גלגלים', baby_crib: 'עריסת תינוק', high_chair: 'כיסא אוכל לתינוק',
  pets_allowed: 'חיות מחמד מותרות', sea_view: 'נוף לים', mountain_view: 'נוף להרים', city_view: 'נוף עירוני', fireplace: 'קמין', workspace: 'פינת עבודה'
}
const ALL_AMENITIES = Object.keys(AMENITY_LABELS)

interface SearchFiltersProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  onSearchSubmit: () => void;
  showAdvancedSearch: boolean;
  setShowAdvancedSearch: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  cities: string[];
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  selectedBedrooms: number | null;
  setSelectedBedrooms: (rooms: number | null) => void;
  selectedAmenities: string[];
  setSelectedAmenities: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function SearchFilters({
  searchValue, setSearchValue, onSearchSubmit,
  showAdvancedSearch, setShowAdvancedSearch,
  selectedCity, setSelectedCity, cities,
  maxPrice, setMaxPrice,
  selectedBedrooms, setSelectedBedrooms,
  selectedAmenities, setSelectedAmenities
}: SearchFiltersProps) {

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities((current) =>
      current.includes(amenity) ? current.filter((item) => item !== amenity) : [...current, amenity]
    )
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit()
    }
  }

  return (
    <Paper elevation={0} sx={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 850, bgcolor: 'rgba(255, 255, 255, 0.96)', p: 3, borderRadius: 5, gap: 2 }}>
      {/* כאן תדביקי את כל ה-JSX של תיבת החיפוש, הסליידר, והצ'קבוקסים מתוך דף הבית */}
      {/* (הקוד שהיה בתוך ה-Paper של תיבת החיפוש בדף הבית) */}
    </Paper>
  )
}