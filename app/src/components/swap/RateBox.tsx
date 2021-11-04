import styles from "./SwapInterface.module.css";
import React from "react";
import { AiOutlineReload } from "react-icons/ai";

interface IProps {
  onClickReload: () => void;
  rate: number;
} 

const RateBox: React.FC<IProps> = ({ onClickReload, rate }) => {

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
            1 SOL = {rate} MACRO
          </span>
        </>
    </div>
  );
};

export default RateBox;
