import { expect } from 'chai';
import { ethers } from 'hardhat';

describe("Leading", () => {
    beforeEach(async () => {
        const AddressProvider = await ethers.getContractFactory("AddressProvider")
        const FactoryV1 = await ethers.getContractFactory("FactoryV1")
        const addressProvider = await AddressProvider.deploy()
        const factoryV1 = await FactoryV1.deploy(addressProvider.address)

        const tx1 = await addressProvider.setFactory(factoryV1.address)
        await tx1.wait()

        const tx2 = await factoryV1.createLendingPool("AAFE", "AAFE", 80, 1, 5)
        await tx2.wait()

        const addresses = await addressProvider.getLendingPools()

        const lendingPool = await ethers.getContractAt("Lending", addresses[0])
        console.log(lendingPool.address)


        const AVAX = await ethers.getContractFactory("mockAvax")
        const CHZ = await ethers.getContractFactory("mockChz")
        const COMP = await ethers.getContractFactory("mockComp")
        const LINK = await ethers.getContractFactory("mockLink")
        const USDT = await ethers.getContractFactory("mockUsdt")

        const avax = await AVAX.deploy(lendingPool.address)
        const chz = await CHZ.deploy(lendingPool.address)
        const comp = await COMP.deploy(lendingPool.address)
        const link = await LINK.deploy(lendingPool.address)
        const usdt = await USDT.deploy(lendingPool.address)

        // https://docs.chain.link/docs/data-feeds/price-feeds/addresses/?network=avalanche#Avalanche%20Testnet
        const add1 = await lendingPool.setAllowedToken(avax.address, "0x5498BB86BC934c8D34FDA08E81D444153d0D06aD")
        await add1.wait()

        const add2 = await lendingPool.setAllowedToken(chz.address, "0x8788f14a9f6c0b12A189686Cd0ADb884a8879B10")
        await add2.wait()

        const add3 = await lendingPool.setAllowedToken(comp.address, "0xFC90B9AC95f933713E0eb3fA134582a05627C669")
        await add3.wait()

        const add4 = await lendingPool.setAllowedToken(link.address, "0x34C4c526902d88a3Aa98DB8a9b802603EB1E3470")
        await add4.wait()

        const add5 = await lendingPool.setAllowedToken(usdt.address, "0x7898AcCC83587C3C55116c5230C17a6Cd9C71bad")
        await add5.wait()

        expect(0).to.equal(0);
    })

    it('mock check', async () => {
        expect(0).to.equal(0);
    })
})
