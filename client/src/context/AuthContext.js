"use client"

import { createContext, useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Set auth token
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      localStorage.setItem("token", token)
    } else {
      delete axios.defaults.headers.common["Authorization"]
      localStorage.removeItem("token")
    }
  }

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true)
      setError(null)

      const res = await axios.post("/api/auth/register", userData)

      if (res.data.success) {
        setToken(res.data.token)
        setAuthToken(res.data.token)
        setUser(res.data.user)
        setIsAuthenticated(true)
        toast.success("Registration successful!")
      }

      setLoading(false)
      return res.data
    } catch (err) {
      setLoading(false)
      setError(err.response?.data?.message || "Registration failed")
      toast.error(err.response?.data?.message || "Registration failed")
      throw err
    }
  }

  // Login user
  const login = async (userData) => {
    try {
      setLoading(true)
      setError(null)

      const res = await axios.post("/api/auth/login", userData)

      if (res.data.success) {
        setToken(res.data.token)
        setAuthToken(res.data.token)
        setUser(res.data.user)
        setIsAuthenticated(true)
        toast.success("Login successful!")
      }

      setLoading(false)
      return res.data
    } catch (err) {
      setLoading(false)
      setError(err.response?.data?.message || "Login failed")
      toast.error(err.response?.data?.message || "Login failed")
      throw err
    }
  }

  // Logout user
  const logout = () => {
    setAuthToken(null)
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
    toast.info("Logged out successfully")
  }

  // Load user
  const loadUser = async () => {
    if (token) {
      setAuthToken(token)

      try {
        setLoading(true)

        const res = await axios.get("/api/auth/me")

        if (res.data.success) {
          setUser(res.data.user)
          setIsAuthenticated(true)
        } else {
          setAuthToken(null)
          setToken(null)
          setUser(null)
          setIsAuthenticated(false)
        }

        setLoading(false)
      } catch (err) {
        setAuthToken(null)
        setToken(null)
        setUser(null)
        setIsAuthenticated(false)
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }

  // Create admin (for initial setup)
  const createAdmin = async (userData) => {
    try {
      setLoading(true)
      setError(null)

      const res = await axios.post("/api/auth/create-admin", userData)

      if (res.data.success) {
        setToken(res.data.token)
        setAuthToken(res.data.token)
        setUser(res.data.user)
        setIsAuthenticated(true)
        toast.success("Admin account created successfully!")
      }

      setLoading(false)
      return res.data
    } catch (err) {
      setLoading(false)
      setError(err.response?.data?.message || "Admin creation failed")
      toast.error(err.response?.data?.message || "Admin creation failed")
      throw err
    }
  }

  useEffect(() => {
    loadUser()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        loadUser,
        createAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
