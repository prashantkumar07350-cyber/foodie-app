
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=2000&q=85",
    label: "FRESHLY MADE, FULL OF FLAVOUR",
    title: "Good Food.",
    highlight: "Great Mood.",
    description:
      "Discover delicious meals made to satisfy your cravings. Your next favourite dish is just a click away.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=2000&q=85",
    label: "FRESH • TASTY • DELICIOUS",
    title: "Eat Fresh.",
    highlight: "Feel Good.",
    description:
      "Enjoy colourful, fresh and flavourful dishes prepared to make every meal special.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=2000&q=85",
    label: "YOUR CRAVINGS, OUR PASSION",
    title: "Bite Into",
    highlight: "Happiness.",
    description:
      "From satisfying burgers to irresistible favourites, find something delicious at The Good Plate.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=2000&q=85",
    label: "A LITTLE TASTE OF HAPPINESS",
    title: "Make Every",
    highlight: "Meal Special.",
    description:
      "Explore our menu, discover new flavours and make your next meal memorable.",
  },
];

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setActiveSlide((current) => (current + 1) % slides.length);
  };

  const previousSlide = () => {
    setActiveSlide(
      (current) => (current - 1 + slides.length) % slides.length
    );
  };

  const slide = slides[activeSlide];

  return (
    <section className="bg-[#F4F1FF] px-3 pb-8 pt-4 sm:px-6 sm:pt-6 lg:px-8">
      <div className="relative mx-auto flex min-h-[480px] max-w-7xl items-center overflow-hidden rounded-[28px] bg-[#17152E] shadow-2xl sm:min-h-[540px] lg:min-h-[610px]">
        {/* Background slideshow */}
        {slides.map((item, index) => (
          <div
            key={item.image}
            aria-hidden="true"
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === activeSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url("${item.image}")` }}
          />
        ))}

        {/* Dark overlay for readable text */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#17152E]/95 via-[#17152E]/75 to-[#17152E]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#17152E]/50 via-transparent to-transparent" />

        {/* Decorative accent */}
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#B7A5FF]/10 blur-3xl" />

        {/* Content */}
        <div
          key={activeSlide}
          className="relative z-10 max-w-3xl px-6 py-16 text-white animate-[fadeIn_700ms_ease-out] sm:px-12 lg:px-16 lg:py-20"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
            <span className="text-[#FF8066]">✦</span>
            <span className="text-[10px] font-bold tracking-[0.18em] sm:text-xs">
              {slide.label}
            </span>
          </div>

          <h1 className="text-4xl font-black leading-[1.12] tracking-tight sm:text-6xl lg:text-7xl">
            {slide.title}
            <br />
            <span className="text-[#B7A5FF]">{slide.highlight}</span>
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-7 text-white/80 sm:text-base sm:leading-8">
            {slide.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-xl bg-[#FF8066] px-6 py-3.5 text-sm font-extrabold text-[#17152E] shadow-lg transition hover:-translate-y-1 hover:bg-[#ff947e]"
            >
              Explore Menu <span>→</span>
            </Link>

            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Order Now <span>↗</span>
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-3 text-xs font-medium text-white/70">
            <span className="text-lg">🍽️</span>
            <span>Discover. Taste. Enjoy.</span>
          </div>
        </div>

        {/* Previous and next controls */}
        <button
          type="button"
          onClick={previousSlide}
          aria-label="Previous background image"
          className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/25 text-xl text-white backdrop-blur-md transition hover:bg-white/20 sm:left-5 sm:h-12 sm:w-12"
        >
          ‹
        </button>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next background image"
          className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/25 text-xl text-white backdrop-blur-md transition hover:bg-white/20 sm:right-5 sm:h-12 sm:w-12"
        >
          ›
        </button>

        {/* Slide indicators */}
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 sm:bottom-8 sm:right-10">
          {slides.map((item, index) => (
            <button
              key={item.image}
              type="button"
              onClick={() => setActiveSlide(index)}
              aria-label={`Show slide ${index + 1}`}
              aria-current={index === activeSlide ? "true" : undefined}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === activeSlide
                  ? "w-9 bg-[#FF8066]"
                  : "w-2.5 bg-white/60 hover:bg-white"
              }`}
            />
          ))}
        </div>

        {/* Slide count */}
        <div className="absolute bottom-6 left-6 z-20 text-xs font-semibold tracking-widest text-white/70 sm:bottom-8 sm:left-12">
          0{activeSlide + 1}
          <span className="mx-2 text-white/40">/</span>
          0{slides.length}
        </div>
      </div>
    </section>
  );
}
