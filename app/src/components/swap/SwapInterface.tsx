import React, { useState, useEffect } from "react";
import { Form, FormControl, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
// import { selectSwap, selectUser } from "../../state";
// import * as swapActions from "../../state/swap/actions";
// import * as userActions from "../../state/user/actions";
// import * as popupActions from "../../state/popup/actions";
import SolDropdown from "./SolDropdown";
import styles from "./SwapInterface.module.css";
import TokenDropdown from "./TokenDropdown";
import {
  getAmount,
  getPrice,
  swapToken,
} from "../../interactions/swap";
import { useAsync, usePrevious, useDidUpdateAsyncEffect } from "../../hooks";
import { JsonRpcSigner } from "@ethersproject/providers";
import { TokenType } from "../../contracts";
// import { TSwapDirection } from "../../state/swap/reducers";
import SwapButton from "../SwapButton";
import { toWei } from "../../utils";
import RateBox from "./RateBox";

type TSwapDirection = "BuyToken" | "SellToken"

const SwapInterface = (): JSX.Element => {
  const [swapDirection, setSwapDirection] = useState<TSwapDirection>("BuyToken");

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

  const onClickReload = () => {

  }

  return (
    <main className={styles.main}>
      <Form className={styles.box}>
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
            // onChange={onInputChange}
            onWheel={(e: any) => e.target.blur()}
            // value={inputValue || ""}
            // required={address ? true : false}
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
        <SwapButton />
      </Form>
    </main>
  );
};

export default SwapInterface;
