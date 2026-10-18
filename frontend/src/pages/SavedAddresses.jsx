import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const INPUT = 'w-full border border-gray-200 rounded-lg px-4 py-3 bg-white'
const EMPTY = { label: 'Home', address_line: '', city: '', pincode: '' }

export default function SavedAddresses() {
  const { user } = useAuth()
  const [list, setList] = useState([])
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const { data } = await api.get('/addresses/')
      setList(data)
    } catch {
      setError('Addresses load nahi hue.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!user) return <Navigate to="/login" />

  const add = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/addresses/', { ...form, is_default: list.length === 0 })
      setForm(EMPTY)
      setAdding(false)
      load()
    } catch {
      setError('Address save nahi hua. Saari fields bharo.')
    }
  }

  const makeDefault = async (id) => {
    await api.patch('/addresses/' + id + '/', { is_default: true })
    load()
  }

  const remove = async (id) => {
    if (!window.confirm('Ye address delete karein?')) return
    await api.delete('/addresses/' + id + '/')
    load()
  }

  return (
    <div className="max-w-md mx-auto">
      <Link to="/profile" className="text-sm text-orange-600">← Profile</Link>
      <h1 className="font-display text-2xl font-bold text-orange-600 mb-4">Saved Addresses</h1>

      {error && <p className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">{error}</p>}
      {loading && <p className="text-gray-500">Loading...</p>}
      {!loading && list.length === 0 && !adding && (
        <p className="text-gray-500 mb-3">Koi saved address nahi.</p>
      )}

      <div className="space-y-3">
        {list.map((a) => (
          <div key={a.id} className="bg-white rounded-2xl shadow-sm p-4 text-sm">
            <div className="flex justify-between items-start">
              <p className="font-semibold">
                📍 {a.label}
                {a.is_default && (
                  <span className="ml-2 text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">
                    Default
                  </span>
                )}
              </p>
              <button onClick={() => remove(a.id)} className="text-red-500">🗑</button>
            </div>
            <p className="text-gray-600 mt-1">{a.address_line}, {a.city} - {a.pincode}</p>
            {!a.is_default && (
              <button onClick={() => makeDefault(a.id)} className="text-orange-600 mt-2">
                Default banao
              </button>
            )}
          </div>
        ))}
      </div>

      {adding ? (
        <form onSubmit={add} className="bg-white rounded-2xl shadow-sm p-4 mt-4 space-y-2">
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
            <button className="bg-orange-600 text-white px-5 py-2 rounded-lg">Save</button>
            <button type="button" onClick={() => setAdding(false)} className="text-sm text-gray-600">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button onClick={() => setAdding(true)}
          className="w-full mt-4 bg-orange-600 text-white py-3 rounded-lg font-medium">
          + Add New Address
        </button>
      )}
    </div>
  )
}