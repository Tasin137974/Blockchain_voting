"use client"

import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import AuthContext from "../context/AuthContext"

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            BlockVote
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="hover:text-gray-300">
              Home
            </Link>
            <Link to="/results" className="hover:text-gray-300">
              Results
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-gray-300">
                  Dashboard
                </Link>
                <Link to="/vote" className="hover:text-gray-300">
                  Vote
                </Link>
                <Link to="/parties" className="hover:text-gray-300">
                  Parties
                </Link>

                {user && user.isAdmin && (
                  <Link to="/admin" className="hover:text-gray-300">
                    Admin
                  </Link>
                )}

                <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-gray-300">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <Link to="/" className="block py-2 hover:text-gray-300">
              Home
            </Link>
            <Link to="/results" className="block py-2 hover:text-gray-300">
              Results
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block py-2 hover:text-gray-300">
                  Dashboard
                </Link>
                <Link to="/vote" className="block py-2 hover:text-gray-300">
                  Vote
                </Link>
                <Link to="/parties" className="block py-2 hover:text-gray-300">
                  Parties
                </Link>

                {user && user.isAdmin && (
                  <Link to="/admin" className="block py-2 hover:text-gray-300">
                    Admin
                  </Link>
                )}

                <button onClick={handleLogout} className="block w-full text-left py-2 text-red-400 hover:text-red-300">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 hover:text-gray-300">
                  Login
                </Link>
                <Link to="/register" className="block py-2 hover:text-gray-300">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
