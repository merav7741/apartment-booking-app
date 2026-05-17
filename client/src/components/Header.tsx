import { useState, type MouseEvent } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Chip,
} from "@mui/material"
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logout } from '../store/authSlice'

const Header = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const menuOpen = Boolean(anchorEl)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const goToApartments = (view: 'recommended' | 'all') => {
    setAnchorEl(null)
    navigate(`/?view=${view}`)
  }

  const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        color: 'text.primary',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          px: 5,
          py: 1.5,
          direction: 'rtl',
        }}
      >
        {/* Logo & Navigation */}
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          <Box
            component="img"
            src="/logo.png"
            alt="לוגו האתר"
            sx={{
              height: 45,
              width: 'auto',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.05)' },
            }}
            onClick={() => navigate('/')}
          />

          <Button
            onClick={handleMenuClick}
            sx={{
              color: 'text.secondary',
              textTransform: 'none',
              fontSize: 15,
              fontWeight: 600,
              p: 0,
            }}
          >
            הדירות שלנו ▼
          </Button>
          <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
            <MenuItem onClick={() => goToApartments('recommended')}>דירות מומלצות</MenuItem>
            <MenuItem onClick={() => goToApartments('all')}>כל הדירות</MenuItem>
          </Menu>

          {isAuthenticated && (
            <Button
              component={NavLink}
              to="/dashboard"
              sx={{
                color: 'text.secondary',
                textTransform: 'none',
                fontSize: 15,
                fontWeight: 500,
                '&.active': { color: 'primary.main', fontWeight: 700 },
              }}
            >
              אזור אישי
            </Button>
          )}

          {isAuthenticated && user?.role === 'Admin' && (
            <Button
              component={NavLink}
              to="/admin"
              sx={{
                color: 'text.secondary',
                textTransform: 'none',
                fontSize: 15,
                fontWeight: 500,
                '&.active': { color: 'primary.main', fontWeight: 700 },
              }}
            >
              לוח מנהל
            </Button>
          )}
        </Box>

        {/* User Section */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <Chip
                avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>{user?.name?.[0]}</Avatar>}
                label={user?.name}
                variant="outlined"
                color="primary"
              />
              <Button
                onClick={handleLogout}
                variant="outlined"
                color="error"
                sx={{ textTransform: 'none' }}
              >
                התנתק
              </Button>
            </>
          ) : (
            <Button
              component={NavLink}
              to="/login"
              variant="contained"
              color="primary"
              sx={{ textTransform: 'none' }}
            >
              התחברות
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
