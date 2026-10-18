import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function BottomNav() {
  const { user } = useAuth()
  const { count } = useCart()

  const items = [{ to: '/', label: 'Home', icon: '🏠' }]
  if (user?.role === 'CUSTOMER') {
    items.push({ to: '/cart', label: `Cart${count ? ` (${count})` : ''}`, icon: '🛒' })
    items.push({ to: '/orders', label: 'Orders', icon: '📋' })
    items.push({ to: '/profile', label: 'Profile', icon: '👤' })
  } else if (user?.role === 'RESTAURANT') {
    items.push({ to: '/owner', label: 'Orders', icon: '📋' })
    items.push({ to: '/owner/menu', label: 'Menu', icon: '🍴' })
    items.push({ to: '/profile', label: 'Profile', icon: '👤' })
  } else if (!user) {
    items.push({ to: '/login', label: 'Login', icon: '👤' })
  }

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t flex justify-around py-2 z-10">
      {items.map((i) => (
        <NavLink key={i.to} to={i.to} end
          className={({ isActive }) =>
            `flex flex-col items-center text-xs px-3 ${isActive ? 'text-orange-600 font-semibold' : 'text-gray-500'}`}>
          <span className="text-lg">{i.icon}</span>
          {i.label}
        </NavLink>
      ))}
    </nav>
  )
}