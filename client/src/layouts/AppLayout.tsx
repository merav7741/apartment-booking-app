import { Outlet } from 'react-router-dom'
import Header from '../components/Header' 

 const AppLayout = () => {
  return (
    <div className="app-layout">
        <Header />
        <Outlet />
    </div>
  )
}

export default AppLayout

