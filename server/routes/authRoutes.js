const express = require("express")
const { register, login, getMe, createAdmin } = require("../controllers/authController")
const { protect } = require("../middleware/auth")

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.get("/me", protect, getMe)
router.post("/create-admin", createAdmin)

module.exports = router
