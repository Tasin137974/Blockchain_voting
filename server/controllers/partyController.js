const Party = require("../models/Party")
const blockchain = require("../utils/blockchain")

// Add party
exports.addParty = async (req, res) => {
  try {
    const { name, description, logoUrl } = req.body

    // Add party to blockchain
    const receipt = await blockchain.addParty(
      name,
      description,
      logoUrl,
      process.env.ADMIN_WALLET_ADDRESS,
      process.env.ADMIN_PRIVATE_KEY,
    )

    // Get party count to determine the ID
    const partyCount = await blockchain.getPartyCount()

    // Create party in database
    const party = await Party.create({
      blockchainId: partyCount,
      name,
      description,
      logoUrl,
    })

    // Log audit
    await blockchain.logAudit(req.user._id, "PARTY_ADDED", { name, blockchainId: partyCount })

    res.status(201).json({
      success: true,
      party,
      transactionHash: receipt.transactionHash,
    })
  } catch (error) {
    console.error("Add party error:", error)
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}

// Get all parties
exports.getParties = async (req, res) => {
  try {
    const parties = await Party.find({ active: true }).sort("name")

    // Get vote counts from blockchain
    const partiesWithVotes = await Promise.all(
      parties.map(async (party) => {
        try {
          const blockchainParty = await blockchain.getParty(party.blockchainId)
          return {
            ...party._doc,
            voteCount: blockchainParty.voteCount,
          }
        } catch (error) {
          console.error(`Error getting party ${party.blockchainId} from blockchain:`, error)
          return {
            ...party._doc,
            voteCount: 0,
          }
        }
      }),
    )

    res.status(200).json({
      success: true,
      count: partiesWithVotes.length,
      parties: partiesWithVotes,
    })
  } catch (error) {
    console.error("Get parties error:", error)
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}

// Get party by ID
exports.getParty = async (req, res) => {
  try {
    const party = await Party.findById(req.params.id)

    if (!party) {
      return res.status(404).json({ success: false, message: "Party not found" })
    }

    // Get vote count from blockchain
    const blockchainParty = await blockchain.getParty(party.blockchainId)

    res.status(200).json({
      success: true,
      party: {
        ...party._doc,
        voteCount: blockchainParty.voteCount,
      },
    })
  } catch (error) {
    console.error("Get party error:", error)
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}

// Update party
exports.updateParty = async (req, res) => {
  try {
    let party = await Party.findById(req.params.id)

    if (!party) {
      return res.status(404).json({ success: false, message: "Party not found" })
    }

    // Update party in database
    party = await Party.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    // Log audit
    await blockchain.logAudit(req.user._id, "PARTY_UPDATED", {
      partyId: party._id,
      blockchainId: party.blockchainId,
      updates: req.body,
    })

    res.status(200).json({
      success: true,
      party,
    })
  } catch (error) {
    console.error("Update party error:", error)
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}

// Remove party
exports.removeParty = async (req, res) => {
  try {
    const party = await Party.findById(req.params.id)

    if (!party) {
      return res.status(404).json({ success: false, message: "Party not found" })
    }

    // Remove party from blockchain
    const receipt = await blockchain.removeParty(
      party.blockchainId,
      process.env.ADMIN_WALLET_ADDRESS,
      process.env.ADMIN_PRIVATE_KEY,
    )

    // Update party in database (mark as inactive)
    await Party.findByIdAndUpdate(req.params.id, { active: false })

    // Log audit
    await blockchain.logAudit(req.user._id, "PARTY_REMOVED", {
      partyId: party._id,
      blockchainId: party.blockchainId,
    })

    res.status(200).json({
      success: true,
      message: "Party removed",
      transactionHash: receipt.transactionHash,
    })
  } catch (error) {
    console.error("Remove party error:", error)
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}
