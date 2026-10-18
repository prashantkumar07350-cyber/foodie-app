import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const INPUT = 'w-full border border-gray-200 rounded-lg px-4 py-3 bg-white'
const ROW = 'flex items-center gap-3 px-4 py-3.5 border-b last:border-b-0 text-sm'

const ROLE_LABEL = {
  CUSTOMER: 'Customer',
  RESTAURANT: 'Restaurant Owner',
  DELIVERY: 'Delivery Partner',
  ADMIN: 'Admin',
}

export default function Profile() {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  if (!user) return <Navigate to="/login" />

  const fullName = ((user.first_name || '') + ' ' + (user.last_name || '')).trim()
  const initial = (fullName || user.email).charAt(0).toUpperCase()

  const startEdit = () => {
    setForm({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone: user.phone || '',
    })
    setError('')
    setMessage('')
    setEditing(true)
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const { data } = await api.patch('/auth/me/', form)
      updateUser(data)
      setEditing(false)
      setMessage('Profile update ho gaya.')
    } catch {
      setError('Profile save nahi hua.')
    } finally {
      setSaving(false)
    }
  }

  const soon = (name) => setMessage(name + ' jaldi aa raha hai.')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isCustomer = user.role === 'CUSTOMER'
  const isOwner = user.role === 'RESTAURANT'

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-[#1f4a3d] text-white text-4xl font-bold flex items-center justify-center">
          {initial}
        </div>
        <h1 className="font-display text-2xl font-bold text-orange-600 mt-3">
          {fullName || 'Welcome'}
        </h1>
        <p className="text-sm text-gray-500">{user.email}</p>
        {user.phone && <p className="text-sm text-gray-500">{user.phone}</p>}
        <span className="inline-block mt-2 text-xs bg-orange-50 text-orange-600 px-3 py-1 rounded-full">
          {ROLE_LABEL[user.role] || user.role}
        </span>
      </div>

      {message && <p className="bg-green-100 text-green-800 p-2 rounded mt-4 text-sm">{message}</p>}
      {error && <p className="bg-red-100 text-red-700 p-2 rounded mt-4 text-sm">{error}</p>}

      {editing ? (
        <form onSubmit={save} className="bg-white rounded-2xl shadow-sm p-4 mt-4 space-y-2">
          <input placeholder="First name" value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })} className={INPUT} />
          <input placeholder="Last name" value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })} className={INPUT} />
          <input placeholder="Phone" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} className={INPUT} />
          <div className="flex gap-3 pt-1">
            <button disabled={saving}
              className="bg-orange-600 text-white px-5 py-2 rounded-lg disabled:opacity-60">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={() => setEditing(false)} className="text-sm text-gray-600">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button onClick={startEdit}
          className="w-full mt-4 border border-orange-600 text-orange-600 py-2.5 rounded-lg text-sm">
          Edit Profile
        </button>
      )}

      <div className="bg-white rounded-2xl shadow-sm mt-4 overflow-hidden">
        {isCustomer && (
          <Link to="/orders" className={ROW}>
            <span>📋</span><span className="flex-1">My Orders</span><span>›</span>
          </Link>
        )}
        {isOwner && (
          <Link to="/owner" className={ROW}>
            <span>📋</span><span className="flex-1">Restaurant Dashboard</span><span>›</span>
          </Link>
        )}
        {isCustomer && (
          <Link to="/addresses" className={ROW}>
            <span>📍</span><span className="flex-1">Saved Addresses</span><span>›</span>
          </Link>
        )}
        <button onClick={() => soon('Payment Methods')} className={ROW + ' w-full text-left'}>
          <span>💳</span><span className="flex-1">Payment Methods</span><span>›</span>
        </button>
        <button onClick={() => soon('Notifications')} className={ROW + ' w-full text-left'}>
          <span>🔔</span><span className="flex-1">Notifications</span><span>›</span>
        </button>
        <Link to="/help" className={ROW}>
          <span>❓</span><span className="flex-1">Help & Support</span><span>›</span>
        </Link>
        <Link to="/about" className={ROW}>
          <span>ℹ️</span><span className="flex-1">About Us</span><span>›</span>
        </Link>
        <button onClick={handleLogout} className={ROW + ' w-full text-left text-red-600'}>
          <span>⏻</span><span className="flex-1">Logout</span>
        </button>
      </div>
    </div>
  )
}