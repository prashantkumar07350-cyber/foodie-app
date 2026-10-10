import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Home() {
  const [restaurants, setRestaurants] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Restaurants</h1>
      <input
        placeholder="Restaurant, cuisine ya city search karo..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-6 bg-white"
      />

      {error && <p className="bg-red-100 text-red-700 p-2 rounded">{error}</p>}
      {loading && <p className="text-gray-500">Loading...</p>}
      {!loading && !error && restaurants.length === 0 && (
        <p className="text-gray-500">Koi restaurant nahi mila.</p>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {restaurants.map((r) => (
          <div key={r.id} className="bg-white rounded shadow overflow-hidden">
            {r.image ? (
              <img src={r.image} alt={r.name} className="h-40 w-full object-cover" />
            ) : (
              <div className="h-40 bg-orange-100 flex items-center justify-center text-5xl">🍽️</div>
            )}
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h2 className="font-bold text-lg">{r.name}</h2>
                <span className={`text-xs px-2 py-1 rounded ${r.is_open ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                  {r.is_open ? 'Open' : 'Closed'}
                </span>
              </div>
              <p className="text-sm text-gray-600">{r.cuisine} • {r.city}</p>
              <p className="text-sm text-gray-500 mt-1">
                Delivery Rs {r.delivery_fee} • Min order Rs {r.min_order}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}