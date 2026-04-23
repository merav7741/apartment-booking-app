import React from 'react';
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography, 
  FormGroup, 
  FormControlLabel, 
  Checkbox, 
  Box 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// אובייקט תרגום עבור הצ'קבוקסים
const translationMap: Record<string, string> = {
  wifi: 'וואי-פיי', ac: 'מזגן', heating: 'חימום', elevator: 'מעלית', parking: 'חניה',
  kitchen: 'מטבח', microwave: 'מיקרוגל', fridge: 'מקרר', dishwasher: 'מדיח כלים', coffee_machine: 'מכונת קפה',
  garden: 'גינה', balcony: 'מרפסת', pool: 'בריכה', jacuzzi: 'גקוזי', nearbyAttractions: 'אטרקציות בקרבת מקום', nearbySynagogue: 'בית כנסת קרוב',
  gym: 'חדר כושר', sauna: 'סאונה', security: 'אבטחה', cleaning_service: 'שירותי ניקיון',
  wheelchair_accessible: 'נגישות לכיסא גלגלים', baby_crib: 'עריסת תינוק', high_chair: 'כיסא אוכל לתינוק',
  pets_allowed: 'חיות מחמד מותרות', sea_view: 'נוף לים', mountain_view: 'נוף להרים', city_view: 'נוף עירוני', fireplace: 'קמין', workspace: 'פינת עבודה'
};

const AMENITIES_DATA = {
  "נוחות בסיסית": ['wifi', 'ac', 'heating', 'elevator', 'parking'],
  "מטבח וארוחות": ['kitchen', 'microwave', 'fridge', 'dishwasher', 'coffee_machine'],
  "מתקני חוץ": ['garden', 'balcony', 'pool', 'jacuzzi', 'nearbyAttractions', 'nearbySynagogue'],
  "שירותים ונגישות": ['gym', 'sauna', 'security', 'cleaning_service', 'wheelchair_accessible', 'baby_crib', 'high_chair'],
  "אחר ונוף": ['pets_allowed', 'sea_view', 'mountain_view', 'city_view', 'fireplace', 'workspace']
};

// props שמגיעים מהטופס - הערכים הנבחרים ופונקציית עדכון
type Props = {
  selectedAmenities: Record<string, boolean>
  onChange: (amenities: Record<string, boolean>) => void
}

export default function AmenitiesSelector({ selectedAmenities, onChange }: Props) {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // מעדכן את ה-state בטופס עם הערך החדש
    onChange({
      ...selectedAmenities,
      [event.target.name]: event.target.checked,
    })
  }

  return (
    <Box sx={{ width: '75%', margin: 'auto', direction: 'rtl' }}>
      {Object.entries(AMENITIES_DATA).map(([category, items]) => (
        <Accordion key={category} disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 'bold' }}>{category}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              {items.map((item) => (
                <FormControlLabel
                  key={item}
                  control={
                    <Checkbox
                      checked={!!selectedAmenities[item]}
                      onChange={handleChange}
                      name={item}
                    />
                  }
                  // מציג את התרגום מהמפה, ואם לא קיים - מציג את המקור
                  label={translationMap[item] || item}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}