import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const link = ({ isActive }) =>
    `pb-1 border-b-2 ${isActive ? 'text-[#e8c07d] border-[#e8c07d]' : 'text-white/80 border-transparent hover:text-white'}`

  return (
    <nav className="bg-[#0d2620] text-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link to="/" className="leading-tight">
          <span className="font-display text-2xl font-bold italic">🍽️ The Good Plate</span>
          <span className="block text-[10px] text-white/70">Good Food • Great Mood</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm">
          <NavLink to="/" end className={link}>Home</NavLink>
          {user?.role === 'CUSTOMER' && (
            <>
              <NavLink to="/orders" className={link}>My Orders</NavLink>
              <NavLink to="/booking" className={link}>Book a Table</NavLink>
            </>
          )}
          {user?.role === 'RESTAURANT' && (
            <>
              <NavLink to="/owner" end className={link}>Dashboard</NavLink>
              <NavLink to="/owner/menu" className={link}>Menu</NavLink>
              <NavLink to="/owner/bookings" className={link}>Bookings</NavLink>
            </>
          )}
          {user?.role === 'ADMIN' && <NavLink to="/admin-panel" className={link}>Admin</NavLink>}
        </div>

        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <Link to="/profile" className="hidden sm:inline text-white/80 hover:text-white">
                {user.first_name || user.email}
              </Link>
              {user.role === 'CUSTOMER' && (
                <Link to="/cart" className="bg-[#e8c07d] text-[#0d2620] font-semibold px-4 py-2 rounded-full">
                  🛒 Cart ({count})
                </Link>
              )}
              <button onClick={handleLogout} className="border border-white/40 px-3 py-2 rounded-full">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white/90">Login</Link>
              <Link to="/register" className="bg-[#e8c07d] text-[#0d2620] font-semibold px-4 py-2 rounded-full">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}