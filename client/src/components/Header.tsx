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
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.94)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #e5e7eb",
        color: "text.primary",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "12px 40px",
          direction: "rtl",
        }}
      >
        {/* Logo & Navigation */}
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, alignItems: 'center' }}>
          <Box
            component="img"
            src="/logo.png"
            alt="לוגו האתר"
            sx={{
              height: "45px",
              width: "auto",
              cursor: "pointer",
              transition: "transform 0.2s",
              "&:hover": { transform: "scale(1.05)" },
            }}
            onClick={() => navigate("/")}
          />

          {/* Apartments Dropdown */}
          <Box>
            <Button
              id="apartments-button"
              aria-controls={menuOpen ? "apartments-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={menuOpen ? "true" : undefined}
              onClick={handleMenuClick}
              sx={{
                color: "#4b5563",
                textTransform: "none",
                fontSize: "15px",
                fontWeight: 600,
                padding: 0,
              }}
            >
              הדירות שלנו ▼
            </Button>
            <Menu
              id="apartments-menu"
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => goToApartments("recommended")}>
                דירות מומלצות
              </MenuItem>
              <MenuItem onClick={() => goToApartments("all")}>
                כל הדירות
              </MenuItem>
            </Menu>
          </Box>

          {/* Dashboard Link */}
          {isAuthenticated && (
            <Button
              component={NavLink}
              to="/dashboard"
              sx={{
                textDecoration: "none",
                color: "#4b5563",
                textTransform: "none",
                fontSize: "15px",
                fontWeight: 500,
                "&.active": {
                  color: "primary.main",
                  fontWeight: 700,
                },
              }}
            >
              אזור אישי
            </Button>
          )}

          {/* Admin Link */}
          {isAuthenticated && user?.role === "Admin" && (
            <Button
              component={NavLink}
              to="/admin"
              sx={{
                textDecoration: "none",
                color: "#4b5563",
                textTransform: "none",
                fontSize: "15px",
                fontWeight: 500,
                "&.active": {
                  color: "primary.main",
                  fontWeight: 700,
                },
              }}
            >
              לוח מנהל
            </Button>
          )}
        </Box>

        {/* User Section */}
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <Chip
                avatar={<Avatar>{user?.name?.[0]}</Avatar>}
                label={user?.name}
                variant="outlined"
              />
              <Button
                onClick={handleLogout}
                variant="outlined"
                color="error"
                sx={{ textTransform: "none" }}
              >
                התנתק
              </Button>
            </>
          ) : (
            <Button
              component={NavLink}
              to="/login"
              variant="contained"
              sx={{ textTransform: "none" }}
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
