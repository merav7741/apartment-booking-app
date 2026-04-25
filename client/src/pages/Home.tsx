import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import ApartmentCard from "../components/ApartmentCard"
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchAllApartments } from '../store/apartmentSlice'

export default function Home() {
  const dispatch = useAppDispatch()
  const { allApartments, loading } = useAppSelector((state) => state.apartments)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const filteredApartments = allApartments.filter((apt: any) => {
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

  useEffect(() => {
    dispatch(fetchAllApartments())
  }, [dispatch])

  return (
    <div>
      <h1>ברוכים הבאים ל-SuiteSpot</h1>
      <p>אתר למציאת דירות להשכרה</p>

      <div>
        <input
          type="text"
          placeholder="היכן אתה מחפש?"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px',
            fontSize: '16px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            width: '300px',
            marginRight: '10px'
          }}
        />
        <button>חפש</button>
      </div>

      <div>
        <h2>דירות מומלצות</h2>
        {loading ? (
          <p>טוען דירות...</p>
        ) : filteredApartments.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
            marginTop: '20px'
          }}>
            {filteredApartments.map((apt: any) => (
              <ApartmentCard
                key={apt._id}
                apartment={apt}
                onClick={handleApartmentClick}
              />
            ))}
          </div>
        ) : (
          <p>לא נמצאו דירות</p>
        )}
      </div>
    </div>
  )
}
