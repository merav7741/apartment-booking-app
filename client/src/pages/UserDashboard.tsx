import { useEffect, useMemo, useState } from 'react'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import ApartmentCard from '../components/ApartmentCard'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchMyApartments } from '../store/apartmentSlice'
import type { Apartment } from '../types/apartment.types'
import type { User } from '../types/user.types'

type DashboardTab = 'apartments' | 'bookings' | 'profile'

const tabs: { id: DashboardTab; label: string }[] = [
  { id: 'apartments', label: 'הנכסים שלי' },
  { id: 'bookings', label: 'הזמנות נכנסות' },
  { id: 'profile', label: 'פרופיל' }
]

export default function UserDashboard() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { myApartments, loading } = useAppSelector((state) => state.apartments)
  const { user, isAuthenticated, token } = useAppSelector((state) => state.auth)

  const [activeTab, setActiveTab] = useState<DashboardTab>('apartments')
  const publishedCount = myApartments.length
  const recommendedCount = useMemo(
    () => myApartments.filter((apt) => apt.reviews?.some((review) => Number(review.rating) === 5)).length,
    [myApartments]
  )

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMyApartments())
    }
  }, [dispatch, isAuthenticated])

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!window.confirm('למחוק את הדירה לצמיתות?')) return

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/apartments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        await dispatch(fetchMyApartments())
      }
    } catch {
      alert('אירעה שגיאה במחיקת הדירה')
    }
  }

  const isEditingOrAdding = location.pathname.includes('/edit/') || location.pathname.includes('/addApartment')
  if (isEditingOrAdding) return <Outlet />

  return (
    <div style={pageStyle}>
      <header style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>אזור אישי</p>
          <h1 style={titleStyle}>שלום {user?.name}</h1>
        </div>
        <button onClick={() => navigate('/dashboard/addApartment')} style={addBtnStyle}>הוסף דירה חדשה</button>
      </header>

      <section style={statsGridStyle}>
        <div style={statBoxStyle}>
          <span style={statLabelStyle}>נכסים פעילים</span>
          <strong style={statValueStyle}>{publishedCount}</strong>
        </div>
        <div style={statBoxStyle}>
          <span style={statLabelStyle}>נכסים עם 5 כוכבים</span>
          <strong style={statValueStyle}>{recommendedCount}</strong>
        </div>
        <div style={statBoxStyle}>
          <span style={statLabelStyle}>סוג חשבון</span>
          <strong style={statValueStyle}>{user?.role === 'Admin' ? 'מנהל' : 'מנוי'}</strong>
        </div>
      </section>

      <div style={tabsStyle} role="tablist" aria-label="אזור אישי">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={activeTab === tab.id ? activeTabStyle : tabStyle}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <main style={panelStyle}>
        {activeTab === 'apartments' && (
          <ApartmentsTab
            apartments={myApartments}
            loading={loading}
            onEdit={(id) => navigate(`/dashboard/edit/${id}`)}
            onDelete={handleDelete}
            onOpen={(id) => navigate(`/apartment/${id}`)}
          />
        )}

        {activeTab === 'bookings' && (
          <BookingsTab apartmentsCount={myApartments.length} />
        )}

        {activeTab === 'profile' && (
          <ProfileTab user={user} />
        )}
      </main>
    </div>
  )
}

function ApartmentsTab({
  apartments,
  loading,
  onEdit,
  onDelete,
  onOpen
}: {
  apartments: Apartment[]
  loading: boolean
  onEdit: (id: string) => void
  onDelete: (e: React.MouseEvent, id: string) => void
  onOpen: (id: string) => void
}) {
  if (loading) return <p style={mutedTextStyle}>טוען נכסים...</p>

  return (
    <section>
      <div style={sectionHeaderStyle}>
        <h2 style={sectionTitleStyle}>הנכסים שפרסמת</h2>
      </div>

      {apartments.length > 0 ? (
        <div style={gridStyle}>
          {apartments.map((apt) => (
            <ApartmentWithActions
              key={apt._id}
              apartment={apt}
              onEdit={onEdit}
              onDelete={onDelete}
              onOpen={onOpen}
            />
          ))}
        </div>
      ) : (
        <div style={emptyStateStyle}>עדיין לא פרסמת דירות.</div>
      )}
    </section>
  )
}

