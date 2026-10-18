import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

const COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-200 text-gray-600',
}

export default function OwnerBookings() {
  const { user } = useAuth()
  const [list, setList] = useState([])
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/bookings/restaurant/')
      setList(data)
    } catch {
      setError('Bookings load nahi hui.')
    }
  }, [])

  useEffect(() => {
    load()
    const t = setInterval(load, 15000)
    return () => clearInterval(t)
  }, [load])

  if (!user || user.role !== 'RESTAURANT') return <Navigate to="/login" />

  const setStatus = async (id, status) => {
    setError('')
    try {
      await api.post('/bookings/' + id + '/status/', { status })
      load()
    } catch (err) {
      setError((err.response && err.response.data && err.response.data.detail) || 'Update nahi hua.')
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <Link to="/owner" className="text-sm text-orange-600">← Dashboard</Link>
      <h1 className="font-display text-2xl font-bold text-orange-600 mb-4">Table Bookings</h1>
      {error && <p className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">{error}</p>}
      {list.length === 0 && <p className="text-gray-500">Abhi koi booking nahi.</p>}

      <div className="space-y-3">
        {list.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl shadow-sm p-4 text-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{b.customer_email}</p>
                {b.customer_phone && <p className="text-gray-500">📞 {b.customer_phone}</p>}
              </div>
              <span className={'text-xs px-2 py-1 rounded-full ' + COLORS[b.status]}>{b.status}</span>
            </div>
            <p className="text-gray-600 mt-2">📅 {b.date} • 🕒 {b.time.slice(0, 5)} • 👥 {b.guests} guests</p>
            {b.note && <p className="text-gray-500 text-xs mt-1">📝 {b.note}</p>}
            <div className="flex gap-2 mt-3">
              {b.status === 'PENDING' && (
                <button onClick={() => setStatus(b.id, 'CONFIRMED')}
                  className="bg-green-600 text-white px-3 py-1 rounded">Confirm</button>
              )}
              {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                <button onClick={() => setStatus(b.id, 'REJECTED')}
                  className="bg-red-600 text-white px-3 py-1 rounded">Reject</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}