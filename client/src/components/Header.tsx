import { NavLink } from "react-router-dom"

const Header = () => {
  return (
    <nav>
<div>
<NavLink to='/'>Home page</NavLink>
</div>

<div>
<NavLink to='/search'>To search</NavLink>
</div>

<div>
<NavLink to='/dashboard'>הדשבורד שלי</NavLink>
</div>

<div>
<NavLink to='/login'>התחברות</NavLink>
</div>
    </nav>
  )
}

export default Header