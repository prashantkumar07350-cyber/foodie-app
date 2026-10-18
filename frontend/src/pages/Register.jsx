import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', phone: '', password: '', role: 'CUSTOMER',
  })
  const [show, setShow] = useState(false)
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

  const input =
    'w-full border border-gray-200 rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-[#1f4a3d]'

  return (
    <div className="max-w-sm mx-auto mt-2 text-center">
      <p className="text-4xl mb-1">👨‍🍳</p>
      <h1 className="font-display text-3xl font-bold italic text-[#163a2f]">The Good Plate</h1>
      <h2 className="text-xl font-bold mt-5">Create Account</h2>
      <p className="text-sm text-gray-500 mb-5">Sign up to get started</p>

      {errors.length > 0 && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm text-left">
          {errors.map((e) => <p key={e}>{e}</p>)}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 text-left">
        <div className="flex gap-2">
          <input name="first_name" placeholder="First name" value={form.first_name} onChange={update} className={input} />
          <input name="last_name" placeholder="Last name" value={form.last_name} onChange={update} className={input} />
        </div>
        <input name="email" type="email" placeholder="Email" required value={form.email} onChange={update} className={input} />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={update} className={input} />
        <div className="relative">
          <input name="password" type={show ? 'text' : 'password'} placeholder="Password" required
            value={form.password} onChange={update} className={input} />
          <button type="button" onClick={() => setShow(!show)}
            className="absolute right-3 top-3 text-sm text-gray-500">
            {show ? 'Hide' : 'Show'}
          </button>
        </div>
        <select name="role" value={form.role} onChange={update} className={input}>
          <option value="CUSTOMER">Customer</option>
          <option value="RESTAURANT">Restaurant Owner</option>
          <option value="DELIVERY">Delivery Partner</option>
        </select>
        <button disabled={loading}
          className="w-full bg-[#1f4a3d] text-white py-3 rounded-lg font-medium disabled:opacity-60">
          {loading ? 'Please wait...' : 'Sign Up'}
        </button>
      </form>

      <p className="text-sm mt-6 text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-[#1f4a3d] font-semibold">Login</Link>
      </p>
    </div>
  )
}