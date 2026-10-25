
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const categories = ['All', 'Burger', 'Pizza', 'Italian', 'Snacks', 'Desserts', 'Drinks']

const demoDishes = [
  {
    id: 'demo-burger',
    name: 'Classic Cheese Burger',
    category: 'Burger',
    description: 'Juicy burger with melted cheese and fresh vegetables.',
    price: 199,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=85',
    is_veg: false,
  },
  {
    id: 'demo-pizza',
    name: 'Margherita Pizza',
    category: 'Pizza',
    description: 'Classic pizza topped with tomato, mozzarella and basil.',
    price: 249,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=800&q=85',
    is_veg: true,
  },
  {
    id: 'demo-pasta',
    name: 'Creamy White Pasta',
    category: 'Italian',
    description: 'Creamy pasta tossed with herbs and a rich sauce.',
    price: 229,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=85',
    is_veg: true,
  },
  {
    id: 'demo-fries',
    name: 'Crispy French Fries',
    category: 'Snacks',
    description: 'Golden crispy fries with our signature seasoning.',
    price: 99,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=85',
    is_veg: true,
  },
  {
    id: 'demo-salad',
    name: 'Fresh Garden Salad',
    category: 'Healthy',
    description: 'Fresh greens and colourful vegetables in every bite.',
    price: 159,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=85',
    is_veg: true,
  },
  {
    id: 'demo-dessert',
    name: 'Chocolate Dessert',
    category: 'Desserts',
    description: 'A sweet treat for the perfect finish to your meal.',
    price: 149,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo- chocolate-placeholder',
    is_veg: true,
  },
  {
    id: 'demo-sandwich',
    name: 'Grilled Sandwich',
    category: 'Snacks',
    description: 'Toasted sandwich with a delicious savoury filling.',
    price: 129,
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=85',
    is_veg: true,
  },
  {
    id: 'demo-drink',
    name: 'Fresh Fruit Drink',
    category: 'Drinks',
    description: 'A refreshing drink to pair with your favourite meal.',
    price: 89,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=85',
    is_veg: true,
  },
]

function normaliseDish(dish) {
  return {
    ...dish,
    category: dish.category || dish.cuisine || 'Other',
    description: dish.description || 'Freshly prepared and ready to enjoy.',
    image: dish.image || '',
    price: Number(dish.price) || 0,
    rating: Number(dish.rating || dish.avg_rating) || 0,
    is_veg: dish.is_veg ?? dish.veg ?? false,
  }
}

