import { Goerli } from "@usedapp/core";

export const config = {
  networks: [Goerli],
  readOnlyChainId: Goerli.chainId,
  readOnlyUrls: {
    [Goerli.chainId]: `https://eth-goerli.g.alchemy.com/v2/Q2PUnyG-VaTxX-hyCceswIuvLL0ALzvT`,
  },
  notifications: {
    expirationPeriod: 1000, //milliseconds
    checkInterval: 1000, // milliseconds
  },
};
