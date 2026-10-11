import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

export default function MenuManage() {
  const { user } = useAuth()
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [catName, setCatName] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({ category: '', name: '', price: '', is_veg: true })

  const load = useCallback(async () => {
    try {
      const [c, i] = await Promise.all([api.get('/menu/categories/'), api.get('/menu/items/')])
      setCategories(c.data)
      setItems(i.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Menu load nahi hua.')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (!user || user.role !== 'RESTAURANT') return <Navigate to="/login" />

  const showError = (err, fallback) => {
    const d = err.response?.data
    setError(d ? (d.detail || Object.values(d).flat().join(' ')) : fallback)
  }

  const addCategory = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/menu/categories/', { name: catName })
      setCatName('')
      load()
    } catch (err) {
      showError(err, 'Category nahi bani.')
    }
  }

  const addItem = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/menu/items/', { ...form, category: Number(form.category) })
      setForm({ ...form, name: '', price: '' })
      load()
    } catch (err) {
      showError(err, 'Dish nahi bani.')
    }
  }

  const toggleAvailable = async (item) => {
    await api.patch(`/menu/items/${item.id}/`, { is_available: !item.is_available })
    load()
  }

  const removeItem = async (id) => {
    if (!window.confirm('Ye dish delete karein?')) return
    await api.delete(`/menu/items/${id}/`)
    load()
  }

  const removeCategory = async (id) => {
    if (!window.confirm('Category aur uski saari dishes delete hongi. Pakka?')) return
    await api.delete(`/menu/categories/${id}/`)
    load()
  }

  const input = 'border rounded px-3 py-2 bg-white'

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/owner" className="text-sm text-orange-600">← Dashboard</Link>
      <h1 className="text-2xl font-bold mb-4">Menu manage</h1>
      {error && <p className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">{error}</p>}

      <form onSubmit={addCategory} className="flex gap-2 mb-4">
        <input placeholder="Nayi category (Starters, Main Course...)" required value={catName}
          onChange={(e) => setCatName(e.target.value)} className={`${input} flex-1`} />
        <button className="bg-orange-600 text-white px-4 rounded">Category add</button>
      </form>

      {categories.length > 0 && (
        <form onSubmit={addItem} className="bg-white rounded shadow p-4 mb-6 space-y-2">
          <p className="font-semibold">Nayi dish</p>
          <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
            className={`${input} w-full`}>
            <option value="">Category chuno</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div className="flex gap-2">
            <input placeholder="Dish name" required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} className={`${input} flex-1`} />
            <input placeholder="Price" type="number" step="0.01" min="1" required value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })} className={`${input} w-28`} />
          </div>
          <label className="text-sm flex items-center gap-2">
            <input type="checkbox" checked={form.is_veg}
              onChange={(e) => setForm({ ...form, is_veg: e.target.checked })} />
            Veg
          </label>
          <button className="bg-orange-600 text-white px-4 py-2 rounded">Dish add karo</button>
        </form>
      )}

      {categories.length === 0 && <p className="text-gray-500">Pehle ek category banao.</p>}

      {categories.map((c) => (
        <section key={c.id} className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-lg">{c.name}</h2>
            <button onClick={() => removeCategory(c.id)} className="text-xs text-red-600">Category delete</button>
          </div>
          <div className="space-y-2">
            {items.filter((i) => i.category === c.id).map((i) => (
              <div key={i.id} className="bg-white rounded shadow p-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    <span className={i.is_veg ? 'text-green-600' : 'text-red-600'}>●</span> {i.name}
                  </p>
                  <p className="text-sm text-gray-600">Rs {i.price}</p>
                </div>
                <div className="flex gap-2 text-sm">
                  <button onClick={() => toggleAvailable(i)}
                    className={`px-3 py-1 rounded ${i.is_available ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                    {i.is_available ? 'Available' : 'Unavailable'}
                  </button>
                  <button onClick={() => removeItem(i.id)} className="text-red-600 border border-red-300 px-2 py-1 rounded">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}