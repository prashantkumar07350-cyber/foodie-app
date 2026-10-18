import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SLIDES = [
  {
    emoji: '🍝',
    title: 'Delicious Food\nFor Every Mood',
    text: 'Fresh ingredients, authentic flavors, and a cozy atmosphere.',
  },
  {
    emoji: '🛵',
    title: 'Fast Delivery\nTo Your Door',
    text: 'Apne pasandida restaurants se order karo, garma garam ghar tak.',
  },
  {
    emoji: '📅',
    title: 'Book A Table\nIn Seconds',
    text: 'Special moments ke liye apni table pehle se reserve karo.',
  },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const [i, setI] = useState(0)
  const last = i === SLIDES.length - 1
  const s = SLIDES[i]

  const finish = () => {
    localStorage.setItem('onboarded', '1')
    navigate('/', { replace: true })
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#faf8f3] flex flex-col md:items-center md:justify-center">
      <div className="w-full md:max-w-sm md:rounded-3xl md:shadow-xl md:overflow-hidden bg-[#faf8f3] flex flex-col h-full md:h-[640px]">
        <div className="h-[55%] bg-[#dce9e3] flex items-center justify-center text-[110px]">
          {s.emoji}
        </div>

        <div className="flex-1 px-7 pt-6 pb-8 flex flex-col">
          <h1 className="font-display text-3xl font-bold text-[#163a2f] whitespace-pre-line">
            {s.title}
          </h1>
          <p className="mt-3 text-gray-600 text-sm">{s.text}</p>

          <div className="flex gap-2 my-6">
            {SLIDES.map((_, idx) => (
              <span key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === i ? 'w-6 bg-[#1f4a3d]' : 'w-2 bg-gray-300'}`} />
            ))}
          </div>

          <div className="mt-auto">
            <button
              onClick={() => (last ? finish() : setI(i + 1))}
              className="w-full bg-[#1f4a3d] text-white py-3 rounded-lg font-medium">
              {last ? 'Get Started' : 'Next'}
            </button>
            <button onClick={finish} className="w-full text-sm text-gray-600 mt-3 py-2">
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}