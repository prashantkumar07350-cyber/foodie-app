import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const NAVY = '#17152E'
const DROPDOWN = '#24213F'
const LAVENDER = '#B7A5FF'
const CORAL = '#FF8066'
const TEXT = '#F7F5FF'

function displayName(user) {
  const full = ((user.first_name || '') + ' ' + (user.last_name || '')).trim()
  return full || (user.email ? user.email.split('@')[0] : 'My Account')
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()
  const menuRef = useRef(null)

  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('goodplate-theme')
      if (saved) return saved === 'dark'
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    } catch {
      return false
    }
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    document.documentElement.style.colorScheme = darkMode ? 'dark' : 'light'
    try {
      localStorage.setItem('goodplate-theme', darkMode ? 'dark' : 'light')
    } catch {
      /* theme still works for this session */
    }
  }, [darkMode])

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setProfileOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setProfileOpen(false)
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const role = user ? user.role : null
  const isAdmin = role === 'ADMIN'
  const isOwner = role === 'RESTAURANT'
  const isCustomer = role === 'CUSTOMER'

  const closeMenus = () => {
    setMobileOpen(false)
    setProfileOpen(false)
  }

  const handleLogout = () => {
    closeMenus()
    logout()
    navigate('/login')
  }

  let links
  if (isAdmin) {
    links = [{ label: 'Dashboard', path: '/admin-panel' }]
  } else if (isOwner) {
    links = [
      { label: 'Dashboard', path: '/owner' },
      { label: 'Manage Menu', path: '/owner/menu' },
      { label: 'Bookings', path: '/owner/bookings' },
    ]
  } else {
    // Services, Menu, Contact pages abhi bane nahi (404 aayega, baad mein banenge)
    links = [
      { label: 'Home', path: '/' },
      { label: 'About', path: '/about' },
      { label: 'Services', path: '/services' },
      { label: 'Menu', path: '/menu' },
      ...(isCustomer ? [{ label: 'My Orders', path: '/orders' }] : []),
      { label: 'Book a Table', path: '/booking' },
      { label: 'Contact', path: '/contact' },
    ]
  }

  const linkClass = (mobile) => ({ isActive }) =>
    'whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold transition ' +
    (mobile ? 'block w-full ' : '') +
    (isActive ? 'bg-white/10 text-[#B7A5FF]' : 'text-[#F7F5FF] hover:bg-white/10')

  const renderLinks = (mobile) =>
    links.map((item) => (
      <NavLink key={item.path} to={item.path} end={item.path === '/'}
        onClick={closeMenus} className={linkClass(mobile)}>
        {item.label}
      </NavLink>
    ))

  const initial = user ? displayName(user).charAt(0).toUpperCase() : ''
  const menuItem = 'block px-4 py-3 text-sm transition hover:bg-white/10'

  const themeButton = (
    <button type="button" onClick={() => setDarkMode(!darkMode)}
      aria-label={'Switch to ' + (darkMode ? 'light' : 'dark') + ' mode'}
      title={'Switch to ' + (darkMode ? 'light' : 'dark') + ' mode'}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 text-xl transition hover:bg-white/10"
      style={{ color: LAVENDER }}>
      {darkMode ? '☀️' : '🌙'}
    </button>
  )

  return (
    <header className="sticky top-0 z-50 w-full shadow-lg"
      style={{ backgroundColor: NAVY, color: TEXT }}>
      <nav className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link to={isAdmin ? '/admin-panel' : isOwner ? '/owner' : '/'} onClick={closeMenus}
          className="flex shrink-0 items-center gap-3" aria-label="The Good Plate home">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl text-2xl shadow-md"
            style={{ backgroundColor: CORAL, color: NAVY }}>🍽️</span>
          <span className="flex flex-col leading-tight">
            <span className="text-xl font-extrabold tracking-tight sm:text-2xl">
              The Good <span style={{ color: LAVENDER }}>Plate</span>
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.24em] text-white/60 sm:block">
              Good food, good mood
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 xl:flex">{renderLinks(false)}</div>

        {/* Desktop actions */}
        <div className="hidden shrink-0 items-center gap-3 xl:flex">
          {!user && (
            <>
              <Link to="/register"
                className="rounded-xl px-4 py-2.5 text-sm font-bold shadow-md transition hover:-translate-y-0.5"
                style={{ backgroundColor: CORAL, color: NAVY }}>
                Register
              </Link>
              <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-semibold hover:bg-white/10">
                Login
              </Link>
            </>
          )}

          {isCustomer && (
            <Link to="/cart"
              className="relative flex items-center gap-2 rounded-xl px-3 py-2 font-semibold hover:bg-white/10"
              aria-label={'Cart, ' + count + ' items'}>
              <span className="text-xl">🛒</span>
              <span className="text-sm">Cart</span>
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold"
                  style={{ backgroundColor: CORAL, color: NAVY }}>
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </Link>
          )}

          {user && (
            <div className="relative" ref={menuRef}>
              <button type="button" onClick={() => setProfileOpen(!profileOpen)}
                aria-expanded={profileOpen} aria-haspopup="menu"
                className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 hover:bg-white/10">
                <span className="flex h-9 w-9 items-center justify-center rounded-full font-bold"
                  style={{ backgroundColor: LAVENDER, color: NAVY }}>
                  {initial}
                </span>
                <span className="max-w-28 truncate text-sm font-semibold">{displayName(user)}</span>
                <span className="text-xs">⌄</span>
              </button>

              {profileOpen && (
                <div role="menu"
                  className="absolute right-0 top-full mt-3 w-60 overflow-hidden rounded-2xl border border-white/10 py-2 shadow-2xl"
                  style={{ backgroundColor: DROPDOWN }}>
                  <div className="border-b border-white/10 px-4 py-3">
                    <p className="truncate text-sm font-bold">{displayName(user)}</p>
                    <p className="truncate text-xs text-white/60">{user.email}</p>
                  </div>
                  <Link to="/profile" onClick={closeMenus} className={menuItem}>👤 My Profile</Link>
                  {isCustomer && (
                    <>
                      <Link to="/orders" onClick={closeMenus} className={menuItem}>📦 Order History</Link>
                      <Link to="/addresses" onClick={closeMenus} className={menuItem}>📍 Saved Addresses</Link>
                    </>
                  )}
                  <Link to="/help" onClick={closeMenus} className={menuItem}>❓ Help &amp; Support</Link>
                  <button type="button" onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-sm font-semibold hover:bg-white/10"
                    style={{ color: CORAL }}>
                    ↪ Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {themeButton}
        </div>

        {/* Mobile actions */}
        <div className="flex shrink-0 items-center gap-2 xl:hidden">
          {isCustomer && (
            <Link to="/cart" onClick={closeMenus} aria-label={'Cart, ' + count + ' items'}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl hover:bg-white/10">
              <span className="text-xl">🛒</span>
              {count > 0 && (
                <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold"
                  style={{ backgroundColor: CORAL, color: NAVY }}>
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </Link>
          )}
          {themeButton}
          <button type="button" onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-2xl hover:bg-white/10">
            {mobileOpen ? '×' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 px-4 pb-5 pt-3 shadow-xl sm:px-6 xl:hidden"
          style={{ backgroundColor: DROPDOWN }}>
          <div className="flex flex-col gap-1">{renderLinks(true)}</div>

          {!user && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link to="/register" onClick={closeMenus}
                className="rounded-xl px-4 py-3 text-center text-sm font-bold"
                style={{ backgroundColor: CORAL, color: NAVY }}>
                Register
              </Link>
              <Link to="/login" onClick={closeMenus}
                className="rounded-xl border border-white/20 px-4 py-3 text-center text-sm font-semibold">
                Login
              </Link>
            </div>
          )}

          {user && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full font-bold"
                  style={{ backgroundColor: LAVENDER, color: NAVY }}>
                  {initial}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{displayName(user)}</p>
                  <p className="truncate text-xs text-white/60">{user.email}</p>
                </div>
              </div>
              <Link to="/profile" onClick={closeMenus} className="block rounded-xl px-3 py-3 text-sm hover:bg-white/10">
                👤 My Profile
              </Link>
              {isCustomer && (
                <Link to="/addresses" onClick={closeMenus} className="block rounded-xl px-3 py-3 text-sm hover:bg-white/10">
                  📍 Saved Addresses
                </Link>
              )}
              <Link to="/help" onClick={closeMenus} className="block rounded-xl px-3 py-3 text-sm hover:bg-white/10">
                ❓ Help &amp; Support
              </Link>
              <button type="button" onClick={handleLogout}
                className="mt-2 w-full rounded-xl px-3 py-3 text-left text-sm font-semibold hover:bg-white/10"
                style={{ color: CORAL }}>
                ↪ Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}