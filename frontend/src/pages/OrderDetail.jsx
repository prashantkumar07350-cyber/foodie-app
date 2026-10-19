import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import ReviewBox from '../components/ReviewBox'

const STEPS = [
  ['PLACED', 'Order placed'],
  ['ACCEPTED', 'Accepted by restaurant'],
  ['PREPARING', 'Preparing your food'],
  ['OUT_FOR_DELIVERY', 'On the way'],
  ['DELIVERED', 'Delivered'],
]

export default function OrderDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')

  const load = () =>
    api.get('/orders/' + id + '/')
      .then((r) => setOrder(r.data))
      .catch(() => setError('Order nahi mila.'))

  useEffect(() => {
    if (!user) return undefined
    load()
    const t = setInterval(load, 15000)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user])

  if (!user) return <Navigate to="/login" />
  if (error) return <p className="bg-red-100 text-red-700 p-2 rounded">{error}</p>
  if (!order) return <p className="text-gray-500">Loading...</p>

  const stopped = order.status === 'CANCELLED' || order.status === 'REJECTED'
  const reached = STEPS.findIndex((s) => s[0] === order.status)

  const cancel = async () => {
    if (!window.confirm('Ye order cancel karein?')) return
    try {
      await api.post('/orders/' + id + '/cancel/')
      load()
    } catch {
      setError('Cancel nahi ho paya.')
    }
  }

  const row = 'flex justify-between text-sm py-1'

  return (
    <div className="max-w-xl mx-auto space-y-4 pb-6">
      <Link to="/orders" className="text-sm text-orange-600">← My Orders</Link>
      <h1 className="font-display text-2xl font-bold text-orange-600">
        Order #GP{String(order.id).padStart(6, '0')}
      </h1>

      <section className="bg-white rounded-2xl shadow-sm p-4">
        <h2 className="font-semibold mb-3">Status</h2>
        {stopped ? (
          <p className={'inline-block px-3 py-1 rounded-full text-sm ' +
            (order.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-600')}>
            {order.status === 'REJECTED' ? 'Restaurant ne reject kiya' : 'Order cancel hua'}
          </p>
        ) : (
          <ol className="space-y-3">
            {STEPS.map((s, i) => (
              <li key={s[0]} className="flex items-center gap-3 text-sm">
                <span className={'w-6 h-6 rounded-full flex items-center justify-center text-xs ' +
                  (i <= reached ? 'bg-[#1f4a3d] text-white' : 'bg-gray-200 text-gray-500')}>
                  {i <= reached ? '✓' : i + 1}
                </span>
                <span className={i <= reached ? 'font-medium' : 'text-gray-400'}>{s[1]}</span>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="bg-white rounded-2xl shadow-sm p-4">
        <h2 className="font-semibold mb-2">{order.restaurant_name}</h2>
        {order.items.map((i) => (
          <div key={i.id} className={row + ' text-gray-600'}>
            <span>{i.name} x {i.quantity}</span>
            <span>Rs {i.line_total}</span>
          </div>
        ))}
        <div className="border-t mt-2 pt-2">
          <div className={row + ' text-gray-600'}><span>Subtotal</span><span>Rs {order.subtotal}</span></div>
          <div className={row + ' text-gray-600'}><span>Delivery Fee</span><span>Rs {order.delivery_fee}</span></div>
          <div className={row + ' font-bold text-base'}><span>Total</span><span>Rs {order.total}</span></div>
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-sm p-4 text-sm space-y-1">
        <p><span className="text-gray-500">Delivery address:</span> {order.delivery_address}</p>
        <p>
          <span className="text-gray-500">Payment:</span>{' '}
          {order.payment_method === 'COD' ? 'Cash on Delivery' : order.payment_method}
        </p>
        {order.note && <p><span className="text-gray-500">Note:</span> {order.note}</p>}
        <p className="text-gray-400">{new Date(order.created_at).toLocaleString()}</p>
      </section>
      {order.status === 'DELIVERED' && <ReviewBox orderId={order.id} />}
      {order.status === 'PLACED' && (
        <button onClick={cancel}
          className="w-full border border-red-300 text-red-600 py-3 rounded-lg">
          Cancel Order
        </button>
      )}
    </div>
  )
}