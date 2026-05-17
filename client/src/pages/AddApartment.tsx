import { useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { useAppSelector } from '../store/hooks'
import CharacteristicsSelector from '../components/CharacteristicsSelector'

import { Button, Card, CardContent } from '@mui/material'

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
  const [characteristics, setCharacteristics] = useState<Record<string, boolean>>({})

  const { register, handleSubmit, formState: { errors } } = useForm<ApartmentFormData>({
    defaultValues: {
      location: 'Center',
      bedrooms: 1
    }
  })

  if (!isAuthenticated || !token) {
    navigate('/login')
    return null
  }

  if (user?.role !== 'Admin' && user?.role !== 'Subscriber') {
    navigate('/')
    return null
  }

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
          characteristics: Object.keys(characteristics).filter(key => characteristics[key])
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

  if (!user) return <div className="text-center py-20 font-medium text-slate-400 animate-pulse">טוען...</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-right dir-rtl">
      <Card className="border-slate-200 shadow-lg">
        <CardContent className="p-6">
          <div className="border-b bg-slate-50/50 pb-6 rounded-t-2xl mb-6">
            <h1 className="text-2xl font-black text-slate-900">הוסף דירה חדשה</h1>
            <p className="text-slate-500 font-medium text-sm mt-1">
              שלום {user.name}, מלא את פרטי הדירה שלך כדי לפרסם אותה במערכת.
            </p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1.5">שם הדירה:</label>
              <input
                type="text"
                {...register('name', {
                  required: 'שם הדירה הוא שדה חובה',
                  minLength: { value: 2, message: 'שם חייב להכיל לפחות 2 תווים' }
                })}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              />
              {errors.name && <span className="text-xs font-semibold text-rose-500 mt-1 block">{errors.name.message}</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-1.5">מחיר לחודש (₪):</label>
                <input
                  type="number"
                  {...register('price', {
                    required: 'מחיר לחודש הוא שדה חובה',
                    min: { value: 1, message: 'מחיר חייב להיות גדול מ-0' },
                    valueAsNumber: true
                  })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                />
                {errors.price && <span className="text-xs font-semibold text-rose-500 mt-1 block">{errors.price.message}</span>}
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 block mb-1.5">מחיר ללילה (₪):</label>
                <input
                  type="number"
                  {...register('pricePerNight', {
                    required: 'מחיר ללילה הוא שדה חובה',
                    min: { value: 1, message: 'מחיר חייב להיות גדול מ-0' },
                    valueAsNumber: true
                  })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                />
                {errors.pricePerNight && <span className="text-xs font-semibold text-rose-500 mt-1 block">{errors.pricePerNight.message}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-1.5">עיר:</label>
                <input
                  type="text"
                  {...register('city', { required: 'עיר היא שדה חובה' })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                />
                {errors.city && <span className="text-xs font-semibold text-rose-500 mt-1 block">{errors.city.message}</span>}
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 block mb-1.5">כתובת:</label>
                <input
                  type="text"
                  {...register('address', { required: 'כתובת היא שדה חובה' })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                />
                {errors.address && <span className="text-xs font-semibold text-rose-500 mt-1 block">{errors.address.message}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-1.5">אזור:</label>
                <select
                  defaultValue="Center"
                  {...register('location', { required: true })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <option value="Center">מרכז</option>
                  <option value="North">צפון</option>
                  <option value="South">דרום</option>
                  <option value="East">מזרח</option>
                  <option value="West">מערב</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 block mb-1.5">מספר חדרי שינה:</label>
                <input
                  type="number"
                  {...register('bedrooms', {
                    required: 'מספר חדרי שינה הוא שדה חובה',
                    min: { value: 0, message: 'מספר חדרים לא יכול להיות שלילי' },
                    valueAsNumber: true
                  })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                />
                {errors.bedrooms && <span className="text-xs font-semibold text-rose-500 mt-1 block">{errors.bedrooms.message}</span>}
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1.5">תיאור:</label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1.5">תמונות (URLs):</label>
              <input
                type="text"
                placeholder="הכנס קישור לתמונה ולחץ Enter"
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    const url = (e.target as HTMLInputElement).value.trim()
                    if (url) {
                      setImages([...images, url]);
                      (e.target as HTMLInputElement).value = ''
                    }
                  }
                }}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              />
              <small className="text-xs text-slate-400 mt-1 block">לחץ Enter לאחר הזנת כל קישור להוספת התמונה לרשימה</small>

              {images.length > 0 && (
                <div className="mt-3 bg-slate-50 p-4 border rounded-xl space-y-2">
                  <strong className="text-xs text-slate-500 block mb-1">תמונות שנוספו ({images.length}):</strong>
                  {images.map((img, index) => (
                    <div key={index} className="flex gap-3 justify-between items-center bg-white p-2 border border-slate-100 rounded-lg text-xs font-mono text-slate-600">
                      <span className="truncate max-w-[400px]">{img}</span>
                      <Button
                        type="button"
                        variant="text"
                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                        className="h-7 px-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-bold"
                      >
                        מחק
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2">
              <CharacteristicsSelector
                selectedCharacteristics={characteristics}
                onChange={setCharacteristics}
              />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 text-base shadow-sm">
              פרסם דירה
            </Button>
          </form>

        </CardContent>
      </Card>
    </div>
  )
}