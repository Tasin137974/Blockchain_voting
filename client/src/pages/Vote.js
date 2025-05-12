"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import PartyCard from "../components/PartyCard"
import VoteReceipt from "../components/VoteReceipt"
import Spinner from "../components/Spinner"

const Vote = () => {
  const [parties, setParties] = useState([])
  const [selectedParty, setSelectedParty] = useState(null)
  const [privateKey, setPrivateKey] = useState("")
  const [votingStatus, setVotingStatus] = useState(false)
  const [voterStatus, setVoterStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [receipt, setReceipt] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [partiesRes, votingRes, voterRes] = await Promise.all([
          axios.get("/api/parties"),
          axios.get("/api/votes/voting-status"),
          axios.get("/api/votes/status"),
        ])

        setParties(partiesRes.data.parties)
        setVotingStatus(votingRes.data.votingOpen)
        setVoterStatus(voterRes.data)
        setLoading(false)

        // Redirect if already voted or voting is closed
        if (voterRes.data.hasVoted) {
          toast.info("You have already cast your vote")
          navigate("/dashboard")
        } else if (!votingRes.data.votingOpen) {
          toast.info("Voting is currently closed")
          navigate("/dashboard")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
        toast.error("Failed to load voting data")
      }
    }

    fetchData()
  }, [navigate])

  const handleSelectParty = (party) => {
    setSelectedParty(party)
  }

  const handlePrivateKeyChange = (e) => {
    setPrivateKey(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedParty) {
      toast.error("Please select a party")
      return
    }

    if (!privateKey) {
      toast.error("Please enter your private key")
      return
    }

    setSubmitting(true)

    try {
      const res = await axios.post("/api/votes/cast", {
        partyId: selectedParty.blockchainId,
        privateKey,
      })

      if (res.data.success) {
        setReceipt(res.data.receipt)
        toast.success("Your vote has been cast successfully")
      }
    } catch (error) {
      console.error("Error casting vote:", error)
      toast.error(error.response?.data?.message || "Failed to cast vote")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <Spinner />
  }

  if (receipt) {
    return <VoteReceipt receipt={receipt} />
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Cast Your Vote</h1>

      {!votingStatus && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          <p className="font-bold">Voting is currently closed</p>
          <p>Please check back later when the voting period is open.</p>
        </div>
      )}

      {voterStatus?.hasVoted && (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md mb-6">
          <p className="font-bold">You have already voted</p>
          <p>Each voter can only cast one vote.</p>
        </div>
      )}

      {votingStatus && !voterStatus?.hasVoted && (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Step 1: Select a Party</h2>

            {parties.length === 0 ? (
              <p className="text-gray-600">No parties available for voting.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {parties.map((party) => (
                  <div
                    key={party._id}
                    className={`cursor-pointer transition-transform duration-200 transform ${
                      selectedParty && selectedParty._id === party._id
                        ? "scale-105 ring-2 ring-blue-500 rounded-lg"
                        : "hover:scale-105"
                    }`}
                    onClick={() => handleSelectParty(party)}
                  >
                    <PartyCard party={party} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedParty && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Step 2: Confirm Your Vote</h2>

              <div className="mb-6">
                <p className="font-medium mb-2">You are voting for:</p>
                <div className="bg-blue-50 p-4 rounded-md">
                  <div className="flex items-center">
                    <img
                      src={selectedParty.logoUrl || "/placeholder.svg"}
                      alt={`${selectedParty.name} logo`}
                      className="h-12 w-12 object-contain mr-4"
                    />
                    <div>
                      <h3 className="font-bold text-lg">{selectedParty.name}</h3>
                      <p className="text-sm text-gray-600">{selectedParty.description}</p>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="privateKey" className="block text-gray-700 font-medium mb-2">
                    Enter Your Wallet Private Key
                  </label>
                  <input
                    type="password"
                    id="privateKey"
                    value={privateKey}
                    onChange={handlePrivateKeyChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0x..."
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Your private key is required to sign the transaction. It will not be stored on our servers.
                  </p>
                </div>

                <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md mb-6">
                  <p className="font-bold">Important:</p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Your vote is final and cannot be changed once submitted</li>
                    <li>Make sure you have selected the correct party</li>
                    <li>Keep your vote receipt for future verification</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md transition duration-200 font-medium"
                  disabled={submitting}
                >
                  {submitting ? "Submitting Vote..." : "Submit Vote"}
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Vote
