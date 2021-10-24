import React, { useState, useEffect } from "react";
import { Form, FormControl, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { selectSwap, selectUser } from "../../state";
import * as swapActions from "../../state/swap/actions";
import * as userActions from "../../state/user/actions";
import * as popupActions from "../../state/popup/actions";
import EthDropdown from "./EthDropdown";
import styles from "./SwapInterface.module.css";
import TokenDropdown from "./TokenDropdown";
import {
  approveToken,
  getAmount,
  getBalanceAllownace,
  getPrice,
  swapToken,
} from "../../interactions/swap";
import { useAsync, usePrevious, useDidUpdateAsyncEffect } from "../../hooks";
import { connectWallet } from "../../interactions/connectwallet";
import { JsonRpcSigner } from "@ethersproject/providers";
import { TokenType } from "../../contracts";
import { TSwapDirection } from "../../state/swap/reducers";
import SwapButton from "../SwapButton";
import RateBox from "./RateBox";
import { toWei } from "../../utils";

const SwapInterface = (): JSX.Element => {
  const { address, signer, balance } = useSelector(selectUser);
  const { swapDirection, value, amount, tokenType, tokensState } =
    useSelector(selectSwap);
  const {
    setSwapDirection,
    setValue,
    setAmount,
    setTxHash,
    updateTokenState,
    updateProvider,
    updateUserInfo,
    updateBalance,
    setAlertModal,
    setSuccessModal,
  } = bindActionCreators(
    { ...swapActions, ...userActions, ...popupActions },
    useDispatch()
  );

  const [payable, setPayable] = useState<boolean>(false);
  const [approved, setApproved] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string | undefined>(
    value ? value.toString() : undefined
  );
  const [loading, setLoading] = useState<boolean>(false);
  const prevSwapDirection = usePrevious<TSwapDirection>(swapDirection);

  interface ISwapTokenParam {
    signer: JsonRpcSigner;
    tokenType: TokenType;
    swapDirection: TSwapDirection;
    value: number;
  }
  interface IApproveTokenParam {
    signer: JsonRpcSigner;
    tokenType: TokenType;
  }

  const connectPromi = useAsync(connectWallet);
  const swapPromi = useAsync<ISwapTokenParam, string>(
    async ({ signer, tokenType, swapDirection, value }) =>
      await swapToken(signer, tokenType, swapDirection, value)
  );
  const approvePromi = useAsync<IApproveTokenParam, string>(
    async ({ signer, tokenType }) => await approveToken(signer, tokenType)
  );

  const onInputChange = (
    e: React.ChangeEvent<typeof FormControl & HTMLInputElement>
  ): void => {
    const inputValueNumber = Number(e.target.value);
    if (inputValueNumber >= 0 && e.target.value) {
      setValue(inputValueNumber);
      setInputValue(e.target.value.toString());
    } else {
      setValue(0);
      setInputValue(undefined);
    }
  };

  const onClickSwitchDirection = (): void => {
    swapDirection === "BuyToken"
      ? setSwapDirection("SellToken")
      : setSwapDirection("BuyToken");
  };

  const onClickSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (address && tokenType && (swapDirection === "BuyToken" || approved)) {
      const { error, data } = await swapPromi.call({
        signer,
        tokenType,
        swapDirection,
        value,
      });
      if (error) {
        setAlertModal({
          active: true,
          title: "Transaction Error!",
          message: error.message,
        });
      }
      if (data) {
        setTxHash(data);
        setSuccessModal({
          active: true,
          txHash: data,
          message: "Swap Successful",
        });
        await reloadTokens([tokenType]);
      }
    } else if (
      address &&
      tokenType &&
      !approved &&
      swapDirection === "SellToken"
    ) {
      const { error, data } = await approvePromi.call({
        signer,
        tokenType,
      });
      if (error) {
        setAlertModal({
          active: true,
          title: "Transaction Error!",
          message: error.message,
        });
      }
      if (data) {
        setTxHash(data);
        setSuccessModal({
          active: true,
          txHash: data,
          message: "Approve Successful",
        });
        setApproved(true);
      }
    } else if (!address) {
      const { error, data } = await connectPromi.call(null);
      if (error) {
        setAlertModal({
          active: true,
          title: "Connection Error!",
          message: error.message || "Refused to connect",
        });
      }
      if (data) {
        const { host, provider, signer, address } = data;
        updateProvider({ host, provider });
        updateUserInfo({ signer, address });
      }
    }
  };

  const reloadTokens = async (tokens: Array<TokenType>): Promise<void> => {
    setLoading(true);
    for (let token of tokens) {
      const price = await getPrice(token);
      updateTokenState({ [token]: { price } });
      if (address) {
        const { balance, allowance } = await getBalanceAllownace(
          address,
          token
        );
        updateTokenState({ [token]: { balance, allowance } });
      }
    }
    if (address) {
      const { balance } = await getBalanceAllownace(address, "Eth");
      updateBalance(balance);
    }
    setLoading(false);
  };

  useDidUpdateAsyncEffect(async () => {
    const tokens: Array<TokenType> = ["Dai", "Link", "Uni"];
    for (let token of tokens) {
      updateTokenState({
        [token]: { balance: undefined, allowance: undefined },
      });
    }
    updateBalance(undefined);
    if (address && tokenType) {
      await reloadTokens([tokenType]);
    }
  }, [address]);

  useDidUpdateAsyncEffect(async () => {
    if (
      tokenType &&
      (!tokensState[tokenType].price ||
        (address && !tokensState[tokenType].balance))
    ) {
      await reloadTokens([tokenType]);
    }
  }, [tokenType]);

  useDidUpdateAsyncEffect(async () => {
    if (value && tokenType) {
      const amount = await getAmount(
        tokenType,
        swapDirection,
        value,
        tokensState[tokenType].price
      );
      setAmount(amount);

      if (address && balance) {
        let balanceCheck: boolean;
        switch (swapDirection) {
          case "BuyToken":
            balanceCheck = balance.gte(toWei(value)) || false;
            break;
          case "SellToken":
            balanceCheck =
              tokensState[tokenType].balance?.gte(toWei(value)) || false;
            const allowanceCheck =
              tokensState[tokenType].allowance?.gte(toWei(value)) || false;
            setApproved(allowanceCheck);
            break;
        }
        setPayable(balanceCheck);
      }
    } else if (value === 0) {
      setAmount(0);
    }
  }, [value, tokensState[tokenType!], balance]);

  useEffect(() => {
    if (amount && prevSwapDirection !== swapDirection) {
      setInputValue(amount.toString());
      setValue(amount);
      setAmount(value);
    }
  }, [swapDirection]);

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
            required={address ? true : false}
          />
          {swapDirection === "BuyToken" ? <EthDropdown /> : <TokenDropdown />}
        </InputGroup>
        <div className={styles.arrowBox}>
          <h2 onClick={onClickSwitchDirection}>↓</h2>
        </div>
        <InputGroup className={styles.inputGroup} id={styles.bottom}>
          <Form.Control
            className={styles.formControl}
            id={styles.bottomFormControl}
            type="number"
            placeholder="0.00"
            value={amount === 0 ? "" : amount.toFixed(7)}
            disabled
          />
          {swapDirection === "BuyToken" ? <TokenDropdown /> : <EthDropdown />}
        </InputGroup>
        <RateBox onClickReload={reloadTokens} />
        <SwapButton
          loading={
            loading ||
            connectPromi.pending ||
            swapPromi.pending ||
            approvePromi.pending
          }
          payable={payable}
          approved={approved}
        />
      </Form>
    </main>
  );
};

export default SwapInterface;
