import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logout } from '../store/authSlice'

const Header = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const [apartmentsMenuOpen, setApartmentsMenuOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const goToApartments = (view: 'recommended' | 'all') => {
    setApartmentsMenuOpen(false)
    navigate(`/?view=${view}`)
  }

  return (
    <nav style={navStyle}>
      <div style={navGroupStyle}>
        <img
          src="/logo.png"
          alt="לוגו האתר"
          style={logoImageStyle}
          onClick={() => navigate('/')}
        />

        <div
          style={menuWrapperStyle}
          onMouseEnter={() => setApartmentsMenuOpen(true)}
          onMouseLeave={() => setApartmentsMenuOpen(false)}
        >
          <button
            type="button"
            style={apartmentsButtonStyle}
            onClick={() => setApartmentsMenuOpen((open) => !open)}
          >
            הדירות שלנו
            <span style={chevronStyle}>⌄</span>
          </button>

          {apartmentsMenuOpen && (
            <div style={dropdownStyle}>
              <button type="button" style={dropdownItemStyle} onClick={() => goToApartments('recommended')}>
                דירות מומלצות
              </button>
              <button type="button" style={dropdownItemStyle} onClick={() => goToApartments('all')}>
                כל הדירות
              </button>
            </div>
          )}
        </div>

        {isAuthenticated && (
          <NavLink to='/dashboard' style={linkStyle}>אזור אישי</NavLink>
        )}
        {isAuthenticated && user?.role === 'Admin' && (
          <NavLink to='/admin' style={linkStyle}>לוח מנהל</NavLink>
        )}
      </div>

      <div style={navGroupStyle}>
        {isAuthenticated ? (
          <>
            <div style={userBadgeStyle}>
              <div style={avatarStyle}>{user?.name?.[0]}</div>
              <span style={userNameStyle}>{user?.name}</span>
            </div>
            <button onClick={handleLogout} style={logoutBtnStyle}>התנתק</button>
          </>
        ) : (
          <NavLink to='/login' style={loginLinkStyle}>התחברות</NavLink>
        )}
      </div>
    </nav>
  )
}

const navStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 40px',
  backgroundColor: 'rgba(255, 255, 255, 0.94)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid #e5e7eb',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  direction: 'rtl'
}

const navGroupStyle: React.CSSProperties = {
  display: 'flex',
  gap: '22px',
  alignItems: 'center'
}

const logoImageStyle: React.CSSProperties = {
  height: '45px',
  width: 'auto',
  cursor: 'pointer',
  transition: 'transform 0.2s'
}

const linkStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
  color: isActive ? '#2563eb' : '#4b5563',
  textDecoration: 'none',
  fontWeight: isActive ? '700' : '500',
  fontSize: '15px',
  transition: '0.2s'
})

const menuWrapperStyle: React.CSSProperties = {
  position: 'relative',
  padding: '8px 0'
}

const apartmentsButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  border: 'none',
  background: 'transparent',
  color: '#4b5563',
  fontSize: '15px',
  fontWeight: 600,
  cursor: 'pointer',
  padding: 0
}

const chevronStyle: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: 1,
  color: '#6b7280'
}

const dropdownStyle: React.CSSProperties = {
  position: 'absolute',
  top: '38px',
  right: 0,
  minWidth: '180px',
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  boxShadow: '0 16px 34px rgba(15, 23, 42, 0.14)',
  padding: '8px',
  display: 'grid',
  gap: '4px',
  zIndex: 1001
}

const dropdownItemStyle: React.CSSProperties = {
  border: 'none',
  backgroundColor: 'transparent',
  color: '#1f2937',
  padding: '10px 12px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 500,
  textAlign: 'right'
}

const userBadgeStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  backgroundColor: '#f3f4f6',
  padding: '6px 14px',
  borderRadius: '25px'
}

const avatarStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  backgroundColor: '#2563eb',
  color: 'white',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: 'bold'
}

const userNameStyle: React.CSSProperties = {
  fontWeight: 500,
  color: '#1f2937'
}

const logoutBtnStyle: React.CSSProperties = {
  padding: '8px 18px',
  backgroundColor: 'transparent',
  color: '#ef4444',
  border: '1px solid #ef4444',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: 500,
  transition: '0.3s'
}

const loginLinkStyle: React.CSSProperties = {
  padding: '10px 22px',
  backgroundColor: '#2563eb',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '10px',
  fontWeight: 600,
  boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)',
  transition: '0.3s'
}

export default Header