function ApartmentWithActions({
  apartment,
  onEdit,
  onDelete,
  onOpen,
  ownerLabel
}: {
  apartment: Apartment
  onEdit: (id: string) => void
  onDelete: (e: React.MouseEvent, id: string) => void
  onOpen: (id: string) => void
  ownerLabel?: string
}) {
  return (
    <div style={cardShellStyle}>
      <div style={actionsStyle}>
        <button onClick={(e) => { e.stopPropagation(); onEdit(apartment._id) }} style={editBtnStyle}>ערוך</button>
        <button onClick={(e) => onDelete(e, apartment._id)} style={deleteBtnStyle}>מחק</button>
      </div>
      {ownerLabel && <div style={ownerTagStyle}>בעלים: {ownerLabel}</div>}
      <ApartmentCard apartment={apartment} onClick={onOpen} />
    </div>
  )
}

function BookingsTab({ apartmentsCount }: { apartmentsCount: number }) {
  return (
    <section>
      <h2 style={sectionTitleStyle}>הזמנות נכנסות</h2>
      <div style={emptyStateStyle}>
        אין עדיין הזמנות נכנסות להצגה. ברגע שמודול הזמנות יחובר לשרת, כאן יוצגו בקשות לפי הנכסים שלך.
        {apartmentsCount > 0 && <div style={smallNoteStyle}>יש לך {apartmentsCount} נכסים מוכנים לקבלת הזמנות.</div>}
      </div>
    </section>
  )
}

function ProfileTab({ user }: { user: User | null }) {
  return (
    <section>
      <h2 style={sectionTitleStyle}>פרופיל</h2>
      <div style={profileGridStyle}>
        <ProfileField label="שם מלא" value={user?.name} />
        <ProfileField label="אימייל" value={user?.email} />
        <ProfileField label="טלפון" value={user?.phone} />
        <ProfileField label="הרשאה" value={user?.role === 'Admin' ? 'מנהל' : 'מנוי'} />
      </div>
    </section>
  )
}

function ProfileField({ label, value }: { label: string; value?: string }) {
  return (
    <div style={profileFieldStyle}>
      <span style={statLabelStyle}>{label}</span>
      <strong style={profileValueStyle}>{value || 'לא הוזן'}</strong>
    </div>
  )
}

export function AdminApartments({
  apartments,
  userId,
  onEdit,
  onDelete,
  onOpen
}: {
  apartments: Apartment[]
  userId: string
  onEdit: (id: string) => void
  onDelete: (e: React.MouseEvent, id: string) => void
  onOpen: (id: string) => void
}) {
  const getOwnerLabel = (apt: Apartment) => {
    const apartmentOwnerId = typeof apt.ownerId === 'object' ? apt.ownerId._id : apt.ownerId
    if (String(apartmentOwnerId) === String(userId)) return 'אני'
    if (typeof apt.ownerId === 'object') return apt.ownerId.fullName || apt.ownerId.name || 'משתמש אחר'
    return 'משתמש אחר'
  }

  return (
    <section style={adminSectionStyle}>
      <div style={sectionHeaderStyle}>
        <h2 style={{ ...sectionTitleStyle, color: '#991b1b' }}>ניהול כלל הדירות במערכת</h2>
      </div>

      <div style={gridStyle}>
        {apartments.map((apt) => (
          <ApartmentWithActions
            key={apt._id}
            apartment={apt}
            ownerLabel={getOwnerLabel(apt)}
            onEdit={onEdit}
            onDelete={onDelete}
            onOpen={onOpen}
          />
        ))}
      </div>
    </section>
  )
}

