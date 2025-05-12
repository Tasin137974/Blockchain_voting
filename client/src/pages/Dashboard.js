"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import AuthContext from "../context/AuthContext"
import Spinner from "../components/Spinner"

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const [voterStatus, setVoterStatus] = useState(null)
  const [votingStatus, setVotingStatus] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statusRes, votingRes] = await Promise.all([
          axios.get("/api/votes/status"),
          axios.get("/api/votes/voting-status"),
        ])

        setVoterStatus(statusRes.data)
        setVotingStatus(votingRes.data.votingOpen)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Voter Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Voter Information</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Name:</span> {user.name}
            </p>
            <p>
              <span className="font-medium">NID:</span> {user.nidNumber}
            </p>
            <p>
              <span className="font-medium">Age:</span> {user.age}
            </p>
            <p className="text-sm break-all">
              <span className="font-medium">Wallet:</span> {user.walletAddress}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Voting Status</h2>
          <div className="space-y-4">
            <div>
              <p className="font-medium">System Status:</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${votingStatus ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                {votingStatus ? "Voting is OPEN" : "Voting is CLOSED"}
              </span>
            </div>

            <div>
              <p className="font-medium">Your Status:</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${voterStatus?.hasVoted ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}`}
              >
                {voterStatus?.hasVoted ? "You have voted" : "You have not voted yet"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/vote"
              className={`block w-full text-center py-2 rounded-md transition duration-200 ${
                votingStatus && !voterStatus?.hasVoted
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
              onClick={(e) => {
                if (!votingStatus || voterStatus?.hasVoted) {
                  e.preventDefault()
                }
              }}
            >
              Cast Your Vote
            </Link>

            <Link
              to="/parties"
              className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-md transition duration-200"
            >
              View Parties
            </Link>

            <Link
              to="/results"
              className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-md transition duration-200"
            >
              View Results
            </Link>
          </div>
        </div>
      </div>

      {voterStatus?.hasVoted && voterStatus?.voteDetails && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Your Vote Receipt</h2>
          <div className="space-y-3">
            <p>
              <span className="font-medium">Party:</span> {voterStatus.voteDetails.party}
            </p>
            <p>
              <span className="font-medium">Time:</span> {new Date(voterStatus.voteDetails.timestamp).toLocaleString()}
            </p>
            <div>
              <p className="font-medium">Transaction Hash:</p>
              <p className="text-xs font-mono bg-gray-100 p-2 rounded overflow-x-auto">
                {voterStatus.voteDetails.transactionHash}
              </p>
            </div>
            <a
              href={`https://etherscan.io/tx/${voterStatus.voteDetails.transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200 mt-2"
            >
              Verify on Blockchain
            </a>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Voting Instructions</h2>
        <div className="space-y-4">
          <p>To cast your vote, you need to:</p>
          <ol className="list-decimal list-inside space-y-2 pl-4">
            <li>Wait for the voting period to open</li>
            <li>Have your wallet private key ready</li>
            <li>Go to the voting page and select your preferred party</li>
            <li>Confirm your vote by signing the transaction with your private key</li>
            <li>Save your vote receipt for future verification</li>
          </ol>
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md mt-4">
            <p className="font-bold">Important:</p>
            <p>
              Keep your private key secure and never share it with anyone. It is required to sign your vote transaction.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
