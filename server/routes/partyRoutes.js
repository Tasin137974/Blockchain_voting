const express = require("express")
const { addParty, getParties, getParty, updateParty, removeParty } = require("../controllers/partyController")
const { protect, admin } = require("../middleware/auth")

const router = express.Router()

router.route("/").get(getParties).post(protect, admin, addParty)

router.route("/:id").get(getParty).put(protect, admin, updateParty).delete(protect, admin, removeParty)

module.exports = router
