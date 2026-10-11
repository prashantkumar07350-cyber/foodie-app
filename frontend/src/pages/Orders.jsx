import { useEffect, useState } from 'react'
import api from '../api/axios'

const colors = {
  PLACED: 'bg-blue-100 text-blue-700',
  ACCEPTED: 'bg-indigo-100 text-indigo-700',
  PREPARING: 'bg-yellow-100 text-yellow-800',
  OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-gray-200 text-gray-600',
  REJECTED: 'bg-red-100 text-red-700',
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () =>
    api.get('/orders/').then((r) => setOrders(r.data)).finally(() => setLoading(false))

  useEffect(() => {
    load()
  }, [])

  const cancel = async (id) => {
    await api.post(`/orders/${id}/cancel/`)
    load()
  }

  if (loading) return <p className="text-gray-500">Loading...</p>
  if (orders.length === 0) return <p className="text-gray-600">Abhi koi order nahi.</p>

  return (
    <div className="max-w-xl mx-auto space-y-3">
      <h1 className="text-2xl font-bold">Mere orders</h1>
      {orders.map((o) => (
        <div key={o.id} className="bg-white rounded shadow p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold">#{o.id} • {o.restaurant_name}</p>
              <p className="text-xs text-gray-500">{new Date(o.created_at).toLocaleString()}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded ${colors[o.status]}`}>{o.status}</span>
          </div>
          <ul className="text-sm text-gray-700 mt-2">
            {o.items.map((i) => (
              <li key={i.id}>{i.name} x {i.quantity} — Rs {i.line_total}</li>
            ))}
          </ul>
          <div className="flex justify-between items-center mt-2">
            <span className="font-semibold">Total Rs {o.total}</span>
            {o.status === 'PLACED' && (
              <button onClick={() => cancel(o.id)} className="text-sm text-red-600 border border-red-300 px-2 py-1 rounded">
                Cancel
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}