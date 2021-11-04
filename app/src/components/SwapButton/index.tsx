import React from "react";
import { Button, Spinner } from "react-bootstrap";
import styles from "./SwapButton.module.css";
import { useWallet } from "@solana/wallet-adapter-react";

interface IProps {
  loading: boolean;
  payable: boolean;
  hasEntered: boolean;
}

const SwapButton: React.FC<IProps> = ({ loading, payable, hasEntered }) => {
  const { connected } = useWallet();

  return (
    <Button
      variant="primary"
      type="submit"
      disabled={
        loading ||
        (connected && !payable) ||
        (connected && !hasEntered)
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
      ) : connected ? (
        !hasEntered ? (
          "Enter an Amount"
        ) : payable ? (
          "Swap"
        ) : (
          "Insufficient Balance"
        )
      ) : (
        "Connet to a Wallet"
      )}
    </Button>
  );
};

export default SwapButton;
