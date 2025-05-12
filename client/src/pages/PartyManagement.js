"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import AdminSidebar from "../components/AdminSidebar"
import Spinner from "../components/Spinner"

const PartyManagement = () => {
  const [parties, setParties] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logoUrl: "",
  })
  const [editingParty, setEditingParty] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchParties()
  }, [])

  const fetchParties = async () => {
    try {
      const res = await axios.get("/api/parties")
      setParties(res.data.parties)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching parties:", error)
      toast.error("Failed to load parties")
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (editingParty) {
        // Update existing party
        const res = await axios.put(`/api/parties/${editingParty._id}`, formData)
        if (res.data.success) {
          toast.success("Party updated successfully")
          setEditingParty(null)
        }
      } else {
        // Add new party
        const res = await axios.post("/api/parties", formData)
        if (res.data.success) {
          toast.success("Party added successfully")
        }
      }

      // Reset form and refresh parties
      setFormData({
        name: "",
        description: "",
        logoUrl: "",
      })
      fetchParties()
    } catch (error) {
      console.error("Error submitting party:", error)
      toast.error(error.response?.data?.message || "Failed to submit party")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (party) => {
    setEditingParty(party)
    setFormData({
      name: party.name,
      description: party.description,
      logoUrl: party.logoUrl,
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleCancel = () => {
    setEditingParty(null)
    setFormData({
      name: "",
      description: "",
      logoUrl: "",
    })
  }

  const handleRemove = async (partyId) => {
    if (!window.confirm("Are you sure you want to remove this party?")) {
      return
    }

    try {
      const res = await axios.delete(`/api/parties/${partyId}`)
      if (res.data.success) {
        toast.success("Party removed successfully")
        fetchParties()
      }
    } catch (error) {
      console.error("Error removing party:", error)
      toast.error(error.response?.data?.message || "Failed to remove party")
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
        <h1 className="text-3xl font-bold mb-8">Party Management</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">{editingParty ? "Edit Party" : "Add New Party"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                  Party Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="logoUrl" className="block text-gray-700 font-medium mb-2">
                  Logo URL
                </label>
                <input
                  type="url"
                  id="logoUrl"
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-4">
              {editingParty && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : editingParty ? "Update Party" : "Add Party"}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Existing Parties</h2>

          {parties.length === 0 ? (
            <p className="text-gray-500">No parties added yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Logo
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Votes
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {parties.map((party) => (
                    <tr key={party._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={party.logoUrl || "/placeholder.svg"}
                          alt={`${party.name} logo`}
                          className="h-10 w-10 object-contain"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{party.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{party.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {party.voteCount !== undefined ? party.voteCount : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => handleEdit(party)} className="text-blue-600 hover:text-blue-900 mr-4">
                          Edit
                        </button>
                        <button onClick={() => handleRemove(party._id)} className="text-red-600 hover:text-red-900">
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PartyManagement
