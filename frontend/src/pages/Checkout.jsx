import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const INPUT = 'w-full border border-gray-200 rounded-lg px-4 py-3 bg-white'
const CARD = 'bg-white rounded-2xl shadow-sm p-4'
const EMPTY = { label: 'Home', address_line: '', city: '', pincode: '' }

const METHODS = [
  { id: 'COD', label: 'Cash on Delivery', icon: '💵', ready: true },
  { id: 'UPI', label: 'UPI / Wallet', icon: '📱', ready: false },
  { id: 'CARD', label: 'Credit / Debit Card', icon: '💳', ready: false },
  { id: 'NET', label: 'Net Banking', icon: '🏦', ready: false },
]

export default function Checkout() {
  const { user } = useAuth()
  const { cart, refresh } = useCart()
  const navigate = useNavigate()

  const [addresses, setAddresses] = useState([])
  const [selected, setSelected] = useState(null)
  const [changing, setChanging] = useState(false)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [method, setMethod] = useState('COD')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const loadAddresses = async () => {
    const { data } = await api.get('/addresses/')
    setAddresses(data)
    setSelected((prev) => prev || (data.length ? data[0].id : null))
    setLoaded(true)
  }

  useEffect(() => {
    if (user) loadAddresses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!user) return <Navigate to="/login" />

  const saveAddress = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/addresses/', {
        ...form,
        is_default: addresses.length === 0,
      })
      setForm(EMPTY)
      setAdding(false)
      setChanging(false)
      await loadAddresses()
      setSelected(data.id)
    } catch {
      setError('Address save nahi hua. Saari fields bharo.')
    }
  }

  const placeOrder = async () => {
    setError('')
    setLoading(true)
    try {
      await api.post('/orders/place/', {
        address_id: selected,
        note,
        payment_method: method,
      })
      await refresh()
      navigate('/orders')
    } catch (err) {
      const d = err.response && err.response.data
      setError((d && d.detail) || 'Order place nahi hua.')
    } finally {
      setLoading(false)
    }
  }

  if (!cart || cart.items.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-600">
        Cart khali hai.{' '}
        <Link to="/" className="text-orange-600">Restaurants dekho</Link>
      </p>
    )
  }

  const current = addresses.find((a) => a.id === selected)
  const showForm = adding || (loaded && addresses.length === 0)
  const fullName = ((user.first_name || '') + ' ' + (user.last_name || '')).trim() || user.email

  return (
    <div className="max-w-xl mx-auto space-y-4 pb-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-xl text-orange-600">←</button>
        <h1 className="font-display text-2xl font-bold text-orange-600">Checkout</h1>
      </div>

      {error && <p className="bg-red-100 text-red-700 p-2 rounded text-sm">{error}</p>}

      {/* DELIVERY ADDRESS */}
      <section className={CARD}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold">Delivery Address</h2>
          {addresses.length > 0 && !showForm && (
            <button onClick={() => setChanging(!changing)} className="text-sm text-orange-600">
              {changing ? 'Close' : 'Change'}
            </button>
          )}
        </div>

        {current && !changing && !showForm && (
          <div className="text-sm">
            <p className="font-medium">📍 {fullName} • {current.label}</p>
            <p className="text-gray-600">
              {current.address_line}, {current.city} - {current.pincode}
            </p>
            {user.phone && <p className="text-gray-500">📞 {user.phone}</p>}
          </div>
        )}

        {changing && !showForm && (
          <div className="space-y-2">
            {addresses.map((a) => (
              <label key={a.id} className="flex gap-2 items-start text-sm">
                <input type="radio" checked={selected === a.id}
                  onChange={() => { setSelected(a.id); setChanging(false) }} />
                <span>
                  <b>{a.label}</b>: {a.address_line}, {a.city} - {a.pincode}
                </span>
              </label>
            ))}
            <button onClick={() => setAdding(true)} className="text-sm text-orange-600">
              + Naya address
            </button>
          </div>
        )}

        {showForm && (
          <form onSubmit={saveAddress} className="space-y-2">
            {addresses.length === 0 && (
              <p className="text-sm text-gray-500">Koi address nahi. Naya add karo.</p>
            )}
            <input placeholder="Label (Home / Work)" value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })} className={INPUT} />
            <input placeholder="Address line" required value={form.address_line}
              onChange={(e) => setForm({ ...form, address_line: e.target.value })} className={INPUT} />
            <div className="flex gap-2">
              <input placeholder="City" required value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })} className={INPUT} />
              <input placeholder="Pincode" required value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })} className={INPUT} />
            </div>
            <div className="flex gap-3">
              <button className="bg-orange-600 text-white px-4 py-2 rounded-lg">Save address</button>
              {addresses.length > 0 && (
                <button type="button" onClick={() => setAdding(false)} className="text-sm text-gray-600">
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}
      </section>

      {/* PAYMENT METHOD */}
      <section className={CARD}>
        <h2 className="font-semibold mb-2">Payment Method</h2>
        <div className="space-y-1">
          {METHODS.map((m) => (
            <label key={m.id}
              className={'flex items-center gap-3 py-2 text-sm ' + (m.ready ? '' : 'opacity-50')}>
              <span className="text-lg">{m.icon}</span>
              <span className="flex-1">
                {m.label}
                {!m.ready && <span className="text-xs text-gray-500"> (jaldi aa raha hai)</span>}
              </span>
              <input type="radio" disabled={!m.ready} checked={method === m.id}
                onChange={() => setMethod(m.id)} />
            </label>
          ))}
        </div>
      </section>

      <input placeholder="Note for restaurant (optional)" value={note}
        onChange={(e) => setNote(e.target.value)} className={INPUT} />

      {/* ORDER SUMMARY */}
      <section className={CARD + ' text-sm'}>
        <h2 className="font-semibold mb-2">Order Summary</h2>
        <p className="text-gray-500 mb-2">{cart.restaurant_name}</p>
        {cart.items.map((i) => (
          <div key={i.id} className="flex justify-between text-gray-600">
            <span>{i.name} x {i.quantity}</span>
            <span>Rs {i.line_total}</span>
          </div>
        ))}
        <div className="border-t mt-2 pt-2 space-y-1">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span><span>Rs {cart.subtotal}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery Fee</span><span>Rs {cart.delivery_fee}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span><span>Rs {cart.total}</span>
          </div>
        </div>
      </section>

      <button onClick={placeOrder} disabled={!selected || loading || showForm}
        className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium disabled:opacity-50">
        {loading ? 'Please wait...' : 'Place Order'}
      </button>
    </div>
  )
}