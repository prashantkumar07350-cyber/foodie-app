import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import RestaurantReviews from '../components/RestaurantReviews'

const BTN_ROUND = 'w-8 h-8 rounded-full bg-orange-600 text-white text-lg leading-none'
const BTN_MINUS = 'w-8 h-8 rounded-full border border-orange-600 text-orange-600 text-lg leading-none'

export default function Menu() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { cart, count, addItem, setQuantity, clearCart } = useCart()

  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [active, setActive] = useState('All')
  const [message, setMessage] = useState('')
  const [conflict, setConflict] = useState(false)

  useEffect(() => {
    setData(null)
    setActive('All')
    api.get('/restaurants/' + id + '/menu/')
      .then((res) => setData(res.data))
      .catch(() => setError('Menu load nahi hua.'))
  }, [id])

  const sections = useMemo(() => {
    if (!data) return []
    return active === 'All' ? data.menu : data.menu.filter((c) => c.name === active)
  }, [data, active])

  const cartItemFor = (foodId) =>
    cart ? cart.items.find((i) => i.food_item === foodId) : null

  const requireCustomer = () => {
    if (!user) {
      navigate('/login')
      return false
    }
    if (user.role !== 'CUSTOMER') {
      setMessage('Sirf customer cart use kar sakta hai.')
      return false
    }
    return true
  }

  const handleAdd = async (foodId) => {
    setMessage('')
    setConflict(false)
    if (!requireCustomer()) return
    try {
      await addItem(foodId, 1)
    } catch (err) {
      const res = err.response
      setMessage((res && res.data && res.data.detail) || 'Add nahi ho paya.')
      if (res && res.status === 409) setConflict(true)
    }
  }

  const handleQty = async (item, qty) => {
    setMessage('')
    try {
      await setQuantity(item.id, qty)
    } catch {
      setMessage('Quantity badal nahi payi.')
    }
  }

  const handleClear = async () => {
    await clearCart()
    setConflict(false)
    setMessage('Cart khali ho gaya. Ab dish add karo.')
  }

  if (error) return <p className="bg-red-100 text-red-700 p-2 rounded">{error}</p>
  if (!data) return <p className="text-gray-500">Loading...</p>

  const closed = !data.restaurant.is_open

  return (
    <div className="pb-20">
      <Link to="/" className="text-sm text-orange-600">← Back</Link>
      <h1 className="font-display text-3xl font-bold text-orange-600 mt-1">Our Menu</h1>
           <p className="text-sm text-gray-500">
        {data.restaurant.name} • Freshly prepared. Always delicious.
      </p>
      <RestaurantReviews restaurantId={id} />
      {data.restaurant.review_count > 0 && (
        <p className="text-sm mt-1">
          <span className="text-[#e8a317]">★</span>{' '}
          <b>{data.restaurant.avg_rating}</b>{' '}
          <span className="text-gray-500">({data.restaurant.review_count} reviews)</span>
        </p>
      )}

      {closed && (
        <p className="bg-gray-200 text-gray-700 p-2 rounded mt-3 text-sm">
          Ye restaurant abhi band hai. Order nahi le sakte.
        </p>
      )}

      {message && (
        <div className="bg-yellow-100 text-yellow-800 p-2 rounded mt-3 text-sm flex justify-between items-center gap-2">
          <span>{message}</span>
          {conflict && (
            <button onClick={handleClear} className="underline whitespace-nowrap">
              Cart clear karo
            </button>
          )}
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto py-4">
        {['All', ...data.menu.map((c) => c.name)].map((name) => (
          <button key={name} onClick={() => setActive(name)}
            className={
              'px-5 py-2 rounded-full text-sm whitespace-nowrap border ' +
              (active === name
                ? 'bg-orange-600 text-white border-orange-600'
                : 'bg-white text-gray-700')
            }>
            {name}
          </button>
        ))}
      </div>

      {data.menu.length === 0 && <p className="text-gray-500">Abhi menu khali hai.</p>}

      {sections.map((cat) => (
        <section key={cat.id} className="mb-6">
          <h2 className="font-semibold text-lg mb-2">{cat.name}</h2>
          <div className="space-y-3">
            {cat.items.map((item) => {
              const inCart = cartItemFor(item.id)
              return (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm p-3 flex gap-3">
                                   <Link to={'/dish/' + item.id}
                    className="w-24 h-24 rounded-xl bg-orange-50 overflow-hidden flex items-center justify-center text-4xl shrink-0">
                    {item.image
                      ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      : '🍽️'}
                  </Link>
                  <div className="flex-1 min-w-0 flex flex-col">
                                       <Link to={'/dish/' + item.id} className="font-medium">
                      <span className={item.is_veg ? 'text-green-600' : 'text-red-600'}>●</span>{' '}
                      {item.name}
                    </Link>
                    {item.description && (
                      <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <span className="font-semibold text-[#a8793a]">Rs {item.price}</span>
                      {!item.is_available || closed ? (
                        <span className="text-xs text-gray-400">Unavailable</span>
                      ) : inCart ? (
                        <div className="flex items-center gap-2">
                          <button className={BTN_MINUS}
                            onClick={() => handleQty(inCart, inCart.quantity - 1)}>−</button>
                          <span className="w-5 text-center text-sm">{inCart.quantity}</span>
                          <button className={BTN_ROUND}
                            onClick={() => handleQty(inCart, inCart.quantity + 1)}>+</button>
                        </div>
                      ) : (
                        <button className={BTN_ROUND} onClick={() => handleAdd(item.id)}>+</button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      ))}

      {count > 0 && (
        <Link to="/cart"
          className="fixed bottom-16 md:bottom-4 inset-x-4 md:inset-x-auto md:right-8 md:w-80 z-20 bg-orange-600 text-white rounded-full px-5 py-3 flex justify-between shadow-lg">
          <span>View Cart ({count})</span>
          <span>Rs {cart ? cart.total : 0}</span>
        </Link>
      )}
    </div>
  )
}