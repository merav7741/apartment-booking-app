import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { useAppSelector } from '../store/hooks'
import type { User } from '../types/user.types'
import AmenitiesSelector from '../components/AmenitiesSelector'

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/apartments`

type ApartmentFormData = {
  name: string
  price: number
  pricePerNight: number
  address: string
  city: string
  location: string
  bedrooms: number
  description: string
}

export default function AddApartment() {
  const navigate = useNavigate()
  const { user, token, isAuthenticated } = useAppSelector((state) => state.auth)
  
  const [images, setImages] = useState<string[]>([])
  const [amenities, setAmenities] = useState<Record<string, boolean>>({})

  const { register, handleSubmit, formState: { errors } } = useForm<ApartmentFormData>({
    defaultValues: {
      location: 'Center',
      bedrooms: 1
    }
  })

  useEffect(() => {
    if (!isAuthenticated || !token) {
      alert('עליך להתחבר כדי להוסיף דירה')
      navigate('/login')
      return
    }

    if (user?.role !== 'Admin' && user?.role !== 'Subscriber') {
      alert('רק מנויים ומנהלים יכולים להוסיף דירות')
      navigate('/')
      return
    }
  }, [isAuthenticated, token, user, navigate])

  const onSubmit: SubmitHandler<ApartmentFormData> = async (data) => {
    try {
      if (!token) {
        alert('אין הרשאה - נדרש להתחבר מחדש')
        navigate('/login')
        return
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...data,
          image: images,
          amenities: Object.keys(amenities).filter(key => amenities[key])
        })
      })

      const resData = await response.json()

      if (response.ok) {
        alert('הדירה נוספה בהצלחה!')
        navigate('/dashboard')
      } else {
        alert(resData.message || 'שגיאה ביצירת הדירה')
      }
    } catch (error) {
      console.error(error)
      alert('שגיאה בחיבור לשרת')
    }
  }

  if (!user) return <div>טוען...</div>

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>הוסף דירה חדשה</h1>
      <p>שלום {user.name}, הוסף את הדירה שלך</p>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>שם הדירה:</label>
          <input
            type="text"
            {...register('name', {
              required: 'שם הדירה הוא שדה חובה',
              minLength: { value: 2, message: 'שם חייב להכיל לפחות 2 תווים' }
            })}
            style={{ width: '100%', padding: '8px' }}
          />
          {errors.name && <span style={{ color: 'red' }}>{errors.name.message}</span>}
        </div>

        <div>
          <label>מחיר לחודש (₪):</label>
          <input
            type="number"
            {...register('price', {
              required: 'מחיר לחודש הוא שדה חובה',
              min: { value: 1, message: 'מחיר חייב להיות גדול מ-0' },
              valueAsNumber: true
            })}
            style={{ width: '100%', padding: '8px' }}
          />
          {errors.price && <span style={{ color: 'red' }}>{errors.price.message}</span>}
        </div>

        <div>
          <label>מחיר ללילה (₪):</label>
          <input
            type="number"
            {...register('pricePerNight', {
              required: 'מחיר ללילה הוא שדה חובה',
              min: { value: 1, message: 'מחיר חייב להיות גדול מ-0' },
              valueAsNumber: true
            })}
            style={{ width: '100%', padding: '8px' }}
          />
          {errors.pricePerNight && <span style={{ color: 'red' }}>{errors.pricePerNight.message}</span>}
        </div>

        <div>
          <label>עיר:</label>
          <input
            type="text"
            {...register('city', {
              required: 'עיר היא שדה חובה'
            })}
            style={{ width: '100%', padding: '8px' }}
          />
          {errors.city && <span style={{ color: 'red' }}>{errors.city.message}</span>}
        </div>

        <div>
          <label>כתובת:</label>
          <input
            type="text"
            {...register('address', {
              required: 'כתובת היא שדה חובה'
            })}
            style={{ width: '100%', padding: '8px' }}
          />
          {errors.address && <span style={{ color: 'red' }}>{errors.address.message}</span>}
        </div>

        <div>
          <label>אזור:</label>
          <select
            {...register('location')}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="Center">מרכז</option>
            <option value="North">צפון</option>
            <option value="South">דרום</option>
            <option value="East">מזרח</option>
            <option value="West">מערב</option>
          </select>
        </div>

        <div>
          <label>מספר חדרי שינה:</label>
          <input
            type="number"
            {...register('bedrooms', {
              required: 'מספר חדרי שינה הוא שדה חובה',
              min: { value: 0, message: 'מספר חדרים לא יכול להיות שלילי' },
              valueAsNumber: true
            })}
            style={{ width: '100%', padding: '8px' }}
          />
          {errors.bedrooms && <span style={{ color: 'red' }}>{errors.bedrooms.message}</span>}
        </div>

        <div>
          <label>תיאור:</label>
          <textarea
            {...register('description')}
            rows={4}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div>
          <label>תמונות (URLs):</label>
          <input
            type="text"
            placeholder="הכנס קישור לתמונה"
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                const url = (e.target as HTMLInputElement).value.trim()
                if (url) {
                  setImages([...images, url]);
                  (e.target as HTMLInputElement).value = ''
                }
              }
            }}
            style={{ width: '100%', padding: '8px' }}
          />
          <small>לחץ Enter להוספת כל תמונה</small>

          {images.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <strong>תמונות שנוספו:</strong>
              {images.map((img, index) => (
                <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '5px' }}>
                  <span>{img}</span>
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                    style={{ padding: '2px 8px', cursor: 'pointer' }}
                  >
                    מחק
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <AmenitiesSelector
          selectedAmenities={amenities}
          onChange={setAmenities}
        />

        <button
          type="submit"
          style={{
            padding: '12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          פרסם דירה
        </button>
      </form>
    </div>
  )
}
