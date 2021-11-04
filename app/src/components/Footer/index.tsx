import React from "react";
import styles from "./Footer.module.css";
import { useWallet } from "@solana/wallet-adapter-react";

const Footer = () => {
  const wallet = useWallet();
  const address = wallet.publicKey?.toString();

  return (
    <footer className={styles.footer}>
      <span id={styles.creator}>Made by REGO350</span>
      <span id={styles.address}>{address}</span>
    </footer>
  );
};

export default Footer;
