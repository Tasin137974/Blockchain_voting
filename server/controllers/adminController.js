const User = require("../models/User")
const Vote = require("../models/Vote")
const AuditLog = require("../models/AuditLog")
const blockchain = require("../utils/blockchain")

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort("name")

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    })
  } catch (error) {
    console.error("Get users error:", error)
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    // Get counts from blockchain
    const voterCount = await blockchain.getVoterCount()
    const totalVotes = await blockchain.getTotalVotes()
    const votingOpen = await blockchain.getVotingStatus()

    // Get counts from database
    const userCount = await User.countDocuments()
    const adminCount = await User.countDocuments({ isAdmin: true })

    // Get recent votes
    const recentVotes = await Vote.find()
      .sort("-timestamp")
      .limit(5)
      .populate("voter", "name")
      .populate("party", "name")

    // Get recent audit logs
    const recentLogs = await AuditLog.find().sort("-timestamp").limit(10).populate("performedBy", "name")

    res.status(200).json({
      success: true,
      stats: {
        voterCount,
        totalVotes,
        votingOpen,
        userCount,
        adminCount,
        participationRate: voterCount > 0 ? (totalVotes / voterCount) * 100 : 0,
      },
      recentVotes,
      recentLogs,
    })
  } catch (error) {
    console.error("Get dashboard stats error:", error)
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}

// Get audit logs
exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().sort("-timestamp").populate("performedBy", "name")

    res.status(200).json({
      success: true,
      count: logs.length,
      logs,
    })
  } catch (error) {
    console.error("Get audit logs error:", error)
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}

// Create wallet
exports.createWallet = async (req, res) => {
  try {
    const wallet = blockchain.createWallet()

    res.status(200).json({
      success: true,
      wallet: {
        address: wallet.address,
        privateKey: wallet.privateKey,
      },
    })
  } catch (error) {
    console.error("Create wallet error:", error)
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}
