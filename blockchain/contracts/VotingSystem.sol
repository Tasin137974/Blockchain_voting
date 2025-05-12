// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSystem {
    struct Party {
        uint256 id;
        string name;
        string description;
        string logoUrl;
        uint256 voteCount;
        bool exists;
    }

    struct Voter {
        string name;
        uint256 age;
        string nidNumber;
        bool hasVoted;
        bool isRegistered;
    }

    address public admin;
    bool public votingOpen;
    uint256 public partyCount;
    uint256 public voterCount;
    uint256 public totalVotes;

    mapping(address => Voter) public voters;
    mapping(uint256 => Party) public parties;
    mapping(address => uint256) private votes;

    event VoterRegistered(address indexed voterAddress, string name);
    event VoteCast(address indexed voter, uint256 partyId);
    event PartyAdded(uint256 partyId, string name);
    event PartyRemoved(uint256 partyId);
    event VotingStarted();
    event VotingStopped();

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier votingIsOpen() {
        require(votingOpen, "Voting is not open");
        _;
    }

    constructor() {
        admin = msg.sender;
        votingOpen = false;
        partyCount = 0;
        voterCount = 0;
        totalVotes = 0;
    }

    function registerVoter(string memory _name, uint256 _age, string memory _nidNumber) public {
        require(!voters[msg.sender].isRegistered, "Voter already registered");
        require(_age >= 18, "Voter must be at least 18 years old");
        
        voters[msg.sender] = Voter({
            name: _name,
            age: _age,
            nidNumber: _nidNumber,
            hasVoted: false,
            isRegistered: true
        });
        
        voterCount++;
        emit VoterRegistered(msg.sender, _name);
    }

    function addParty(string memory _name, string memory _description, string memory _logoUrl) public onlyAdmin {
        partyCount++;
        parties[partyCount] = Party({
            id: partyCount,
            name: _name,
            description: _description,
            logoUrl: _logoUrl,
            voteCount: 0,
            exists: true
        });
        
        emit PartyAdded(partyCount, _name);
    }

    function removeParty(uint256 _partyId) public onlyAdmin {
        require(parties[_partyId].exists, "Party does not exist");
        parties[_partyId].exists = false;
        emit PartyRemoved(_partyId);
    }

    function startVoting() public onlyAdmin {
        votingOpen = true;
        emit VotingStarted();
    }

    function stopVoting() public onlyAdmin {
        votingOpen = false;
        emit VotingStopped();
    }

    function vote(uint256 _partyId) public votingIsOpen {
        require(voters[msg.sender].isRegistered, "Voter is not registered");
        require(!voters[msg.sender].hasVoted, "Voter has already voted");
        require(parties[_partyId].exists, "Party does not exist");
        
        voters[msg.sender].hasVoted = true;
        parties[_partyId].voteCount++;
        votes[msg.sender] = _partyId;
        totalVotes++;
        
        emit VoteCast(msg.sender, _partyId);
    }

    function getParty(uint256 _partyId) public view returns (uint256, string memory, string memory, string memory, uint256) {
        require(parties[_partyId].exists, "Party does not exist");
        Party memory party = parties[_partyId];
        return (party.id, party.name, party.description, party.logoUrl, party.voteCount);
    }

    function getVoterStatus() public view returns (bool, bool) {
        return (voters[msg.sender].isRegistered, voters[msg.sender].hasVoted);
    }

    function getVoterDetails() public view returns (string memory, uint256, string memory, bool, bool) {
        Voter memory voter = voters[msg.sender];
        return (voter.name, voter.age, voter.nidNumber, voter.isRegistered, voter.hasVoted);
    }

    function getResults() public view returns (uint256[] memory, string[] memory, uint256[] memory) {
        uint256[] memory ids = new uint256[](partyCount);
        string[] memory names = new string[](partyCount);
        uint256[] memory voteCounts = new uint256[](partyCount);
        
        for (uint256 i = 1; i <= partyCount; i++) {
            if (parties[i].exists) {
                ids[i-1] = parties[i].id;
                names[i-1] = parties[i].name;
                voteCounts[i-1] = parties[i].voteCount;
            }
        }
        
        return (ids, names, voteCounts);
    }

    function getVotingStatus() public view returns (bool) {
        return votingOpen;
    }

    function getPartyCount() public view returns (uint256) {
        return partyCount;
    }

    function getVoterCount() public view returns (uint256) {
        return voterCount;
    }

    function getTotalVotes() public view returns (uint256) {
        return totalVotes;
    }
}
