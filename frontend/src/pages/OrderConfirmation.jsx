import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function OrderConfirmation() {
  const { id } = useParams()
  const { user } = useAuth()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    api.get('/orders/' + id + '/')
      .then((r) => setOrder(r.data))
      .catch(() => setError('Order nahi mila.'))
  }, [id, user])

  if (!user) return <Navigate to="/login" />
  if (error) return <p className="bg-red-100 text-red-700 p-2 rounded">{error}</p>
  if (!order) return <p className="text-gray-500">Loading...</p>

  const row = 'flex justify-between py-2 text-sm'

  return (
    <div className="max-w-md mx-auto text-center mt-6">
      <div className="w-24 h-24 mx-auto rounded-full bg-[#dce9e3] flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-[#1f4a3d] text-white text-4xl flex items-center justify-center">
          ✓
        </div>
      </div>

      <h1 className="font-display text-2xl font-bold text-orange-600 mt-5">
        Order Placed Successfully!
      </h1>
      <p className="text-sm text-gray-500 mt-1">
        Your order has been confirmed. We'll get it ready soon.
      </p>

      <div className="bg-white rounded-2xl shadow-sm p-4 mt-6 text-left">
        <div className={row}>
          <span className="text-gray-500">Order ID</span>
          <b>#GP{String(order.id).padStart(6, '0')}</b>
        </div>
        <div className={row + ' border-t'}>
          <span className="text-gray-500">Restaurant</span>
          <b>{order.restaurant_name}</b>
        </div>
        <div className={row + ' border-t'}>
          <span className="text-gray-500">Payment</span>
          <b>{order.payment_method === 'COD' ? 'Cash on Delivery' : order.payment_method}</b>
        </div>
        <div className={row + ' border-t'}>
          <span className="text-gray-500">Estimated Delivery Time</span>
          <b>30-40 mins</b>
        </div>
        <div className={row + ' border-t'}>
          <span className="text-gray-500">Total Amount</span>
          <b>Rs {order.total}</b>
        </div>
      </div>

      <Link to="/orders"
        className="block w-full bg-orange-600 text-white py-3 rounded-lg font-medium mt-6">
        View Order
      </Link>
      <Link to="/"
        className="block w-full border border-orange-600 text-orange-600 py-3 rounded-lg font-medium mt-3">
        Back to Home
      </Link>
    </div>
  )
}