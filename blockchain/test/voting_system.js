const VotingSystem = artifacts.require("VotingSystem")

contract("VotingSystem", (accounts) => {
  const admin = accounts[0]
  const voter1 = accounts[1]
  const voter2 = accounts[2]

  let votingSystemInstance

  beforeEach(async () => {
    votingSystemInstance = await VotingSystem.new({ from: admin })
  })

  it("should set the admin correctly", async () => {
    const contractAdmin = await votingSystemInstance.admin()
    assert.equal(contractAdmin, admin, "Admin not set correctly")
  })

  it("should register a voter", async () => {
    await votingSystemInstance.registerVoter("John Doe", 25, "1234567890", { from: voter1 })

    const voterDetails = await votingSystemInstance.getVoterDetails({ from: voter1 })
    assert.equal(voterDetails[0], "John Doe", "Voter name not set correctly")
    assert.equal(voterDetails[1].toNumber(), 25, "Voter age not set correctly")
    assert.equal(voterDetails[2], "1234567890", "Voter NID not set correctly")
    assert.equal(voterDetails[3], true, "Voter not registered")
    assert.equal(voterDetails[4], false, "Voter should not have voted yet")
  })

  it("should add a party", async () => {
    await votingSystemInstance.addParty("Party A", "Description A", "logo_a.png", { from: admin })

    const party = await votingSystemInstance.getParty(1)
    assert.equal(party[0].toNumber(), 1, "Party ID not set correctly")
    assert.equal(party[1], "Party A", "Party name not set correctly")
    assert.equal(party[2], "Description A", "Party description not set correctly")
    assert.equal(party[3], "logo_a.png", "Party logo URL not set correctly")
    assert.equal(party[4].toNumber(), 0, "Party vote count should be 0")
  })

  it("should allow voting when voting is open", async () => {
    await votingSystemInstance.registerVoter("John Doe", 25, "1234567890", { from: voter1 })
    await votingSystemInstance.addParty("Party A", "Description A", "logo_a.png", { from: admin })
    await votingSystemInstance.startVoting({ from: admin })

    await votingSystemInstance.vote(1, { from: voter1 })

    const voterStatus = await votingSystemInstance.getVoterStatus({ from: voter1 })
    assert.equal(voterStatus[1], true, "Voter should have voted")

    const party = await votingSystemInstance.getParty(1)
    assert.equal(party[4].toNumber(), 1, "Party vote count should be 1")
  })

  it("should not allow voting twice", async () => {
    await votingSystemInstance.registerVoter("John Doe", 25, "1234567890", { from: voter1 })
    await votingSystemInstance.addParty("Party A", "Description A", "logo_a.png", { from: admin })
    await votingSystemInstance.startVoting({ from: admin })

    await votingSystemInstance.vote(1, { from: voter1 })

    try {
      await votingSystemInstance.vote(1, { from: voter1 })
      assert.fail("Should have thrown an error")
    } catch (error) {
      assert(error.message.includes("Voter has already voted"), "Expected 'Voter has already voted' error")
    }
  })

  it("should not allow voting when voting is closed", async () => {
    await votingSystemInstance.registerVoter("John Doe", 25, "1234567890", { from: voter1 })
    await votingSystemInstance.addParty("Party A", "Description A", "logo_a.png", { from: admin })

    try {
      await votingSystemInstance.vote(1, { from: voter1 })
      assert.fail("Should have thrown an error")
    } catch (error) {
      assert(error.message.includes("Voting is not open"), "Expected 'Voting is not open' error")
    }
  })

  it("should get correct results", async () => {
    await votingSystemInstance.addParty("Party A", "Description A", "logo_a.png", { from: admin })
    await votingSystemInstance.addParty("Party B", "Description B", "logo_b.png", { from: admin })

    await votingSystemInstance.registerVoter("John Doe", 25, "1234567890", { from: voter1 })
    await votingSystemInstance.registerVoter("Jane Doe", 30, "0987654321", { from: voter2 })

    await votingSystemInstance.startVoting({ from: admin })

    await votingSystemInstance.vote(1, { from: voter1 })
    await votingSystemInstance.vote(2, { from: voter2 })

    const results = await votingSystemInstance.getResults()

    assert.equal(results[0][0].toNumber(), 1, "Party ID not correct")
    assert.equal(results[0][1].toNumber(), 2, "Party ID not correct")
    assert.equal(results[1][0], "Party A", "Party name not correct")
    assert.equal(results[1][1], "Party B", "Party name not correct")
    assert.equal(results[2][0].toNumber(), 1, "Vote count not correct")
    assert.equal(results[2][1].toNumber(), 1, "Vote count not correct")
  })
})
