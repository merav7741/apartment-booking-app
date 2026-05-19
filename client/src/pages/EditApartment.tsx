import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMyApartments } from '../store/apartmentSlice';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { AMENITY_TRANSLATIONS } from '../types/amenities';

import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  TextField, 
  MenuItem, 
  FormControlLabel, 
  Checkbox, 
  Paper, 
  Chip,
  IconButton
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';

// ⬅️ המערך מייצר את עצמו אוטומטית מתוך המפתחות של המילון המרכזי שלך
const ALL_CHARACTERISTICS = Object.keys(AMENITY_TRANSLATIONS);
const LOCATIONS = ['Center', 'North', 'South', 'East', 'West'];

export default function EditApartment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const { register, handleSubmit, setValue, watch, reset } = useForm<any>({
    defaultValues: {
      name: '',
      price: 0,
      city: '',
      address: '',
      bedrooms: 0,
      location: '',
      description: '',
      image: [],
      characteristics: []
    }
  });

  const formData = watch();

  useEffect(() => {
    const fetchApartment = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/apartments/${id}`)
        const data = await response.json()
        reset({ ...data, characteristics: data.characteristics || [] })
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching apartment:', err)
        setIsLoading(false)
      }
    }
    fetchApartment()
  }, [id, reset])

  const handleCharChange = (char: string) => {
    const currentChars = formData?.characteristics || [];
    const updatedChars = currentChars.includes(char)
      ? currentChars.filter((c: string) => c !== char)
      : [...currentChars, char];
    setValue('characteristics', updatedChars);
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      const currentImages = formData.image || [];
      setValue('image', [...currentImages, newImageUrl]);
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    const currentImages = formData.image || [];
    const updatedImages = currentImages.filter((_: any, i: number) => i !== index);
    setValue('image', updatedImages);
  };

  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/apartments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        await dispatch(fetchMyApartments());
        alert("הדירה עודכנה בהצלחה!");
        navigate('/dashboard');
      }
    } catch (err) {
      alert("שגיאה בעדכון הנתונים");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("האם את בטוחה שברצונך למחוק את הדירה לצמיתות?")) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/apartments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        await dispatch(fetchMyApartments());
        alert("הדירה נמחקה בהצלחה");
        navigate('/dashboard');
      }
    } catch (err) {
      alert("שגיאה בתהליך המחיקה");
    }
  };

  if (isLoading) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 6, color: 'text.secondary' }}>
        טוען נתונים...
      </Typography>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', my: 4, p: 3, direction: 'rtl' }}>
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 3, bgcolor: 'background.paper' }}>
        
        {/* כותרת הדף */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 2, mb: 4, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'text.primary', flexGrow: 1 }}>
            עריכת דירה: {formData.name}
          </Typography>
          {user?.role === 'Admin' && (
            <Chip label="מצב מנהלת" color="error" variant="outlined" size="small" />
          )}
        </Box>

        {/* טופס */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          
          {/* שדות קלט ראשיים בגריד */}
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="שם הדירה" {...register('name')} variant="outlined" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="מחיר ללילה" {...register('price', { valueAsNumber: true })} type="number" variant="outlined" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="עיר" {...register('city')} variant="outlined" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="כתובת" {...register('address')} variant="outlined" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="חדרי שינה" {...register('bedrooms', { valueAsNumber: true })} type="number" variant="outlined" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                select
                label="אזור"
                {...register('location')}
                variant="outlined"
              >
                {LOCATIONS.map((loc) => (
                  <MenuItem key={loc} value={loc}>
                    {loc}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          {/* שדה תיאור */}
          <TextField fullWidth multiline rows={3} label="תיאור" {...register('description')} variant="outlined" />

          {/* ניהול תמונות */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, bgcolor: 'action.hover' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5, color: 'text.primary' }}>
              תמונות הנכס
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
              <TextField 
                fullWidth 
                size="small"
                placeholder="הדבק URL לתמונה" 
                value={newImageUrl} 
                onChange={(e) => setNewImageUrl(e.target.value)} 
                variant="outlined"
                sx={{ bgcolor: 'background.paper' }}
              />
              <Button variant="contained" color="primary" onClick={addImage} startIcon={<AddIcon />} sx={{ px: 3, borderRadius: 1.5, gap: 1, '& .MuiButton-startIcon': { m: 0 } }}>
                הוסף
              </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {formData.image?.map((img: string, index: number) => (
                <Box key={index} sx={{ position: 'relative', width: 75, height: 75 }}>
                  <Box 
                    component="img" 
                    src={img} 
                    alt="" 
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 2, border: 1, borderColor: 'divider' }} 
                  />
                  <IconButton 
                    size="small" 
                    onClick={() => removeImage(index)} 
                    sx={{ position: 'absolute', top: -6, right: -6, bgcolor: 'error.main', color: 'error.contrastText', p: 0.2, '&:hover': { bgcolor: 'error.dark' } }}
                  >
                    <CancelIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* ניהול מאפיינים מתורגמים */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, bgcolor: 'action.hover' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5, color: 'text.primary' }}>
              מאפיינים ושירותים
            </Typography>
            <Grid container spacing={1}>
              {ALL_CHARACTERISTICS.map((char) => (
                <Grid size={{ xs: 6, sm: 4, md: 3 }} key={char}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        size="small"
                        checked={formData.characteristics?.includes(char) || false} 
                        onChange={() => handleCharChange(char)} 
                      />
                    }
                    label={
                      <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.primary' }}>
                        {/* ⬅️ כאן אנו משתמשים במילון המיובא כדי להציג עברית נקייה ליוזר */}
                        {AMENITY_TRANSLATIONS[char]} 
                      </Typography>
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* כפתורי פעולה תחתונים */}
          <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
            <Button variant="contained" color="success" type="submit" startIcon={<SaveIcon />} sx={{ flex: { xs: '1 1 100%', sm: 2 }, py: 1.5, borderRadius: 2, fontWeight: 'bold', boxShadow: 'none', gap: 1, '& .MuiButton-startIcon': { m: 0 } }}>
              שמור שינויים
            </Button>
            <Button variant="outlined" color="error" onClick={handleDelete} startIcon={<DeleteIcon />} sx={{ flex: 1, py: 1.5, borderRadius: 2, fontWeight: 'medium', gap: 1, '& .MuiButton-startIcon': { m: 0 } }}>
              מחק דירה
            </Button>
            <Button variant="outlined" color="inherit" onClick={() => navigate('/dashboard')} sx={{ flex: 1, py: 1.5, borderRadius: 2, fontWeight: 'medium' }}>
              ביטול
            </Button>
          </Box>

        </Box>
      </Paper>
    </Box>
  );
}