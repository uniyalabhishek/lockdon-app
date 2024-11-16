// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Verifier} from "vlayer-0.1.0/Verifier.sol";
import {EmailProver} from "./EmailProver.sol";
import {IVerifier} from "./IVerifier.sol";

contract LockContract {
    struct Lock {
        address owner;
        string target;
        uint256 amount;
        uint256 deadline;
        string proofType;
        bool completed;
        bool claimed;
    }

    mapping(uint256 => Lock) public locks;
    uint256 public nextLockId;
    address public charityAddress;
    mapping(string => address) public proofVerifiers;

    event LockCreated(
        uint256 indexed lockId,
        address indexed owner,
        string target,
        uint256 amount,
        uint256 deadline
    );
    event ProofVerified(uint256 indexed lockId);
    event TokensClaimed(uint256 indexed lockId);
    event TokensToCharity(uint256 indexed lockId);

    constructor(address _charityAddress, address _emailVerifier) {
        charityAddress = _charityAddress;
        proofVerifiers["email"] = _emailVerifier;
    }

    function createLock(
        string memory target,
        string memory proofType,
        uint256 deadline
    ) public payable {
        require(msg.value > 0, "Must lock some ETH");
        require(deadline > block.timestamp, "Deadline must be in future");
        require(proofVerifiers[proofType] != address(0), "Invalid proof type");

        uint256 lockId = nextLockId++;
        locks[lockId] = Lock({
            owner: msg.sender,
            target: target,
            amount: msg.value,
            deadline: deadline,
            proofType: proofType,
            completed: false,
            claimed: false
        });

        emit LockCreated(lockId, msg.sender, target, msg.value, deadline);
    }

    function verifyProof(uint256 lockId, Proof calldata proof) public {
        Lock storage lock = locks[lockId];
        require(!lock.completed, "Already completed");

        address verifier = proofVerifiers[lock.proofType];
        IVerifier(verifier).verify(proof, lock.owner);

        lock.completed = true;
        emit ProofVerified(lockId);
    }

    function claimTokens(uint256 lockId) public {
        Lock storage lock = locks[lockId];
        require(msg.sender == lock.owner, "Not owner");
        require(lock.completed, "Not completed");
        require(!lock.claimed, "Already claimed");

        lock.claimed = true;
        payable(lock.owner).transfer(lock.amount);
        emit TokensClaimed(lockId);
    }

    function sendToCharity(uint256 lockId) public {
        Lock storage lock = locks[lockId];
        require(block.timestamp > lock.deadline, "Not past deadline");
        require(!lock.completed, "Already completed");
        require(!lock.claimed, "Already claimed");

        lock.claimed = true;
        payable(charityAddress).transfer(lock.amount);
        emit TokensToCharity(lockId);
    }

    function setProofVerifier(
        string memory proofType,
        address verifier
    ) public {
        // Add admin checks as needed
        proofVerifiers[proofType] = verifier;
    }
}
