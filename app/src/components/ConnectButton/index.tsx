import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import React from "react";

const ConnectButton = () => {
  const { connected } = useWallet();

  return (
    <>
      {connected ? (
        <WalletMultiButton />
      ) : (
        <WalletMultiButton>Connect Wallet</WalletMultiButton>
      )}
    </>
  );
};

export default ConnectButton;
