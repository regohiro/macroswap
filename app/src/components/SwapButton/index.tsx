import React from "react";
import { useSelector } from "react-redux";
// import { selectSwap, selectUser } from "../../state";
import { Button, Spinner } from "react-bootstrap";
import styles from "./SwapButton.module.css";

const SwapButton: React.FC = () => {
  // const { address } = useSelector(selectUser);
  // const { value } = useSelector(selectSwap);

  return (
    <Button
      variant="primary"
      type="submit"
      className={styles.btn}
    >
      Swap
    </Button>
  );
};

export default SwapButton;
