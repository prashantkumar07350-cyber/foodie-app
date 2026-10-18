import { useEffect, useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const INPUT = 'w-full border border-gray-200 rounded-lg px-4 py-3 bg-white'
const SLOTS = [
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00',
]
const COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-200 text-gray-600',
}

function fmtTime(t) {
  const [h, m] = t.split(':')
  const hh = Number(h)
  return (hh % 12 || 12) + ':' + m + (hh >= 12 ? ' PM' : ' AM')
}

export default function Booking() {
  const { user } = useAuth()
  const [params] = useSearchParams()
  const today = new Date().toLocaleDateString('en-CA')

  const [restaurants, setRestaurants] = useState([])
  const [mine, setMine] = useState([])
  const [form, setForm] = useState({
    restaurant: params.get('restaurant') || '',
    date: '', time: '', guests: 2, note: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const loadMine = async () => {
    try {
      const { data } = await api.get('/bookings/')
      setMine(data)
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    api.get('/restaurants/').then((r) => setRestaurants(r.data)).catch(() => {})
    if (user && user.role === 'CUSTOMER') loadMine()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!user) return <Navigate to="/login" />
  if (user.role !== 'CUSTOMER') {
    return <p className="text-center mt-10 text-gray-600">Table booking sirf customers ke liye hai.</p>
  }

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await api.post('/bookings/', {
        ...form,
        restaurant: Number(form.restaurant),
        guests: Number(form.guests),
      })
      setSuccess('Booking request bhej di. Restaurant confirm karega.')
      setForm({ ...form, date: '', time: '', note: '' })
      loadMine()
    } catch (err) {
      const d = err.response && err.response.data
      setError(d ? Object.values(d).flat().join(' ') : 'Booking nahi ho paayi.')
    } finally {
      setLoading(false)
    }
  }

  const cancel = async (id) => {
    if (!window.confirm('Ye booking cancel karein?')) return
    try {
      await api.post('/bookings/' + id + '/cancel/')
      loadMine()
    } catch {
      setError('Cancel nahi ho paya.')
    }
  }

  return (
    <div className="max-w-md mx-auto pb-6">
      <div
        className="rounded-2xl text-white p-6 mb-5"
        style={{ background: 'linear-gradient(135deg,#0d2620,#2b6350)' }}
      >
        <h1 className="font-display text-3xl font-bold">Reserve Your Table</h1>
        <p className="text-sm text-white/80 mt-1">A perfect place for your special moments.</p>
      </div>

      {error && <p className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">{error}</p>}
      {success && <p className="bg-green-100 text-green-800 p-2 rounded mb-3 text-sm">{success}</p>}

      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="text-sm font-medium">Restaurant</label>
          <select required name="restaurant" value={form.restaurant} onChange={update} className={INPUT}>
            <option value="">Restaurant chuno</option>
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>{r.name} • {r.city}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Date</label>
          <input required type="date" name="date" min={today} value={form.date}
            onChange={update} className={INPUT} />
        </div>
        <div>
          <label className="text-sm font-medium">Time</label>
          <select required name="time" value={form.time} onChange={update} className={INPUT}>
            <option value="">Time chuno</option>
            {SLOTS.map((t) => <option key={t} value={t}>{fmtTime(t)}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Guests</label>
          <select name="guests" value={form.guests} onChange={update} className={INPUT}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>
            ))}
          </select>
        </div>
        <input name="note" placeholder="Special request (optional)" value={form.note}
          onChange={update} className={INPUT} />
        <button disabled={loading}
          className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium disabled:opacity-60">
          {loading ? 'Please wait...' : 'Book Now'}
        </button>
      </form>

      {mine.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-xl font-bold text-orange-600 mb-3">My Bookings</h2>
          <div className="space-y-3">
            {mine.map((b) => (
              <div key={b.id} className="bg-white rounded-2xl shadow-sm p-4 text-sm">
                <div className="flex justify-between items-start">
                  <p className="font-semibold">{b.restaurant_name}</p>
                  <span className={'text-xs px-2 py-1 rounded-full ' + COLORS[b.status]}>{b.status}</span>
                </div>
                <p className="text-gray-600 mt-1">
                  📅 {b.date} • 🕒 {fmtTime(b.time)} • 👥 {b.guests}
                </p>
                {b.note && <p className="text-gray-500 text-xs mt-1">📝 {b.note}</p>}
                {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                  <button onClick={() => cancel(b.id)}
                    className="mt-2 text-red-600 border border-red-300 px-3 py-1 rounded-lg">
                    Cancel
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <Link to="/" className="block text-center text-sm text-orange-600 mt-6">← Home</Link>
    </div>
  )
}