import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const ONGOING = ['PLACED', 'ACCEPTED', 'PREPARING', 'OUT_FOR_DELIVERY']

const COLORS = {
  PLACED: 'bg-blue-100 text-blue-700',
  ACCEPTED: 'bg-indigo-100 text-indigo-700',
  PREPARING: 'bg-yellow-100 text-yellow-800',
  OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-gray-200 text-gray-600',
  REJECTED: 'bg-red-100 text-red-700',
}

const LABELS = {
  OUT_FOR_DELIVERY: 'On the way',
}

export default function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [tab, setTab] = useState('ongoing')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const { data } = await api.get('/orders/')
      setOrders(data)
    } catch {
      setError('Orders load nahi hue.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) return undefined
    load()
    const t = setInterval(load, 15000)
    return () => clearInterval(t)
  }, [user])

  if (!user) return <Navigate to="/login" />

  const cancel = async (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    if (!window.confirm('Ye order cancel karein?')) return
    try {
      await api.post('/orders/' + id + '/cancel/')
      load()
    } catch {
      setError('Cancel nahi ho paya.')
    }
  }

  const shown = orders.filter((o) =>
    tab === 'ongoing' ? ONGOING.includes(o.status) : !ONGOING.includes(o.status),
  )

  const tabClass = (name) =>
    'flex-1 py-2 rounded-full text-sm font-medium ' +
    (tab === name ? 'bg-orange-600 text-white' : 'text-gray-600')

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="font-display text-3xl font-bold text-orange-600 mb-4">My Orders</h1>

      <div className="flex bg-white rounded-full p-1 shadow-sm mb-4">
        <button className={tabClass('ongoing')} onClick={() => setTab('ongoing')}>Ongoing</button>
        <button className={tabClass('past')} onClick={() => setTab('past')}>Past Orders</button>
      </div>

      {error && <p className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">{error}</p>}
      {loading && <p className="text-gray-500">Loading...</p>}
      {!loading && shown.length === 0 && (
        <div className="text-center mt-10 text-gray-500">
          <p className="text-5xl mb-2">🧾</p>
          <p>{tab === 'ongoing' ? 'Koi ongoing order nahi.' : 'Abhi koi purana order nahi.'}</p>
          <Link to="/" className="text-orange-600 text-sm">Restaurants dekho</Link>
        </div>
      )}

      <div className="space-y-3">
        {shown.map((o) => {
          const first = o.items[0]
          const more = o.items.length - 1
          return (
            <Link key={o.id} to={'/orders/' + o.id}
              className="block bg-white rounded-2xl shadow-sm p-4 hover:shadow-md">
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">#GP{String(o.id).padStart(6, '0')}</p>
                  <p className="font-semibold truncate">{o.restaurant_name}</p>
                </div>
                <span className={'text-xs px-2 py-1 rounded-full whitespace-nowrap ' + COLORS[o.status]}>
                  {LABELS[o.status] || o.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {first ? first.name + ' x ' + first.quantity : ''}
                {more > 0 ? ' + ' + more + ' more' : ''}
              </p>
              <p className="text-xs text-gray-400">{new Date(o.created_at).toLocaleString()}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="font-bold">Rs {o.total}</span>
                {o.status === 'PLACED' && (
                  <button onClick={(e) => cancel(e, o.id)}
                    className="text-sm text-red-600 border border-red-300 px-3 py-1 rounded-lg">
                    Cancel
                  </button>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}