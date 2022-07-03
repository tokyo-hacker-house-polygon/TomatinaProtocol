// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.6;

import {implementationOfEip5114} from "./implementEIP5114.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Soulbond is  implementationOfEip5114{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _pubTokenIds;
    Counters.Counter private _keyIds;
    uint public tokenCount;
    uint public pubTokenCount;
    uint public keyCount;
    address from;

    struct Soul {
        uint soulId;
        address sender;
        address owner;
        bool show;
    }

    struct PubSoul {
        uint soulId;
        address sender;
        address owner;
        string img;
        string description;
        string name;
    }

    struct Keys {
        uint keyId;
        address owner;
        string publicKey;
    }

    mapping(uint256 => Soul) private idToSoul;
    mapping(uint256 => PubSoul) private idToPubSoul;
    mapping(uint256 => Keys) private addrToPubkey;

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
    function getPubSender(uint _tokenId) public view returns (address sender) {
        require(idToPubSoul[_tokenId].owner != address(0), "This token doesn't exist");
        return idToPubSoul[_tokenId].sender;
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
    
    function fetchUserSouls(address _user) public view returns (Soul[] memory) {
        uint totalSoulCount = _tokenIds.current();
        uint soulCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalSoulCount; i++) {
            if (idToSoul[i + 1].owner == _user) {
                soulCount += 1;
            }
        }

        Soul[] memory souls = new Soul[](soulCount);
        for (uint i = 0; i < totalSoulCount; i++) {
            if (idToSoul[i + 1].owner == _user) {
                uint currentId = idToSoul[i + 1].soulId;
                Soul storage currentSoul = idToSoul[currentId];
                souls[currentIndex] = currentSoul;
                currentIndex += 1;
            }
        }
        return souls;
    }

    function fetchUserPubSouls(address _user) public view returns (PubSoul[] memory) {
        uint totalSoulCount = _pubTokenIds.current();
        uint soulCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalSoulCount; i++) {
            if (idToPubSoul[i + 1].owner == _user) {
                soulCount += 1;
            }
        }

        PubSoul[] memory pubSouls = new PubSoul[](soulCount);
        for (uint i = 0; i < totalSoulCount; i++) {
            if (idToPubSoul[i + 1].owner == _user) {
                uint currentId = idToPubSoul[i + 1].soulId;
                PubSoul storage currentSoul = idToPubSoul[currentId];
                pubSouls[currentIndex] = currentSoul;
                currentIndex += 1;
            }
        }
        return pubSouls;
    }

    function setPubSoul(address _sender, string memory _img, string memory _description, string memory _name) public {
        _pubTokenIds.increment();
        pubTokenCount = _pubTokenIds.current();
        idToPubSoul[pubTokenCount] = PubSoul(
            pubTokenCount,
            _sender,
            msg.sender,
            _img,
            _description,
            _name
        );
    }

    function fetchYourPubSouls() public view returns (PubSoul[] memory) {
        uint totalPubSoulCount = _pubTokenIds.current();
        uint soulCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalPubSoulCount; i++) {
            if (idToPubSoul[i + 1].owner == msg.sender) {
                soulCount += 1;
            }
        }

        PubSoul[] memory souls = new PubSoul[](soulCount);
        for (uint i = 0; i < totalPubSoulCount; i++) {
            if (idToPubSoul[i + 1].owner == msg.sender) {
                uint currentId = idToPubSoul[i + 1].soulId;
                PubSoul storage currentSoul = idToPubSoul[currentId];
                souls[currentIndex] = currentSoul;
                currentIndex += 1;
            }
        }
        return souls;
    }

    function setPubKey(string memory _pubKey) public {
        _keyIds.increment();
        keyCount = _keyIds.current();
        addrToPubkey[keyCount] = Keys(
            keyCount,
            msg.sender,
            _pubKey
        );
    }

    function getPubKey(address _to) public view returns (Keys[] memory) {
        uint totalKeyCount = _keyIds.current();
        uint keyOwn = 0;
        uint currentIndex = 0;
  

        for (uint i = 0; i < totalKeyCount; i++) {
            if (addrToPubkey[i + 1].owner == _to) {
                keyOwn = 1;
            }
        }

        Keys[] memory key = new Keys[](keyOwn);
        for (uint i = 0; i < totalKeyCount; i++) {
            if (addrToPubkey[i + 1].owner == _to) {
                uint currentId = addrToPubkey[i + 1].keyId;
                Keys storage currentKey = addrToPubkey[currentId];
                key[currentIndex] = currentKey;
                currentIndex += 1;
            }
        }
        return key;
    }
}