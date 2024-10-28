import {
  time,
  loadFixture,
  mine,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("Memories", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployDefaultMemoriesContract() {
    
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const Memories = await hre.ethers.getContractFactory("Memories");
    const memories = await Memories.deploy();

    return { memories, owner, otherAccount };
  }

  const name = 'test memory name';
  const description = 'test memory description';
  const text = 'test memory text';

  describe("Memories", function () {
    it("Should emit event on create", async function () {
      const { memories, otherAccount } = await loadFixture(deployDefaultMemoriesContract);

      await expect(memories.connect(otherAccount).
      createMemory(name, description, text)).to.emit(memories, "MemoryCreated").withArgs(otherAccount.address, anyValue);
   
    });

    it("Should create new memory", async function () {
      const { memories, otherAccount } = await loadFixture(deployDefaultMemoriesContract);

      const newMemoryId = await memories.connect(otherAccount).createMemory(name, description, text);
      if (!newMemoryId) {
        throw new Error("newMemoryId is undefined");
      }
      const memory = await memories.getMemory(newMemoryId.value);
      expect(memory.name).to.equal(name);
      expect(memory.description).to.equal(description);
      expect(memory.text).to.equal(text);
    });

    it("Should get user memories", async function () {
      const { memories, otherAccount } = await loadFixture(deployDefaultMemoriesContract);

      // create 2 memories
      const newMemoryId1 = await memories.connect(otherAccount).createMemory(name, description, text);
      if (!newMemoryId1) {
        throw new Error("newMemoryId is undefined");
      }
      const newMemoryId2 = await memories.connect(otherAccount).createMemory(name, description, text);
      if (!newMemoryId2) {
        throw new Error("newMemoryId is undefined");
      }

      console.log(newMemoryId1.value.toString(), newMemoryId2.value.toString());
      expect(newMemoryId1.value).to.not.equal(newMemoryId2.value);
      const memory = await memories.getUserMemories(otherAccount.address);
      expect(memory.length).to.equal(2);

      expect(memory[0].name).to.equal(name);
      expect(memory[0].description).to.equal(description);
      expect(memory[0].text).to.equal(text);

      expect(memory[1].name).to.equal(name);
      expect(memory[1].description).to.equal(description);
      expect(memory[1].text).to.equal(text);  
    });

    it("Should get total memories", async function () {
      const { memories, otherAccount } = await loadFixture(deployDefaultMemoriesContract);  

      // create 2 memories
      const newMemoryId1 = await memories.connect(otherAccount).createMemory(name, description, text);
      if (!newMemoryId1) {
        throw new Error("newMemoryId is undefined");
      }
      const newMemoryId2 = await memories.connect(otherAccount).createMemory(name, description, text);
      if (!newMemoryId2) {
        throw new Error("newMemoryId is undefined");
      }

      await expect(memories.getTotalMemories()).to.eventually.equal(2);
    });

    it("Should get user collection", async function () {
      const { memories, otherAccount } = await loadFixture(deployDefaultMemoriesContract);
      const newMemoryId1 = await memories.connect(otherAccount).createMemory(name, description, text);
      if (!newMemoryId1) {
        throw new Error("newMemoryId is undefined");
      }
      const newMemoryId2 = await memories.connect(otherAccount).createMemory(name, description, text);
      if (!newMemoryId2) {
        throw new Error("newMemoryId is undefined");
      }
      const collection = await memories.getUserCollection(otherAccount.address);
      expect(collection.length).to.equal(2);
      expect(collection[0]).to.equal(0);
      expect(collection[1]).to.equal(1);
    });
  
  });
});
