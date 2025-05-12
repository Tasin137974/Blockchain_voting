const express = require("express")
const { getUsers, getDashboardStats, getAuditLogs, createWallet } = require("../controllers/adminController")
const { protect, admin } = require("../middleware/auth")

const router = express.Router()

router.use(protect)
router.use(admin)

router.get("/users", getUsers)
router.get("/dashboard", getDashboardStats)
router.get("/audit-logs", getAuditLogs)
router.get("/create-wallet", createWallet)

module.exports = router
