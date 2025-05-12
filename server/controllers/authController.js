const jwt = require("jsonwebtoken")
const User = require("../models/User")
const blockchain = require("../utils/blockchain")

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  })
}

// Register user
exports.register = async (req, res) => {
  try {
    const { name, age, nidNumber, walletAddress, password } = req.body

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ nidNumber }, { walletAddress }] })
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" })
    }

    // Validate age
    if (age < 18) {
      return res.status(400).json({ success: false, message: "You must be at least 18 years old to register" })
    }

    // Create user in database
    const user = await User.create({
      name,
      age,
      nidNumber,
      walletAddress,
      password,
    })

    // Register on blockchain
    await blockchain.registerVoter(
      walletAddress,
      name,
      age,
      nidNumber,
      process.env.ADMIN_WALLET_ADDRESS,
      process.env.ADMIN_PRIVATE_KEY,
    )

    // Log audit
    await blockchain.logAudit(user._id, "USER_REGISTERED", { name, nidNumber, walletAddress })

    // Generate token
    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        age: user.age,
        nidNumber: user.nidNumber,
        walletAddress: user.walletAddress,
        isAdmin: user.isAdmin,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}

// Login user
exports.login = async (req, res) => {
  try {
    const { nidNumber, password } = req.body

    // Check if user exists
    const user = await User.findOne({ nidNumber })
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    // Generate token
    const token = generateToken(user._id)

    // Log audit
    await blockchain.logAudit(user._id, "USER_LOGIN", { nidNumber })

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        age: user.age,
        nidNumber: user.nidNumber,
        walletAddress: user.walletAddress,
        isAdmin: user.isAdmin,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")

    // Get blockchain status
    const blockchainStatus = await blockchain.getVoterStatus(user.walletAddress)

    res.status(200).json({
      success: true,
      user: {
        ...user._doc,
        blockchainRegistered: blockchainStatus[0],
        blockchainVoted: blockchainStatus[1],
      },
    })
  } catch (error) {
    console.error("Get me error:", error)
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}

// Create admin (for initial setup)
exports.createAdmin = async (req, res) => {
  try {
    const { name, age, nidNumber, walletAddress, password, adminSecret } = req.body

    // Verify admin secret
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(401).json({ success: false, message: "Invalid admin secret" })
    }

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ nidNumber }, { walletAddress }] })
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" })
    }

    // Create admin user
    const admin = await User.create({
      name,
      age,
      nidNumber,
      walletAddress,
      password,
      isAdmin: true,
    })

    // Register on blockchain
    await blockchain.registerVoter(
      walletAddress,
      name,
      age,
      nidNumber,
      process.env.ADMIN_WALLET_ADDRESS,
      process.env.ADMIN_PRIVATE_KEY,
    )

    // Log audit
    await blockchain.logAudit(admin._id, "ADMIN_CREATED", { name, nidNumber, walletAddress })

    // Generate token
    const token = generateToken(admin._id)

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: admin._id,
        name: admin.name,
        age: admin.age,
        nidNumber: admin.nidNumber,
        walletAddress: admin.walletAddress,
        isAdmin: admin.isAdmin,
      },
    })
  } catch (error) {
    console.error("Create admin error:", error)
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}
