import { useNavigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom'

export default function UserDashboard() {
  const navigate = useNavigate()

  const handleAddApartment = () => {
    navigate('/dashboard/addApartment')
  }

  return (
    <>
      <div>
        <h1>הדשבורד שלי</h1>

        <div>
          <section>
            <h2>הדירות שלי</h2>
            <p>כאן יופיעו הדירות שפרסמת...</p>
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
