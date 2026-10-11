import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useCart } from '../context/CartContext'

export default function Checkout() {
  const { cart, refresh } = useCart()
  const navigate = useNavigate()
  const [addresses, setAddresses] = useState([])
  const [selected, setSelected] = useState(null)
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ label: 'Home', address_line: '', city: '', pincode: '' })

  const loadAddresses = async () => {
    const { data } = await api.get('/addresses/')
    setAddresses(data)
    if (data.length && !selected) setSelected(data[0].id)
  }

  useEffect(() => {
    loadAddresses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addAddress = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/addresses/', { ...form, is_default: addresses.length === 0 })
      setForm({ label: 'Home', address_line: '', city: '', pincode: '' })
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
      await api.post('/orders/place/', { address_id: selected, note })
      await refresh()
      navigate('/orders')
    } catch (err) {
      setError(err.response?.data?.detail || 'Order place nahi hua.')
    } finally {
      setLoading(false)
    }
  }

  if (!cart || cart.items.length === 0) {
    return <p className="text-center mt-10 text-gray-600">Cart khali hai. <Link to="/" className="text-orange-600">Restaurants dekho</Link></p>
  }

  const input = 'w-full border rounded px-3 py-2'

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Checkout</h1>
      {error && <p className="bg-red-100 text-red-700 p-2 rounded text-sm">{error}</p>}

      <div className="bg-white rounded shadow p-4">
        <h2 className="font-semibold mb-2">Delivery address</h2>
        {addresses.length === 0 && <p className="text-sm text-gray-500 mb-2">Koi address nahi. Neeche naya add karo.</p>}
        {addresses.map((a) => (
          <label key={a.id} className="flex gap-2 items-start py-1">
            <input type="radio" checked={selected === a.id} onChange={() => setSelected(a.id)} />
            <span className="text-sm">
              <b>{a.label}</b>: {a.address_line}, {a.city} - {a.pincode}
            </span>
          </label>
        ))}

        <form onSubmit={addAddress} className="mt-3 space-y-2 border-t pt-3">
          <p className="text-sm font-medium">Naya address</p>
          <input placeholder="Label (Home/Work)" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className={input} />
          <input placeholder="Address line" required value={form.address_line} onChange={(e) => setForm({ ...form, address_line: e.target.value })} className={input} />
          <div className="flex gap-2">
            <input placeholder="City" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={input} />
            <input placeholder="Pincode" required value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} className={input} />
          </div>
          <button className="border border-orange-600 text-orange-600 px-3 py-1 rounded">Address save karo</button>
        </form>
      </div>

      <input placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} className={`${input} bg-white`} />

      <div className="bg-white rounded shadow p-4 flex justify-between font-bold">
        <span>Total</span><span>Rs {cart.total}</span>
      </div>

      <button
        onClick={placeOrder}
        disabled={!selected || loading}
        className="w-full bg-orange-600 text-white py-2 rounded disabled:opacity-60"
      >
        {loading ? 'Please wait...' : 'Order place karo'}
      </button>
    </div>
  )
}