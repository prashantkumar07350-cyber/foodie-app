import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Menu() {
  const { id } = useParams()
  const { user } = useAuth()
  const { addItem, cart, count } = useCart()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.get(`/restaurants/${id}/menu/`)
      .then((res) => setData(res.data))
      .catch(() => setError('Menu load nahi hua.'))
  }, [id])

  const handleAdd = async (foodId) => {
    setMessage('')
    if (!user) return navigate('/login')
    if (user.role !== 'CUSTOMER') return setMessage('Sirf customer cart use kar sakta hai.')
    try {
      await addItem(foodId, 1)
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Add nahi ho paya.')
    }
  }

  const qtyInCart = (foodId) =>
    cart?.items.find((i) => i.food_item === foodId)?.quantity || 0

  if (error) return <p className="bg-red-100 text-red-700 p-2 rounded">{error}</p>
  if (!data) return <p className="text-gray-500">Loading...</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <Link to="/" className="text-sm text-orange-600">← Restaurants</Link>
          <h1 className="text-2xl font-bold">{data.restaurant.name}</h1>
        </div>
        {count > 0 && (
          <Link to="/cart" className="bg-orange-600 text-white px-4 py-2 rounded">
            Cart ({count})
          </Link>
        )}
      </div>

      {message && <p className="bg-yellow-100 text-yellow-800 p-2 rounded mb-3 text-sm">{message}</p>}
      {data.menu.length === 0 && <p className="text-gray-500">Abhi menu khali hai.</p>}

      {data.menu.map((cat) => (
        <section key={cat.id} className="mb-6">
          <h2 className="text-lg font-semibold mb-2">{cat.name}</h2>
          <div className="space-y-2">
            {cat.items.map((item) => (
              <div key={item.id} className="bg-white rounded shadow p-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    <span className={item.is_veg ? 'text-green-600' : 'text-red-600'}>●</span>{' '}
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-600">Rs {item.price}</p>
                </div>
                {item.is_available ? (
                  <button
                    onClick={() => handleAdd(item.id)}
                    className="border border-orange-600 text-orange-600 px-3 py-1 rounded"
                  >
                    Add{qtyInCart(item.id) > 0 ? ` (${qtyInCart(item.id)})` : ''}
                  </button>
                ) : (
                  <span className="text-sm text-gray-400">Unavailable</span>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}