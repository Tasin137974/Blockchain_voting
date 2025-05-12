const Vote = require("../models/Vote")
const User = require("../models/User")
const Party = require("../models/Party")
const blockchain = require("../utils/blockchain")

// Cast vote
exports.castVote = async (req, res) => {
  try {
    const { partyId, privateKey } = req.body

    // Get user
    const user = await User.findById(req.user._id)

    // Get party
    const party = await Party.findOne({ blockchainId: partyId, active: true })
    if (!party) {
      return res.status(404).json({ success: false, message: "Party not found" })
    }

    // Check if voting is open
    const votingOpen = await blockchain.getVotingStatus()
    if (!votingOpen) {
      return res.status(400).json({ success: false, message: "Voting is not open" })
    }

    // Check if user has already voted
    const voterStatus = await blockchain.getVoterStatus(user.walletAddress)
    if (voterStatus[1]) {
      return res.status(400).json({ success: false, message: "You have already voted" })
    }

    // Cast vote on blockchain
    const receipt = await blockchain.castVote(partyId, user.walletAddress, privateKey)

    // Create vote record in database
    const vote = await Vote.create({
      voter: user._id,
      party: party._id,
      blockchainTransactionHash: receipt.transactionHash,
    })

    // Log audit
    await blockchain.logAudit(user._id, "VOTE_CAST", {
      partyId: party._id,
      blockchainId: party.blockchainId,
      transactionHash: receipt.transactionHash,
    })

    // Generate receipt data
    const voteReceipt = {
      voter: {
        name: user.name,
        nidNumber: user.nidNumber,
      },
      party: {
        name: party.name,
        id: party.blockchainId,
      },
      timestamp: vote.timestamp,
      transactionHash: receipt.transactionHash,
    }

    res.status(200).json({
      success: true,
      message: "Vote cast successfully",
      receipt: voteReceipt,
      transactionHash: receipt.transactionHash,
    })
  } catch (error) {
    console.error("Cast vote error:", error)
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}

// Get voting results
exports.getResults = async (req, res) => {
  try {
    // Get results from blockchain
    const results = await blockchain.getResults()

    // Get party details from database
    const partiesWithDetails = await Promise.all(
      results.map(async (result) => {
        const party = await Party.findOne({ blockchainId: result.id })
        return {
          ...result,
          description: party ? party.description : "",
          logoUrl: party ? party.logoUrl : "",
          active: party ? party.active : false,
        }
      }),
    )

    // Get voting status
    const votingOpen = await blockchain.getVotingStatus()

    // Get voter counts
    const voterCount = await blockchain.getVoterCount()
    const totalVotes = await blockchain.getTotalVotes()

    res.status(200).json({
      success: true,
      votingOpen,
      voterCount,
      totalVotes,
      results: partiesWithDetails,
    })
  } catch (error) {
    console.error("Get results error:", error)
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}

// Get voter status
exports.getVoterStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    // Get voter status from blockchain
    const status = await blockchain.getVoterStatus(user.walletAddress)

    // Get vote details if voted
    let voteDetails = null
    if (status[1]) {
      const vote = await Vote.findOne({ voter: user._id }).populate("party")
      if (vote) {
        voteDetails = {
          party: vote.party.name,
          timestamp: vote.timestamp,
          transactionHash: vote.blockchainTransactionHash,
        }
      }
    }

    res.status(200).json({
      success: true,
      isRegistered: status[0],
      hasVoted: status[1],
      voteDetails,
    })
  } catch (error) {
    console.error("Get voter status error:", error)
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}

// Start voting
exports.startVoting = async (req, res) => {
  try {
    // Start voting on blockchain
    const receipt = await blockchain.startVoting(process.env.ADMIN_WALLET_ADDRESS, process.env.ADMIN_PRIVATE_KEY)

    // Log audit
    await blockchain.logAudit(req.user._id, "VOTING_STARTED", {
      transactionHash: receipt.transactionHash,
    })

    res.status(200).json({
      success: true,
      message: "Voting started",
      transactionHash: receipt.transactionHash,
    })
  } catch (error) {
    console.error("Start voting error:", error)
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}

// Stop voting
exports.stopVoting = async (req, res) => {
  try {
    // Stop voting on blockchain
    const receipt = await blockchain.stopVoting(process.env.ADMIN_WALLET_ADDRESS, process.env.ADMIN_PRIVATE_KEY)

    // Log audit
    await blockchain.logAudit(req.user._id, "VOTING_STOPPED", {
      transactionHash: receipt.transactionHash,
    })

    res.status(200).json({
      success: true,
      message: "Voting stopped",
      transactionHash: receipt.transactionHash,
    })
  } catch (error) {
    console.error("Stop voting error:", error)
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}

// Get voting status
exports.getVotingStatus = async (req, res) => {
  try {
    // Get voting status from blockchain
    const votingOpen = await blockchain.getVotingStatus()

    res.status(200).json({
      success: true,
      votingOpen,
    })
  } catch (error) {
    console.error("Get voting status error:", error)
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}
