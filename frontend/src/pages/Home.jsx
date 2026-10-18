import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

const FEATURES = [
  { icon: '🍴', title: 'Fresh Ingredients', text: 'We use only the freshest and finest ingredients.' },
  { icon: '👨‍🍳', title: 'Expert Chefs', text: 'Our chefs bring years of experience and passion.' },
  { icon: '🌿', title: 'Cozy Ambiance', text: 'A perfect place for family, friends and special moments.' },
  { icon: '⭐', title: 'Excellent Service', text: 'Your satisfaction is our top priority.' },
]

export default function Home() {
  const [restaurants, setRestaurants] = useState([])
  const [popular, setPopular] = useState([])
  const [search, setSearch] = useState('')
  const [cuisine, setCuisine] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/menu/popular/').then((r) => setPopular(r.data)).catch(() => setPopular([]))
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

  const cuisines = useMemo(
    () => ['All', ...new Set(restaurants.map((r) => r.cuisine))],
    [restaurants],
  )
  const shown = cuisine === 'All' ? restaurants : restaurants.filter((r) => r.cuisine === cuisine)

  return (
    <div>
      {/* HERO (poori width) */}
      <section
        className="w-screen ml-[calc(50%-50vw)] -mt-6 text-white"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(8,24,20,.92) 35%, rgba(8,24,20,.45)), url(/hero.jpg), linear-gradient(135deg,#0d2620,#1f4a3d)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <p className="text-[#e8c07d] tracking-[0.3em] text-xs mb-4">FINE DINING EXPERIENCE</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">
            Good Food<br />
            Creates <span className="text-[#e8c07d]">Great Moments</span>
          </h1>
          <p className="mt-5 max-w-md text-white/85">
            Hum sirf khana nahi, yaadein serve karte hain. Apne pasandida restaurants se
            fresh khana order karo, seedha ghar tak.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#restaurants"
              className="bg-[#e8c07d] text-[#0d2620] font-semibold px-6 py-3 rounded-full">
              Explore Our Menu →
            </a>
            <Link to="/booking"
              className="border border-white/70 px-6 py-3 rounded-full">
              Book a Table 📅
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="w-screen ml-[calc(50%-50vw)] bg-[#faf8f3]">
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
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

      {/* POPULAR DISHES */}
      {popular.length > 0 && (
        <section className="mt-6 max-w-6xl mx-auto">
          <p className="text-[#a8793a] tracking-[0.25em] text-xs">OUR SPECIALTIES</p>
          <div className="flex items-center gap-4 mb-5">
            <h2 className="font-display text-3xl font-bold text-orange-600">Popular Dishes</h2>
            <div className="flex-1 h-px bg-[#a8793a]/50 hidden sm:block" />
            <a href="#restaurants" className="text-sm border border-orange-600 text-orange-600 px-4 py-1.5 rounded-full">
              View All →
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popular.map((d, idx) => (
              <Link key={d.id} to={`/restaurant/${d.restaurant_id}`}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md">
                <div className="relative h-36 bg-orange-100 flex items-center justify-center text-5xl">
                  {d.image ? (
                    <img src={d.image} alt={d.name} className="h-full w-full object-cover" />
                  ) : '🍽️'}
                  {idx === 0 && (
                    <span className="absolute top-2 left-2 bg-[#e8c07d] text-[#0d2620] text-xs px-2 py-1 rounded-full font-medium">
                      Most Popular
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <div className="flex justify-between gap-2 text-sm font-medium">
                    <span>
                      <span className={d.is_veg ? 'text-green-600' : 'text-red-600'}>●</span> {d.name}
                    </span>
                    <span className="text-[#a8793a]">Rs {d.price}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{d.restaurant_name}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* RESTAURANTS */}
      <section id="restaurants" className="mt-12 max-w-6xl mx-auto scroll-mt-4">
        <p className="text-[#a8793a] tracking-[0.25em] text-xs">ORDER ONLINE</p>
        <h2 className="font-display text-3xl font-bold text-orange-600 mb-4">Our Restaurants</h2>

        <input
          placeholder="Restaurant, cuisine ya city search karo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 mb-4 bg-white"
        />

        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {cuisines.map((c) => (
            <button key={c} onClick={() => setCuisine(c)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap border ${
                cuisine === c ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-gray-700'}`}>
              {c}
            </button>
          ))}
        </div>

        {error && <p className="bg-red-100 text-red-700 p-2 rounded">{error}</p>}
        {loading && <p className="text-gray-500">Loading...</p>}
        {!loading && !error && shown.length === 0 && <p className="text-gray-500">Koi restaurant nahi mila.</p>}

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {shown.map((r) => (
            <Link key={r.id} to={`/restaurant/${r.id}`}
              className="block bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md">
              {r.image ? (
                <img src={r.image} alt={r.name} className="h-40 w-full object-cover" />
              ) : (
                <div className="h-40 bg-orange-50 flex items-center justify-center text-5xl">🍽️</div>
              )}
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg">{r.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    r.is_open ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
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