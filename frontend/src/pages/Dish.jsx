import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Dish() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { cart, addItem, clearCart } = useCart()

  const [dish, setDish] = useState(null)
  const [error, setError] = useState('')
  const [qty, setQty] = useState(1)
  const [message, setMessage] = useState('')
  const [added, setAdded] = useState(false)
  const [conflict, setConflict] = useState(false)

  useEffect(() => {
    setDish(null)
    setQty(1)
    api.get('/menu/dishes/' + id + '/')
      .then((r) => setDish(r.data))
      .catch(() => setError('Dish nahi mili.'))
  }, [id])

  const inCart = dish && cart ? cart.items.find((i) => i.food_item === dish.id) : null

  const handleAdd = async () => {
    setMessage('')
    setAdded(false)
    setConflict(false)
    if (!user) return navigate('/login')
    if (user.role !== 'CUSTOMER') return setMessage('Sirf customer cart use kar sakta hai.')
    try {
      await addItem(dish.id, qty)
      setAdded(true)
    } catch (err) {
      const res = err.response
      setMessage((res && res.data && res.data.detail) || 'Add nahi ho paya.')
      if (res && res.status === 409) setConflict(true)
    }
  }

  const handleClear = async () => {
    await clearCart()
    setConflict(false)
    setMessage('Cart khali ho gaya. Ab dobara Add to Cart dabao.')
  }

  if (error) return <p className="bg-red-100 text-red-700 p-2 rounded">{error}</p>
  if (!dish) return <p className="text-gray-500">Loading...</p>

  const unavailable = !dish.is_available || !dish.restaurant_is_open
  const total = (Number(dish.price) * qty).toFixed(2)

  return (
    <div className="max-w-xl mx-auto pb-6">
      <Link to={'/restaurant/' + dish.restaurant_id} className="text-sm text-orange-600">
        ← Back to menu
      </Link>

      <div className="mt-2 h-64 md:h-80 rounded-2xl bg-orange-50 overflow-hidden flex items-center justify-center text-8xl">
        {dish.image
          ? <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
          : '🍽️'}
      </div>

      <div className="flex justify-between items-start mt-4 gap-3">
        <h1 className="font-display text-2xl font-bold text-orange-600">
          <span className={dish.is_veg ? 'text-green-600' : 'text-red-600'}>●</span>{' '}
          {dish.name}
        </h1>
        <span className="text-xl font-bold text-[#a8793a] whitespace-nowrap">Rs {dish.price}</span>
      </div>
      <p className="text-sm text-gray-500">{dish.restaurant_name}</p>

      {dish.description && <p className="text-gray-700 mt-3">{dish.description}</p>}

      {message && (
        <div className="bg-yellow-100 text-yellow-800 p-2 rounded mt-3 text-sm flex justify-between gap-2">
          <span>{message}</span>
          {conflict && (
            <button onClick={handleClear} className="underline whitespace-nowrap">
              Cart clear karo
            </button>
          )}
        </div>
      )}

      {added && (
        <div className="bg-green-100 text-green-800 p-2 rounded mt-3 text-sm flex justify-between">
          <span>Cart mein add ho gaya.</span>
          <Link to="/cart" className="underline">View Cart</Link>
        </div>
      )}

      {unavailable ? (
        <p className="mt-5 text-center text-gray-500 bg-gray-100 rounded-lg py-3">
          Ye dish abhi available nahi hai.
        </p>
      ) : (
        <div className="flex items-center gap-3 mt-5">
          <div className="flex items-center border border-gray-300 rounded-lg bg-white">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2 text-lg">−</button>
            <span className="w-8 text-center">{qty}</span>
            <button onClick={() => setQty(Math.min(50, qty + 1))} className="px-4 py-2 text-lg">+</button>
          </div>
          <button onClick={handleAdd}
            className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-medium">
            Add to Cart • Rs {total}
          </button>
        </div>
      )}

      {inCart && (
        <p className="text-xs text-gray-500 mt-2">
          Cart mein pehle se {inCart.quantity} hai.
        </p>
      )}

      {dish.ingredients_list.length > 0 && (
        <section className="mt-6">
          <h2 className="font-semibold mb-2">Ingredients</h2>
          <div className="flex flex-wrap gap-2">
            {dish.ingredients_list.map((x) => (
              <span key={x} className="bg-white border border-gray-200 rounded-full px-4 py-1.5 text-sm">
                {x}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}