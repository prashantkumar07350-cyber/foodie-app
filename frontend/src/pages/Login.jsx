import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
        const u = await login(email, password)
         navigate(u.role === 'RESTAURANT' ? '/owner' : '/')
    } catch {
      setError('Email ya password galat hai.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {error && <p className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email" placeholder="Email" required value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="password" placeholder="Password" required value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <button
          disabled={loading}
          className="w-full bg-orange-600 text-white py-2 rounded disabled:opacity-60"
        >
          {loading ? 'Please wait...' : 'Login'}
        </button>
      </form>
      <p className="text-sm mt-4 text-gray-600">
        Account nahi hai? <Link to="/register" className="text-orange-600">Register karo</Link>
      </p>
    </div>
  )
}