import { useEffect, useMemo, useState } from 'react'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import ApartmentCard from '../components/ApartmentCard'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchMyApartments } from '../store/apartmentSlice'
import { updateProfile } from '../store/authSlice'
import { fetchMyBookings, fetchIncomingBookings, updateBookingStatus } from '../store/bookingSlice'
import type { Apartment } from '../types/apartment.types'
import type { User } from '../types/user.types'

type DashboardTab = 'apartments' | 'myBookings' | 'bookings' | 'profile'

const tabs: { id: DashboardTab; label: string }[] = [
  { id: 'apartments', label: 'הנכסים שלי' },
  { id: 'myBookings', label: 'הזמנות שלי' },
  { id: 'bookings', label: 'הזמנות נכנסות' },
  { id: 'profile', label: 'פרופיל' }
]

export default function UserDashboard() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { myApartments, loading } = useAppSelector((state) => state.apartments)
  const { user, isAuthenticated, token } = useAppSelector((state) => state.auth)
  const { incomingBookings, myBookings } = useAppSelector((state) => state.bookings)

  const [activeTab, setActiveTab] = useState<DashboardTab>('apartments')
  const pendingCount = incomingBookings.filter((b) => b.status === 'Pending Approval').length
  const publishedCount = myApartments.length
  const recentBookings = useMemo(() => {
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

    return myBookings.filter((booking) => {
      const bookingDate = new Date(booking.startDate)
      return bookingDate >= ninetyDaysAgo
    })
  }, [myBookings])

  const recommendedCount = useMemo(
    () => myApartments.filter((apt) => apt.reviews?.some((review) => Number(review.rating) === 5)).length,
    [myApartments]
  )

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMyApartments())
      dispatch(fetchIncomingBookings())
      dispatch(fetchMyBookings())
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
          <span style={statLabelStyle}>הזמנות אחרונות</span>
          <strong style={statValueStyle}>{recentBookings.length}</strong>
        </div>
        <div style={statBoxStyle}>
          <span style={statLabelStyle}>הזמנות נכנסות</span>
          <strong style={statValueStyle}>{incomingBookings.length}</strong>
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
            {tab.id === 'bookings' && pendingCount > 0 && (
              <span style={badgeStyle}>{pendingCount}</span>
            )}
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

        {activeTab === 'myBookings' && (
          <MyBookingsTab bookings={myBookings} />
        )}

        {activeTab === 'bookings' && (
          <BookingsTab bookings={incomingBookings} onStatusChange={(bookingId, status) => {
            dispatch(updateBookingStatus({ bookingId, status }))
          }} />
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

function MyBookingsTab({ bookings }: { bookings: any[] }) {
  const sortedBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  if (sortedBookings.length === 0) {
    return (
      <section>
        <h2 style={sectionTitleStyle}>הזמנות שלי</h2>
        <div style={emptyStateStyle}>
          אין הזמנות בחודשים האחרונים. ברגע שתבצעו הזמנה, היא תופיע כאן.
        </div>
      </section>
    )
  }

  return (
    <section>
      <h2 style={sectionTitleStyle}>הזמנות שלי</h2>
      <div style={bookingsGridStyle}>
        {sortedBookings.map((booking) => (
          <div key={booking._id} style={{
            ...bookingCardStyle,
            borderRight: booking.status === 'Canceled' ? '4px solid #ef4444' : bookingCardStyle.borderRight
          }}>
            <div style={bookingHeaderStyle}>
              <div>
                <h3 style={bookingApartmentStyle}>{booking.apartmentId?.name || 'דירה לא זמינה'}</h3>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>
                  📍 {booking.apartmentId?.address || ''}
                </p>
              </div>
              <div style={{ ...statusBadgeStyle, backgroundColor: getStatusColor(booking.status) }}>
                {getStatusLabel(booking.status)}
              </div>
            </div>

            <div style={bookingDetailsStyle}>
              <div style={detailRowStyle}>
                <span style={detailLabelStyle}>🗓️ התחלה</span>
                <span style={detailValueStyle}>{new Date(booking.startDate).toLocaleDateString('he-IL')}</span>
              </div>
              <div style={detailRowStyle}>
                <span style={detailLabelStyle}>🗓️ סיום</span>
                <span style={detailValueStyle}>{new Date(booking.endDate).toLocaleDateString('he-IL')}</span>
              </div>
              <div style={detailRowStyle}>
                <span style={detailLabelStyle}>🌙 לילות</span>
                <span style={detailValueStyle}>{booking.numberOfNights}</span>
              </div>
              <div style={detailRowStyle}>
                <span style={detailLabelStyle}>💰 סה"כ</span>
                <span style={{ ...detailValueStyle, fontWeight: 'bold', color: '#10b981' }}>₪{booking.totalPrice?.toLocaleString()}</span>
              </div>
            </div>

            {booking.status === 'Canceled' && (
              <div style={{ padding: '10px', backgroundColor: '#fef2f2', borderRadius: '6px', fontSize: '13px', color: '#991b1b' }}>
                ❌ הזמנה זו בוטלה
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function BookingsTab({ 
  bookings,
  onStatusChange
}: { 
  bookings: any[]
  onStatusChange: (bookingId: string, status: string) => void
}) {
  if (bookings.length === 0) {
    return (
      <section>
        <h2 style={sectionTitleStyle}>הזמנות נכנסות</h2>
        <div style={emptyStateStyle}>
          אין עדיין הזמנות נכנסות להצגה. ברגע שהאורחים שלך יבצעו הזמנות, הן יופיעו כאן.
        </div>
      </section>
    )
  }

  return (
    <section>
      <h2 style={sectionTitleStyle}>הזמנות נכנסות</h2>
      <div style={bookingsGridStyle}>
        {bookings.map((booking) => (
          <div key={booking._id} style={bookingCardStyle}>
            <div style={bookingHeaderStyle}>
              <div>
                <h3 style={bookingApartmentStyle}>{booking.apartmentId?.name || 'דירה'}</h3>
                <p style={bookingGuestStyle}>
                  👤 {booking.customerId?.name || 'אורח'}
                </p>
              </div>
              <div style={{ ...statusBadgeStyle, backgroundColor: getStatusColor(booking.status) }}>
                {getStatusLabel(booking.status)}
              </div>
            </div>

            <div style={bookingDetailsStyle}>
              <div style={detailRowStyle}>
                <span style={detailLabelStyle}>🗓️ תאריך התחלה</span>
                <span style={detailValueStyle}>
                  {new Date(booking.startDate).toLocaleDateString('he-IL')}
                </span>
              </div>
              <div style={detailRowStyle}>
                <span style={detailLabelStyle}>🗓️ תאריך סיום</span>
                <span style={detailValueStyle}>
                  {new Date(booking.endDate).toLocaleDateString('he-IL')}
                </span>
              </div>
              <div style={detailRowStyle}>
                <span style={detailLabelStyle}>🌙 מספר לילות</span>
                <span style={detailValueStyle}>{booking.numberOfNights}</span>
              </div>
              <div style={detailRowStyle}>
                <span style={detailLabelStyle}>💰 סה"כ תשלום</span>
                <span style={{ ...detailValueStyle, fontWeight: 'bold', color: '#10b981' }}>
                  ₪{booking.totalPrice.toLocaleString()}
                </span>
              </div>
              <div style={detailRowStyle}>
                <span style={detailLabelStyle}>📧 אימייל האורח</span>
                <span style={detailValueStyle}>{booking.customerId?.email}</span>
              </div>
              <div style={detailRowStyle}>
                <span style={detailLabelStyle}>📱 טלפון האורח</span>
                <span style={detailValueStyle}>{booking.customerId?.phone || 'לא ידוע'}</span>
              </div>
            </div>

            {booking.status === 'Pending Approval' && (
              <div style={actionButtonsStyle}>
                <button
                  onClick={() => onStatusChange(booking._id, 'Approved')}
                  style={approveButtonStyle}
                  type="button"
                >
                  ✓ אשר הזמנה
                </button>
                <button
                  onClick={() => onStatusChange(booking._id, 'Canceled')}
                  style={cancelButtonStyle}
                  type="button"
                >
                  ✕ דחה הזמנה
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'Approved':
      return '#10b981'
    case 'Pending Approval':
      return '#f59e0b'
    case 'Canceled':
      return '#ef4444'
    default:
      return '#6b7280'
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'Approved':
      return 'מאושר'
    case 'Pending Approval':
      return 'בהמתנה'
    case 'Canceled':
      return 'בוטל'
    default:
      return status
  }
}

function ProfileTab({ user }: { user: User | null }) {
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
    } catch {
      // error is handled by slice state
    }
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
      <section>
        <h2 style={sectionTitleStyle}>פרופיל</h2>
        <div style={emptyStateStyle}>לא נמצא משתמש. היכנס שוב כדי להציג את הפרופיל.</div>
      </section>
    )
  }

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <h2 style={sectionTitleStyle}>פרופיל</h2>
        {!isEditing && (
          <button type="button" onClick={() => setIsEditing(true)} style={editBtnStyle}>
            ערוך פרופיל
          </button>
        )}
      </div>

      {successMessage && <div style={successMessageStyle}>{successMessage}</div>}
      {error && <div style={errorMessageStyle}>{error}</div>}

      {isEditing ? (
        <form onSubmit={handleSubmit} style={profileFormStyle}>
          <label style={formLabelStyle}>
            שם מלא
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
              required
            />
          </label>
          <label style={formLabelStyle}>
            אימייל
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              required
            />
          </label>
          <label style={formLabelStyle}>
            טלפון
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={inputStyle}
            />
          </label>

          <div style={formActionsStyle}>
            <button type="button" onClick={handleCancel} style={cancelButtonStyle}>
              בטל
            </button>
            <button type="submit" disabled={loading} style={saveButtonStyle}>
              שמור עדכון
            </button>
          </div>
        </form>
      ) : (
        <div style={profileGridStyle}>
          <ProfileField label="שם מלא" value={user.name} />
          <ProfileField label="אימייל" value={user.email} />
          <ProfileField label="טלפון" value={user.phone} />
          <ProfileField label="הרשאה" value={user.role === 'Admin' ? 'מנהל' : 'מנוי'} />
        </div>
      )}
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

const profileFormStyle: React.CSSProperties = {
  display: 'grid',
  gap: '16px',
  marginTop: '20px'
}

const formLabelStyle: React.CSSProperties = {
  display: 'grid',
  gap: '8px',
  fontWeight: 700,
  color: '#111827'
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontSize: '15px'
}

const formActionsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px',
  flexWrap: 'wrap'
}

const saveButtonStyle: React.CSSProperties = {
  ...editBtnStyle,
  backgroundColor: '#10b981'
}
const cancelButtonStyle: React.CSSProperties = {
  ...editBtnStyle,
  backgroundColor: '#64748b'
}

const successMessageStyle: React.CSSProperties = {
  marginTop: '16px',
  padding: '12px 16px',
  borderRadius: '8px',
  backgroundColor: '#ecfdf5',
  color: '#065f46',
  border: '1px solid #6ee7b7'
}

const errorMessageStyle: React.CSSProperties = {
  marginTop: '16px',
  padding: '12px 16px',
  borderRadius: '8px',
  backgroundColor: '#fef2f2',
  color: '#991b1b',
  border: '1px solid #fecaca'
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

const bookingsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: '20px'
}

const bookingCardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '18px',
  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
  transition: 'all 0.2s'
}

const bookingHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '12px',
  marginBottom: '16px',
  paddingBottom: '16px',
  borderBottom: '1px solid #f3f4f6'
}

const bookingApartmentStyle: React.CSSProperties = {
  margin: '0 0 6px 0',
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#1f2937'
}

const bookingGuestStyle: React.CSSProperties = {
  margin: '0',
  fontSize: '13px',
  color: '#6b7280'
}

const statusBadgeStyle: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: '600',
  color: 'white',
  whiteSpace: 'nowrap'
}

const bookingDetailsStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  marginBottom: '16px'
}

const detailRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '13px'
}

const detailLabelStyle: React.CSSProperties = {
  color: '#6b7280',
  fontWeight: '500'
}

const detailValueStyle: React.CSSProperties = {
  color: '#1f2937',
  fontWeight: '600',
  textAlign: 'left'
}

const actionButtonsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '10px',
  paddingTop: '16px',
  borderTop: '1px solid #f3f4f6'
}

const approveButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: '10px 16px',
  backgroundColor: '#10b981',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s'
}

const cancelButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: '10px 16px',
  backgroundColor: '#ef4444',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s'
}

const badgeStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '6px',
  backgroundColor: '#ef4444',
  color: 'white',
  borderRadius: '999px',
  fontSize: '11px',
  fontWeight: 700,
  minWidth: '18px',
  height: '18px',
  padding: '0 5px'
}
