const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const Soulbond = await hre.ethers.getContractFactory("Soulbond");
  const soulbond = await Soulbond.deploy();

  await soulbond.deployed();

  console.log("Soulbond deployed to:", soulbond.address);

  fs.writeFileSync('./config.js', `
  export const soulbondAddress = "${soulbond.address}"
  `)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
