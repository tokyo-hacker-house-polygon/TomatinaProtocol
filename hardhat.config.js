require("@nomiclabs/hardhat-waffle");
const fs = require("fs")
const privateKey = fs.readFileSync(".secret").toString()

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/cW-N3l4GQ7gpRnEESWt4YH4AdT2wv7kN",
      accounts: ["9908f4233557a71d605f6dd954e79a10daae0e3a821ea52ee9694b59a742e982"]
    },
    mainnet: {
      url: "https://polygon-mainnet.g.alchemy.com/v2/fYD8HuxRv9oQvn7FasnMOb1HtZOQyS2k",
      accounts: ["9908f4233557a71d605f6dd954e79a10daae0e3a821ea52ee9694b59a742e982"]
    }
  },
  solidity: "0.8.6",
};