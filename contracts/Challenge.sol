// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Challenge {
    struct ChallengeData {
        address challenger;
        string proofType;
        uint256 amount;
        uint256 deadline;
        string target;
        string email;
        bool isGroupTarget;
        uint256 lockedAmount;
        bool completed;
    }

    mapping(address => ChallengeData[]) public userChallenges;
    uint256 public totalChallenges;

    struct Hit {
        address creator;
        string target;
        address[] approvedAddresses;
        bool active;
    }

    mapping(address => Hit[]) public userHits;
    
    event ChallengeCreated(
        address indexed challenger,
        string proofType,
        uint256 amount,
        uint256 deadline,
        string target,
        bool isGroupTarget
    );

    event HitCreated(
        address indexed creator,
        string target,
        address[] approvedAddresses
    );

    function createChallenge(
        string memory _proofType,
        uint256 _amount,
        uint256 _deadline,
        string memory _target,
        string memory _email,
        bool _isGroupTarget
    ) external payable {
        require(msg.value > 0, "Must lock some ETH");
        require(_deadline > block.timestamp, "Deadline must be in the future");

        ChallengeData memory newChallenge = ChallengeData({
            challenger: msg.sender,
            proofType: _proofType,
            amount: _amount,
            deadline: _deadline,
            target: _target,
            email: _email,
            isGroupTarget: _isGroupTarget,
            lockedAmount: msg.value,
            completed: false
        });

        userChallenges[msg.sender].push(newChallenge);
        totalChallenges++;

        emit ChallengeCreated(
            msg.sender,
            _proofType,
            _amount,
            _deadline,
            _target,
            _isGroupTarget
        );
    }

    function createHit(
        string memory _target,
        address[] memory _approvedAddresses
    ) external {
        Hit memory newHit = Hit({
            creator: msg.sender,
            target: _target,
            approvedAddresses: _approvedAddresses,
            active: true
        });

        userHits[msg.sender].push(newHit);

        emit HitCreated(
            msg.sender,
            _target,
            _approvedAddresses
        );
    }

    function getUserHits(address _user) external view returns (Hit[] memory) {
        return userHits[_user];
    }

    // Additional functions for completing challenges, withdrawing funds, etc.
    // would go here
} 