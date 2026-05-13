import { useEffect, useState } from 'react'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import ApartmentCard from '../components/ApartmentCard'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchMyApartments } from '../store/apartmentSlice'
import type { Apartment } from '../types/apartment.types'

export default function UserDashboard() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { myApartments, loading } = useAppSelector((state) => state.apartments)
  const { user, isAuthenticated, token } = useAppSelector((state) => state.auth)

  const [allSystemApartments, setAllSystemApartments] = useState<Apartment[]>([])
  const [adminLoading, setAdminLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMyApartments())
    }
  }, [dispatch, isAuthenticated])

  useEffect(() => {
    if (isAuthenticated && user?.role === 'Admin') {
      fetchAllApartmentsForAdmin()
    }
  }, [isAuthenticated, user])



  const fetchAllApartmentsForAdmin = async () => {
    setAdminLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/apartments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setAllSystemApartments(data)
      }
    } catch (err) {
      console.error("Error fetching all apartments", err)
    } finally {
      setAdminLoading(false)
    }
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!window.confirm("האם למחוק דירה זו לצמיתות?")) return
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/apartments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        alert("הדירה נמחקה")
        dispatch(fetchMyApartments())
        if (user?.role === 'Admin') fetchAllApartmentsForAdmin()
      }
    } catch (err) {
      alert("שגיאה במחיקה")
    }
  }

  const isEditingOrAdding = location.pathname.includes('/edit/') || location.pathname.includes('/addApartment')
  if (isEditingOrAdding) return <Outlet />

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', direction: 'rtl', textAlign: 'right' }}>

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>לוח בקרה - {user?.name}</h1>
        <button onClick={() => navigate('/dashboard/addApartment')} style={addBtnStyle}>+ הוסף דירה חדשה</button>
      </header>

      {/* חלק 1: הדירות שלי */}
      <section style={{ marginBottom: '50px' }}>
        <h2 style={sectionTitleStyle}>הדירות שפרסמתי</h2>
        {loading ? <p>טוען...</p> : (
          <div style={gridStyle}>
            {myApartments.length > 0 ? myApartments.map(apt => (
              <div key={apt._id} style={{ position: 'relative' }}>
                <div style={adminActionsStyle}>
                  <button onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/edit/${apt._id}`) }} style={editBtnStyle}>ערוך ✏️</button>
                  <button onClick={(e) => handleDelete(e, apt._id)} style={deleteBtnStyle}>מחק 🗑️</button>
                </div>
                <ApartmentCard apartment={apt} onClick={() => navigate(`/apartment/${apt._id}`)} />
              </div>
            )) : <p>אין דירות להצגה.</p>}
          </div>
        )}
        <div>
        </div>
      </section>

      {/* חלק 2: ניהול מערכתי (ADMIN ONLY) */}
      {user?.role === 'Admin' && (
        <section style={{ marginTop: '50px', paddingTop: '30px', borderTop: '4px double #eee' }}>
          <div style={{ backgroundColor: '#f9fafb', padding: '25px', borderRadius: '15px', border: '1px solid #e5e7eb' }}>
            <h2 style={{ ...sectionTitleStyle, color: '#b91c1c' }}>ניהול כלל הדירות במערכת (מצב מנהלת)</h2>
            <div>

            </div>
            {adminLoading ? <p>טוען נתונים...</p> : (
              <div style={gridStyle}>
                {allSystemApartments.map(apt => {
                  const apartmentOwnerId = typeof apt.ownerId === 'object' ? apt.ownerId._id : apt.ownerId;
                  const isMine = String(apartmentOwnerId) === String(user?._id || '');

                  let ownerDisplayName = "משתמש אחר";
                  if (isMine) {
                    ownerDisplayName = "אני";
                  } else if (typeof apt.ownerId === 'object') {
                    ownerDisplayName = apt.ownerId.fullName || apt.ownerId.name || "משתמש אחר";
                  }

                  return (
                      <div key={apt._id} style={{ position: 'relative' }}>

                        <div style={adminActionsStyle}>
                          <button onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/edit/${apt._id}`) }} style={editBtnStyle}>ערוך ✏️</button>
                          <button onClick={(e) => handleDelete(e, apt._id)} style={deleteBtnStyle}>מחק 🗑️</button>
                        </div>

                        <div style={{
                          ...ownerTagStyle,
                          backgroundColor: isMine ? '#10b981' : '#4b5563'
                        }}>
                          בעלים: {ownerDisplayName}
                        </div>

                        <ApartmentCard apartment={apt} onClick={() => navigate(`/apartment/${apt._id}`)} />
                      </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' };
const sectionTitleStyle = { marginBottom: '20px', paddingBottom: '10px', borderBottom: '2px solid #eee', fontWeight: 'bold' as const };
const adminActionsStyle: React.CSSProperties = { position: 'absolute', top: '10px', left: '10px', zIndex: 30, display: 'flex', gap: '8px' };
const editBtnStyle = { padding: '6px 12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' };
const deleteBtnStyle = { padding: '6px 12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' };
const addBtnStyle = { padding: '12px 24px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' as const };
const ownerTagStyle: React.CSSProperties = { position: 'absolute', bottom: '120px', right: '10px', zIndex: 20, color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' };