const pageStyle: React.CSSProperties = {
  padding: '32px 24px 60px',
  maxWidth: '1220px',
  margin: '0 auto',
  direction: 'rtl',
  textAlign: 'right'
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '20px',
  marginBottom: '24px',
  flexWrap: 'wrap'
}

const eyebrowStyle: React.CSSProperties = {
  margin: '0 0 6px',
  color: '#2563eb',
  fontWeight: 700,
  fontSize: '14px'
}

const titleStyle: React.CSSProperties = {
  margin: 0,
  color: '#111827',
  fontSize: '32px',
  fontWeight: 800
}

const addBtnStyle: React.CSSProperties = {
  padding: '12px 22px',
  backgroundColor: '#10b981',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 700
}

const statsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
  gap: '14px',
  marginBottom: '22px'
}

const statBoxStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '18px',
  boxShadow: '0 8px 22px rgba(15, 23, 42, 0.05)'
}

const statLabelStyle: React.CSSProperties = {
  display: 'block',
  color: '#64748b',
  fontSize: '13px',
  marginBottom: '8px',
  fontWeight: 600
}

const statValueStyle: React.CSSProperties = {
  color: '#111827',
  fontSize: '26px',
  fontWeight: 800
}

const tabsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  backgroundColor: '#eef2f7',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '6px',
  marginBottom: '20px',
  overflowX: 'auto'
}

const tabStyle: React.CSSProperties = {
  border: 'none',
  backgroundColor: 'transparent',
  color: '#475569',
  padding: '11px 18px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 700,
  whiteSpace: 'nowrap'
}

const activeTabStyle: React.CSSProperties = {
  ...tabStyle,
  backgroundColor: '#ffffff',
  color: '#2563eb',
  boxShadow: '0 6px 16px rgba(15, 23, 42, 0.08)'
}

const panelStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '24px',
  boxShadow: '0 10px 28px rgba(15, 23, 42, 0.06)'
}

const sectionHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '16px',
  marginBottom: '18px'
}

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  color: '#111827',
  fontSize: '22px',
  fontWeight: 800
}

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '24px'
}

const cardShellStyle: React.CSSProperties = {
  position: 'relative',
  minWidth: 0
}

const actionsStyle: React.CSSProperties = {
  position: 'absolute',
  top: '10px',
  left: '10px',
  zIndex: 30,
  display: 'flex',
  gap: '8px'
}

const editBtnStyle: React.CSSProperties = {
  padding: '6px 12px',
  backgroundColor: '#2563eb',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: 700
}

const deleteBtnStyle: React.CSSProperties = {
  ...editBtnStyle,
  backgroundColor: '#ef4444'
}

const ownerTagStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '112px',
  right: '10px',
  zIndex: 20,
  backgroundColor: '#334155',
  color: 'white',
  padding: '4px 10px',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: 700
}

const emptyStateStyle: React.CSSProperties = {
  border: '1px dashed #cbd5e1',
  borderRadius: '8px',
  backgroundColor: '#f8fafc',
  color: '#475569',
  padding: '34px 24px',
  textAlign: 'center',
  fontSize: '16px',
  lineHeight: 1.7
}

const smallNoteStyle: React.CSSProperties = {
  marginTop: '8px',
  color: '#2563eb',
  fontWeight: 700
}

const profileGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '14px'
}

const profileFieldStyle: React.CSSProperties = {
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '18px',
  backgroundColor: '#f8fafc'
}

const profileValueStyle: React.CSSProperties = {
  color: '#111827',
  fontSize: '17px',
  fontWeight: 800,
  wordBreak: 'break-word'
}

const adminSectionStyle: React.CSSProperties = {
  marginTop: '24px',
  padding: '24px',
  backgroundColor: '#fff7f7',
  border: '1px solid #fecaca',
  borderRadius: '8px'
}

const mutedTextStyle: React.CSSProperties = {
  color: '#64748b',
  fontSize: '16px'
}
