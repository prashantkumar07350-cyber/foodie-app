import { useEffect, useState } from 'react'
import api from '../api/axios'

function Stars({ value }) {
  return (
    <span className="text-[#e8a317]">
      {'★'.repeat(value)}
      <span className="text-gray-300">{'★'.repeat(5 - value)}</span>
    </span>
  )
}

export default function ReviewBox({ orderId }) {
  const [review, setReview] = useState(undefined)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/reviews/', { params: { order: orderId } })
      .then((r) => setReview(r.data[0] || null))
      .catch(() => setReview(null))
  }, [orderId])

  const submit = async (e) => {
    e.preventDefault()
    if (!rating) return setError('Pehle star rating chuno.')
    setError('')
    setSaving(true)
    try {
      const { data } = await api.post('/reviews/', { order: orderId, rating, comment })
      setReview(data)
    } catch (err) {
      const d = err.response && err.response.data
      setError(d ? Object.values(d).flat().join(' ') : 'Review save nahi hua.')
    } finally {
      setSaving(false)
    }
  }

  if (review === undefined) return null

  if (review) {
    return (
      <section className="bg-white rounded-2xl shadow-sm p-4">
        <h2 className="font-semibold mb-1">Aapka review</h2>
        <p className="text-xl"><Stars value={review.rating} /></p>
        {review.comment && <p className="text-sm text-gray-600 mt-1">{review.comment}</p>}
      </section>
    )
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm p-4">
      <h2 className="font-semibold mb-2">Khana kaisa laga?</h2>
      {error && <p className="bg-red-100 text-red-700 p-2 rounded mb-2 text-sm">{error}</p>}
      <form onSubmit={submit} className="space-y-3">
        <div className="flex gap-1 text-3xl">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => setRating(n)}
              className={n <= rating ? 'text-[#e8a317]' : 'text-gray-300'}>★</button>
          ))}
        </div>
        <textarea rows={3} maxLength={500} value={comment} onChange={(e) => setComment(e.target.value)}
          placeholder="Apna experience likho (optional)"
          className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white text-sm" />
        <button disabled={saving}
          className="bg-orange-600 text-white px-5 py-2 rounded-lg text-sm disabled:opacity-60">
          {saving ? 'Saving...' : 'Submit Review'}
        </button>
      </form>
    </section>
  )
}