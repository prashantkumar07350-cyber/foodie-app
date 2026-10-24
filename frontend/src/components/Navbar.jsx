
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const COLORS = {
  navbar: "#17152E",
  dropdown: "#24213F",
  lavender: "#B7A5FF",
  coral: "#FF8066",
  text: "#F7F5FF",
};

const navLinkClass = ({ isActive }) =>
  `whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200 ${
    isActive ? "bg-white/10" : "hover:bg-white/10"
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("goodplate-theme") === "dark";
    } catch {
      return false;
    }
  });

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.style.colorScheme = darkMode
      ? "dark"
      : "light";

    try {
      localStorage.setItem(
        "goodplate-theme",
        darkMode ? "dark" : "light"
      );
    } catch {
      // Theme still works for the current session.
    }
  }, [darkMode]);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [user]);

  const role = String(user?.role || user?.userType || "customer")
    .toLowerCase()
    .replace(/[\s_-]/g, "");

  const isAdmin = ["admin", "administrator"].includes(role);

  const isOwner = [
    "owner",
    "restaurantowner",
    "vendor",
    "restaurant",
  ].includes(role);

  const isLoggedIn = Boolean(user);

  const cartCount = Array.isArray(cartItems)
    ? cartItems.reduce(
        (total, item) => total + Number(item.quantity || 1),
        0
      )
    : 0;

  const closeMenus = () => {
    setMobileOpen(false);
    setProfileOpen(false);
  };

  const handleLogout = async () => {
    closeMenus();

    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const publicLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Services", path: "/services" },
    { label: "Menu", path: "/menu" },
    { label: "Contact", path: "/contact" },
  ];

  const customerLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Services", path: "/services" },
    { label: "Menu", path: "/menu" },
    { label: "My Orders", path: "/orders" },
    { label: "Booking", path: "/booking" },
    { label: "Contact", path: "/contact" },
  ];

  const ownerLinks = [
    { label: "Dashboard", path: "/owner" },
    { label: "Manage Menu", path: "/owner/menu" },
    { label: "Bookings", path: "/owner/bookings" },
  ];

  const adminLinks = [
    { label: "Dashboard", path: "/admin-panel" },
  ];

  const navLinks = isAdmin
    ? adminLinks
    : isOwner
    ? ownerLinks
    : isLoggedIn
    ? customerLinks
    : publicLinks;

  const renderLinks = (mobile = false) =>
    navLinks.map((item) => (
      <NavLink
        key={item.path}
        to={item.path}
        onClick={closeMenus}
        className={({ isActive }) =>
          `${navLinkClass({ isActive })} ${
            mobile ? "block w-full" : ""
          }`
        }
        style={({ isActive }) => ({
          color: isActive ? COLORS.lavender : COLORS.text,
          borderBottom:
            isActive && !mobile
              ? `2px solid ${COLORS.lavender}`
              : "2px solid transparent",
        })}
      >
        {item.label}
      </NavLink>
    ));

  const themeButton = (
    <button
      type="button"
      onClick={() => setDarkMode((previous) => !previous)}
      aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
      title={`Switch to ${darkMode ? "light" : "dark"} mode`}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 text-xl transition hover:scale-105 hover:bg-white/10"
      style={{ color: COLORS.lavender }}
    >
      {darkMode ? "☀️" : "🌙"}
    </button>
  );

  return (
    <header
      className="sticky top-0 z-50 w-full shadow-lg"
      style={{
        backgroundColor: COLORS.navbar,
        color: COLORS.text,
      }}
    >
      <nav className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          to="/"
          onClick={closeMenus}
          className="flex shrink-0 items-center gap-3"
          aria-label="The Good Plate home"
        >
          <span
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-2xl shadow-md"
            style={{
              backgroundColor: COLORS.coral,
              color: COLORS.navbar,
            }}
          >
            🍽️
          </span>

          <span className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight sm:text-2xl">
              The Good{" "}
              <span style={{ color: COLORS.lavender }}>Plate</span>
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.24em] text-white/60 sm:block">
              Good food, good mood
            </span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-1 xl:flex">
          {renderLinks()}
        </div>

        {/* Desktop actions */}
        <div className="hidden shrink-0 items-center gap-3 xl:flex">
          {!isLoggedIn && (
            <>
              {/* Register first */}
              <Link
                to="/register"
                className="rounded-xl px-4 py-2.5 text-sm font-bold shadow-md transition hover:-translate-y-0.5"
                style={{
                  backgroundColor: COLORS.coral,
                  color: COLORS.navbar,
                }}
              >
                Register
              </Link>

              {/* Login after Register */}
              <Link
                to="/login"
                className="rounded-xl px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
                style={{ color: COLORS.text }}
              >
                Login
              </Link>
            </>
          )}

          {/* Customer cart */}
          {isLoggedIn && !isAdmin && !isOwner && (
            <Link
              to="/cart"
              className="relative flex items-center gap-2 rounded-xl px-3 py-2 font-semibold transition hover:bg-white/10"
              style={{ color: COLORS.text }}
            >
              <span className="text-xl">🛒</span>
              <span className="text-sm">Cart</span>

              {cartCount > 0 && (
                <span
                  className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold"
                  style={{
                    backgroundColor: COLORS.coral,
                    color: COLORS.navbar,
                  }}
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          )}

          {/* Profile menu */}
          {isLoggedIn && (
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setProfileOpen((previous) => !previous)
                }
                aria-expanded={profileOpen}
                className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 transition hover:bg-white/10"
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full font-bold"
                  style={{
                    backgroundColor: COLORS.lavender,
                    color: COLORS.navbar,
                  }}
                >
                  {(
                    user?.name ||
                    user?.username ||
                    user?.email ||
                    "U"
                  )
                    .charAt(0)
                    .toUpperCase()}
                </span>

                <span className="max-w-24 truncate text-sm font-semibold">
                  {user?.name || user?.username || "My Account"}
                </span>

                <span className="text-xs">⌄</span>
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 top-full mt-3 w-56 overflow-hidden rounded-2xl border border-white/10 py-2 shadow-2xl"
                  style={{ backgroundColor: COLORS.dropdown }}
                >
                  <div className="border-b border-white/10 px-4 py-3">
                    <p className="truncate text-sm font-bold">
                      {user?.name || user?.username || "Welcome"}
                    </p>
                    <p className="truncate text-xs text-white/60">
                      {user?.email || ""}
                    </p>
                  </div>

                  {!isAdmin && !isOwner && (
                    <Link
                      to="/profile"
                      onClick={closeMenus}
                      className="block px-4 py-3 text-sm transition hover:bg-white/10"
                    >
                      👤 My Profile
                    </Link>
                  )}

                  {!isAdmin && !isOwner && (
                    <Link
                      to="/orders"
                      onClick={closeMenus}
                      className="block px-4 py-3 text-sm transition hover:bg-white/10"
                    >
                      📦 Order History
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-sm font-semibold transition hover:bg-white/10"
                    style={{ color: COLORS.coral }}
                  >
                    ↪ Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Theme switch */}
          {themeButton}
        </div>

        {/* Mobile actions */}
        <div className="flex shrink-0 items-center gap-2 xl:hidden">
          {isLoggedIn && !isAdmin && !isOwner && (
            <Link
              to="/cart"
              onClick={closeMenus}
              aria-label="Shopping cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl hover:bg-white/10"
            >
              <span className="text-xl">🛒</span>

              {cartCount > 0 && (
                <span
                  className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold"
                  style={{
                    backgroundColor: COLORS.coral,
                    color: COLORS.navbar,
                  }}
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          )}

          {themeButton}

          <button
            type="button"
            onClick={() => setMobileOpen((previous) => !previous)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-2xl transition hover:bg-white/10"
            style={{ color: COLORS.text }}
          >
            {mobileOpen ? "×" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="border-t border-white/10 px-4 pb-5 pt-3 shadow-xl xl:hidden sm:px-6"
          style={{ backgroundColor: COLORS.dropdown }}
        >
          <div className="flex flex-col gap-1">
            {renderLinks(true)}
          </div>

          {/* Register first, then Login on mobile */}
          {!isLoggedIn && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link
                to="/register"
                onClick={closeMenus}
                className="rounded-xl px-4 py-3 text-center text-sm font-bold"
                style={{
                  backgroundColor: COLORS.coral,
                  color: COLORS.navbar,
                }}
              >
                Register
              </Link>

              <Link
                to="/login"
                onClick={closeMenus}
                className="rounded-xl border border-white/20 px-4 py-3 text-center text-sm font-semibold"
                style={{ color: COLORS.text }}
              >
                Login
              </Link>
            </div>
          )}

          {/* Logged-in mobile account section */}
          {isLoggedIn && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <div className="mb-3 flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full font-bold"
                  style={{
                    backgroundColor: COLORS.lavender,
                    color: COLORS.navbar,
                  }}
                >
                  {(
                    user?.name ||
                    user?.username ||
                    user?.email ||
                    "U"
                  )
                    .charAt(0)
                    .toUpperCase()}
                </span>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">
                    {user?.name || user?.username || "My Account"}
                  </p>
                  <p className="truncate text-xs text-white/60">
                    {user?.email || ""}
                  </p>
                </div>
              </div>

              {!isAdmin && !isOwner && (
                <Link
                  to="/profile"
                  onClick={closeMenus}
                  className="block rounded-xl px-3 py-3 text-sm hover:bg-white/10"
                >
                  👤 My Profile
                </Link>
              )}

              {!isAdmin && !isOwner && (
                <Link
                  to="/orders"
                  onClick={closeMenus}
                  className="block rounded-xl px-3 py-3 text-sm hover:bg-white/10"
                >
                  📦 Order History
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 w-full rounded-xl px-3 py-3 text-left text-sm font-semibold hover:bg-white/10"
                style={{ color: COLORS.coral }}
              >
                ↪ Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
