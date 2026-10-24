
import { useEffect, useState } from 'react'

const slides = [
  {
    image:
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1600&q=80',
    title: 'Good Food, Great Vibes',
    subtitle: 'Join The Good Plate community today.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1600&q=80',
    title: 'Fresh Food, Happy You',
    subtitle: 'Discover delicious meals and new favourites.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1600&q=80',
    title: 'Your Food Journey Starts Here',
    subtitle: 'Great food and happy moments are waiting.',
  },
]

export default function ShortHero() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((current) => (current + 1) % slides.length)
    }, 4500)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative h-[170px] sm:h-[200px] md:h-[220px] w-screen ml-[calc(50%-50vw)] overflow-hidden bg-[#17152E] text-white">
      {slides.map((slide, index) => (
        <div
          key={slide.image}
          aria-hidden="true"
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            active === index ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url("${slide.image}")` }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-[#17152E]/95 via-[#17152E]/75 to-[#17152E]/30" />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-5">
        <p className="mb-2 text-[10px] font-bold tracking-[0.2em] text-[#B7A5FF] sm:text-xs">
          WELCOME TO THE GOOD PLATE
        </p>

        <h1 className="text-2xl font-extrabold sm:text-3xl md:text-4xl">
          {slides[active].title}
        </h1>

        <p className="mt-2 max-w-lg text-xs text-white/85 sm:text-sm">
          {slides[active].subtitle}
        </p>

        <div className="mt-3 flex gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              aria-label={`Show slide ${index + 1}`}
              aria-pressed={active === index}
              onClick={() => setActive(index)}
              className={`h-1.5 rounded-full transition-all ${
                active === index
                  ? 'w-7 bg-[#B7A5FF]'
                  : 'w-2 bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
