import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import ApartmentCard from '../components/ApartmentCard'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchMyApartments } from '../store/apartmentSlice'
import type { Apartment } from '../types/apartment.types'

export default function UserDashboard() {
  const dispatch = useAppDispatch()
  const { myApartments, loading, error } = useAppSelector((state) => state.apartments)
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const filteredApartments = myApartments.filter((apt: Apartment) => {
    const search = searchTerm.toLowerCase()
    return (
      apt.name?.toLowerCase().includes(search) ||
      apt.location?.toLowerCase().includes(search) ||
      apt.description?.toLowerCase().includes(search)
    )
  })

  const handleApartmentClick = (id: string) => {
    navigate(`/apartment/${id}`)
  }

  const handleAddApartment = () => {
    navigate('/dashboard/addApartment')
  }

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMyApartments())
    }
  }, [dispatch, isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>נדרש להתחבר</h2>
        <p>אנא התחבר כדי לראות את הדשבורד שלך</p>
        <button onClick={() => navigate('/login')}>התחבר</button>
      </div>
    )
  }

  return (
    <>
      <div>
        <h1>הדשבורד שלי</h1>
        {user && (
          <div style={{ marginBottom: '20px' }}>
            <p>שלום, {user.name}!</p>
            <p>תפקיד: {user.role}</p>
          </div>
        )}
        
        {error && (
          <div style={{ color: 'red', padding: '10px', marginBottom: '10px', backgroundColor: '#fee' }}>
            שגיאה: {error}
          </div>
        )}

        <div>
          <section>
            <h2>הדירות שלי</h2>
            <div>
              {loading ? (
                <p>טוען דירות...</p>
              ) : filteredApartments.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '20px',
                  marginTop: '20px'
                }}>
                  {filteredApartments.map((apt: Apartment) => (
                    <ApartmentCard
                      key={apt._id}
                      apartment={apt}
                      onClick={handleApartmentClick}
                    />
                  ))}
                </div>
              ) : (
                <p>לא נמצאו דירות. הוסף דירה ראשונה!</p>
              )}
            </div>

            <button onClick={handleAddApartment}>הוסף דירה חדשה</button>
          </section>

          <section>
            <h2>פרופיל</h2>
            <p>כאן יופיעו פרטי הפרופיל...</p>
          </section>
        </div>
      </div>
      <Outlet />
    </>
  )
}
