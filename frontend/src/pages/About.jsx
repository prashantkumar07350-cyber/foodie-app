import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

const MIN_STATS_ORDERS = 10
const EYEBROW = 'text-xs font-semibold tracking-[0.25em] text-[#FF8066]'
const H2 = 'mt-1 text-2xl font-bold text-[#17152E] md:text-3xl'
const CORAL_BTN = 'bg-[#FF8066] text-[#17152E] font-bold hover:bg-[#ff9580]'

const VALUES = [
  {
    icon: '🥗',
    title: 'Fresh and local',
    text: 'We work with neighbourhood kitchens that cook to order, so your food arrives the way it should.',
  },
  {
    icon: '🔍',
    title: 'Honest and transparent',
    text: 'You see the full price, delivery fee and total before you pay. Reviews come only from real, delivered orders.',
  },
  {
    icon: '🤝',
    title: 'Fair to restaurants',
    text: 'Owners control their own menu, prices and availability, and get a simple dashboard to run everything.',
  },
  {
    icon: '⚡',
    title: 'Simple and fast',
    text: 'From browsing to checkout in a few taps, with live status updates until your order is at the door.',
  },
]

const CUSTOMER_POINTS = [
  'Browse restaurants, cuisines and popular dishes',
  'Order with saved addresses and Cash on Delivery',
  'Track your order from Placed to Delivered',
  'Reserve a table for a special evening',
  'Rate your meal after it arrives',
]

const OWNER_POINTS = [
  'Create your restaurant and get listed after approval',
  'Manage categories, dishes and availability',
  'Accept, prepare and deliver orders from one screen',
  'Confirm or decline table bookings',
  'Open or close your restaurant any time',
]

function Check({ children }) {
  return (
    <li className="flex gap-3 text-sm text-gray-700">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FF8066] text-xs font-bold text-[#17152E]">
        ✓
      </span>
      <span>{children}</span>
    </li>
  )
}

export default function About() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get('/stats/')
      .then((r) => setStats(r.data))
      .catch(() => setStats(null))
  }, [])

  const showStats = stats && stats.delivered >= MIN_STATS_ORDERS

  return (
    <div>
      {/* HERO */}
      <section
        className="relative -mt-6 ml-[calc(50%-50vw)] w-screen overflow-hidden bg-[#17152E] text-white"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(23,21,46,.96) 40%, rgba(23,21,46,.6)), url(/about.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <p className={EYEBROW}>ABOUT US</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            Bringing people together over{' '}
            <span className="text-[#FF8066]">good food</span>
          </h1>
          <p className="mt-5 max-w-2xl text-white/80 md:text-lg">
            The Good Plate connects hungry people with the restaurants around them. Order
            for delivery, or book a table and enjoy a meal out.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/" className={'rounded-full px-6 py-3 ' + CORAL_BTN}>
              Explore restaurants
            </Link>
            <Link to="/booking"
              className="rounded-full border border-white/60 px-6 py-3 hover:bg-white hover:text-[#17152E]">
              Book a table
            </Link>
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="mx-auto mt-14 grid max-w-6xl items-center gap-10 md:grid-cols-2">
        <div>
          <p className={EYEBROW}>OUR STORY</p>
          <h2 className={H2}>Good meals make good moments</h2>
          <p className="mt-4 leading-7 text-gray-700">
            We started with a simple idea: ordering from a local restaurant should be as
            easy as it is enjoyable. No confusing prices, no guessing where your order is.
          </p>
          <p className="mt-3 leading-7 text-gray-700">
            Today, customers can discover restaurants, order in minutes and track every
            step. Restaurant owners get their own space to manage menus, orders and table
            bookings, without any technical hassle.
          </p>
        </div>

        <div className="flex h-64 items-center justify-center rounded-3xl bg-[#17152E] text-8xl shadow-lg md:h-80">
          🍽️
        </div>
      </section>

      {/* VALUES */}
      <section className="ml-[calc(50%-50vw)] mt-16 w-screen bg-white py-14">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <p className={EYEBROW}>WHAT WE STAND FOR</p>
            <h2 className={H2}>Our values</h2>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title}
                className="rounded-2xl border border-gray-100 p-6 transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f1eefc] text-2xl">
                  {v.icon}
                </div>
                <h3 className="mt-4 font-semibold text-[#17152E]">{v.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REAL STATS */}
      {showStats && (
        <section className="mx-auto mt-14 max-w-6xl">
          <div className="grid grid-cols-3 gap-4 rounded-2xl bg-[#17152E] p-6 text-center text-white md:p-8">
            <div>
              <p className="text-3xl font-bold text-[#FF8066] md:text-5xl">{stats.restaurants}</p>
              <p className="mt-1 text-xs text-white/70 md:text-sm">Restaurants</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#FF8066] md:text-5xl">{stats.delivered}</p>
              <p className="mt-1 text-xs text-white/70 md:text-sm">Orders delivered</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#FF8066] md:text-5xl">
                {stats.reviews > 0 ? stats.avg_rating : '-'}
              </p>
              <p className="mt-1 text-xs text-white/70 md:text-sm">Average rating</p>
            </div>
          </div>
        </section>
      )}

      {/* HOW IT WORKS FOR EACH SIDE */}
      <section className="mx-auto mt-14 max-w-6xl">
        <div className="text-center">
          <p className={EYEBROW}>BUILT FOR BOTH SIDES</p>
          <h2 className={H2}>One platform, two experiences</h2>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#17152E]">For customers</h3>
            <ul className="mt-4 space-y-3">
              {CUSTOMER_POINTS.map((p) => <Check key={p}>{p}</Check>)}
            </ul>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#17152E]">For restaurant owners</h3>
            <ul className="mt-4 space-y-3">
              {OWNER_POINTS.map((p) => <Check key={p}>{p}</Check>)}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mb-4 mt-14 max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-5 rounded-3xl bg-[#17152E] px-8 py-10 text-center text-white md:flex-row md:text-left">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Ready to get started?</h2>
            <p className="mt-2 max-w-lg text-sm text-white/75">
              Order your next meal, or bring your restaurant online. It only takes a few minutes.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/" className={'rounded-full px-6 py-3 ' + CORAL_BTN}>Order now</Link>
            <Link to="/register"
              className="rounded-full border border-white/60 px-6 py-3 hover:bg-white hover:text-[#17152E]">
              List your restaurant
            </Link>
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-gray-500">
          Questions? Visit{' '}
          <Link to="/help" className="font-semibold text-[#17152E] underline">Help &amp; Support</Link>.
        </p>
      </section>
    </div>
  )
}