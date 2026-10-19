import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function RestaurantReviews({ restaurantId }) {
  const [list, setList] = useState([])

  useEffect(() => {
    api.get('/reviews/', { params: { restaurant: restaurantId } })
      .then((r) => setList(r.data))
      .catch(() => setList([]))
  }, [restaurantId])

  if (list.length === 0) return null

  return (
    <section className="mt-8">
      <h2 className="font-display text-xl font-bold text-orange-600 mb-3">Customer Reviews</h2>
      <div className="space-y-3">
        {list.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl shadow-sm p-4 text-sm">
            <div className="flex justify-between">
              <b>{r.customer_name}</b>
              <span className="text-[#e8a317]">
                {'★'.repeat(r.rating)}
                <span className="text-gray-300">{'★'.repeat(5 - r.rating)}</span>
              </span>
            </div>
            {r.comment && <p className="text-gray-600 mt-1">{r.comment}</p>}
            <p className="text-xs text-gray-400 mt-1">{new Date(r.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </section>
  )
}