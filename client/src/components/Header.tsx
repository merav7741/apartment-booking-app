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
    <nav style={navStyle}>
      {/* צד ימין: לוגו וקישורי ניווט עיקריים */}
      <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
        
        {/* הלוגו - מושך את התמונה מתיקיית public */}
        <img 
          src="/logo.png" 
          alt="לוגו האתר" 
          style={logoImageStyle} 
          onClick={() => navigate('/')} 
        />

        <NavLink to='/' style={linkStyle}>דף הבית</NavLink>
        
        {isAuthenticated && (
          <NavLink to='/dashboard' style={linkStyle}>הדשבורד שלי</NavLink>
        )}
      </div>

      {/* צד שמאל: פרטי משתמש / התחברות / התנתקות */}
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        {isAuthenticated ? (
          <>
            <div style={userBadgeStyle}>
              {/* עיגול עם האות הראשונה של השם */}
              <div style={avatarStyle}>{user?.name?.[0]}</div>
              <span style={{ fontWeight: '500', color: '#1f2937' }}>{user?.name}</span>
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

// --- אובייקטי עיצוב (CSS-in-JS) ברמה גבוהה ---

const navStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 40px',
  backgroundColor: 'rgba(255, 255, 255, 0.9)', // שקיפות קלה
  backdropFilter: 'blur(10px)', // אפקט טשטוש יוקרתי
  borderBottom: '1px solid #e5e7eb',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  direction: 'rtl' // מוודא שהכל מיושר לימין
};

const logoImageStyle: React.CSSProperties = {
  height: '45px', // גובה הלוגו
  width: 'auto',
  cursor: 'pointer',
  transition: 'transform 0.2s',
};

const linkStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
  color: isActive ? '#2563eb' : '#4b5563',
  textDecoration: 'none',
  fontWeight: isActive ? '600' : '400',
  fontSize: '15px',
  transition: '0.2s',
});

const userBadgeStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  backgroundColor: '#f3f4f6',
  padding: '6px 14px',
  borderRadius: '25px',
};

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
};

const logoutBtnStyle: React.CSSProperties = {
  padding: '8px 18px',
  backgroundColor: 'transparent',
  color: '#ef4444',
  border: '1px solid #ef4444',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: '500',
  transition: '0.3s',
};

const loginLinkStyle: React.CSSProperties = {
  padding: '10px 22px',
  backgroundColor: '#2563eb',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '10px',
  fontWeight: '600',
  boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)',
  transition: '0.3s'
};

export default Header;