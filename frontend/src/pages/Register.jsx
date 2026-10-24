
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

const COLORS = {
  primary: '#17152E',
  dropdown: '#24213F',
  accent: '#B7A5FF',
  coral: '#FF8066',
  text: '#F7F5FF',
  background: '#F4F1FF',
}

const HERO_SLIDES = [
  {
    image:
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=2200&q=85',
    eyebrow: 'WELCOME TO THE GOOD PLATE',
    title: 'Good Food, Great Vibes',
    subtitle: 'Join The Good Plate community today.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2200&q=85',
    eyebrow: 'YOUR NEXT FAVOURITE MEAL',
    title: 'Every Meal, A Happy Moment',
    subtitle: 'Discover delicious food and new favourites.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1515003197210-e0cd7184f8b5?auto=format&fit=crop&w=2200&q=85',
    eyebrow: 'GOOD FOOD, GOOD MOOD',
    title: 'Your Table Is Waiting',
    subtitle: 'Great food and great people start here.',
  },
]

const ROLES = [
  {
    value: 'CUSTOMER',
    icon: '🛍️',
    title: 'Customer',
    description: 'Discover food & order your favourites',
  },
  {
    value: 'RESTAURANT',
    icon: '👨‍🍳',
    title: 'Restaurant Owner',
    description: 'Manage your restaurant & menu',
  },
  {
    value: 'DELIVERY',
    icon: '🛵',
    title: 'Delivery Partner',
    description: 'Deliver happiness to every doorstep',
  },
]

