import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import Home from '../pages/Home'
import SearchResults from '../pages/SearchResults'
import PropertyDetails from '../pages/PropertyDetails'
import UserDashboard from '../pages/UserDashboard'
import Login from '../pages/Login'
import Register from '../pages/Register'
import AddProperty from '../pages/AddProperty'


const router = createBrowserRouter([
    {
        element: <AppLayout />, children: [
            { index: true, element: <Home /> },
            { path: "login", element: <Login /> },
            { path: "register", element: <Register />},
              {  path:"dashboard", element: <UserDashboard />,children:[
                {path:"addproperty",element:<AddProperty/>}
            ]},
            { path: "search", element: <SearchResults />,children:[
             { path: ":id", element: <PropertyDetails /> }
            ] }
             ]
    }
])

export default router

