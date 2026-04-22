// ייבוא ספריות בסיסיות
import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

// ייבוא React Hook Form - useForm לניהול הטופס, SubmitHandler לטיפוס של פונקציית השליחה
import { useForm,type SubmitHandler } from "react-hook-form"

// הגדרת טיפוס לכל שדות הטופס
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

  // useState רק למשתמש ולתמונות - אלה לא שדות טופס רגילים
  const [user, setUser] = useState<any>(null)
  const [images, setImages] = useState<string[]>([])

  // אתחול React Hook Form עם ערכי ברירת מחדל לכל השדות
  const { register,handleSubmit, formState: { errors }  // מכיל את שגיאות הולידציה
   } = useForm<ApartmentFormData>({
    defaultValues: {
      location: 'Center',  // ברירת מחדל לאזור
      bedrooms: 1
    }
  })

  // בדיקה שהמשתמש מחובר ומורשה בעת טעינת הדף
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      alert('עליך להתחבר כדי להוסיף דירה')
      navigate('/login')
      return
    }
    const parsedUser = JSON.parse(userData)

    if (parsedUser.role !== 'Admin' && parsedUser.role !== 'Subscriber') {
      alert('רק מנויים ומנהלים יכולים להוסיף דירות')
      navigate('/')
      return
    }
    setUser(parsedUser)
  }, [navigate])
  

    // פונקציית שליחת הטופס - מקבלת את הנתונים ישירות מ-React Hook Form
  const onSubmit: SubmitHandler<ApartmentFormData> = async (data) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5500/api/apartments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        // data מגיע ישירות מ-React Hook Form כבר מומר לטיפוסים הנכונים
        body: JSON.stringify({ ...data, images })
      })

      const resData = await response.json()

      if (response.ok) {
        alert('הדירה נוספה בהצלחה!')
        navigate('/')
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

      {/* handleSubmit של React Hook Form עוטף את onSubmit שלנו */}
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

        {/* שדה שם הדירה - חובה, מינימום 2 תווים */}
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

        {/* שדה מחיר לחודש - חובה, מספר חיובי */}
        <div>
          <label>מחיר לחודש (₪):</label>
          <input
            type="number"
            {...register('price', {
              required: 'מחיר לחודש הוא שדה חובה',
              min: { value: 1, message: 'מחיר חייב להיות גדול מ-0' },
              valueAsNumber: true  // ממיר אוטומטית ל-number
            })}
            style={{ width: '100%', padding: '8px' }}
          />
          {errors.price && <span style={{ color: 'red' }}>{errors.price.message}</span>}
        </div>

        {/* שדה מחיר ללילה - חובה, מספר חיובי */}
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

        {/* שדה עיר - חובה */}
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

        {/* שדה כתובת - חובה */}
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

        {/* שדה אזור - select עם ברירת מחדל Center */}
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

        {/* שדה חדרי שינה - חובה, מינימום 0 */}
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

        {/* שדה תיאור - לא חובה */}
        <div>
          <label>תיאור:</label>
          <textarea
            {...register('description')}
            rows={4}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        {/* שדה תמונות - מנוהל ידנית עם useState כי זה מערך דינמי */}
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
