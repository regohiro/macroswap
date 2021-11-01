import React from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  getLedgerWallet,
  getPhantomWallet,
  getSlopeWallet,
  getSolflareWallet,
  getSolletExtensionWallet,
  getSolletWallet,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
require("@solana/wallet-adapter-react-ui/styles.css");

const WalletConnectionProvider: React.FC = ({ children }) => {
  const endpoint = process.env.NEXT_PUBLIC_RPC_URL || "";

  const wallets = [
    getPhantomWallet(),
    getSlopeWallet(),
    getSolflareWallet(),
    getLedgerWallet(),
    getSolletWallet(),
    getSolletExtensionWallet(),
  ];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletConnectionProvider;
