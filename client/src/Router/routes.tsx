import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import Home from '../pages/Home'
import SearchResults from '../pages/SearchResults'
import apartmentDetails from '../pages/ApartmentDetails'
import UserDashboard from '../pages/UserDashboard'
import Login from '../pages/Login'
import Register from '../pages/Register'
import AddApartment from '../pages/AddApartment'


const router = createBrowserRouter([
    {
        element: <AppLayout />, children: [
            { index: true, element: <Home /> },
            { path: "login", element: <Login /> },
            { path: "register", element: <Register />},
              {  path:"dashboard", element: <UserDashboard />,children:[
                {path:"addapartment",element:<Addapartment/>}
            ]},
            { path: "search", element: <SearchResults />,children:[
             { path: ":id", element: <apartmentDetails /> }
            ] }
             ]
    }
])

export default router

