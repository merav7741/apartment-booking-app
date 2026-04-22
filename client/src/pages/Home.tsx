import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import ApartmentCard from "../components/ApartmentCard"

export default function Home() {
  const [apartments, setApartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const navigate = useNavigate()

  const filteredApartments = apartments.filter((apt: any) => {
    const search = searchTerm.toLowerCase()
    return (
      apt.name?.toLowerCase().includes(search) ||
      apt.location?.toLowerCase().includes(search) ||
      apt.description?.toLowerCase().includes(search)
    )
  })


  const fetchApartments = async () => {
    try {
      const response = await fetch('http://localhost:5500/api/apartments')
      const data = await response.json()
      setApartments(data)
    } catch (error) {
      console.error('Error fetching apartments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApartmentClick = (id: string) => {
    navigate(`/apartment/${id}`)
  }

  useEffect(() => {
    fetchApartments()
  }, [])

  return (
    <div >
      <h1>ברוכים הבאים ל-SuiteSpot</h1>
      <p>אתר למציאת דירות להשכרה</p>

      <div >
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
        }}      />
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
