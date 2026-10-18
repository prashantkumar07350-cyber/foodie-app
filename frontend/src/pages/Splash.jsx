import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    // Page 2 (Onboarding) banne ke baad yahan '/onboarding' hoga
    const t = setTimeout(() => navigate('/', { replace: true }), 2500)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center text-center text-white"
      style={{ background: 'radial-gradient(circle at 50% 40%, #1f4a3d, #081814)' }}
    >
      <div className="text-7xl mb-4">👨‍🍳</div>
      <h1 className="font-display text-5xl font-bold italic">The Good Plate</h1>
      <p className="mt-2 text-xs tracking-[0.4em] text-white/80">RESTAURANT</p>
      <p className="mt-6 text-sm text-[#e8c07d]">Good Food &nbsp;•&nbsp; Great Mood</p>

      <div className="absolute bottom-10 w-32 h-1 rounded-full bg-white/20 overflow-hidden">
        <div
          className="h-full bg-white rounded-full"
          style={{ animation: 'splash-load 2.4s ease-out forwards' }}
        />
      </div>
    </div>
  )
}