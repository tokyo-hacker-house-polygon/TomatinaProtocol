// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.6;

import {ERC4973} from "./ERC4973.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Soulbond is  ERC4973{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint public tokenCount;
    bool show;
    address from;

    struct Soul {
        uint soulId;
        address sender;
        address owner;
        bool show;
    }

    mapping(uint256 => Soul) private idToSoul;

    constructor() ERC4973("Soulbond Token", "SOUL") {}

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
}