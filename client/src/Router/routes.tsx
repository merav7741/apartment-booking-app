import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import Home from '../pages/Home'
import SearchResults from '../pages/SearchResults'
import ApartmentDetails from '../pages/ApartmentDetails'
import UserDashboard from '../pages/UserDashboard'
import Login from '../pages/Login'
import Register from '../pages/Register'
import AddApartment from '../pages/AddApartment'
import EditApartment from '../pages/EditApartment'
import ProtectedRoute from '../components/ProtectedRoute'

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "apartment/:id", element: <ApartmentDetails /> },
      { path: "search", element: <SearchResults /> },
      
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        ),
        children: [
          // שים לב: כאן לא מוסיפים /dashboard/ בהתחלה כי זה בתוך children
          { path: "addApartment", element: <AddApartment /> },
          { path: "edit/:id", element: <EditApartment /> }
        ]
      }
    ]
  }
])

export default router