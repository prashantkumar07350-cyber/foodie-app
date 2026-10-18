import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const API_HOST = 'http://127.0.0.1:8000'
const BTN_ROUND = 'w-7 h-7 rounded-full bg-orange-600 text-white leading-none'
const BTN_MINUS = 'w-7 h-7 rounded-full border border-orange-600 text-orange-600 leading-none'

export default function Cart() {
  const { cart, setQuantity, clearCart } = useCart()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const change = async (id, qty) => {
    setError('')
    try {
      await setQuantity(id, qty)
    } catch {
      setError('Cart update nahi ho paya.')
    }
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center mt-16">
        <p className="text-6xl mb-3">🛒</p>
        <h1 className="font-display text-2xl font-bold text-orange-600">Cart khali hai</h1>
        <p className="text-gray-500 mt-1 mb-5">Kuch tasty add karo.</p>
        <Link to="/" className="bg-orange-600 text-white px-6 py-3 rounded-lg">
          Restaurants dekho
        </Link>
      </div>
    )
  }

  const unavailable = cart.items.some((i) => !i.is_available)
  const belowMin = Number(cart.subtotal) < Number(cart.min_order)
  const blocked = unavailable || belowMin

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-1">
        <button onClick={() => navigate(-1)} className="text-sm text-orange-600">← Back</button>
        <button onClick={clearCart} className="text-sm text-red-600">Clear cart</button>
      </div>
      <h1 className="font-display text-3xl font-bold text-orange-600">Your Cart</h1>
      <p className="text-sm text-gray-500 mb-4">{cart.restaurant_name}</p>

      {error && <p className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">{error}</p>}

      <div className="space-y-3">
        {cart.items.map((i) => (
          <div key={i.id} className="bg-white rounded-2xl shadow-sm p-3 flex gap-3">
            <Link to={'/dish/' + i.food_item}
              className="w-20 h-20 rounded-xl bg-orange-50 overflow-hidden flex items-center justify-center text-3xl shrink-0">
              {i.image
                ? <img src={API_HOST + i.image} alt={i.name} className="w-full h-full object-cover" />
                : '🍽️'}
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between gap-2">
                <p className="font-medium">
                  <span className={i.is_veg ? 'text-green-600' : 'text-red-600'}>●</span> {i.name}
                </p>
                <button onClick={() => change(i.id, 0)} className="text-red-500 text-sm"
                  aria-label="Remove">🗑</button>
              </div>
              {!i.is_available && (
                <p className="text-xs text-red-600">Ab available nahi. Hata do.</p>
              )}
              <div className="flex items-center justify-between mt-2">
                <span className="font-semibold text-[#a8793a]">Rs {i.price}</span>
                <div className="flex items-center gap-2">
                  <button className={BTN_MINUS} onClick={() => change(i.id, i.quantity - 1)}>−</button>
                  <span className="w-5 text-center text-sm">{i.quantity}</span>
                  <button className={BTN_ROUND} onClick={() => change(i.id, i.quantity + 1)}>+</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 mt-4 space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span><span>Rs {cart.subtotal}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Delivery Fee</span><span>Rs {cart.delivery_fee}</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total</span><span>Rs {cart.total}</span>
        </div>
      </div>

      {belowMin && (
        <p className="bg-yellow-100 text-yellow-800 p-2 rounded mt-3 text-sm">
          Minimum order Rs {cart.min_order} ka hai. Aur dishes add karo.
        </p>
      )}

      <button disabled={blocked} onClick={() => navigate('/checkout')}
        className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium mt-4 disabled:opacity-50">
        Proceed to Checkout
      </button>
      <Link to={'/restaurant/' + cart.restaurant}
        className="block text-center text-sm text-orange-600 mt-3">
        + Aur dishes add karo
      </Link>
    </div>
  )
}