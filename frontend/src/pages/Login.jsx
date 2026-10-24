import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Login hero carousel images and text
const HERO_SLIDES = [
  {
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2200&q=85',
    eyebrow: 'THE GOOD PLATE • LOGIN',
    title: 'Welcome Back!',
    subtitle:
      'Sign in to your account and discover your next favourite meal.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2200&q=85',
    eyebrow: 'YOUR FOOD JOURNEY CONTINUES',
    title: 'Good to See You Again',
    subtitle:
      'Log in to explore restaurants, order delicious food, and more.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1515003197210-e0cd7184f8b5?auto=format&fit=crop&w=2200&q=85',
    eyebrow: 'LOGIN • EAT • ENJOY',
    title: 'Your Favourites Are Waiting',
    subtitle:
      'Access your account and make every meal special.',
  },
];

// Top hero carousel
function LoginHero() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((current) => (current + 1) % HERO_SLIDES.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[185px] overflow-hidden bg-[#17152E] sm:h-[215px] lg:h-[250px]">
      {HERO_SLIDES.map((slide, index) => (
        <div
          key={slide.title}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            activeSlide === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt="Restaurant dining atmosphere"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#100e24]/95 via-[#17152E]/65 to-[#17152E]/10" />
        </div>
      ))}

      <div className="relative mx-auto flex h-full max-w-7xl items-center px-5 sm:px-8 lg:px-12">
        <div className="max-w-2xl text-white">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#B7A5FF] sm:text-xs">
            {HERO_SLIDES[activeSlide].eyebrow}
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            {HERO_SLIDES[activeSlide].title}
          </h1>

          <p className="mt-2 max-w-lg text-sm leading-6 text-white/85 sm:text-base">
            {HERO_SLIDES[activeSlide].subtitle}
          </p>

          <div className="mt-4 flex items-center gap-2">
            {HERO_SLIDES.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                aria-label={`Show slide ${index + 1}`}
                onClick={() => setActiveSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  activeSlide === index
                    ? 'w-7 bg-[#FF8066]'
                    : 'w-2 bg-white/70 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState(
    () => localStorage.getItem('rememberedEmail') || ''
  );
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const [rememberMe, setRememberMe] = useState(
    () => Boolean(localStorage.getItem('rememberedEmail'))
  );
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState(location.state?.message || '');

  useEffect(() => {
    if (location.state?.message) {
      setInfo(location.state.message);
    }
  }, [location.state]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setInfo('');

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError('Please enter your email address and password.');
      return;
    }

    setLoading(true);

    try {
      const user = await login(cleanEmail, password);

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', cleanEmail);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      const actualRole = String(
        user?.role || user?.user?.role || ''
      ).toUpperCase();

      if (actualRole === 'ADMIN') {
        navigate('/admin-panel', { replace: true });
      } else if (
        actualRole === 'RESTAURANT' ||
        actualRole === 'OWNER'
      ) {
        navigate('/owner', { replace: true });
      } else if (
        role !== 'CUSTOMER' &&
        actualRole === 'CUSTOMER'
      ) {
        setError(
          'Your account role does not match the selected login type.'
        );
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1FF]">
      {/* Hero carousel */}
      <LoginHero />

      {/* Main login card */}
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl bg-white shadow-[0_25px_80px_rgba(23,21,46,0.12)] lg:grid-cols-12">

          {/* LEFT: Branding panel */}
          <section className="relative overflow-hidden bg-gradient-to-br from-[#17152E] via-[#211D48] to-[#17152E] px-7 py-9 text-white sm:px-10 sm:py-11 lg:col-span-4 lg:px-9 lg:py-12">
            <div className="pointer-events-none absolute -right-20 top-20 h-56 w-56 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -right-10 top-32 h-40 w-40 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-[#FF8066]/10 blur-2xl" />

            <div className="relative z-10 flex h-full flex-col">
              <Link to="/" className="inline-flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF8066] text-2xl shadow-lg">
                  🍽️
                </span>

                <span className="text-xl font-extrabold tracking-tight sm:text-2xl">
                  The Good <span className="text-[#B7A5FF]">Plate</span>
                </span>
              </Link>

              <div className="mt-9 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white/90 sm:text-xs">
                <span className="text-[#FF8066]">✦</span>
                Your food journey continues
              </div>

              <h2 className="mt-6 text-3xl font-extrabold leading-tight sm:text-4xl">
                Good food.
                <br />
                Great people.
              </h2>

              <p className="mt-4 max-w-sm text-sm leading-7 text-white/75 sm:text-base">
                Log in to your account and enjoy personalised
                recommendations, delicious discoveries and more.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/15 bg-white/[0.04] px-2 py-4 text-center">
                  <div className="text-2xl">🍴</div>
                  <p className="mt-2 text-xs font-medium text-white/90">
                    Better Food
                  </p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/[0.04] px-2 py-4 text-center">
                  <div className="text-2xl">❤️</div>
                  <p className="mt-2 text-xs font-medium text-white/90">
                    Happier Moments
                  </p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/[0.04] px-2 py-4 text-center">
                  <div className="text-2xl">🚀</div>
                  <p className="mt-2 text-xs font-medium text-white/90">
                    Easy Ordering
                  </p>
                </div>
              </div>

              <div className="mt-9 border-t border-white/15 pt-5 lg:mt-auto lg:pt-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#B7A5FF]">
                  Good food, good mood
                </p>
                <p className="mt-2 text-xs leading-5 text-white/55">
                  Your next great meal is just around the corner.
                </p>
              </div>
            </div>
          </section>

          {/* CENTER: Login form */}
          <section className="px-6 py-9 sm:px-10 sm:py-11 lg:col-span-5 lg:px-9 lg:py-12">
            <div className="mx-auto max-w-md">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8C72F8]">
                Welcome back
              </p>

              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#17152E]">
                Login to your account<span className="text-[#FF8066]">.</span>
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Enter your details to continue to The Good Plate.
              </p>

              {info && (
                <div
                  role="status"
                  className="mt-5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800"
                >
                  {info}
                </div>
              )}

              {error && (
                <div
                  role="alert"
                  className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                {/* Login role */}
                <div>
                  <label
                    htmlFor="login-role"
                    className="mb-2 block text-sm font-semibold text-[#17152E]"
                  >
                    Login As
                  </label>

                  <select
                    id="login-role"
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#17152E] outline-none transition focus:border-[#8C72F8] focus:ring-4 focus:ring-[#8C72F8]/10"
                  >
                    <option value="CUSTOMER">Customer</option>
                    <option value="OWNER">Restaurant Owner</option>
                  </select>

                  <p className="mt-2 text-xs text-gray-500">
                    {role === 'CUSTOMER'
                      ? 'Login to order food and manage your orders.'
                      : 'Login to manage your restaurant and orders.'}
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="login-email"
                    className="mb-2 block text-sm font-semibold text-[#17152E]"
                  >
                    Email Address
                  </label>

                  <div className="flex items-center rounded-xl border border-gray-200 bg-white transition focus-within:border-[#8C72F8] focus-within:ring-4 focus-within:ring-[#8C72F8]/10">
                    <span className="pl-4 text-gray-400">✉</span>

                    <input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      className="w-full rounded-xl bg-transparent px-3 py-3 text-sm text-[#17152E] outline-none placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="login-password"
                    className="mb-2 block text-sm font-semibold text-[#17152E]"
                  >
                    Password
                  </label>

                  <div className="flex items-center rounded-xl border border-gray-200 bg-white transition focus-within:border-[#8C72F8] focus-within:ring-4 focus-within:ring-[#8C72F8]/10">
                    <span className="pl-4 text-gray-400">🔒</span>

                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      className="w-full min-w-0 rounded-xl bg-transparent px-3 py-3 text-sm text-[#17152E] outline-none placeholder:text-gray-400"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="px-4 text-xs font-semibold text-[#8C72F8] hover:text-[#6F54DB]"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) =>
                        setRememberMe(event.target.checked)
                      }
                      className="h-4 w-4 rounded accent-[#8C72F8]"
                    />
                    Remember me
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      setInfo(
                        'Please contact support to reset your password.'
                      )
                    }
                    className="text-xs font-semibold text-[#8C72F8] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF8066] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#FF8066]/20 transition hover:bg-[#f56f55] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Logging in...' : 'Login to Your Account'}
                  {!loading && <span aria-hidden="true">→</span>}
                </button>
              </form>

              {/* Social login UI */}
              <div className="my-7 flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Or continue with
                </span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setInfo(
                      'Google login is not connected yet. Please use your email and password.'
                    )
                  }
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                  <span className="font-bold text-base text-[#4285F4]">G</span>
                  Google
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setInfo(
                      'Facebook login is not connected yet. Please use your email and password.'
                    )
                  }
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                  <span className="font-bold text-base text-[#1877F2]">f</span>
                  Facebook
                </button>
              </div>

              <p className="mt-7 text-center text-sm text-gray-500">
                Don&apos;t have an account?{' '}
                <Link
                  to="/register"
                  className="font-bold text-[#8C72F8] hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </section>

          {/* RIGHT: Restaurant laptop photo */}
          <aside className="relative hidden min-h-full overflow-hidden lg:col-span-3 lg:block">
            <img
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=85"
              alt="People working together with laptops in a cafe"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#17152E]/90 via-[#17152E]/10 to-[#17152E]/10" />

            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <span className="inline-flex rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                ☕ Your table, your moment
              </span>

              <h3 className="mt-4 text-2xl font-extrabold leading-tight">
                Good food.
                <br />
                Great company.
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/80">
                Settle in, explore your favourites and make every moment
                delicious.
              </p>
            </div>
          </aside>
        </div>

        <p className="mt-5 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} The Good Plate. All rights reserved.
        </p>
      </main>
    </div>
  );
}
