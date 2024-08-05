require("dotenv").config();

module.exports = {
  solidity: "0.8.17",
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_API_URL,
    },
  },
};
