import React from "react";
import { useSelector } from "react-redux";
import { selectSwap, selectUser } from "../../state";
import { Button, Spinner } from "react-bootstrap";
import styles from "./SwapButton.module.css";

interface IProps {
  loading: boolean;
  payable: boolean;
  approved: boolean
}

const SwapButton: React.FC<IProps> = ({
  loading,
  payable,
  approved
}) => {
  const { address } = useSelector(selectUser);
  const { swapDirection, value, tokenType } = useSelector(selectSwap);

  return (
    <Button
      variant="primary"
      type="submit"
      disabled={
        loading ||
        (address !== "" && !payable) ||
        (address !== "" && value === 0)
      }
      className={styles.btn}
    >
      {loading ? (
        <Spinner
          as="span"
          animation="border"
          role="status"
          aria-hidden="true"
        /> 
      ) : address ? (
        value === 0 ? (
          "Enter an Amount"
        ) : payable ? (
          approved || swapDirection === "BuyToken" ? (
            "Swap"
          ) : (
            "Approve token"
          )
        ) : tokenType ? (
          "Insufficient Balance"
        ) : (
          "Select a Token"
        )
      ) : (
        "Connet to a Wallet"
      )}
    </Button>
  );
};

export default SwapButton;
