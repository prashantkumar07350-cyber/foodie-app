import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function PopularDishes({ dishes, onAddToCart }) {
  const [addingId, setAddingId] = useState(null)
  const [addedId, setAddedId] = useState(null)

  if (!dishes || dishes.length === 0) return null

  const handleAdd = async (dish) => {
    if (addingId !== null) return
    setAddingId(dish.id)
    const ok = await onAddToCart(dish)
    setAddingId(null)
    if (ok) {
      setAddedId(dish.id)
      setTimeout(() => setAddedId((c) => (c === dish.id ? null : c)), 1500)
    }
  }

  return (
    <section className="ml-[calc(50%-50vw)] w-screen bg-[#eef4f1] px-4 py-12 md:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] text-[#a8793a]">OUR SPECIALTIES</p>
            <h2 className="font-display mt-1 text-3xl font-bold text-orange-600">Popular Dishes</h2>
          </div>
          <a href="#restaurants"
            className="rounded-full border border-orange-600 px-4 py-1.5 text-sm text-orange-600">
            View All →
          </a>
        </div>

        <div className="grid grid-cols-2 items-stretch gap-4 lg:grid-cols-4 lg:gap-6">
          {dishes.map((dish, idx) => (
            <article key={dish.id}
              className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <Link to={'/dish/' + dish.id}
                className="relative flex h-36 shrink-0 items-center justify-center overflow-hidden bg-orange-100 text-5xl md:h-44">
                {dish.image ? (
                  <img src={dish.image} alt={dish.name} loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                ) : '🍽️'}
                {idx === 0 && (
                  <span className="absolute left-2 top-2 rounded-full bg-[#e8c07d] px-2 py-1 text-xs font-medium text-[#0d2620]">
                    Most Popular
                  </span>
                )}
              </Link>

              <div className="flex flex-1 flex-col p-3 md:p-4">
                <Link to={'/dish/' + dish.id} className="font-semibold text-sm md:text-base">
                  <span className={dish.is_veg ? 'text-green-600' : 'text-red-600'}>●</span>{' '}
                  {dish.name}
                </Link>
                <p className="mt-1 truncate text-xs text-gray-500">{dish.restaurant_name}</p>

                <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                  <span className="font-bold text-[#a8793a]">Rs {dish.price}</span>
                  <button type="button" onClick={() => handleAdd(dish)} disabled={addingId !== null}
                    className="rounded-full bg-orange-600 px-4 py-1.5 text-sm font-medium text-white transition active:scale-95 disabled:opacity-60">
                    {addingId === dish.id ? '...' : addedId === dish.id ? '✓ Added' : '+ Add'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}