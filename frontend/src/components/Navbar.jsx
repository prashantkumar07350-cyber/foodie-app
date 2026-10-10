import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-orange-600">
          🍔 Foodie
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <span className="text-gray-600">
                {user.first_name || user.email} ({user.role})
              </span>
              <button onClick={handleLogout} className="bg-gray-800 text-white px-3 py-1 rounded">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700">Login</Link>
              <Link to="/register" className="bg-orange-600 text-white px-3 py-1 rounded">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}