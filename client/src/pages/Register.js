"use client"

import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import AuthContext from "../context/AuthContext"
import axios from "axios"

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    nidNumber: "",
    walletAddress: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [walletLoading, setWalletLoading] = useState(false)
  const [walletData, setWalletData] = useState(null)

  const { register } = useContext(AuthContext)
  const navigate = useNavigate()

  const { name, age, nidNumber, walletAddress, password, confirmPassword } = formData

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (Number.parseInt(age) < 18) {
      setError("You must be at least 18 years old to register")
      return
    }

    setLoading(true)

    try {
      await register({
        name,
        age: Number.parseInt(age),
        nidNumber,
        walletAddress,
        password,
      })

      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
      setLoading(false)
    }
  }

  const generateWallet = async () => {
    setWalletLoading(true)

    try {
      const res = await axios.get("/api/admin/create-wallet")

      if (res.data.success) {
        setWalletData(res.data.wallet)
        setFormData({ ...formData, walletAddress: res.data.wallet.address })
      }
    } catch (err) {
      setError("Failed to generate wallet. Please try again.")
    } finally {
      setWalletLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Register to Vote</h2>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="age" className="block text-gray-700 font-medium mb-2">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={age}
              onChange={handleChange}
              min="18"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="nidNumber" className="block text-gray-700 font-medium mb-2">
              NID Number
            </label>
            <input
              type="text"
              id="nidNumber"
              name="nidNumber"
              value={nidNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="walletAddress" className="block text-gray-700 font-medium mb-2">
              Wallet Address
            </label>
            <div className="flex">
              <input
                type="text"
                id="walletAddress"
                name="walletAddress"
                value={walletAddress}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={generateWallet}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-r-md"
                disabled={walletLoading}
              >
                {walletLoading ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>

          {walletData && (
            <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-md">
              <p className="font-bold mb-1">Wallet Generated!</p>
              <p className="text-sm mb-2">Save this information securely. You will need the private key to vote.</p>
              <div className="mb-2">
                <span className="font-medium">Address:</span>
                <p className="text-xs font-mono bg-white p-1 rounded mt-1 overflow-x-auto">{walletData.address}</p>
              </div>
              <div>
                <span className="font-medium">Private Key:</span>
                <p className="text-xs font-mono bg-white p-1 rounded mt-1 overflow-x-auto">{walletData.privateKey}</p>
              </div>
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-200 font-medium"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
