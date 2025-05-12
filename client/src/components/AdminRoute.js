"use client"

import { useContext } from "react"
import { Navigate } from "react-router-dom"
import AuthContext from "../context/AuthContext"
import Spinner from "./Spinner"

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext)

  if (loading) {
    return <Spinner />
  }

  return isAuthenticated && user?.isAdmin ? children : <Navigate to="/dashboard" />
}

export default AdminRoute
