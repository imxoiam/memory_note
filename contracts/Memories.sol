// contracts/Memories.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Memories{
    uint256 private _nextMemoryId;
    struct Memory {
        string name;
        string description;
        string text;
    }
    Memory[] private _memories;
    mapping(address => uint256[]) private _memoryCollections;

    event MemoryCreated(address user,uint256 memoryId);

    constructor() {
        _nextMemoryId = 0;
    }

    function createMemory(string memory name, string memory description, string memory text)
        public
        returns (uint256)
    {
        uint256 memoryId = _nextMemoryId++;
        _createMemory(memoryId, Memory(name, description, text));
        return memoryId;
    }

    function _createMemory(uint256 memoryId, Memory memory item) private{
        _memories.push(item);
        _memoryCollections[msg.sender].push(memoryId);
        emit MemoryCreated(msg.sender, memoryId);
    }

    function getMemory(uint256 memoryId)
        public
        view
        returns (Memory memory)
    {
        return _memories[memoryId];
    }

    function getUserMemories(address user)
        public
        view
        returns (Memory[] memory)
    {
        Memory[] memory usersMemories = new Memory[](_memoryCollections[user].length);
        for(uint256 i = 0; i < _memoryCollections[user].length; i++) {
            uint256 memoryId = _memoryCollections[user][i];
            usersMemories[i] = _memories[memoryId];
        }
        return usersMemories;
    }

    function getUserCollection(address user)
        public
        view
        returns (uint256[] memory)
    {
        return _memoryCollections[user];
    }

    function getTotalMemories()
        public
        view
        returns (uint256)
    {
        return _nextMemoryId;
    }
}