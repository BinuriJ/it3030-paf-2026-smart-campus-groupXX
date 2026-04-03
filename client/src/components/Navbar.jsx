import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-gray-100 border-b border-gray-300 px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">Smart Campus</h1>
      <div className="flex gap-6">
        <Link to="/" className="text-gray-600 hover:text-black font-medium">My Tickets</Link>
        <Link to="/technician" className="text-gray-600 hover:text-black font-medium">Technician</Link>
        <Link to="/admin" className="text-gray-600 hover:text-black font-medium">Admin</Link>
      </div>
    </nav>
  )
}

export default Navbar