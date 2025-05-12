const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const path = require("path")
const blockchain = require("./utils/blockchain")

// Load environment variables
dotenv.config()

// Initialize Express app
const app = express()

// Middleware
app.use(express.json())
app.use(cors())

// Routes
app.use("/api/auth", require("./routes/authRoutes"))
app.use("/api/parties", require("./routes/partyRoutes"))
app.use("/api/votes", require("./routes/voteRoutes"))
app.use("/api/admin", require("./routes/adminRoutes"))

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"))
  })
}

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: "Server error",
    error: process.env.NODE_ENV === "production" ? {} : err,
  })
})

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected")

    // Initialize blockchain contract
    return blockchain.initContract()
  })
  .then(() => {
    console.log("Blockchain contract initialized")

    // Start server
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((err) => {
    console.error("Error starting server:", err)
    process.exit(1)
  })
