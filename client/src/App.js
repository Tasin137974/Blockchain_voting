import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Context
import { AuthProvider } from "./context/AuthContext"

// Components
import PrivateRoute from "./components/PrivateRoute"
import AdminRoute from "./components/AdminRoute"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

// Pages
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import AdminDashboard from "./pages/AdminDashboard"
import Parties from "./pages/Parties"
import Vote from "./pages/Vote"
import Results from "./pages/Results"
import PartyManagement from "./pages/PartyManagement"
import AuditLogs from "./pages/AuditLogs"
import NotFound from "./pages/NotFound"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/results" element={<Results />} />

              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              <Route
                path="/vote"
                element={
                  <PrivateRoute>
                    <Vote />
                  </PrivateRoute>
                }
              />

              <Route
                path="/parties"
                element={
                  <PrivateRoute>
                    <Parties />
                  </PrivateRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/parties"
                element={
                  <AdminRoute>
                    <PartyManagement />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/audit-logs"
                element={
                  <AdminRoute>
                    <AuditLogs />
                  </AdminRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer position="bottom-right" />
      </Router>
    </AuthProvider>
  )
}

export default App
