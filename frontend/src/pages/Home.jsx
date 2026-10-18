import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const GOLD = 'text-[#e8c07d]'
const CARD = 'bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md'

const FEATURES = [
  { icon: '🍴', title: 'Fresh Ingredients', text: 'Sirf sabse taaza samaan.' },
  { icon: '👨‍🍳', title: 'Expert Chefs', text: 'Saalon ka tajurba aur junoon.' },
  { icon: '🌿', title: 'Cozy Ambiance', text: 'Family aur dosto ke liye.' },
  { icon: '⭐', title: 'Great Service', text: 'Aapki khushi hamari priority.' },
]

const HERO_BG =
  'linear-gradient(90deg, rgba(8,24,20,.92) 40%, rgba(8,24,20,.5)), ' +
  'url(/hero.jpg), linear-gradient(135deg,#0d2620,#1f4a3d)'

export default function Home() {
  const { user } = useAuth()
  const { addItem } = useCart()
  const navigate = useNavigate()

  const [restaurants, setRestaurants] = useState([])
  const [popular, setPopular] = useState([])
  const [search, setSearch] = useState('')
  const [cuisine, setCuisine] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => {
    api.get('/menu/popular/')
      .then((r) => setPopular(r.data))
      .catch(() => setPopular([]))
  }, [])

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true)
      setError('')
      try {
        const { data } = await api.get('/restaurants/', { params: { search } })
        setRestaurants(data)
      } catch {
        setError('Restaurants load nahi hue. Backend server chal raha hai?')
      } finally {
        setLoading(false)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    if (!toast) return undefined
    const t = setTimeout(() => setToast(''), 2500)
    return () => clearTimeout(t)
  }, [toast])

  const cuisines = useMemo(
    () => ['All', ...new Set(restaurants.map((r) => r.cuisine))],
    [restaurants],
  )
  const shown =
    cuisine === 'All' ? restaurants : restaurants.filter((r) => r.cuisine === cuisine)

  const quickAdd = async (e, dish) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) return navigate('/login')
    if (user.role !== 'CUSTOMER') return setToast('Sirf customer cart use kar sakta hai.')
    try {
      await addItem(dish.id, 1)
      setToast(dish.name + ' cart mein add ho gaya')
    } catch (err) {
      setToast(err.response?.data?.detail || 'Add nahi ho paya.')
    }
  }

  return (
    <div>
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#163a2f] text-white text-sm px-4 py-2 rounded-full shadow-lg">
          {toast}
        </div>
      )}

      {/* HERO */}
      <section
        className="w-screen ml-[calc(50%-50vw)] -mt-6 text-white"
        style={{ backgroundImage: HERO_BG, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="max-w-6xl mx-auto px-5 py-12 md:py-24">
          <p className={'tracking-[0.3em] text-xs mb-3 ' + GOLD}>FINE DINING EXPERIENCE</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">
            Good Food<br />
            Great <span className={GOLD}>Vibes</span>
          </h1>
          <p className="mt-4 max-w-md text-white/85 text-sm md:text-base">
            Enjoy the best dining experience with us. Apne pasandida restaurants
            se order karo, seedha ghar tak.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <a href="#restaurants"
              className="bg-[#e8c07d] text-[#0d2620] font-semibold px-6 py-3 rounded-full">
              Explore Restaurants
            </a>
            <Link to="/booking" className="border border-white/70 px-6 py-3 rounded-full">
              Book a Table
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES (desktop) */}
      <section className="hidden md:block w-screen ml-[calc(50%-50vw)] bg-[#faf8f3]">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-4 gap-6 text-center">
          {FEATURES.map((f) => (
            <div key={f.title}>
              <div className="w-14 h-14 mx-auto rounded-full bg-orange-50 flex items-center justify-center text-2xl">
                {f.icon}
              </div>
              <h3 className="font-semibold mt-3 text-orange-600">{f.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CUISINE CHIPS */}
      <section className="max-w-6xl mx-auto mt-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {cuisines.map((c) => (
            <button key={c} onClick={() => setCuisine(c)}
              className={
                'px-5 py-2 rounded-full text-sm whitespace-nowrap border ' +
                (cuisine === c
                  ? 'bg-orange-600 text-white border-orange-600'
                  : 'bg-white text-gray-700')
              }>
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* POPULAR DISHES */}
      {popular.length > 0 && (
        <section className="max-w-6xl mx-auto mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-2xl font-bold text-orange-600">Popular Dishes</h2>
            <a href="#restaurants" className="text-sm text-orange-600">See All</a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popular.map((d, idx) => (
              <Link key={d.id} to={'/restaurant/' + d.restaurant_id} className={CARD}>
                <div className="relative h-32 md:h-36 bg-orange-100 flex items-center justify-center text-5xl">
                  {d.image
                    ? <img src={d.image} alt={d.name} className="h-full w-full object-cover" />
                    : '🍽️'}
                  {idx === 0 && (
                    <span className="absolute top-2 left-2 bg-[#e8c07d] text-[#0d2620] text-xs px-2 py-1 rounded-full font-medium">
                      Most Popular
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium truncate">
                    <span className={d.is_veg ? 'text-green-600' : 'text-red-600'}>●</span>{' '}
                    {d.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{d.restaurant_name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-semibold text-[#a8793a]">Rs {d.price}</span>
                    <button onClick={(e) => quickAdd(e, d)}
                      className="w-8 h-8 rounded-full bg-orange-600 text-white text-lg leading-none">
                      +
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* RESTAURANTS */}
      <section id="restaurants" className="max-w-6xl mx-auto mt-10 scroll-mt-4">
        <h2 className="font-display text-2xl font-bold text-orange-600 mb-3">Our Restaurants</h2>
        <input
          placeholder="Restaurant, cuisine ya city search karo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 mb-4 bg-white"
        />

        {error && <p className="bg-red-100 text-red-700 p-2 rounded">{error}</p>}
        {loading && <p className="text-gray-500">Loading...</p>}
        {!loading && !error && shown.length === 0 && (
          <p className="text-gray-500">Koi restaurant nahi mila.</p>
        )}

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {shown.map((r) => (
            <Link key={r.id} to={'/restaurant/' + r.id} className={CARD}>
              {r.image ? (
                <img src={r.image} alt={r.name} className="h-40 w-full object-cover" />
              ) : (
                <div className="h-40 bg-orange-50 flex items-center justify-center text-5xl">🍽️</div>
              )}
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg">{r.name}</h3>
                  <span className={
                    'text-xs px-2 py-1 rounded-full ' +
                    (r.is_open ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600')
                  }>
                    {r.is_open ? 'Open' : 'Closed'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{r.cuisine} • {r.city}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Delivery Rs {r.delivery_fee} • Min Rs {r.min_order}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}