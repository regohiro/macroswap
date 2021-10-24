import React from "react";
import styles from "./MainNavigation.module.css";
import ConnectButton from "../ConnectButton";

const MainNavigation: React.FC = () => {
  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.logo}>Block Swap &nbsp; V2</h1>
        <div className={styles.button}>
          <ConnectButton />
        </div>
      </header>
    </>
  );
};

export default MainNavigation;
