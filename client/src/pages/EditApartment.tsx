import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMyApartments } from '../store/apartmentSlice';

const ALL_CHARACTERISTICS = [
  'wifi', 'ac', 'heating', 'elevator', 'parking', 'kitchen', 'microwave',
  'fridge', 'dishwasher', 'coffee_machine', 'garden', 'balcony', 'pool',
  'jacuzzi', 'nearbyAttractions', 'nearbySynagogue', 'gym', 'sauna',
  'security', 'cleaning_service', 'wheelchair_accessible', 'baby_crib',
  'high_chair', 'pets_allowed', 'sea_view', 'mountain_view', 'city_view',
  'fireplace', 'workspace'
];

const LOCATIONS = ['Center', 'North', 'South', 'East', 'West'];

export default function EditApartment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  useEffect(() => {
    const fetchApartment = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/apartments/${id}`)
      const data = await response.json()
      setFormData(data)
    }
    fetchApartment()
  }, [id])




  const [formData, setFormData] = useState<any>(null);
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: (name === 'price' || name === 'bedrooms' || name === 'pricePerNight') ? Number(value) : value
    });
  };

  const handleCharChange = (char: string) => {
    const currentChars = formData.characteristics || [];
    const updatedChars = currentChars.includes(char)
      ? currentChars.filter((c: string) => c !== char)
      : [...currentChars, char];
    setFormData({ ...formData, characteristics: updatedChars });
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData({ ...formData, image: [...(formData.image || []), newImageUrl] });
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = formData.image.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, image: updatedImages });
  };

  // פונקציית שמירה
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/apartments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
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

  if (!formData) return <p style={{ textAlign: 'center', marginTop: '50px' }}>טוען נתונים...</p>;

  return (
    <div style={containerStyle}>
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        עריכת דירה: {formData.name}
        {user?.role === 'Admin' && <span style={adminTag}>מצב מנהלת</span>}
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={gridStyle}>
          <label>שם הדירה: <input name="name" value={formData.name} onChange={handleChange} style={inputStyle} /></label>
          <label>מחיר ללילה: <input name="price" type="number" value={formData.price} onChange={handleChange} style={inputStyle} /></label>
          <label>עיר: <input name="city" value={formData.city} onChange={handleChange} style={inputStyle} /></label>
          <label>כתובת: <input name="address" value={formData.address} onChange={handleChange} style={inputStyle} /></label>
          <label>חדרי שינה: <input name="bedrooms" type="number" value={formData.bedrooms} onChange={handleChange} style={inputStyle} /></label>
          <label>אזור:
            <select name="location" value={formData.location} onChange={handleChange} style={inputStyle}>
              {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </label>
        </div>

        <label>תיאור: <textarea name="description" value={formData.description} onChange={handleChange} style={{ ...inputStyle, height: '80px' }} /></label>

        {/* תמונות */}
        <div style={sectionStyle}>
          <h4>תמונות</h4>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input placeholder="הדבק URL לתמונה" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} style={inputStyle} />
            <button type="button" onClick={addImage} style={addBtnStyle}>הוסף</button>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {formData.image?.map((img: string, index: number) => (
              <div key={index} style={{ position: 'relative' }}>
                <img src={img} alt="" style={thumbStyle} />
                <button type="button" onClick={() => removeImage(index)} style={removeImgBtn}>X</button>
              </div>
            ))}
          </div>
        </div>

        {/* מאפיינים */}
        <div style={sectionStyle}>
          <h4>מאפיינים:</h4>
          <div style={charGrid}>
            {ALL_CHARACTERISTICS.map(char => (
              <label key={char} style={{ fontSize: '12px', display: 'flex', gap: '5px', alignItems: 'center' }}>
                <input type="checkbox" checked={formData.characteristics?.includes(char)} onChange={() => handleCharChange(char)} />
                {char.replace('_', ' ')}
              </label>
            ))}
          </div>
        </div>

        {/* כפתורי פעולה */}
        <div style={{ display: 'flex', gap: '15px' }}>
          <button type="submit" style={saveBtn}>שמור שינויים</button>
          <button type="button" onClick={handleDelete} style={deleteBtn}>מחק דירה 🗑️</button>
          <button type="button" onClick={() => navigate('/dashboard')} style={cancelBtn}>ביטול</button>
        </div>
      </form>
    </div>
  );
}

// עיצובים (Styles)
const containerStyle: React.CSSProperties = { maxWidth: '800px', margin: '20px auto', padding: '25px', direction: 'rtl', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 15px rgba(0,0,0,0.1)' };
const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', marginTop: '5px' };
const sectionStyle = { border: '1px solid #eee', padding: '15px', borderRadius: '8px', backgroundColor: '#fcfcfc' };
const thumbStyle = { width: '70px', height: '70px', objectFit: 'cover' as 'cover', borderRadius: '4px' };
const charGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '8px' };
const adminTag: React.CSSProperties = { fontSize: '12px', backgroundColor: '#fee2e2', color: '#b91c1c', padding: '4px 8px', borderRadius: '4px', marginRight: '10px', verticalAlign: 'middle' };

// כפתורים
const saveBtn = { flex: 2, padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' as const };
const deleteBtn = { flex: 1, padding: '12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' };
const cancelBtn = { flex: 1, padding: '12px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' };
const addBtnStyle = { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '0 20px', borderRadius: '6px', cursor: 'pointer' };
const removeImgBtn: React.CSSProperties = { position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', cursor: 'pointer' };