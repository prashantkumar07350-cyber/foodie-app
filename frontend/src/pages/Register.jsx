import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '', phone: '', first_name: '', last_name: '', password: '', role: 'CUSTOMER',
  })
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors([])
    setLoading(true)
    try {
      await api.post('/auth/register/', form)
      navigate('/login')
    } catch (err) {
      const data = err.response?.data
      if (data && typeof data === 'object') {
        setErrors(Object.entries(data).map(([k, v]) => `${k}: ${[].concat(v).join(' ')}`))
      } else {
        setErrors(['Kuch galat hua. Server chal raha hai?'])
      }
    } finally {
      setLoading(false)
    }
  }

  const input = 'w-full border rounded px-3 py-2'

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      {errors.length > 0 && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">
          {errors.map((e) => <p key={e}>{e}</p>)}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="first_name" placeholder="First name" value={form.first_name} onChange={update} className={input} />
        <input name="last_name" placeholder="Last name" value={form.last_name} onChange={update} className={input} />
        <input name="email" type="email" placeholder="Email" required value={form.email} onChange={update} className={input} />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={update} className={input} />
        <input name="password" type="password" placeholder="Password" required value={form.password} onChange={update} className={input} />
        <select name="role" value={form.role} onChange={update} className={input}>
          <option value="CUSTOMER">Customer</option>
          <option value="RESTAURANT">Restaurant Owner</option>
          <option value="DELIVERY">Delivery Partner</option>
        </select>
        <button disabled={loading} className="w-full bg-orange-600 text-white py-2 rounded disabled:opacity-60">
          {loading ? 'Please wait...' : 'Register'}
        </button>
      </form>
      <p className="text-sm mt-4 text-gray-600">
        Pehle se account hai? <Link to="/login" className="text-orange-600">Login karo</Link>
      </p>
    </div>
  )
}