import { useState, useEffect } from 'react'
import { Box, Typography, Button, TextField, Alert, Card } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { updateProfile } from '../../store/authSlice'
import type { User } from '../../types/user.types'

interface ProfileTabProps {
  user: User | null
}

export default function ProfileTab({ user }: ProfileTabProps) {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.auth)
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setPhone(user.phone)
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSuccessMessage(null)
    if (!user) return

    try {
      await dispatch(updateProfile({ name, email, phone })).unwrap()
      setSuccessMessage('הפרופיל עודכן בהצלחה')
      setIsEditing(false)
    } catch { }
  }

  const handleCancel = () => {
    setIsEditing(false)
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setPhone(user.phone)
    }
    setSuccessMessage(null)
  }

  if (!user) {
    return (
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>פרופיל</Typography>
        <Alert severity="warning" variant="outlined" sx={{ borderRadius: 2 }}>לא נמצא משתמש. היכנס שוב כדי להציג את הפרופיל.</Alert>
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>פרופיל משתמש</Typography>
        {!isEditing && (
          <Button variant="outlined" color="primary" startIcon={<EditIcon />} onClick={() => setIsEditing(true)} sx={{ borderRadius: 2, fontWeight: 700 }}>
            ערוך פרופיל
          </Button>
        )}
      </Box>

      {successMessage && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{successMessage}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      {isEditing ? (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, maxWidth: 500 }}>
          <TextField label="שם מלא" fullWidth variant="outlined" value={name} onChange={(e) => setName(e.target.value)} required InputProps={{ sx: { borderRadius: 2 } }} />
          <TextField label="אימייל" type="email" fullWidth variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} required InputProps={{ sx: { borderRadius: 2 } }} />
          <TextField label="טלפון" type="tel" fullWidth variant="outlined" value={phone} onChange={(e) => setPhone(e.target.value)} InputProps={{ sx: { borderRadius: 2 } }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
            <Button variant="outlined" color="inherit" onClick={handleCancel} sx={{ borderRadius: 2 }}>בטל</Button>
            <Button variant="contained" color="success" type="submit" disabled={loading} sx={{ borderRadius: 2, fontWeight: 700 }}>שמור עדכון</Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 2 }}>
          <ProfileFieldItem label="שם מלא" value={user.name} />
          <ProfileFieldItem label="אימייל" value={user.email} />
          <ProfileFieldItem label="טלפון" value={user.phone} />
          <ProfileFieldItem label="הרשאה" value={user.role === 'Admin' ? 'מנהל' : 'מנוי'} />
        </Box>
      )}
    </Box>
  )
}

function ProfileFieldItem({ label, value }: { label: string; value?: string }) {
  return (
    <Card variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>{label}</Typography>
      <Typography variant="body1" sx={{ fontWeight: 800, color: 'text.primary', wordBreak: 'break-word' }}>{value || 'לא הוזן'}</Typography>
    </Card>
  )
}