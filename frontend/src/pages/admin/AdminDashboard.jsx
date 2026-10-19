import { useCallback, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

const COLORS = {
  PLACED: 'bg-blue-100 text-blue-700',
  ACCEPTED: 'bg-indigo-100 text-indigo-700',
  PREPARING: 'bg-yellow-100 text-yellow-800',
  OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-gray-200 text-gray-600',
  REJECTED: 'bg-red-100 text-red-700',
}

function Stat({ label, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-orange-600">{value}</p>
    </div>
  )
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [restaurants, setRestaurants] = useState([])
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      const [s, r] = await Promise.all([
        api.get('/admin-panel/stats/'),
        api.get('/admin-panel/restaurants/'),
      ])
      setStats(s.data)
      setRestaurants(r.data)
    } catch {
      setError('Data load nahi hua.')
    }
  }, [])

  useEffect(() => {
    if (user && user.role === 'ADMIN') load()
  }, [user, load])

  if (!user || user.role !== 'ADMIN') return <Navigate to="/login" />

  const approve = async (id, approved) => {
    await api.post('/admin-panel/restaurants/' + id + '/approve/', { approved })
    load()
  }

  return (
    <div className="max-w-4xl mx-auto pb-6">
      <h1 className="font-display text-3xl font-bold text-orange-600 mb-4">Admin Dashboard</h1>
      {error && <p className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">{error}</p>}
      {!stats && !error && <p className="text-gray-500">Loading...</p>}

      {stats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="Total Users" value={stats.users} />
            <Stat label="Customers" value={stats.customers} />
            <Stat label="Restaurants" value={stats.restaurants} />
            <Stat label="Approval Pending" value={stats.pending_restaurants} />
            <Stat label="Total Orders" value={stats.orders} />
            <Stat label="Revenue (Delivered)" value={'Rs ' + stats.revenue} />
          </div>

          <h2 className="font-semibold text-lg mt-8 mb-2">Restaurants</h2>
          <div className="space-y-2">
            {restaurants.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl shadow-sm p-3 flex justify-between items-center gap-2 text-sm">
                <div className="min-w-0">
                  <p className="font-semibold truncate">{r.name}</p>
                  <p className="text-xs text-gray-500 truncate">{r.owner} • {r.cuisine} • {r.city}</p>
                </div>
                {r.is_approved ? (
                  <button onClick={() => approve(r.id, false)}
                    className="border border-red-300 text-red-600 px-3 py-1 rounded-lg whitespace-nowrap">
                    Unapprove
                  </button>
                ) : (
                  <button onClick={() => approve(r.id, true)}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg whitespace-nowrap">
                    Approve
                  </button>
                )}
              </div>
            ))}
          </div>

          <h2 className="font-semibold text-lg mt-8 mb-2">Latest Orders</h2>
          <div className="space-y-2">
            {stats.latest_orders.length === 0 && <p className="text-gray-500 text-sm">Abhi koi order nahi.</p>}
            {stats.latest_orders.map((o) => (
              <div key={o.id} className="bg-white rounded-2xl shadow-sm p-3 flex justify-between items-center text-sm">
                <div>
                  <p className="font-semibold">#GP{String(o.id).padStart(6, '0')} • {o.restaurant}</p>
                  <p className="text-xs text-gray-500">{o.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">Rs {o.total}</p>
                  <span className={'text-xs px-2 py-0.5 rounded-full ' + COLORS[o.status]}>{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}