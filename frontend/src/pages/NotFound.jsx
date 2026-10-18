import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="max-w-sm mx-auto text-center mt-12">
      <p className="text-7xl">👨‍🍳</p>
      <h1 className="font-display text-6xl font-bold text-orange-600 mt-2">404</h1>
      <h2 className="text-xl font-bold mt-3">Page Not Found</h2>
      <p className="text-sm text-gray-500 mt-2">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/"
        className="inline-block bg-orange-600 text-white px-8 py-3 rounded-lg font-medium mt-6">
        Go to Home
      </Link>
    </div>
  )
}