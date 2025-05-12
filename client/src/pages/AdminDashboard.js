"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import AdminSidebar from "../components/AdminSidebar"
import Spinner from "../components/Spinner"

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [votingStatusLoading, setVotingStatusLoading] = useState(false)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/api/admin/dashboard")
        setStats(res.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        toast.error("Failed to load dashboard data")
        setLoading(false)
      }
    }

    fetchStats()

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchStats, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleStartVoting = async () => {
    try {
      setVotingStatusLoading(true)
      const res = await axios.post("/api/votes/start")
      if (res.data.success) {
        toast.success("Voting has been started")
        // Update stats
        const statsRes = await axios.get("/api/admin/dashboard")
        setStats(statsRes.data)
      }
    } catch (error) {
      console.error("Error starting voting:", error)
      toast.error(error.response?.data?.message || "Failed to start voting")
    } finally {
      setVotingStatusLoading(false)
    }
  }

  const handleStopVoting = async () => {
    try {
      setVotingStatusLoading(true)
      const res = await axios.post("/api/votes/stop")
      if (res.data.success) {
        toast.success("Voting has been stopped")
        // Update stats
        const statsRes = await axios.get("/api/admin/dashboard")
        setStats(statsRes.data)
      }
    } catch (error) {
      console.error("Error stopping voting:", error)
      toast.error(error.response?.data?.message || "Failed to stop voting")
    } finally {
      setVotingStatusLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <Spinner />
        </div>
      </div>
    )
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-sm font-medium text-gray-500 uppercase mb-2">Registered Voters</h2>
            <div className="text-3xl font-bold">{stats.stats.voterCount}</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-sm font-medium text-gray-500 uppercase mb-2">Total Votes</h2>
            <div className="text-3xl font-bold">{stats.stats.totalVotes}</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-sm font-medium text-gray-500 uppercase mb-2">Participation Rate</h2>
            <div className="text-3xl font-bold">
              {stats.stats.participationRate ? stats.stats.participationRate.toFixed(1) : 0}%
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-sm font-medium text-gray-500 uppercase mb-2">Voting Status</h2>
            <div
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                stats.stats.votingOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {stats.stats.votingOpen ? "OPEN" : "CLOSED"}
            </div>
            <div className="mt-3">
              {stats.stats.votingOpen ? (
                <button
                  onClick={handleStopVoting}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                  disabled={votingStatusLoading}
                >
                  {votingStatusLoading ? "Processing..." : "Stop Voting"}
                </button>
              ) : (
                <button
                  onClick={handleStartVoting}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                  disabled={votingStatusLoading}
                >
                  {votingStatusLoading ? "Processing..." : "Start Voting"}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Recent Votes</h2>
            {stats.recentVotes.length === 0 ? (
              <p className="text-gray-500">No votes recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Voter
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Party
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.recentVotes.map((vote) => (
                      <tr key={vote._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {vote.voter ? vote.voter.name : "Unknown"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {vote.party ? vote.party.name : "Unknown"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(vote.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            {stats.recentLogs.length === 0 ? (
              <p className="text-gray-500">No activity recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Action
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        User
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.recentLogs.map((log) => (
                      <tr key={log._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.action}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.performedBy ? log.performedBy.name : "System"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/parties"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-center"
            >
              Manage Parties
            </a>
            <a
              href="/admin/audit-logs"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-center"
            >
              View Audit Logs
            </a>
            <a href="/results" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-center">
              View Results
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
