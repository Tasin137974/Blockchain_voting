"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

const Home = () => {
  const [votingStatus, setVotingStatus] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVotingStatus = async () => {
      try {
        const res = await axios.get("/api/votes/voting-status")
        setVotingStatus(res.data.votingOpen)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching voting status:", error)
        setLoading(false)
      }
    }

    fetchVotingStatus()
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white rounded-lg shadow-lg overflow-hidden mb-12">
        <div className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">Secure Blockchain Voting System</h1>
            <p className="text-xl mb-8">
              Vote securely and transparently with our blockchain-based voting system. Your vote is immutable,
              verifiable, and anonymous.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/register"
                className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-md font-medium text-center"
              >
                Register to Vote
              </Link>
              <Link
                to="/results"
                className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-md font-medium text-center"
              >
                View Results
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img src="/blockchain-voting.svg" alt="Blockchain Voting" className="w-full max-w-md" />
          </div>
        </div>
      </section>

      {/* Voting Status */}
      <section className="mb-12">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Current Voting Status</h2>
          {loading ? (
            <div className="animate-pulse h-6 bg-gray-200 rounded w-24 mx-auto"></div>
          ) : (
            <div
              className={`inline-block px-4 py-2 rounded-full font-bold ${votingStatus ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {votingStatus ? "Voting is OPEN" : "Voting is CLOSED"}
            </div>
          )}
          <p className="mt-4 text-gray-600">
            {votingStatus
              ? "The voting period is currently active. Registered voters can cast their votes now."
              : "The voting period is currently closed. Please check back later or contact the administrator."}
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose BlockVote?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-blue-600 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Secure</h3>
            <p className="text-gray-600">
              Your vote is secured by blockchain technology, making it tamper-proof and resistant to fraud.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-blue-600 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Transparent</h3>
            <p className="text-gray-600">
              All votes are recorded on a public blockchain, allowing for complete transparency and verification.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-blue-600 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Verifiable</h3>
            <p className="text-gray-600">
              Voters can verify that their vote was counted correctly without compromising the secrecy of their ballot.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="font-bold mb-2">Register</h3>
              <p className="text-gray-600 text-sm">
                Create an account with your NID and connect your blockchain wallet
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="font-bold mb-2">Verify</h3>
              <p className="text-gray-600 text-sm">Your identity is verified to ensure you're eligible to vote</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="font-bold mb-2">Vote</h3>
              <p className="text-gray-600 text-sm">Cast your vote securely during the open voting period</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">4</span>
              </div>
              <h3 className="font-bold mb-2">Verify</h3>
              <p className="text-gray-600 text-sm">Receive a receipt and verify your vote on the blockchain</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to participate?</h2>
          <p className="text-gray-600 mb-6">
            Join our secure blockchain voting system today and make your voice heard.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium">
              Register Now
            </Link>
            <Link
              to="/login"
              className="bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 px-6 py-3 rounded-md font-medium"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
