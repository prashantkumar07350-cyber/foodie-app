import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cart, setCart] = useState(null)

  const refresh = useCallback(async () => {
    if (!user || user.role !== 'CUSTOMER') {
      setCart(null)
      return
    }
    try {
      const { data } = await api.get('/cart/')
      setCart(data)
    } catch {
      setCart(null)
    }
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addItem = async (foodId, quantity = 1) => {
    const { data } = await api.post('/cart/add/', { food_item: foodId, quantity })
    setCart(data)
  }

  const setQuantity = async (itemId, quantity) => {
    const { data } = await api.patch(`/cart/items/${itemId}/`, { quantity })
    setCart(data)
  }

  const clearCart = async () => {
    const { data } = await api.delete('/cart/clear/')
    setCart(data)
  }

  const count = cart ? cart.items.reduce((n, i) => n + i.quantity, 0) : 0

  return (
    <CartContext.Provider value={{ cart, count, refresh, addItem, setQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)