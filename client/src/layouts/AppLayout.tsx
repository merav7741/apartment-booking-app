import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

const AppLayout = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  )
}

export default AppLayout

