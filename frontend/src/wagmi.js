import { createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

// The configured contract is deployed on Sepolia. Keeping the app on this
// chain ensures every wallet reads the same student-registration mapping.
export const CONTRACT_CHAIN = sepolia;

export const config = createConfig({
  chains: [CONTRACT_CHAIN],
  connectors: [
    // Uses the wallet injected by the browser (MetaMask, Rabby, etc.).
    // This avoids relying on the MetaMask SDK popup flow when an extension is
    // already available in the browser.
    injected({ shimDisconnect: true }),
  ],
  transports: {
    [CONTRACT_CHAIN.id]: http(),
  },
});
