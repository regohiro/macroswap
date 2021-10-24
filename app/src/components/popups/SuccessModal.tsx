import React from "react";
import * as popupActions from "../../state/popup/actions";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { selectPopup } from "../../state";
import { Alert } from "react-bootstrap";
import { GoLinkExternal } from "react-icons/go";
import styles from "./Popup.module.css";

const SuccessModal = (): JSX.Element => {
  const {
    success: { txHash, message, active },
  } = useSelector(selectPopup);
  const { setSuccessModal } = bindActionCreators(popupActions, useDispatch());

  return (
    <Alert
      variant="success"
      show={active}
      onClose={() =>
        setSuccessModal({
          active: false,
          txHash: "",
          message: "",
        })
      }
      className={styles.popupContainer}
      dismissible
    >
      <Alert.Heading>Transaction Confirmed!</Alert.Heading>
      <div>
        {message} <hr/>
        <a href={`https://kovan.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
          <GoLinkExternal size="20"/>
          　View on EtherScan
        </a>
      </div>
    </Alert>
  );
};

export default SuccessModal;
