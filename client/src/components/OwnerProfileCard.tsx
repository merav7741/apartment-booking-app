import React from 'react'

type OwnerProfileCardProps = {
  ownerName: string
}

export default function OwnerProfileCard({ ownerName }: OwnerProfileCardProps) {
  const ownerInitial = ownerName?.trim()?.[0]?.toUpperCase() || 'ב'

  return (
    <div style={profileCardStyle}>
      <div style={avatarStyle}>{ownerInitial}</div>
      <div>
        <div style={profileRoleStyle}>בעל/ת הנכס</div>
        <div style={profileNameStyle}>{ownerName}</div>
      </div>
    </div>
  )
}

const profileCardStyle = { display: 'flex', alignItems: 'center', gap: '18px', padding: '22px', marginBottom: '24px', backgroundColor: 'white', borderRadius: '24px', border: '1px solid #e5e7eb', boxShadow: '0 18px 30px rgba(15,23,42,0.05)' };
const avatarStyle = { width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#2563eb', color: 'white', display: 'grid', placeItems: 'center', fontSize: '28px', fontWeight: '700' };
const profileRoleStyle = { color: '#6b7280', fontSize: '13px', marginBottom: '6px' };
const profileNameStyle = { fontSize: '20px', fontWeight: '800', color: '#111827' };
