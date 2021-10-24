import React from "react";
import * as popupActions from "../../state/popup/actions";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { selectPopup } from "../../state";
import { Alert } from "react-bootstrap";
import styles from "./Popup.module.css";

const AlertModal = (): JSX.Element => {
  const {
    alert: { title, message, active },
  } = useSelector(selectPopup);
  const { setAlertModal } = bindActionCreators(popupActions, useDispatch());

  return (
    <Alert
      variant="danger"
      show={active}
      onClose={() =>
        setAlertModal({
          active: false,
          title: "",
          message: "",
        })
      }
      className={styles.popupContainer}
      dismissible
    >
      <Alert.Heading>{title}</Alert.Heading>
      <div>{message}</div>
    </Alert>
  );
};

export default AlertModal;
