// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Proof} from "vlayer-0.1.0/Proof.sol";

interface IVerifier {
    function verify(Proof calldata proof, address owner) external view;
}
