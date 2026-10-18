import { Route, Routes, useLocation } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Navbar from './components/Navbar'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Home from './pages/Home'
import Login from './pages/Login'
import Menu from './pages/Menu'
import Orders from './pages/Orders'
import Register from './pages/Register'
import Splash from './pages/Splash'
import Dashboard from './pages/owner/Dashboard'
import MenuManage from './pages/owner/MenuManage'

// In pages par Navbar aur BottomNav nahi dikhte (full-screen pages)
const BARE_PAGES = ['/splash']

export default function App() {
  const { pathname } = useLocation()
  const bare = BARE_PAGES.includes(pathname)

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {!bare && <Navbar />}
      <main className={bare ? '' : 'max-w-5xl mx-auto px-4 py-6 pb-24 md:pb-6'}>
        <Routes>
          <Route path="/splash" element={<Splash />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/restaurant/:id" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/owner" element={<Dashboard />} />
          <Route path="/owner/menu" element={<MenuManage />} />
        </Routes>
      </main>
      {!bare && <BottomNav />}
    </div>
  )
}