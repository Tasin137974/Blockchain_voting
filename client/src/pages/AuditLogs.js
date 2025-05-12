"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import AdminSidebar from "../components/AdminSidebar"
import Spinner from "../components/Spinner"

const AuditLogs = () => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [logsPerPage] = useState(20)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get("/api/admin/audit-logs")
        setLogs(res.data.logs)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching audit logs:", error)
        toast.error("Failed to load audit logs")
        setLoading(false)
      }
    }

    fetchLogs()
  }, [])

  // Filter logs based on search term
  const filteredLogs = logs.filter(
    (log) =>
      log.action.toLowerCase().includes(filter.toLowerCase()) ||
      (log.performedBy && log.performedBy.name.toLowerCase().includes(filter.toLowerCase())) ||
      (log.details && JSON.stringify(log.details).toLowerCase().includes(filter.toLowerCase())),
  )

  // Pagination
  const indexOfLastLog = currentPage * logsPerPage
  const indexOfFirstLog = indexOfLastLog - logsPerPage
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog)
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

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
        <h1 className="text-3xl font-bold mb-8">Audit Logs</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <label htmlFor="filter" className="block text-gray-700 font-medium mb-2">
              Search Logs
            </label>
            <input
              type="text"
              id="filter"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value)
                setCurrentPage(1) // Reset to first page on filter change
              }}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by action, user, or details..."
            />
          </div>

          {filteredLogs.length === 0 ? (
            <p className="text-gray-500">No audit logs found.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Timestamp
                      </th>
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
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentLogs.map((log) => (
                      <tr key={log._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.action}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.performedBy ? log.performedBy.name : "System"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {log.details ? (
                            <pre className="whitespace-pre-wrap font-mono text-xs bg-gray-100 p-2 rounded">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          ) : (
                            "No details"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <nav className="flex items-center">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-l-md border ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      Previous
                    </button>

                    <div className="flex">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => paginate(i + 1)}
                          className={`px-3 py-1 border-t border-b ${
                            currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white text-blue-600 hover:bg-blue-50"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-r-md border ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuditLogs
