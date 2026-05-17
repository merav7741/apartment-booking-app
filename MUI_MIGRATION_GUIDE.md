# 🎨 מדריך המיגרציה ל-MUI

## מה עשינו כבר?

✅ **App.tsx** - הוסף ThemeProvider  
✅ **theme.ts** - יצרנו קובץ עיצוב מרכזי  
✅ **Header.tsx** - המרנו לקומפוננטות MUI  

## איך להמשיך? 📖

### עיקרון בסיסי: תחליף `inline styles` ב-`sx` prop

**לפני (עם inline styles):**
```tsx
<div style={{
  padding: '12px',
  backgroundColor: '#2563eb',
  borderRadius: '8px',
  color: 'white'
}}>
  ...
</div>
```

**אחרי (עם MUI + sx prop):**
```tsx
import { Box } from '@mui/material'

<Box sx={{
  p: 1.5,
  backgroundColor: 'primary.main',
  borderRadius: 1,
  color: 'white'
}}>
  ...
</Box>
```

---

## 🔄 ספריות MUI שכדאי להכיר

### ה-building blocks:
- **`Box`** - דיו ל-`<div>` עם sx support
- **`Button`** - כפתורים עם variants (contained, outlined, text)
- **`Card`** - כרטיסים עם shadow וrounded edges
- **`Grid`** - responsive layouts
- **`Stack`** - flex layout קל (direction, gap)
- **`TextField`** - inputs עם validation
- **`Typography`** - טקסט עם מאפיינים
- **`Paper`** - wrapper עם elevation
- **`Chip`** - תגיות וbadges
- **`Avatar`** - תמונות עגולות

---

## 🎯 דוגמות לשימוש נפוצים

### 1. Grid responsive:
```tsx
import { Grid } from '@mui/material'

<Grid container spacing={2}>
  <Grid item xs={12} sm={6} md={4}>
    {/* תוכן - יתכווץ באתרים קטנים */}
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    {/* תוכן */}
  </Grid>
</Grid>
```

### 2. Stack (קל יותר מ-Grid):
```tsx
import { Stack } from '@mui/material'

<Stack direction="row" spacing={2} sx={{ direction: 'rtl' }}>
  <Box>תוכן 1</Box>
  <Box>תוכן 2</Box>
</Stack>
```

### 3. Buttons עם וריאנטים:
```tsx
<Button variant="contained">שמור</Button>
<Button variant="outlined">בטל</Button>
<Button variant="text">עוד</Button>

// עם צבעים:
<Button color="error" variant="contained">מחוק</Button>
<Button color="success" variant="contained">אישור</Button>
```

### 4. Cards:
```tsx
import { Card, CardContent, CardActions, Button } from '@mui/material'

<Card>
  <CardContent>
    <Typography>כותרת</Typography>
    <Typography>תוכן</Typography>
  </CardContent>
  <CardActions>
    <Button>פעולה</Button>
  </CardActions>
</Card>
```

---

## 📝 יחידות זמן ב-sx

בMUI יש קיצור ידי עבור padding, margin וגדלים:

```tsx
p={2}         // padding: theme.spacing(2) = 16px
m={1}         // margin: theme.spacing(1) = 8px
px={2}        // padding-x (left + right)
py={1}        // padding-y (top + bottom)
gap={3}       // גם spacing

// מדיה queries:
sx={{
  fontSize: { xs: '14px', sm: '16px', md: '18px' }
}}
```

---

## 🌍 כיווניות RTL (עבור עברית)

MUI תומך RTL במקום רחב! אבל בחלק מהמקומות צריך להוסיף `direction: 'rtl'`:

```tsx
<Box sx={{ direction: 'rtl', textAlign: 'right' }}>
  {/* תוכן עברי */}
</Box>
```

---

## 🚀 קומפוננטות להמיר בעדיפות

1. **UserDashboard.tsx** - הרבה cards ו-stats (קל!)
2. **ApartmentCard.tsx** - Card קטנה (קל!)
3. **Login.tsx** / **Register.tsx** - Forms (בינוני)
4. **BookingPage.tsx** - Forms ו-cards (בינוני)
5. **ReviewsSection.tsx** - Cards וRating (בינוני)

---

## ⚡ טיפים חשובים

### ✅ עשה זאת:
- השתמש `sx` prop לכל סגנון דינאמי
- השתמש theme colors: `primary.main`, `error.main`, `success.main`
- השתמש MUI components כמו `Stack` ו-`Box` במקום `<div>`
- בצע מיגרציה קומפוננטה בכל פעם

### ❌ אל תעשה:
- אל תשתמש `style={}` prop יותר מדי
- אל תכתוב CSS files חדשים
- אל תערבב inline styles ו-sx בתוך אותו קומפוננטה

---

## 🆘 דוגמה מלאה - AmenitiesGrid

```tsx
import { Grid, Box, Typography, Stack } from '@mui/material'

type AmenitiesGridProps = {
  characteristics?: string[]
}

const AMENITY_ICONS = {
  wifi: '📶', ac: '❄️', heating: '🔥', // ... etc
}

const AMENITY_LABELS = {
  wifi: 'WiFi', ac: 'מזגן', // ... etc
}

export default function AmenitiesGrid({ characteristics }: AmenitiesGridProps) {
  if (!characteristics?.length) {
    return (
      <Box
        sx={{
          color: '#64748b',
          p: 2,
          backgroundColor: '#f8fafc',
          borderRadius: 2,
          textAlign: 'center'
        }}
      >
        לא נבחרו מתקנים
      </Box>
    )
  }

  return (
    <Grid container spacing={1.5} sx={{ mb: 3 }}>
      {characteristics.map((item) => (
        <Grid item xs={6} sm={4} md={3} key={item}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              p: 1.75,
              borderRadius: 2,
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 15px rgba(15, 23, 42, 0.05)',
            }}
          >
            <Typography sx={{ fontSize: '18px' }}>
              {AMENITY_ICONS[item] || '✅'}
            </Typography>
            <Typography variant="body2">
              {AMENITY_LABELS[item] || item}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  )
}
```

---

## 📚 משאבים

- [MUI Components](https://mui.com/material-ui/react-box/)
- [MUI sx prop](https://mui.com/system/getting-started/the-sx-prop/)
- [Theme docs](https://mui.com/material-ui/customization/theming/)

---

**בהצלחה! 💪 בואו נשמור על הקוד נקי ויפה!**
