import React from "react";
import { InputGroup } from "react-bootstrap";
import styles from "./SwapInterface.module.css";
import Image from "next/image";

const TokenDropdown = (): JSX.Element => {
  return (
    <InputGroup.Text className={styles.inputGroupText}>
      <Image src="/macro.png" alt="Eth" width={30} height={30}/>
      &nbsp;MACRO
    </InputGroup.Text>
  );
};

export default TokenDropdown;