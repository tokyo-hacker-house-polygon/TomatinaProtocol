// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.6;

/// @title This is my fast implementation of EIP5114
/// Pls refer this page https://eips.ethereum.org/EIPS/eip-5114

interface IImplementationOfEip5114 {
    event Mint (address indexed to, uint256 indexed tokenId);

    function balanceOf(address owner) external view returns (uint256);

    function ownerOf(uint256 tokenId) external view returns (address);
}