import React from "react";
import styles from "./MainNavigation.module.css";
import ConnectButton from "../ConnectButton";

const MainNavigation: React.FC = () => {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <h1>MacroSwap</h1>
        </div>
        <div className={styles.button}>
          <ConnectButton/>
        </div>
      </header>
    </>
  );
};

export default MainNavigation;
