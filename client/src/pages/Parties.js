"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import PartyCard from "../components/PartyCard"
import Spinner from "../components/Spinner"

const Parties = () => {
  const [parties, setParties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const res = await axios.get("/api/parties")
        setParties(res.data.parties)
        setLoading(false)
      } catch (err) {
        setError("Failed to load parties")
        setLoading(false)
      }
    }

    fetchParties()
  }, [])

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Political Parties</h1>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">{error}</div>}

      {parties.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">No parties available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parties.map((party) => (
            <PartyCard key={party._id} party={party} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Parties
