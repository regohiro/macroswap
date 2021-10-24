import styles from "./SwapInterface.module.css";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectSwap } from "../../state";
import { AiOutlineReload } from "react-icons/ai";
import { TokenType } from "../../contracts";

interface IProps {
  onClickReload: (tokens: Array<TokenType>) => Promise<void>;
} 

const RateBox: React.FC<IProps> = ({ onClickReload }) => {
  const { swapDirection, value, amount, tokenType } = useSelector(selectSwap);

  const [fromTokenName, setFromTokenName] = useState<string>("ETH");
  const [toTokenName, setToTokenName] = useState<string>("DAI");
  const [rate, setRate] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    if (tokenType === undefined || value === 0) {
      setShow(false);
      return;
    }
    switch (swapDirection) {
      case "BuyToken":
        setFromTokenName("ETH");
        setToTokenName(tokenType.toUpperCase());
        break;
      case "SellToken":
        setFromTokenName(tokenType.toUpperCase());
        setToTokenName("ETH");
        break;
    }
    setRate((amount / value).toFixed(6));
    setShow(true);
  }, [swapDirection, amount, tokenType]);

  return (
    <div className={styles.rateBox}>
      <span className={styles.rateText}>Exchange Rate</span>
      {show && (
        <>
          <span>
            <AiOutlineReload
              className={styles.reloadBtn}
              onClick={async () => tokenType && await onClickReload([tokenType])}
            />
          </span>
          <span className={styles.rateValue}>
            1 {fromTokenName} = {rate} {toTokenName}
          </span>
        </>
      )}
    </div>
  );
};

export default RateBox;
