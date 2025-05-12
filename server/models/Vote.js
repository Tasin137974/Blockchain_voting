const mongoose = require("mongoose")

const VoteSchema = new mongoose.Schema({
  voter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  party: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Party",
    required: true,
  },
  blockchainTransactionHash: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Vote", VoteSchema)
