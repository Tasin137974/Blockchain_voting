const express = require("express")
const {
  castVote,
  getResults,
  getVoterStatus,
  startVoting,
  stopVoting,
  getVotingStatus,
} = require("../controllers/voteController")
const { protect, admin } = require("../middleware/auth")

const router = express.Router()

router.post("/cast", protect, castVote)
router.get("/results", getResults)
router.get("/status", protect, getVoterStatus)
router.post("/start", protect, admin, startVoting)
router.post("/stop", protect, admin, stopVoting)
router.get("/voting-status", getVotingStatus)

module.exports = router
