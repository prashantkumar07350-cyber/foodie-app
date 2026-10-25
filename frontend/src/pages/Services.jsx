
import { Link } from 'react-router-dom'

const services = [
  {
    number: '01',
    icon: '🛵',
    title: 'Food Delivery',
    description:
      'Order your favourite meals from available restaurants and enjoy delicious food at home or work.',
    features: ['Easy online ordering', 'Order status tracking', 'Multiple food choices'],
    link: '/menu',
    action: 'Explore Menu',
    color: 'bg-orange-50',
  },
  {
    number: '02',
    icon: '🍽️',
    title: 'Table Reservations',
    description:
      'Plan your next dinner, family gathering or special occasion with a convenient table reservation.',
    features: ['Plan your visit', 'Choose your preferred time', 'Special occasion dining'],
    link: '/booking',
    action: 'Book a Table',
    color: 'bg-purple-50',
  },
  {
    number: '03',
    icon: '🥡',
    title: 'Takeaway Orders',
    description:
      'Order food ahead of time and collect it from the restaurant, subject to the restaurant’s availability.',
    features: ['Convenient ordering', 'Flexible meal choices', 'Less waiting at pickup'],
    link: '/menu',
    action: 'Order Food',
    color: 'bg-amber-50',
  },
  {
    number: '04',
    icon: '🎉',
    title: 'Catering & Events',
    description:
      'Planning a birthday, family get-together or office event? Contact a restaurant to discuss your catering needs.',
    features: ['Event meal planning', 'Menu discussions', 'Group food requirements'],
    link: '/contact',
    action: 'Contact Us',
    color: 'bg-rose-50',
  },
  {
    number: '05',
    icon: '🍕',
    title: 'Explore Restaurants',
    description:
      'Discover restaurants, explore cuisines and compare available menu options before making your choice.',
    features: ['Restaurant discovery', 'Cuisine exploration', 'Menu browsing'],
    link: '/restaurants',
    action: 'Find Restaurants',
    color: 'bg-green-50',
  },
  {
    number: '06',
    icon: '🛒',
    title: 'Easy Online Ordering',
    description:
      'Browse dishes, add your selections to the cart and continue through the ordering flow available on the platform.',
    features: ['Simple menu browsing', 'Cart management', 'Convenient checkout flow'],
    link: '/menu',
    action: 'Start Ordering',
    color: 'bg-blue-50',
  },
]

const steps = [
  {
    number: '01',
    title: 'Explore',
    text: 'Browse available restaurants and discover food you love.',
    icon: '🔎',
  },
  {
    number: '02',
    title: 'Choose',
    text: 'Select your dishes or choose a table booking option.',
    icon: '🍴',
  },
  {
    number: '03',
    title: 'Confirm',
    text: 'Review your selection and follow the available booking or checkout steps.',
    icon: '✓',
  },
  {
    number: '04',
    title: 'Enjoy',
    text: 'Enjoy your meal at home or during your restaurant visit.',
    icon: '❤️',
  },
]

export default function Services() {
  return (
    <main className="min-h-screen bg-[#F8F7FC] text-[#17152E]">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#17152E]">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center opacity-35"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2000&q=85')",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#17152E] via-[#17152E]/95 to-[#17152E]/55" />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 sm:px-8 md:grid-cols-2 md:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#B7A5FF]">
              <span className="text-[#FF8066]">✦</span>
              The Good Plate Services
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              Great Food.
              <br />
              <span className="text-[#FF8066]">Better Experiences.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
              Discover restaurants, explore delicious menus, order your
              favourite meals and plan your next dining experience with
              The Good Plate.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/menu"
                className="rounded-xl bg-[#FF8066] px-6 py-3.5 font-bold text-white transition hover:bg-[#F16D53]"
              >
                Explore Menu →
              </Link>

              <Link
                to="/booking"
                className="rounded-xl border border-white/30 px-6 py-3.5 font-semibold text-white transition hover:bg-white hover:text-[#17152E]"
              >
                Book a Table
              </Link>
            </div>

            <p className="mt-5 text-xs leading-5 text-white/50">
              Service availability may vary by restaurant and location.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-[#B7A5FF]/10 blur-2xl" />
            <img
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1000&q=85"
              alt="Guests enjoying a restaurant dining experience"
              className="relative h-[320px] w-full rounded-[2rem] object-cover shadow-2xl sm:h-[420px]"
            />

            <div className="absolute -bottom-5 left-4 right-4 rounded-2xl border border-white/60 bg-white p-4 shadow-xl sm:left-8 sm:right-8 sm:p-5">
              <p className="text-sm font-bold text-[#17152E]">
                Your food journey starts here
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Discover, choose and enjoy — all in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8066E8]">
            What We Offer
          </span>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            Everything for a Better Food Experience
          </h2>
          <p className="mt-4 leading-7 text-gray-600">
            Whether you want a meal at home, a restaurant visit or help
            planning a group meal, explore the services and options
            available through our platform.
          </p>
        </div>

        {/* Services cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.number}
              className="group flex h-full flex-col rounded-3xl border border-[#17152E]/5 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl sm:p-7"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${service.color}`}
                >
                  {service.icon}
                </div>
                <span className="text-sm font-bold tracking-widest text-gray-300">
                  {service.number}
                </span>
              </div>

              <h3 className="mt-6 text-xl font-extrabold">
                {service.title}
              </h3>

              <p className="mt-3 min-h-[84px] text-sm leading-6 text-gray-600">
                {service.description}
              </p>

              <ul className="mt-5 space-y-3">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <span className="mt-0.5 font-bold text-[#8066E8]">
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-7">
                <Link
                  to={service.link}
                  className="inline-flex items-center gap-2 font-bold text-[#17152E] transition group-hover:text-[#E9674D]"
                >
                  {service.action}
                  <span className="transition group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8066E8]">
              Simple & Convenient
            </span>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 leading-7 text-gray-600">
              Follow a simple process to find your next meal or plan a
              restaurant visit.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center">
                <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#F4F1FF] text-3xl">
                  {step.icon}
                  <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#FF8066] text-xs font-bold text-white">
                    {step.number}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-extrabold">
                  {step.title}
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-gray-600">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#17152E] px-6 py-12 text-center sm:px-12 md:py-16">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B7A5FF]">
            Ready to Get Started?
          </span>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold text-white sm:text-4xl">
            Your Next Favourite Meal Is Waiting
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
            Explore the menu, discover restaurants and find an option
            that suits your next meal.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/menu"
              className="rounded-xl bg-[#FF8066] px-6 py-3.5 font-bold text-white transition hover:bg-[#F16D53]"
            >
              Browse Menu →
            </Link>

            <Link
              to="/contact"
              className="rounded-xl border border-white/25 px-6 py-3.5 font-semibold text-white transition hover:bg-white hover:text-[#17152E]"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
