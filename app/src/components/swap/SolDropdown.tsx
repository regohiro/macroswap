import React from "react";
import { InputGroup } from "react-bootstrap";
import styles from "./SwapInterface.module.css";
import Image from "next/image";

const EthDropdown = (): JSX.Element => {
  return (
    <InputGroup.Text className={styles.inputGroupText}>
      <Image src="/sol.png" alt="Eth" width={30} height={30}/>
      &nbsp;&nbsp;SOL
    </InputGroup.Text>
  );
};

export default EthDropdown;
