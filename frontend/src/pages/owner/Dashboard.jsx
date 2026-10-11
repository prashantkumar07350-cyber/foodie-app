import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

const ACTIONS = {
  PLACED: [
    { status: 'ACCEPTED', label: 'Accept', cls: 'bg-green-600' },
    { status: 'REJECTED', label: 'Reject', cls: 'bg-red-600' },
  ],
  ACCEPTED: [{ status: 'PREPARING', label: 'Start preparing', cls: 'bg-yellow-600' }],
  PREPARING: [{ status: 'OUT_FOR_DELIVERY', label: 'Out for delivery', cls: 'bg-purple-600' }],
  OUT_FOR_DELIVERY: [{ status: 'DELIVERED', label: 'Mark delivered', cls: 'bg-green-700' }],
}

const colors = {
  PLACED: 'bg-blue-100 text-blue-700',
  ACCEPTED: 'bg-indigo-100 text-indigo-700',
  PREPARING: 'bg-yellow-100 text-yellow-800',
  OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-gray-200 text-gray-600',
  REJECTED: 'bg-red-100 text-red-700',
}

const emptyForm = {
  name: '', cuisine: '', phone: '', address: '', city: '', pincode: '',
  delivery_fee: '30', min_order: '150',
}

export default function Dashboard() {
  const { user } = useAuth()
  const [restaurant, setRestaurant] = useState(null)
  const [checked, setChecked] = useState(false)
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)

  const loadRestaurant = useCallback(async () => {
    try {
      const { data } = await api.get('/restaurants/mine/')
      setRestaurant(data)
    } catch {
      setRestaurant(null)
    } finally {
      setChecked(true)
    }
  }, [])

  const loadOrders = useCallback(async () => {
    try {
      const { data } = await api.get('/orders/restaurant/', { params: filter ? { status: filter } : {} })
      setOrders(data)
    } catch {
      /* ignore, next poll will retry */
    }
  }, [filter])

  useEffect(() => {
    loadRestaurant()
  }, [loadRestaurant])

  // Naye orders ke liye har 10 second mein refresh
  useEffect(() => {
    if (!restaurant) return
    loadOrders()
    const t = setInterval(loadOrders, 10000)
    return () => clearInterval(t)
  }, [restaurant, loadOrders])

  if (!user || user.role !== 'RESTAURANT') return <Navigate to="/login" />

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const createRestaurant = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/restaurants/', form)
      setRestaurant(data)
    } catch (err) {
      const d = err.response?.data
      setError(d ? Object.values(d).flat().join(' ') : 'Restaurant nahi bana.')
    }
  }

  const toggleOpen = async () => {
    const { data } = await api.patch(`/restaurants/${restaurant.id}/`, { is_open: !restaurant.is_open })
    setRestaurant(data)
  }

  const changeStatus = async (id, status) => {
    setError('')
    try {
      await api.post(`/orders/${id}/status/`, { status })
      loadOrders()
    } catch (err) {
      setError(err.response?.data?.detail || 'Status badal nahi paya.')
    }
  }

  if (!checked) return <p className="text-gray-500">Loading...</p>

  if (!restaurant) {
    const input = 'w-full border rounded px-3 py-2'
    return (
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-1">Apna restaurant banao</h1>
        <p className="text-sm text-gray-500 mb-4">Admin approve karega, uske baad customers ko dikhega.</p>
        {error && <p className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">{error}</p>}
        <form onSubmit={createRestaurant} className="space-y-3">
          <input name="name" placeholder="Restaurant name" required value={form.name} onChange={update} className={input} />
          <input name="cuisine" placeholder="Cuisine (North Indian)" required value={form.cuisine} onChange={update} className={input} />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={update} className={input} />
          <input name="address" placeholder="Address" required value={form.address} onChange={update} className={input} />
          <div className="flex gap-2">
            <input name="city" placeholder="City" required value={form.city} onChange={update} className={input} />
            <input name="pincode" placeholder="Pincode" required value={form.pincode} onChange={update} className={input} />
          </div>
          <div className="flex gap-2">
            <input name="delivery_fee" type="number" placeholder="Delivery fee" value={form.delivery_fee} onChange={update} className={input} />
            <input name="min_order" type="number" placeholder="Min order" value={form.min_order} onChange={update} className={input} />
          </div>
          <button className="w-full bg-orange-600 text-white py-2 rounded">Restaurant banao</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h1 className="text-2xl font-bold">{restaurant.name}</h1>
          <p className="text-sm text-gray-600">
            {restaurant.is_approved ? '✅ Approved' : '⏳ Admin approval baaki hai'}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={toggleOpen}
            className={`px-3 py-2 rounded text-white ${restaurant.is_open ? 'bg-green-600' : 'bg-gray-500'}`}>
            {restaurant.is_open ? 'Open (band karo)' : 'Closed (kholo)'}
          </button>
          <Link to="/owner/menu" className="px-3 py-2 rounded border border-orange-600 text-orange-600">
            Menu manage
          </Link>
        </div>
      </div>

      {error && <p className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">{error}</p>}

      <div className="flex gap-2 mb-4 text-sm flex-wrap">
        {['', 'PLACED', 'ACCEPTED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'].map((s) => (
          <button key={s || 'ALL'} onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded border ${filter === s ? 'bg-orange-600 text-white border-orange-600' : 'bg-white'}`}>
            {s || 'ALL'}
          </button>
        ))}
      </div>

      {orders.length === 0 && <p className="text-gray-500">Abhi koi order nahi.</p>}

      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="bg-white rounded shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold">Order #{o.id}</p>
                <p className="text-xs text-gray-500">{new Date(o.created_at).toLocaleString()}</p>
                <p className="text-sm text-gray-600">{o.customer_email}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${colors[o.status]}`}>{o.status}</span>
            </div>
            <ul className="text-sm mt-2">
              {o.items.map((i) => (
                <li key={i.id}>{i.name} x {i.quantity} — Rs {i.line_total}</li>
              ))}
            </ul>
            <p className="text-sm text-gray-600 mt-2">📍 {o.delivery_address}</p>
            {o.note && <p className="text-sm text-gray-600">📝 {o.note}</p>}
            <div className="flex justify-between items-center mt-3">
              <span className="font-semibold">Total Rs {o.total}</span>
              <div className="flex gap-2">
                {(ACTIONS[o.status] || []).map((a) => (
                  <button key={a.status} onClick={() => changeStatus(o.id, a.status)}
                    className={`${a.cls} text-white text-sm px-3 py-1 rounded`}>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}