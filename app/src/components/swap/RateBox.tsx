import styles from "./SwapInterface.module.css";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import { selectSwap } from "../../state";
import { AiOutlineReload } from "react-icons/ai";

interface IProps {
  onClickReload: () => void;
} 

const RateBox: React.FC<IProps> = ({ onClickReload }) => {
  // const { swapDirection, value, amount, tokenType } = useSelector(selectSwap);

  return (
    <div className={styles.rateBox}>
      <span className={styles.rateText}>Exchange Rate</span>
        <>
          <span>
            <AiOutlineReload
              className={styles.reloadBtn}
              onClick={onClickReload}
            />
          </span>
          <span className={styles.rateValue}>
            1 SOL = 100 MACRO
          </span>
        </>
    </div>
  );
};

export default RateBox;
