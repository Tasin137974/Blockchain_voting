const Web3 = require("web3")
const VotingSystemABI = require("../contracts/VotingSystem.json")
const AuditLog = require("../models/AuditLog")

// Connect to local blockchain using Web3.js v4.x syntax
const web3 = new Web3("http://localhost:7545")


// Contract instance
let votingSystemContract

// Initialize contract
const initContract = async () => {
  try {
    const networkId = await web3.eth.net.getId()
    const deployedNetwork = VotingSystemABI.networks[networkId]

    if (!deployedNetwork) {
      throw new Error("Contract not deployed on the current network")
    }

    votingSystemContract = new web3.eth.Contract(
      VotingSystemABI.abi,
      deployedNetwork.address
    )

    console.log("Contract initialized at:", deployedNetwork.address)
    return votingSystemContract
  } catch (error) {
    console.error("Failed to initialize contract:", error)
    throw error
  }
}

// Get contract instance
const getContract = () => {
  if (!votingSystemContract) {
    throw new Error("Contract not initialized")
  }
  return votingSystemContract
}

// Register voter on blockchain
const registerVoter = async (walletAddress, name, age, nidNumber, adminWallet, adminPrivateKey) => {
  try {
    const contract = getContract()

    const data = contract.methods.registerVoter(name, age, nidNumber).encodeABI()

    const tx = {
      from: adminWallet,
      to: contract.options.address,
      gas: 2000000,
      data: data,
    }

    const signedTx = await web3.eth.accounts.signTransaction(tx, adminPrivateKey)
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)

    return receipt
  } catch (error) {
    console.error("Failed to register voter on blockchain:", error)
    throw error
  }
}

// Add party on blockchain
const addParty = async (name, description, logoUrl, adminWallet, adminPrivateKey) => {
  try {
    const contract = getContract()

    const data = contract.methods.addParty(name, description, logoUrl).encodeABI()

    const tx = {
      from: adminWallet,
      to: contract.options.address,
      gas: 2000000,
      data: data,
    }

    const signedTx = await web3.eth.accounts.signTransaction(tx, adminPrivateKey)
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)

    return receipt
  } catch (error) {
    console.error("Failed to add party on blockchain:", error)
    throw error
  }
}

// Remove party on blockchain
const removeParty = async (partyId, adminWallet, adminPrivateKey) => {
  try {
    const contract = getContract()

    const data = contract.methods.removeParty(partyId).encodeABI()

    const tx = {
      from: adminWallet,
      to: contract.options.address,
      gas: 2000000,
      data: data,
    }

    const signedTx = await web3.eth.accounts.signTransaction(tx, adminPrivateKey)
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)

    return receipt
  } catch (error) {
    console.error("Failed to remove party on blockchain:", error)
    throw error
  }
}

// Start voting on blockchain
const startVoting = async (adminWallet, adminPrivateKey) => {
  try {
    const contract = getContract()

    const data = contract.methods.startVoting().encodeABI()

    const tx = {
      from: adminWallet,
      to: contract.options.address,
      gas: 2000000,
      data: data,
    }

    const signedTx = await web3.eth.accounts.signTransaction(tx, adminPrivateKey)
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)

    return receipt
  } catch (error) {
    console.error("Failed to start voting on blockchain:", error)
    throw error
  }
}

// Stop voting on blockchain
const stopVoting = async (adminWallet, adminPrivateKey) => {
  try {
    const contract = getContract()

    const data = contract.methods.stopVoting().encodeABI()

    const tx = {
      from: adminWallet,
      to: contract.options.address,
      gas: 2000000,
      data: data,
    }

    const signedTx = await web3.eth.accounts.signTransaction(tx, adminPrivateKey)
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)

    return receipt
  } catch (error) {
    console.error("Failed to stop voting on blockchain:", error)
    throw error
  }
}

// Cast vote on blockchain
const castVote = async (partyId, voterWallet, voterPrivateKey) => {
  try {
    const contract = getContract()

    const data = contract.methods.vote(partyId).encodeABI()

    const tx = {
      from: voterWallet,
      to: contract.options.address,
      gas: 2000000,
      data: data,
    }

    const signedTx = await web3.eth.accounts.signTransaction(tx, voterPrivateKey)
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)

    return receipt
  } catch (error) {
    console.error("Failed to cast vote on blockchain:", error)
    throw error
  }
}

// Get voter status from blockchain
const getVoterStatus = async (walletAddress) => {
  try {
    const contract = getContract()
    const status = await contract.methods.getVoterStatus().call({ from: walletAddress })
    return status
  } catch (error) {
    console.error("Failed to get voter status from blockchain:", error)
    throw error
  }
}

// Get voter details from blockchain
const getVoterDetails = async (walletAddress) => {
  try {
    const contract = getContract()
    const details = await contract.methods.getVoterDetails().call({ from: walletAddress })
    return {
      name: details[0],
      age: details[1],
      nidNumber: details[2],
      isRegistered: details[3],
      hasVoted: details[4],
    }
  } catch (error) {
    console.error("Failed to get voter details from blockchain:", error)
    throw error
  }
}

// Get party details from blockchain
const getParty = async (partyId) => {
  try {
    const contract = getContract()
    const party = await contract.methods.getParty(partyId).call()
    return {
      id: party[0],
      name: party[1],
      description: party[2],
      logoUrl: party[3],
      voteCount: party[4],
    }
  } catch (error) {
    console.error("Failed to get party from blockchain:", error)
    throw error
  }
}

// Get voting results from blockchain
const getResults = async () => {
  try {
    const contract = getContract()
    const results = await contract.methods.getResults().call()

    const formattedResults = []
    for (let i = 0; i < results[0].length; i++) {
      formattedResults.push({
        id: results[0][i],
        name: results[1][i],
        voteCount: results[2][i],
      })
    }

    return formattedResults
  } catch (error) {
    console.error("Failed to get results from blockchain:", error)
    throw error
  }
}

// Get voting status from blockchain
const getVotingStatus = async () => {
  try {
    const contract = getContract()
    return await contract.methods.getVotingStatus().call()
  } catch (error) {
    console.error("Failed to get voting status from blockchain:", error)
    throw error
  }
}

// Get party count from blockchain
const getPartyCount = async () => {
  try {
    const contract = getContract()
    return await contract.methods.getPartyCount().call()
  } catch (error) {
    console.error("Failed to get party count from blockchain:", error)
    throw error
  }
}

// Get voter count from blockchain
const getVoterCount = async () => {
  try {
    const contract = getContract()
    return await contract.methods.getVoterCount().call()
  } catch (error) {
    console.error("Failed to get voter count from blockchain:", error)
    throw error
  }
}

// Get total votes from blockchain
const getTotalVotes = async () => {
  try {
    const contract = getContract()
    return await contract.methods.getTotalVotes().call()
  } catch (error) {
    console.error("Failed to get total votes from blockchain:", error)
    throw error
  }
}

// Create a new wallet
const createWallet = () => {
  return web3.eth.accounts.create()
}

// Log audit event
const logAudit = async (userId, action, details) => {
  try {
    await AuditLog.create({
      action,
      performedBy: userId,
      details,
    })
  } catch (error) {
    console.error("Failed to log audit event:", error)
  }
}

module.exports = {
  initContract,
  getContract,
  registerVoter,
  addParty,
  removeParty,
  startVoting,
  stopVoting,
  castVote,
  getVoterStatus,
  getVoterDetails,
  getParty,
  getResults,
  getVotingStatus,
  getPartyCount,
  getVoterCount,
  getTotalVotes,
  createWallet,
  logAudit,
}