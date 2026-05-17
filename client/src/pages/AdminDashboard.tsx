import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchAllBookings } from '../store/bookingSlice'
import type { Apartment } from '../types/apartment.types'
import { AdminApartments } from './components/UserDasbord.ts' //לבדוק אם הניתוב טוב

import { Card, CardContent, Badge } from '@mui/material'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user, token } = useAppSelector((state) => state.auth)
  const { allBookings } = useAppSelector((state) => state.bookings)
  const [allSystemApartments, setAllSystemApartments] = useState<Apartment[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAllApartmentsForAdmin = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/apartments`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setAllSystemApartments(data)
      }
    } catch (err) {
      console.error('Error fetching all apartments', err)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (user?.role === 'Admin') {
      fetchAllApartmentsForAdmin()
      dispatch(fetchAllBookings())
    } else {
      setLoading(false)
    }
  }, [fetchAllApartmentsForAdmin, user?.role, dispatch])

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!window.confirm('למחוק את הדירה לצמיתות?')) return

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/apartments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        fetchAllApartmentsForAdmin()
      }
    } catch {
      alert('אירעה שגיאה במחיקת הדירה')
    }
  }

  if (user?.role !== 'Admin') {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center dir-rtl">
        <h1 className="text-3xl font-extrabold text-red-700 mb-2">אין הרשאה</h1>
        <p className="text-slate-500">לוח הבקרה מיועד למנהל בלבד.</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-right dir-rtl space-y-10">
      <header className="flex justify-between items-center gap-4 flex-wrap pb-4 border-b">
        <div>
          <p className="text-xs font-bold text-red-800 uppercase tracking-wider mb-1">לוח מנהל</p>
          <h1 className="text-3xl font-black text-slate-900">ניהול הדירות במערכת</h1>
        </div>
      </header>

      {loading ? (
        <p className="text-center text-slate-400 py-10 animate-pulse font-medium">טוען דירות...</p>
      ) : (
        <>
          <AdminApartments
            apartments={allSystemApartments}
            userId={user?._id || ''}
            onEdit={(id) => navigate(`/dashboard/edit/${id}`)}
            onDelete={handleDelete}
            onOpen={(id) => navigate(`/apartment/${id}`)}
          />

          <section className="space-y-6 pt-4">
            <h2 className="text-2xl font-bold text-slate-900">כל ההזמנות במערכת</h2>
            
            {allBookings.length === 0 ? (
              <div className="p-6 text-center rounded-2xl bg-slate-50 border text-slate-500 font-medium">
                אין הזמנות להצגה כרגע.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allBookings.map((booking: any) => (
                  <Card key={booking._id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex justify-between items-start gap-4 flex-wrap">
                        <div>
                          <h3 className="font-bold text-lg text-slate-950">{booking.apartmentId?.name || 'דירה'}</h3>
                          <p className="text-xs font-medium text-slate-400 mt-1">אורח: {booking.customerId?.name || 'לא ידוע'}</p>
                        </div>
                        <Badge className={`font-bold px-3 py-1 text-xs rounded-full border-none text-white
                          ${booking.status === 'Approved' ? 'bg-emerald-500 hover:bg-emerald-600' : 
                            booking.status === 'Pending Approval' ? 'bg-amber-500 hover:bg-amber-600' : 
                            'bg-rose-500 hover:bg-rose-600'}`}>
                          {booking.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 pt-2 border-t border-slate-50">
                        <div className="flex justify-between bg-slate-50 p-2 rounded-lg">
                          <span className="text-slate-400">🗓️ התחלה</span>
                          <span className="font-medium text-slate-900">{new Date(booking.startDate).toLocaleDateString('he-IL')}</span>
                        </div>
                        <div className="flex justify-between bg-slate-50 p-2 rounded-lg">
                          <span className="text-slate-400">🗓️ סיום</span>
                          <span className="font-medium text-slate-900">{new Date(booking.endDate).toLocaleDateString('he-IL')}</span>
                        </div>
                        <div className="flex justify-between bg-slate-50 p-2 rounded-lg">
                          <span className="text-slate-400">💰 סה"כ</span>
                          <span className="font-bold text-emerald-600">₪{booking.totalPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between bg-slate-50 p-2 rounded-lg col-span-2">
                          <span className="text-slate-400">📍 כתובת</span>
                          <span className="font-medium text-slate-900 truncate max-w-[250px]">{booking.apartmentId?.address || 'לא זמין'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}