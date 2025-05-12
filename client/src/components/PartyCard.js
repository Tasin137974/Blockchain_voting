"use client"

const PartyCard = ({ party, onVote, showVoteButton = false }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-center mb-4">
          <img
            src={party.logoUrl || "/placeholder.svg"}
            alt={`${party.name} logo`}
            className="h-24 w-24 object-contain"
          />
        </div>

        <h3 className="text-xl font-bold text-center mb-2">{party.name}</h3>

        <p className="text-gray-600 mb-4">{party.description}</p>

        {party.voteCount !== undefined && (
          <div className="text-center mb-4">
            <span className="bg-blue-100 text-blue-800 font-medium px-3 py-1 rounded-full">
              {party.voteCount} votes
            </span>
          </div>
        )}

        {showVoteButton && (
          <button
            onClick={() => onVote(party)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-200"
          >
            Vote for {party.name}
          </button>
        )}
      </div>
    </div>
  )
}

export default PartyCard
