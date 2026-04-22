import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function AddApartment() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [pricePerNight, setPricePerNight] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [location, setLocation] = useState('Center')
  const [bedrooms, setBedrooms] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<string[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      alert('עליך להתחבר כדי להוסיף דירה')
      navigate('/login')
      return
    }

    const parsedUser = JSON.parse(userData)

    // בדיקה אם המשתמש מורשה
    if (parsedUser.role !== 'Admin' && parsedUser.role !== 'Subscriber') {
      alert('רק מנויים ומנהלים יכולים להוסיף דירות')
      navigate('/')
      return
    }

    setUser(parsedUser)
  }, [navigate])

  const handleSubmitAddApartment = async (e: any) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem('token')

      const response = await fetch('http://localhost:5500/api/apartments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          price: Number(price),
          pricePerNight: Number(pricePerNight),
          address,
          city,
          location,
          bedrooms: Number(bedrooms),
          description,
          images
        })
      })

      const data = await response.json()

      if (response.ok) {
        alert('הדירה נוספה בהצלחה!')
        navigate('/')
      } else {
        alert(data.message || 'שגיאה ביצירת הדירה')
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

      <form onSubmit={handleSubmitAddApartment} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

        <div>
          <label>שם הדירה:</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div>
          <label>מחיר לחודש (₪):</label>
          <input
            type="number"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div>
          <label>מחיר ללילה (₪):</label>
          <input
            type="number"
            required
            value={pricePerNight}
            onChange={(e) => setPricePerNight(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div>
          <label>עיר:</label>
          <input
            type="text"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div>
          <label>כתובת:</label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div>
          <label>אזור:</label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
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
            required
            min="0"
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div>
          <label>תיאור:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div>
          <label>תמונות (URLs):</label>
          <input
            type="text"
            placeholder="הכנס קישור לתמונה"
            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
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
