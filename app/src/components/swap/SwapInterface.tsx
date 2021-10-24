import React, { useState, useEffect } from "react";
import { Form, FormControl, InputGroup } from "react-bootstrap";
import SolDropdown from "./SolDropdown";
import styles from "./SwapInterface.module.css";
import TokenDropdown from "./TokenDropdown";
import {
  getAmount,
  getPrice,
  swapToken,
} from "../../interactions/swap";
import { useAsync, usePrevious, useDidUpdateAsyncEffect } from "../../hooks";
import SwapButton from "../SwapButton";
import { toWei } from "../../utils";
import RateBox from "./RateBox";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

type TSwapDirection = "BuyToken" | "SellToken"

const SwapInterface = (): JSX.Element => {
  const [swapDirection, setSwapDirection] = useState<TSwapDirection>("BuyToken");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isPayable, setPayable] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string | undefined>(undefined);
  const [input, setInput] = useState<number>(0);

  const wallet = useWallet();
  const walletModal = useWalletModal();

  const onInputChange = (
    e: React.ChangeEvent<typeof FormControl & HTMLInputElement>
  ) => {
    const inputValueNumber = Number(e.target.value);
    if (inputValueNumber >= 0 && e.target.value) {
      setInput(inputValueNumber);
      setInputValue(e.target.value.toString());
    } else {
      setInput(0);
      setInputValue(undefined);
    }
  }

  const onClickSwapDirection = () => {
    switch(swapDirection){
      case "BuyToken":
        setSwapDirection("SellToken");
        break;
      case "SellToken":
        setSwapDirection("BuyToken");
        break;
    }
  }

  const onClickSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if(wallet.connected){
      
    }else{
      walletModal.setVisible(true);
    }
  }

  const onClickReload = () => {

  }

  return (
    <main className={styles.main}>
      <Form className={styles.box} onSubmit={onClickSubmit}>
        <InputGroup className={styles.inputGroup} id={styles.top}>
          <Form.Control
            className={styles.formControl}
            id={styles.topFormControl}
            inputMode="decimal"
            type="number"
            min="0"
            placeholder="0.00"
            step="any"
            autoComplete="off"
            autoCorrect="off"
            onChange={onInputChange}
            onWheel={(e: any) => e.target.blur()}
            value={inputValue || ""}
            required={wallet.connected ? true : false}
          />
          {swapDirection === "BuyToken" ? <SolDropdown /> : <TokenDropdown />}
        </InputGroup>
        <div className={styles.arrowBox}>
          <h2 onClick={onClickSwapDirection}>↓</h2>
        </div>
        <InputGroup className={styles.inputGroup} id={styles.bottom}>
          <Form.Control
            className={styles.formControl}
            id={styles.bottomFormControl}
            type="number"
            placeholder="0.00"
            // value={amount === 0 ? "" : amount.toFixed(7)}
            disabled
          />
          {swapDirection === "BuyToken" ? <TokenDropdown /> : <SolDropdown />}
        </InputGroup>
        <RateBox onClickReload={onClickReload} />
        <SwapButton 
          loading={isLoading || wallet.connecting}
          payable={isPayable}
          hasEntered={input ? true : false}
        />
      </Form>
    </main>
  );
};

export default SwapInterface;
