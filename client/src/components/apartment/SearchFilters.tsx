import { 
  Box, 
  TextField, 
  Button, 
  MenuItem, 
  Slider, 
  Typography, 
  Paper, 
  Divider, 
  FormControlLabel, 
  Checkbox, 
  Chip,
  Grid 
} from '@mui/material';

import { Search as SearchIcon, Tune as TuneIcon } from '@mui/icons-material';

const AMENITY_LABELS: Record<string, string> = {
  wifi: 'וואי-פיי', ac: 'מזגן', heating: 'חימום', elevator: 'מעלית', parking: 'חניה',
  kitchen: 'מטבח', microwave: 'מיקרוגל', fridge: 'מקרר', dishwasher: 'מדיח כלים', coffee_machine: 'מכונת קפה',
  garden: 'גינה', balcony: 'מרפסת', pool: 'בריכה', jacuzzi: 'ג׳קוזי', nearbyAttractions: 'אטרקציות בקרבת מקום', nearbySynagogue: 'בית כנסת קרוב',
  gym: 'חדר כושר', sauna: 'סאונה', security: 'אבטחה', cleaning_service: 'שירותי ניקיון',
  wheelchair_accessible: 'נגישות לכיסא גלגלים', baby_crib: 'עריסת תינוק', high_chair: 'כיסא אוכל לתינוק',
  pets_allowed: 'חיות מחמד מותרות', sea_view: 'נוף לים', mountain_view: 'נוף להרים', city_view: 'נוף עירוני', fireplace: 'קמין', workspace: 'פינת עבודה'
};
const ALL_AMENITIES = Object.keys(AMENITY_LABELS);

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
    );
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit();
    }
  };

  return (
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
        gap: 2,
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        direction: 'rtl'
      }}
    >
      {/* שורת החיפוש הראשית */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', md: 'nowrap' }, width: '100%' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="חפשו לפי שם דירה, כתובת או תיאור..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          slotProps={{
            input: {
              startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1, ml: 1 }} />
            }
          }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'background.paper' } }}
        />

        <TextField
          select
          label="עיר"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          sx={{ minWidth: { xs: '100%', md: 160 }, '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'background.paper' } }}
        >
          {cities.map((city) => (
            <MenuItem key={city} value={city}>
              {city === 'all' ? 'כל הערים' : city}
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ display: 'flex', gap: 1.5, width: { xs: '100%', md: 'auto' } }}>
          <Button
            variant="contained"
            onClick={onSearchSubmit}
            sx={{ px: 4, py: 1.5, borderRadius: 3, fontWeight: 'bold', whiteSpace: 'nowrap', flexGrow: 1 }}
          >
            חיפוש
          </Button>
          
          <Button
            variant={showAdvancedSearch ? "contained" : "outlined"}
            color="secondary"
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
            sx={{ p: 1.5, minWidth: 54, borderRadius: 3 }}
          >
            <TuneIcon />
          </Button>
        </Box>
      </Box>

      {/* פאנל חיפוש מתקדם קורס/נפתח */}
      {showAdvancedSearch && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          <Divider />
          
          <Grid container spacing={4}>
            {/* פילטר מחיר מקסימלי */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                מחיר מקסימלי ללילה: {maxPrice === 10000 ? 'ללא הגבלה' : `₪${maxPrice}`}
              </Typography>
              <Slider
                value={maxPrice}
                onChange={(_, value) => setMaxPrice(value as number)}
                min={100}
                max={10000}
                step={100}
                valueLabelDisplay="auto"
                sx={{ ml: 1 }}
              />
            </Grid>

            {/* פילטר חדרי שינה */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: 'text.primary' }}>
                מספר חדרי שינה:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {[null, 1, 2, 3, 4].map((rooms) => (
                  <Chip
                    key={rooms ?? 'all'}
                    label={rooms === null ? 'הכל' : rooms === 4 ? '+4 חדרים' : `${rooms} חדרים`}
                    clickable
                    color={selectedBedrooms === rooms ? 'primary' : 'default'}
                    onClick={() => setSelectedBedrooms(rooms)}
                    sx={{ borderRadius: 2, fontWeight: 600, px: 1 }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>

          {/* פילטר מאפיינים / אמיניטיז */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
              מאפיינים ותוספות:
            </Typography>
            <Box sx={{ display: 'flex', gap: '4px 12px', flexWrap: 'wrap', maxHeight: 160, overflowY: 'auto', p: 0.5 }}>
              {ALL_AMENITIES.map((amenity) => (
                <FormControlLabel
                  key={amenity}
                  control={
                    <Checkbox
                      size="small"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                    />
                  }
                  label={<Typography variant="body2" sx={{ fontWeight: 500 }}>{AMENITY_LABELS[amenity]}</Typography>}
                />
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </Paper>
  );
}