function RegisterHero() {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % HERO_SLIDES.length)
    }, 4500)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative isolate h-[175px] w-full overflow-hidden sm:h-[205px] md:h-[225px]">
      {HERO_SLIDES.map((slide, index) => (
        <div
          key={slide.title}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            activeSlide === index ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url("${slide.image}")` }}
          aria-hidden="true"
        />
      ))}

      <div className="absolute inset-0 bg-[#17152E]/65" />

      <div className="relative mx-auto flex h-full w-full max-w-7xl flex-col justify-center px-5 sm:px-8 lg:px-12">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#B7A5FF] sm:text-xs md:text-sm">
          {HERO_SLIDES[activeSlide].eyebrow}
        </p>

        <h1 className="max-w-3xl text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-4xl">
          {HERO_SLIDES[activeSlide].title}
        </h1>

        <p className="mt-2 max-w-xl text-xs text-white/90 sm:text-sm md:text-base">
          {HERO_SLIDES[activeSlide].subtitle}
        </p>

        <div className="mt-4 flex items-center gap-2">
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => setActiveSlide(index)}
              aria-label={`Show hero slide ${index + 1}`}
              aria-pressed={activeSlide === index}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeSlide === index
                  ? 'w-7 bg-[#FF8066]'
                  : 'w-2 bg-white/70 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    role: 'CUSTOMER',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))

    setErrors((previous) => ({
      ...previous,
      [name]: '',
      non_field_errors: '',
      detail: '',
      general: '',
    }))
  }

  const handleRoleChange = (role) => {
    setForm((previous) => ({
      ...previous,
      role,
    }))

    setErrors((previous) => ({
      ...previous,
      role: '',
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrors({})

    const cleanedForm = {
      ...form,
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    }

    if (!cleanedForm.first_name || !cleanedForm.last_name) {
      setErrors({
        first_name: !cleanedForm.first_name
          ? 'First name is required.'
          : '',
        last_name: !cleanedForm.last_name
          ? 'Last name is required.'
          : '',
      })
      return
    }

    if (cleanedForm.password.length < 8) {
      setErrors({
        password: 'Password must be at least 8 characters.',
      })
      return
    }

    setLoading(true)

    try {
      await api.post('/auth/register/', cleanedForm)

      navigate('/login', {
        state: {
          message: 'Registration successful! Please log in.',
          email: cleanedForm.email,
        },
      })
    } catch (error) {
      const responseData = error.response?.data

      if (responseData && typeof responseData === 'object') {
        const formattedErrors = {}

        Object.entries(responseData).forEach(([key, value]) => {
          formattedErrors[key] = Array.isArray(value)
            ? value.join(' ')
            : typeof value === 'string'
              ? value
              : JSON.stringify(value)
        })

        setErrors(formattedErrors)
      } else {
        setErrors({
          general: 'Registration failed. Please try again.',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const getError = (field) => {
    const error = errors[field]
    if (!error) return null

    return (
      <p className="mt-1 text-sm text-red-600" role="alert">
        {error}
      </p>
    )
  }

  const inputClass =
    'mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#17152E] outline-none transition placeholder:text-gray-400 focus:border-[#B7A5FF] focus:ring-4 focus:ring-[#B7A5FF]/20'

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden"
      style={{ backgroundColor: COLORS.background }}
    >
      {/* Full-width hero below the existing navbar */}
      <RegisterHero />

      {/* Registration card */}
      <main className="w-full px-3 py-6 sm:px-5 sm:py-8 md:px-6 lg:py-10">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-[28px] bg-white shadow-xl md:rounded-[32px] lg:grid-cols-2">

          {/* LEFT SIDE: BRANDING CARD */}
          <section
            className="relative flex flex-col justify-between overflow-hidden px-6 py-8 text-white sm:px-9 sm:py-10 lg:px-12 lg:py-12"
            style={{
              background: `linear-gradient(145deg, ${COLORS.primary}, ${COLORS.dropdown})`,
            }}
          >
            <div className="absolute -right-20 top-24 h-64 w-64 rounded-full bg-[#B7A5FF]/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#FF8066]/10 blur-3xl" />

            <div className="relative z-10">
              <Link to="/" className="inline-flex items-center gap-3">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl shadow-lg"
                  style={{ backgroundColor: COLORS.coral }}
                >
                  🍽️
                </span>

                <span className="text-xl font-extrabold tracking-tight sm:text-2xl">
                  The Good <span style={{ color: COLORS.accent }}>Plate</span>
                </span>
              </Link>

              <div className="mt-9 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wide">
                <span style={{ color: COLORS.coral }}>✦</span>
                A fresh way to connect
              </div>

              <h2 className="mt-6 max-w-md text-4xl font-extrabold leading-tight sm:text-5xl lg:text-[52px]">
                Good food.
                <br />
                Great people.
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-white/70 sm:text-base">
                Discover delicious meals, connect with restaurants, and enjoy
                a better food experience with The Good Plate.
              </p>
            </div>

            <div className="relative z-10 mt-8">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: '🍕', label: 'Tasty food' },
                  { icon: '❤️', label: 'Made with love' },
                  { icon: '🚀', label: 'Easy ordering' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center"
                  >
                    <div className="text-2xl">{item.icon}</div>
                    <p className="mt-2 text-[11px] font-semibold text-white/80 sm:text-xs">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-8 text-xs font-medium tracking-[0.18em] text-white/50">
                GOOD FOOD, GOOD MOOD
              </p>
            </div>
          </section>

          {/* RIGHT SIDE: REGISTRATION FORM */}
          <section className="min-w-0 px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            <div className="mx-auto w-full max-w-xl">
              <p
                className="text-xs font-bold uppercase tracking-[0.2em] sm:text-sm"
                style={{ color: '#8B72FF' }}
              >
                Your journey starts here
              </p>

              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#17152E] sm:text-4xl">
                Create your account
                <span style={{ color: COLORS.coral }}>.</span>
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500 sm:text-base">
                A few details, and you are ready to get started.
              </p>

              {(errors.general ||
                errors.detail ||
                errors.non_field_errors) && (
                <div
                  className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
                  role="alert"
                >
                  {errors.general ||
                    errors.detail ||
                    errors.non_field_errors}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">

                {/* ROLE SELECTION */}
                <fieldset>
                  <legend className="mb-3 text-sm font-bold text-[#17152E]">
                    First, tell us who you are
                  </legend>

                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {ROLES.map((role) => {
                      const selected = form.role === role.value

                      return (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => handleRoleChange(role.value)}
                          aria-pressed={selected}
                          className={`relative min-w-0 rounded-2xl border-2 p-3 text-left transition-all sm:p-4 ${
                            selected
                              ? 'border-[#B7A5FF] bg-[#F4F1FF]'
                              : 'border-gray-100 bg-white hover:border-[#D8CEFF]'
                          }`}
                        >
                          <span className="text-xl sm:text-2xl">
                            {role.icon}
                          </span>

                          <span
                            className={`absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border text-xs ${
                              selected
                                ? 'border-[#17152E] bg-[#17152E] text-white'
                                : 'border-gray-300 text-transparent'
                            }`}
                          >
                            ✓
                          </span>

                          <span className="mt-3 block text-xs font-bold leading-5 text-[#17152E] sm:text-sm">
                            {role.title}
                          </span>

                          <span className="mt-1 block text-[10px] leading-4 text-gray-500 sm:text-xs sm:leading-5">
                            {role.description}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  {getError('role')}
                </fieldset>

                {/* FIRST AND LAST NAME */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="first_name"
                      className="text-sm font-semibold text-[#17152E]"
                    >
                      First name
                    </label>

                    <input
                      id="first_name"
                      name="first_name"
                      type="text"
                      autoComplete="given-name"
                      placeholder="Enter first name"
                      value={form.first_name}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />

                    {getError('first_name')}
                  </div>

                  <div>
                    <label
                      htmlFor="last_name"
                      className="text-sm font-semibold text-[#17152E]"
                    >
                      Last name
                    </label>

                    <input
                      id="last_name"
                      name="last_name"
                      type="text"
                      autoComplete="family-name"
                      placeholder="Enter last name"
                      value={form.last_name}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />

                    {getError('last_name')}
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-[#17152E]"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />

                  {getError('email')}
                </div>

                {/* PHONE */}
                <div>
                  <label
                    htmlFor="phone"
                    className="text-sm font-semibold text-[#17152E]"
                  >
                    Phone number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="Enter phone number"
                    value={form.phone}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />

                  {getError('phone')}
                </div>

                {/* PASSWORD */}
                <div>
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-[#17152E]"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Create a password"
                      value={form.password}
                      onChange={handleChange}
                      className={`${inputClass} pr-20`}
                      minLength={8}
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#7463C8] hover:text-[#17152E]"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  <p className="mt-2 text-xs text-gray-500">
                    Use at least 8 characters.
                  </p>

                  {getError('password')}
                </div>

                {/* CREATE ACCOUNT BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center rounded-xl px-5 py-3.5 text-sm font-bold text-[#17152E] shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ backgroundColor: COLORS.coral }}
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                  {!loading && <span className="ml-2">→</span>}
                </button>

                <p className="text-center text-sm text-gray-500">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-bold hover:underline"
                    style={{ color: '#7862D8' }}
                  >
                    Login
                  </Link>
                </p>
              </form>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
