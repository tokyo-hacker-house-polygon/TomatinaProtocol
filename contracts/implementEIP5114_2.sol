// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.6;

import {ERC165} from "./ERC165.sol";

import {IERC721Metadata} from "./interfaces/IERC721Metadata.sol";
import {IImplementationOfEip5114} from "./interfaces/IImplementationOfEip5114.sol";

abstract contract implementationOfEip5114_2 is ERC165, IERC721Metadata, IImplementationOfEip5114 {
    string private _name;
    string private _symbol;

    mapping (uint256 => address) private _owners;
    mapping (uint256 => string) private _tokenURIs;
    mapping (address => uint256) private _balances;

    constructor (
        string memory name_,
        string memory symbol_
    ) {
        _name = name_;
        _symbol = symbol_;
    }

    function supportsInterface(bytes4 interfaceId) public view override returns (bool) {
        return 
        interfaceId == type(IERC721Metadata).interfaceId ||
        interfaceId == type(IImplementationOfEip5114).interfaceId ||
        super.supportsInterface(interfaceId);
    }

    function name() public view virtual override returns (string memory) {
        return _name;
    }

    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory)  {
        require(_exists(tokenId), "tokenURI: token doesn't exist");
        return _tokenURIs[tokenId];
    }

    function balanceOf(address owner) public view override virtual returns (uint256) {
        require(owner != address(0), "balanceOf: address zero is not a valid owner");
        return _balances[owner];
    }

    function ownerOf(uint tokenId) public view override virtual returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "ownerOf: token doesn't exist");
        return owner;
    }

    function _exists(uint256 tokenId) internal view virtual returns (bool) {
        return _owners[tokenId] != address(0);
    }

    function _mintPub(
        address _to,
        uint256 tokenId,
        string memory uri
    ) internal virtual returns (uint256) {
        require(!_exists(tokenId), "mint: tokenID exists");
        _balances[_to] += 1;
        _owners[tokenId] = _to;
        _tokenURIs[tokenId] = uri;
        emit Mint(_to, tokenId);
        return tokenId;
    }
}