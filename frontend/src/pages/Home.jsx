import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import PopularDishes from '../components/PopularDishes'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const GOLD = 'text-[#e8c07d]'
const CARD = 'block overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg'

const FEATURES = [
  { icon: '🍴', title: 'Fresh Ingredients', text: 'Sirf sabse taaza samaan.' },
  { icon: '👨‍🍳', title: 'Expert Chefs', text: 'Saalon ka tajurba aur junoon.' },
  { icon: '🌿', title: 'Cozy Ambiance', text: 'Family aur dosto ke liye.' },
  { icon: '⭐', title: 'Great Service', text: 'Aapki khushi hamari priority.' },
]

const U = 'https://images.unsplash.com/'
const HERO_SLIDES = [
  {
    image: U + 'photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=2000&q=80',
    label: 'FRESHLY PREPARED',
    title: 'Good Food',
    highlight: 'Great Vibes',
    description: 'Delicious food aur aapke favourite restaurants, sab ek hi jagah.',
  },
  {
    image: U + 'photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=2000&q=80',
    label: 'FRESH & HEALTHY',
    title: 'Eat Fresh',
    highlight: 'Feel Good',
    description: 'Fresh ingredients aur tasty meals ke saath har din special banao.',
  },
  {
    image: U + 'photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=2000&q=80',
    label: 'MADE FOR FOOD LOVERS',
    title: 'Big Flavours',
    highlight: 'Happy Moments',
    description: 'Cravings chahe jo bhi ho, apni pasand ka khana aasani se order karo.',
  },
]

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
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    api.get('/menu/popular/')
      .then((r) => setPopular(Array.isArray(r.data) ? r.data : []))
      .catch(() => setPopular([]))
  }, [])

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true)
      setError('')
      try {
        const { data } = await api.get('/restaurants/', { params: { search } })
        setRestaurants(Array.isArray(data) ? data : [])
      } catch {
        setError('Restaurants load nahi hue. Backend server chal raha hai?')
        setRestaurants([])
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
    () => ['All', ...new Set(restaurants.map((r) => r.cuisine).filter(Boolean))],
    [restaurants],
  )
  const shown = cuisine === 'All' ? restaurants : restaurants.filter((r) => r.cuisine === cuisine)

  // true = add ho gaya, false = nahi hua (PopularDishes isi se "Added" dikhata hai)
  const quickAdd = async (dish) => {
    if (!user) {
      navigate('/login')
      return false
    }
    if (user.role !== 'CUSTOMER') {
      setToast('Sirf customer cart use kar sakta hai.')
      return false
    }
    try {
      await addItem(dish.id, 1)
      setToast(dish.name + ' cart mein add ho gaya')
      return true
    } catch (err) {
      const res = err.response
      setToast((res && res.data && res.data.detail) || 'Add nahi ho paya.')
      return false
    }
  }

  const s = HERO_SLIDES[slide]

  return (
    <div>
      {toast && (
        <div role="status"
          className="fixed left-1/2 top-24 z-50 -translate-x-1/2 rounded-full bg-[#163a2f] px-5 py-3 text-sm text-white shadow-xl">
          {toast}
        </div>
      )}

      {/* HERO CAROUSEL */}
      <section
        className="relative -mt-6 ml-[calc(50%-50vw)] min-h-[440px] w-screen overflow-hidden bg-[#0d2620] text-white md:min-h-[560px]"
        aria-label="Featured food">
        {HERO_SLIDES.map((h, i) => (
          <div key={h.image} aria-hidden="true"
            className={'absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ' +
              (slide === i ? 'opacity-100' : 'opacity-0')}
            style={{ backgroundImage: 'url("' + h.image + '")' }} />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-[#081812]/95 via-[#081812]/70 to-[#081812]/20" />

        <div className="relative mx-auto flex min-h-[440px] max-w-6xl items-center px-5 py-14 md:min-h-[560px]">
          <div className="max-w-2xl">
            <p className={'mb-4 text-xs font-semibold tracking-[0.3em] ' + GOLD}>{s.label}</p>
            <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl md:text-7xl">
              {s.title}<br />
              <span className={GOLD}>{s.highlight}</span>
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-white/90 md:text-lg">{s.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#restaurants"
                className="rounded-full bg-[#e8c07d] px-6 py-3.5 font-bold text-[#0d2620] shadow-lg">
                Explore Restaurants →
              </a>
              <Link to="/booking" className="rounded-full border border-white/70 px-6 py-3.5">
                Book a Table
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {HERO_SLIDES.map((h, i) => (
            <button key={h.image} type="button" aria-label={'Slide ' + (i + 1)}
              onClick={() => setSlide(i)}
              className={'h-2.5 rounded-full transition-all ' +
                (slide === i ? 'w-8 bg-[#e8c07d]' : 'w-2.5 bg-white/70')} />
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="ml-[calc(50%-50vw)] w-screen bg-[#faf8f3]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 text-center md:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title}>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-2xl">
                {f.icon}
              </div>
              <h3 className="mt-3 font-semibold text-orange-600">{f.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* POPULAR DISHES (asli data) */}
      <PopularDishes dishes={popular} onAddToCart={quickAdd} />

      {/* RESTAURANTS */}
      <section id="restaurants" className="mx-auto mb-12 mt-10 max-w-6xl scroll-mt-4">
        <p className="text-xs font-semibold tracking-[0.25em] text-[#a8793a]">ORDER ONLINE</p>
        <h2 className="font-display mb-4 text-3xl font-bold text-orange-600">Our Restaurants</h2>

        <input type="search" aria-label="Search restaurants"
          placeholder="Restaurant, cuisine ya city search karo..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="mb-4 w-full rounded-lg border border-gray-200 bg-white px-4 py-3" />

        <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
          {cuisines.map((c) => (
            <button key={c} type="button" onClick={() => setCuisine(c)}
              className={'whitespace-nowrap rounded-full border px-5 py-2 text-sm ' +
                (cuisine === c ? 'border-orange-600 bg-orange-600 text-white' : 'bg-white text-gray-700')}>
              {c}
            </button>
          ))}
        </div>

        {error && <p role="alert" className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">{error}</p>}
        {loading && <p className="text-gray-500">Loading...</p>}
        {!loading && !error && shown.length === 0 && <p className="text-gray-500">Koi restaurant nahi mila.</p>}

        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {shown.map((r) => (
            <Link key={r.id} to={'/restaurant/' + r.id} className={CARD}>
              {r.image ? (
                <img src={r.image} alt={r.name} loading="lazy" className="h-44 w-full object-cover" />
              ) : (
                <div className="flex h-44 items-center justify-center bg-orange-50 text-5xl">🍽️</div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold">{r.name}</h3>
                  <span className={'shrink-0 rounded-full px-2 py-1 text-xs ' +
                    (r.is_open ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600')}>
                    {r.is_open ? 'Open' : 'Closed'}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {r.cuisine} • {r.city}
                  {Number(r.avg_rating) > 0 && (
                    <span> • <span className="text-[#e8a317]">★</span> {r.avg_rating}</span>
                  )}
                </p>
                <p className="mt-1 text-sm text-gray-500">
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