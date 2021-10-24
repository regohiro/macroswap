import React from "react";
import { useSelector } from "react-redux";
// import { selectUser } from "../../state";
import styles from "./Footer.module.css";

const Footer = () => {
  // const { address } = useSelector(selectUser);

  return (
    <footer className={styles.footer}>
      <span id={styles.creator}>Made by REGO350</span>
      <span id={styles.address}>123456789</span>
    </footer>
  );
};

export default Footer;
