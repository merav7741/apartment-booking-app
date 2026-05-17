import { Box, Avatar, Typography, Paper } from '@mui/material'

type OwnerProfileCardProps = {
  ownerName: string
}

export default function OwnerProfileCard({ ownerName }: OwnerProfileCardProps) {
  const ownerInitial = ownerName?.trim()?.[0]?.toUpperCase() || 'ב'

  return (
    <Paper elevation={1} sx={{ display: 'flex', alignItems: 'center', gap: 2.5, p: 3, mb: 3, borderRadius: 6, border: 1, borderColor: 'divider' }}>
      <Avatar sx={{ width: 72, height: 72, bgcolor: 'primary.main', fontSize: 28, fontWeight: 700 }}>
        {ownerInitial}
      </Avatar>
      <Box>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
          בעל/ת הנכס
        </Typography>
        <Typography variant="h6" fontWeight={800} color="text.primary">
          {ownerName}
        </Typography>
      </Box>
    </Paper>
  )
}
