// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721, ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Memory is ERC721URIStorage {
    uint256 private _nextTokenId;

    constructor() ERC721("Memory Note", "MNT") {}

    function awardItem(address user, string memory tokenURI)
        public
        returns (uint256)
    {
        uint256 tokenId = _nextTokenId++;
        _mint(user, tokenId);
        _setTokenURI(tokenId, tokenURI);

        return tokenId;
    }
}