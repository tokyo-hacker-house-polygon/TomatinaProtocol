// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.6;

import {implementationOfEip5114} from "./implementEIP5114.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Soulbond is  implementationOfEip5114{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint public tokenCount;
    address from;

    struct Soul {
        uint soulId;
        address sender;
        address owner;
        bool show;
    }

    mapping(uint256 => Soul) private idToSoul;
    mapping(address => string) private addrToPubkey;

    constructor() implementationOfEip5114("Soulbond Token", "SOUL") {}

    function _setYourSoul(uint256 _tokenId, bool _show) public {
        idToSoul[_tokenId].show = _show;
    }

    function mint(address _to, string memory _tokenURI) external returns(uint) {
        _tokenIds.increment();
        tokenCount = _tokenIds.current();
        idToSoul[tokenCount] = Soul(
            tokenCount,
            msg.sender,
            _to,
            false
        );
        _mint(_to, tokenCount, _tokenURI);

        return tokenCount;
    }

    function getSender(uint _tokenId) public view returns (address sender) {
        require(idToSoul[_tokenId].owner != address(0), "This token doesn't exist");
        return idToSoul[_tokenId].sender;
    }

    function fetchYourSouls() public view returns (Soul[] memory) {
        uint totalSoulCount = _tokenIds.current();
        uint soulCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalSoulCount; i++) {
            if (idToSoul[i + 1].owner == msg.sender) {
                soulCount += 1;
            }
        }

        Soul[] memory souls = new Soul[](soulCount);
        for (uint i = 0; i < totalSoulCount; i++) {
            if (idToSoul[i + 1].owner == msg.sender) {
                uint currentId = idToSoul[i + 1].soulId;
                Soul storage currentSoul = idToSoul[currentId];
                souls[currentIndex] = currentSoul;
                currentIndex += 1;
            }
        }
        return souls;
    }

    function setPubKey(string memory _pubKey) public {
        addrToPubkey[msg.sender] = _pubKey;
    }

    function getPubkey(address _to) public view returns (string memory pubKey) {
        return addrToPubkey[_to];
    }
}