import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Manager", function () {
    
    async function deployManagerContract() {
        // Contracts are deployed using the first signer/account by default
        const [owner, providerAccount, consumerAccount] = await ethers.getSigners();

        const ManagerContract = await ethers.getContractFactory("Manager");
        const manager = await ManagerContract.deploy({});
    
        return { manager, owner, providerAccount, consumerAccount };
    }

    async function deploySLAContract() {
        const { manager, providerAccount, consumerAccount } = await loadFixture(deployManagerContract);
        const slaContractTransaction = await (await manager.connect(providerAccount).createSLAContract()).wait();
        const slaContractAddress = slaContractTransaction.events?.find(event => event.event === 'SLAContractCreated')?.args?.[0];
        const sla = await ethers.getContractAt('SLA', slaContractAddress);
        return {manager, sla, providerAccount, consumerAccount}
    }
      
    describe("Deploy", function () {
      it("Should deploy manager contract", async function () {
        expect(async function() {await loadFixture(deployManagerContract)}).to.not.throw();
      });

      it("Should deploy SLA contract", async function(){
        const { sla, providerAccount} = await loadFixture(deploySLAContract);
        expect(await sla.owner()).eq(providerAccount.address);
      });

      it("Should add consumer to the SLA contract", async function() {
        const {manager, sla, providerAccount, consumerAccount} = await loadFixture(deploySLAContract);
        expect(await sla.owner()).eq(providerAccount.address);
        expect(async function () {await sla.connect(providerAccount).addConsumer(consumerAccount.address)}).not.revertedWith('You are not the provider');
      })
    });
    
});
