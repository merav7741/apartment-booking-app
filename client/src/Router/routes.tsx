import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import Home from '../pages/Home'
import ApartmentDetails from '../pages/ApartmentDetails'
import UserDashboard from '../components/UserDashboard'
import AdminDashboard from '../pages/AdminDashboard'
import Login from '../pages/Login'
import Register from '../pages/Register'
import AddApartment from '../pages/AddApartment'
import EditApartment from '../pages/EditApartment'
import BookingPage from '../pages/BookingPage'
import ProtectedRoute from '../components/ProtectedRoute'

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "apartment/:id", element: <ApartmentDetails /> },
      { path: "booking/:apartmentId", element: <BookingPage /> },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        ),
        children: [
          { path: "addApartment", element: <AddApartment /> },
          { path: "edit/:id", element: <EditApartment /> }
        ]
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        )
      }
    ]
  }
])

export default router
