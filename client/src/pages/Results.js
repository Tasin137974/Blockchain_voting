"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Spinner from "../components/Spinner"
import ResultsChart from "../components/ResultsChart"

const Results = () => {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get("/api/votes/results")
        setResults(res.data)
        setLoading(false)
      } catch (err) {
        setError("Failed to load results")
        setLoading(false)
      }
    }

    fetchResults()

    // Poll for results every 30 seconds
    const interval = setInterval(fetchResults, 30000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Election Results</h1>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">{error}</div>}

      {results && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Voting Status</h2>
              <div
                className={`inline-block px-4 py-2 rounded-full font-bold ${
                  results.votingOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {results.votingOpen ? "Voting is OPEN" : "Voting is CLOSED"}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Participation</h2>
              <div className="flex items-end">
                <div className="text-4xl font-bold">{results.totalVotes}</div>
                <div className="text-gray-500 ml-2 mb-1">/ {results.voterCount} registered voters</div>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{
                      width: `${results.voterCount > 0 ? (results.totalVotes / results.voterCount) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {results.voterCount > 0
                    ? `${((results.totalVotes / results.voterCount) * 100).toFixed(1)}% participation rate`
                    : "0% participation rate"}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Total Votes</h2>
              <div className="text-4xl font-bold">{results.totalVotes}</div>
              <p className="text-sm text-gray-600 mt-1">Votes recorded on the blockchain</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">Vote Distribution</h2>
            <div className="h-80">
              <ResultsChart results={results.results} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Detailed Results</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Rank
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
                      Votes
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.results
                    .sort((a, b) => b.voteCount - a.voteCount)
                    .map((party, index) => (
                      <tr key={party.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <img
                              src={party.logoUrl || "/placeholder.svg"}
                              alt={`${party.name} logo`}
                              className="h-8 w-8 mr-3 object-contain"
                            />
                            {party.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{party.voteCount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {results.totalVotes > 0
                            ? `${((party.voteCount / results.totalVotes) * 100).toFixed(2)}%`
                            : "0%"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Results
