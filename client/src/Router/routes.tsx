import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import Home from '../pages/Home'
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
      }
    ]
  }
])

export default router