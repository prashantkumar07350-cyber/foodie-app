import { Link } from 'react-router-dom'

const HIGHLIGHTS = [
  { icon: '🥗', title: 'Fresh Ingredients', text: 'Roz taaza samaan, seedha farm se.' },
  { icon: '📖', title: 'Authentic Recipes', text: 'Asli swaad, purani recipes ke saath.' },
  { icon: '🤝', title: 'Great Service', text: 'Aapki khushi hamari priority hai.' },
]

export default function About() {
  return (
    <div className="max-w-2xl mx-auto pb-6">
      <Link to="/" className="text-sm text-orange-600">← Back</Link>

      <div
        className="mt-2 h-48 md:h-64 rounded-2xl flex items-center justify-center text-7xl"
        style={{
          backgroundImage:
            'linear-gradient(rgba(8,24,20,.35), rgba(8,24,20,.35)), url(/about.jpg), linear-gradient(135deg,#0d2620,#2b6350)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        🍽️
      </div>

      <h1 className="font-display text-3xl font-bold text-orange-600 mt-6">Our Story</h1>
      <p className="text-gray-700 mt-3 leading-relaxed">
        The Good Plate ek simple idea se shuru hua: logon ko ek saath laana, achhe khane ke
        zariye. Hum taaza ingredients, asli recipes aur mehmaannawazi ke junoon se kaam karte
        hain, taaki har meal ek yaadgaar pal ban jaye.
      </p>
      <p className="text-gray-700 mt-3 leading-relaxed">
        Ab aap apne pasandida restaurants se ghar baithe order kar sakte ho, ya apni table
        pehle se reserve kar sakte ho.
      </p>

      <div className="grid grid-cols-3 gap-3 mt-8 text-center">
        {HIGHLIGHTS.map((h) => (
          <div key={h.title} className="bg-white rounded-2xl shadow-sm p-3">
            <div className="text-3xl">{h.icon}</div>
            <p className="font-semibold text-sm text-orange-600 mt-2">{h.title}</p>
            <p className="text-xs text-gray-500 mt-1">{h.text}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <p className="font-display text-2xl font-bold italic text-[#163a2f]">The Good Plate</p>
        <p className="text-[10px] tracking-[0.35em] text-gray-500">RESTAURANT</p>
        <p className="text-sm text-[#a8793a] mt-1">Good Food • Great Mood</p>
      </div>
    </div>
  )
}