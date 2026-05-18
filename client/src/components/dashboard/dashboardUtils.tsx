import React from 'react';
import { Box, Typography } from '@mui/material';

export function getStatusColor(status: string): string {
  switch (status) {
    case 'Approved': return '#10b981';
    case 'Pending Approval': return '#f59e0b';
    case 'Canceled': return '#ef4444';
    default: return '#6b7280';
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'Approved': return 'מאושר';
    case 'Pending Approval': return 'בהמתנה';
    case 'Canceled': return 'בוטל';
    default: return status;
  }
}

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string | number;
  isPrice?: boolean;
}

export function DetailRow({ icon, label, value, isPrice }: DetailRowProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', gap: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: 'inherit' }}>
        {icon} {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: isPrice ? 800 : 600, color: isPrice ? 'success.main' : 'text.primary', fontSize: 'inherit', textAlign: 'left' }}>
        {value || 'לא ידוע'}
      </Typography>
    </Box>
  );
}