export default function Menu() {
  const { user } = useAuth()
  const { addItem } = useCart()
  const navigate = useNavigate()

  const [dishes, setDishes] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [foodType, setFoodType] = useState('All')
  const [sort, setSort] = useState('popular')
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState('')
  const [toast, setToast] = useState('')
  const [addingId, setAddingId] = useState(null)

  useEffect(() => {
    let active = true

    async function loadMenu() {
      setLoading(true)
      setApiError('')

      try {
        const response = await api.get('/menu/')
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.results || response.data?.items || []

        if (active) {
          setDishes(data.map(normaliseDish))
        }
      } catch {
        // Demo cards are shown only as a frontend preview.
        if (active) {
          setDishes(demoDishes.map(normaliseDish))
          setApiError(
            'Demo menu dikh raha hai. Real menu ke liye backend ka /menu/ endpoint check karein.'
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadMenu()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(''), 2500)
    return () => clearTimeout(timer)
  }, [toast])

  const availableCategories = useMemo(() => {
    const actual = dishes
      .map((dish) => dish.category)
      .filter(Boolean)

    return ['All', ...new Set([...categories.slice(1), ...actual])]
  }, [dishes])

  const filteredDishes = useMemo(() => {
    let result = dishes.filter((dish) => {
      const text = `${dish.name} ${dish.category} ${dish.restaurant_name || ''}`.toLowerCase()
      const matchesSearch = text.includes(search.toLowerCase())
      const matchesCategory =
        category === 'All' || dish.category.toLowerCase() === category.toLowerCase()
      const matchesType =
        foodType === 'All' ||
        (foodType === 'Veg' && dish.is_veg) ||
        (foodType === 'Non-Veg' && !dish.is_veg)

      return matchesSearch && matchesCategory && matchesType
    })

    if (sort === 'price-low') result = [...result].sort((a, b) => a.price - b.price)
    if (sort === 'price-high') result = [...result].sort((a, b) => b.price - a.price)
    if (sort === 'rating') result = [...result].sort((a, b) => b.rating - a.rating)

    return result
  }, [dishes, search, category, foodType, sort])

  const handleAdd = async (dish) => {
    if (!user) {
      navigate('/login', {
        state: { message: 'Please log in to add items to your cart.' },
      })
      return
    }

    if (user.role !== 'CUSTOMER') {
      setToast('Cart use karne ke liye customer account se login karein.')
      return
    }

    if (String(dish.id).startsWith('demo-')) {
      setToast('Ye demo dish hai. Cart ke liye backend menu item use karein.')
      return
    }

    setAddingId(dish.id)

    try {
      await addItem(dish.id, 1)
      setToast(`${dish.name} cart mein add ho gaya!`)
    } catch (error) {
      setToast(error.response?.data?.detail || 'Item cart mein add nahi ho paya.')
    } finally {
      setAddingId(null)
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F7FC] text-[#17152E]">
      {toast && (
        <div
          role="status"
          className="fixed left-1/2 top-20 z-50 -translate-x-1/2 rounded-full bg-[#17152E] px-5 py-3 text-center text-sm font-medium text-white shadow-xl"
        >
          {toast}
        </div>
      )}

      {/* Menu hero */}
      <section className="relative isolate overflow-hidden bg-[#17152E]">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=2000&q=85')",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#17152E] via-[#17152E]/90 to-[#17152E]/45" />

        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-16 sm:px-8 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#B7A5FF]">
              Discover Our Menu
            </span>

            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              Find Your
              <br />
              <span className="text-[#FF8066]">Next Favourite.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
              From comfort food to delicious favourites, explore the dishes
              available on The Good Plate.
            </p>

            <a
              href="#all-dishes"
              className="mt-7 inline-flex rounded-xl bg-[#FF8066] px-6 py-3.5 font-bold text-white transition hover:bg-[#F16D53]"
            >
              Browse Dishes ↓
            </a>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85"
              alt="A colourful selection of freshly prepared food"
              className="h-64 w-full rounded-3xl object-cover shadow-2xl sm:h-80"
            />
            <div className="absolute -bottom-4 left-4 rounded-2xl bg-white px-5 py-4 shadow-xl sm:left-8">
              <p className="text-sm font-bold">Good food, good mood</p>
              <p className="mt-1 text-xs text-gray-500">
                Find something delicious today.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu content */}
      <section id="all-dishes" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-12 sm:px-8 md:py-16">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8066E8]">
            Explore & Choose
          </p>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
            Our <span className="text-[#FF8066]">Menu</span>
          </h2>
          <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
            Search dishes, filter by category and find the right meal for you.
          </p>
        </div>

        {/* Search and sorting */}
        <div className="rounded-3xl border border-[#17152E]/5 bg-white p-4 shadow-sm sm:p-6">
          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            <label className="relative block">
              <span className="sr-only">Search dishes or restaurants</span>
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400">
                ⌕
              </span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search dishes or restaurants..."
                className="w-full rounded-xl border border-gray-200 bg-[#FAF9FD] py-3.5 pl-12 pr-4 outline-none transition focus:border-[#B7A5FF] focus:ring-4 focus:ring-[#B7A5FF]/20"
              />
            </label>

            <label className="block">
              <span className="sr-only">Sort dishes</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 outline-none focus:border-[#B7A5FF]"
              >
                <option value="popular">Recommended</option>
                <option value="rating">Highest rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </label>
          </div>

          {/* Categories */}
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {availableCategories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                  category === item
                    ? 'border-[#17152E] bg-[#17152E] text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-[#FF8066] hover:text-[#E9674D]'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Veg filter */}
          <div className="mt-5 flex flex-wrap gap-2">
            {['All', 'Veg', 'Non-Veg'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFoodType(type)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  foodType === type
                    ? 'bg-[#F4F1FF] text-[#6E55D9] ring-1 ring-[#B7A5FF]'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {type === 'Veg' ? '🟢 ' : type === 'Non-Veg' ? '🔴 ' : ''}
                {type}
              </button>
            ))}
          </div>
        </div>

        {apiError && (
          <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
            {apiError}
          </p>
        )}

        <div className="mb-5 mt-8 flex items-center justify-between gap-3">
          <h3 className="text-xl font-extrabold">
            {category === 'All' ? 'All Dishes' : category}
          </h3>
          <span className="text-sm text-gray-500">
            {filteredDishes.length} items
          </span>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-3xl bg-white shadow-sm"
              />
            ))}
          </div>
        ) : filteredDishes.length === 0 ? (
          <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-sm">
            <div className="text-5xl">🍽️</div>
            <h3 className="mt-4 text-xl font-extrabold">No dishes found</h3>
            <p className="mt-2 text-sm text-gray-500">
              Try another search or change your filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setCategory('All')
                setFoodType('All')
              }}
              className="mt-5 rounded-xl bg-[#17152E] px-5 py-3 font-bold text-white"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredDishes.map((dish) => (
              <article
                key={dish.id}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#17152E]/5 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-52 shrink-0 overflow-hidden bg-[#F4F1FF]">
                  {dish.image ? (
                    <img
                      src={dish.image}
                      alt={dish.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-5xl">
                      🍽️
                    </div>
                  )}

                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#17152E] shadow">
                    {dish.category}
                  </span>

                  {dish.rating > 0 && (
                    <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#17152E] shadow">
                      ★ {dish.rating}
                    </span>
                  )}

                  <span className={`absolute bottom-3 left-3 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold ${dish.is_veg ? 'text-green-700' : 'text-red-600'}`}>
                    {dish.is_veg ? '● Veg' : '● Non-Veg'}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h4 className="text-lg font-extrabold leading-7 text-[#17152E]">
                    {dish.name}
                  </h4>

                  <p className="mt-2 min-h-[3rem] text-sm leading-6 text-gray-500">
                    {dish.description}
                  </p>

                  {dish.restaurant_name && (
                    <p className="mt-3 truncate text-xs text-gray-500">
                      From {dish.restaurant_name}
                    </p>
                  )}

                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-xs text-gray-400">Price</p>
                      <p className="mt-0.5 text-xl font-extrabold">
                        ₹{dish.price}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAdd(dish)}
                      disabled={addingId !== null}
                      className="rounded-xl bg-[#FF8066] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#F16D53] active:scale-95 disabled:opacity-60"
                    >
                      {addingId === dish.id ? 'Adding...' : '+ Add'}
                    </button>
                  </div>

                  {dish.restaurant_id && (
                    <Link
                      to={`/restaurant/${dish.restaurant_id}`}
                      className="mt-4 text-sm font-semibold text-[#8066E8] hover:underline"
                    >
                      View Restaurant →
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="px-5 pb-16 sm:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl bg-[#17152E] px-6 py-10 text-center sm:px-12 sm:py-14">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            Found Something Delicious?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/70 sm:text-base">
            Explore available restaurants and discover more meals to enjoy.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-xl bg-[#FF8066] px-6 py-3.5 font-bold text-white transition hover:bg-[#F16D53]"
          >
            Explore Restaurants →
          </Link>
        </div>
      </section>
    </main>
  )
}
