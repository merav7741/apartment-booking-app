import { Box, Typography, FormControlLabel, Checkbox } from '@mui/material'

// 1. הגדרת הטיפוסים שהקומפוננטה מצפה לקבל
interface ApartmentAmenitiesSelectorProps {
  selectedAmenities: string[];
  onChange: (newAmenities: string[]) => void;
}

// 2. חיבור ה-Props לפונקציה
export default function ApartmentAmenitiesSelector({ selectedAmenities, onChange }: ApartmentAmenitiesSelectorProps) {
  
  // דוגמה לאיך אתה מעדכן כשמישהו לוחץ על צ'קבוקס:
  const handleToggleAmenity = (amenity: string) => {
    const updated = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter(item => item !== amenity)
      : [...selectedAmenities, amenity];
    
    onChange(updated); // שולח את המערך המעודכן למעלה לטופס
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>מאפייני הנכס</Typography>
      {/* כאן נמצא שאר קוד ה-UI המקורי שלך של הצ'קבוקסים */}
    </Box>
  );
}