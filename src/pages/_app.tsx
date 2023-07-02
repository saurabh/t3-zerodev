import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import '@rainbow-me/rainbowkit/styles.css';

import {
  googleWallet,
  facebookWallet,
  githubWallet,
  discordWallet,
  twitterWallet,
} from "@zerodevapp/wagmi/rainbowkit";
import { RainbowKitProvider, connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { goerli, mainnet, polygon, polygonMumbai } from 'wagmi/chains';
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const goerliProjectId = '' // goerli
const mumbaiProjectId = '' // mumbai
const walletConnectProjectID = '' // testnets

const allowedChains = [
  mainnet,
  polygon,
  ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [goerli] : []),
  ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [polygonMumbai] : []),
]

const { chains, provider, webSocketProvider } = configureChains(
  allowedChains,
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID || '' }),
    publicProvider()
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: 'Social',
    wallets: [
      googleWallet({chains: allowedChains, options: { projectIds: [goerliProjectId,  mumbaiProjectId], shimDisconnect: true }}),
      facebookWallet({chains: allowedChains, options: { projectIds: [goerliProjectId,  mumbaiProjectId], shimDisconnect: true }}),
      githubWallet({chains: allowedChains, options: { projectIds: [goerliProjectId,  mumbaiProjectId], shimDisconnect: true }}),
      discordWallet({chains: allowedChains, options: { projectIds: [goerliProjectId,  mumbaiProjectId], shimDisconnect: true }}),
      twitterWallet({chains: allowedChains, options: { projectIds: [goerliProjectId,  mumbaiProjectId], shimDisconnect: true }})
    ],
  },
  {
    groupName: "Wallets",
    wallets: [
      metaMaskWallet({ chains: allowedChains, projectId: walletConnectProjectID }), 
      walletConnectWallet({ chains: allowedChains, projectId: walletConnectProjectID  })
    ],
  },
]);

const wagmiConfig = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <WagmiConfig client={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default api.withTRPC(MyApp);
