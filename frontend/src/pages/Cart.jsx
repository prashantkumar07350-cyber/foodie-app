import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { cart, setQuantity, clearCart } = useCart()

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-600 mb-3">Cart khali hai.</p>
        <Link to="/" className="text-orange-600">Restaurants dekho</Link>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Cart</h1>
      <p className="text-gray-600 mb-4">{cart.restaurant_name}</p>

      <div className="bg-white rounded shadow divide-y">
        {cart.items.map((i) => (
          <div key={i.id} className="p-3 flex items-center justify-between">
            <div>
              <p className="font-medium">{i.name}</p>
              <p className="text-sm text-gray-500">Rs {i.price} each</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setQuantity(i.id, i.quantity - 1)} className="w-7 h-7 border rounded">−</button>
              <span>{i.quantity}</span>
              <button onClick={() => setQuantity(i.id, i.quantity + 1)} className="w-7 h-7 border rounded">+</button>
              <span className="w-20 text-right">Rs {i.line_total}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded shadow p-4 mt-4 space-y-1">
        <div className="flex justify-between"><span>Subtotal</span><span>Rs {cart.subtotal}</span></div>
        <div className="flex justify-between"><span>Delivery fee</span><span>Rs {cart.delivery_fee}</span></div>
        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total</span><span>Rs {cart.total}</span>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button onClick={clearCart} className="border px-4 py-2 rounded">Clear cart</button>
        <Link to="/checkout" className="flex-1 text-center bg-orange-600 text-white py-2 rounded">
          Checkout
        </Link>
      </div>
    </div>
  )
}