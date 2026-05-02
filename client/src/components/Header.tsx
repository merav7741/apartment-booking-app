import { NavLink, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logout } from '../store/authSlice'

const Header = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav style={{
      display: 'flex',
      gap: '20px',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', gap: '20px' }}>
        <NavLink to='/' style={({ isActive }) => ({
          color: isActive ? 'blue' : 'black',
          textDecoration: 'none',
          fontWeight: isActive ? 'bold' : 'normal'
        })}>דף הבית</NavLink>

        {isAuthenticated && (
          <NavLink to='/dashboard' style={({ isActive }) => ({
            color: isActive ? 'blue' : 'black',
            textDecoration: 'none',
            fontWeight: isActive ? 'bold' : 'normal'
          })}>הדשבורד שלי</NavLink>
        )}
      </div>

      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        {isAuthenticated ? (
          <>
            <span style={{ color: '#666' }}>שלום, {user?.name}!</span>
            <button 
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              התנתק
            </button>
          </>
        ) : (
          <NavLink to='/login' style={({ isActive }) => ({
            color: isActive ? 'blue' : 'black',
            textDecoration: 'none',
            fontWeight: isActive ? 'bold' : 'normal'
          })}>התחברות</NavLink>
        )}
      </div>
    </nav>
  )
}

export default Header