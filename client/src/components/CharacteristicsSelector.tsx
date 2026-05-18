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
import { AMENITY_TRANSLATIONS } from './amenities';

const CHARACTERISTICS_DATA = {
  "נוחות בסיסית": ['wifi', 'ac', 'heating', 'elevator', 'parking'],
  "מטבח וארוחות": ['kitchen', 'microwave', 'fridge', 'dishwasher', 'coffee_machine'],
  "מתקני חוץ": ['garden', 'balcony', 'pool', 'jacuzzi', 'nearbyAttractions', 'nearbySynagogue'],
  "שירותים ונגישות": ['gym', 'sauna', 'security', 'cleaning_service', 'wheelchair_accessible', 'baby_crib', 'high_chair'],
  "אחר ונוף": ['pets_allowed', 'sea_view', 'mountain_view', 'city_view', 'fireplace', 'workspace']
};

type Props = {
  selectedCharacteristics: Record<string, boolean>
  onChange: (characteristics: Record<string, boolean>) => void
}

export default function CharacteristicsSelector({ selectedCharacteristics, onChange }: Props) {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...selectedCharacteristics,
      [event.target.name]: event.target.checked,
    })
  }

  return (
    <Box sx={{ width: '75%', margin: 'auto', direction: 'rtl' }}>
      {Object.entries(CHARACTERISTICS_DATA).map(([category, items]) => (
        <Accordion key={category} disableGutters>
          <AccordionSummary expandIcon={<span>▼</span>}>
            <Typography sx={{ fontWeight: 'bold' }}>{category}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              {items.map((item) => (
                <FormControlLabel
                  key={item}
                  control={
                    <Checkbox
                      checked={!!selectedCharacteristics[item]}
                      onChange={handleChange}
                      name={item}
                    />
                  }
                  label={AMENITY_TRANSLATIONS[item] || item}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}