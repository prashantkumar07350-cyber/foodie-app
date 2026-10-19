import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const INPUT =
  'w-full border border-gray-200 rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-[#1f4a3d]'
const SOCIAL = 'border border-gray-200 bg-white rounded-lg py-2.5 text-sm'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState(localStorage.getItem('remember_email') || '')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [remember, setRemember] = useState(!!localStorage.getItem('remember_email'))
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)
    try {
      const u = await login(email, password)
      if (remember) localStorage.setItem('remember_email', email)
      else localStorage.removeItem('remember_email')
      navigate(u.role === 'RESTAURANT' ? '/owner' : u.role === 'ADMIN' ? '/admin-panel' : '/')
    } catch {
      setError('Email ya password galat hai.')
    } finally {
      setLoading(false)
    }
  }

  const soon = (name) => setInfo(name + ' login jaldi aa raha hai.')

  return (
    <div className="max-w-sm mx-auto mt-4 text-center">
      <p className="text-5xl mb-1">👨‍🍳</p>
      <h1 className="font-display text-3xl font-bold italic text-[#163a2f]">The Good Plate</h1>
      <p className="text-[10px] tracking-[0.35em] text-gray-500 mb-8">RESTAURANT</p>

      <h2 className="text-xl font-bold">Welcome Back</h2>
      <p className="text-sm text-gray-500 mb-5">Login to your account</p>

      {error && <p className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">{error}</p>}
      {info && <p className="bg-yellow-100 text-yellow-800 p-2 rounded mb-3 text-sm">{info}</p>}

      <form onSubmit={handleSubmit} className="space-y-3 text-left">
        <input type="email" placeholder="Email" required value={email}
          onChange={(e) => setEmail(e.target.value)} className={INPUT} />
        <div className="relative">
          <input type={show ? 'text' : 'password'} placeholder="Password" required value={password}
            onChange={(e) => setPassword(e.target.value)} className={INPUT} />
          <button type="button" onClick={() => setShow(!show)}
            className="absolute right-3 top-3 text-sm text-gray-500">
            {show ? 'Hide' : 'Show'}
          </button>
        </div>

        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center gap-2 text-gray-600">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Remember me
          </label>
          <button type="button" onClick={() => setInfo('Forgot password jaldi aa raha hai.')}
            className="text-[#1f4a3d] font-medium">
            Forgot Password?
          </button>
        </div>

        <button disabled={loading}
          className="w-full bg-[#1f4a3d] text-white py-3 rounded-lg font-medium disabled:opacity-60">
          {loading ? 'Please wait...' : 'Login'}
        </button>
      </form>

      <div className="flex items-center gap-3 my-5 text-xs text-gray-500">
        <div className="flex-1 h-px bg-gray-200" />
        <span>Or continue with</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={() => soon('Google')} className={SOCIAL}>
          <b className="text-blue-600">G</b> Google
        </button>
        <button type="button" onClick={() => soon('Facebook')} className={SOCIAL}>
          <b className="text-blue-700">f</b> Facebook
        </button>
      </div>

      <p className="text-sm mt-6 text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="text-[#1f4a3d] font-semibold">Sign Up</Link>
      </p>
    </div>
  )
}``