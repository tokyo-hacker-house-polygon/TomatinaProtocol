require("@nomiclabs/hardhat-waffle");
//const fs = require("fs")

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: "",
      accounts: [""]
    }
  },
  solidity: "0.8.6",
};