import React from "react";
import styles from "./MainNavigation.module.css";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const MainNavigation: React.FC = () => {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <h1>MacroSwap</h1>
        </div>
        <div className={styles.button}>
          <WalletMultiButton>Select Wallet</WalletMultiButton>
        </div>
      </header>
    </>
  );
};

export default MainNavigation;
