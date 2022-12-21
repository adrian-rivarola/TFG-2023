import React, { useImperativeHandle, useState } from "react";
import {
  Button,
  Dialog,
  Paragraph,
  Portal,
  Snackbar,
} from "react-native-paper";
import { useTheme } from "../context/ThemeContext";

type SnackOptions = {
  confirmText?: string;
  message: string;
  type: "success" | "error";
};

export type SnackRef = {
  showSnackMessage(opts: SnackOptions): void;
};

const SnackbarMessage: React.ForwardRefRenderFunction<SnackRef, {}> = (
  props,
  ref
) => {
  useImperativeHandle(ref, () => ({
    showSnackMessage,
  }));

  const initialSnackOptions: SnackOptions = {
    message: "Está seguro que desea eliminar este elemento?",
    confirmText: "Ok",
    type: "success",
  };

  const [visible, setVisible] = useState(false);
  const [snackOptions, setSnackOptions] = useState(initialSnackOptions);
  const {
    theme: { colors },
  } = useTheme();

  const hideSnack = () => setVisible(false);
  const showSnackMessage = (snackOptions: SnackOptions) => {
    setSnackOptions(snackOptions);
    setVisible(true);
  };

  return (
    <Snackbar
      style={{
        backgroundColor:
          snackOptions.type === "error" ? colors.error : colors.onSurface,
      }}
      visible={visible}
      onDismiss={() => setVisible(false)}
      theme={{ colors: { inversePrimary: colors.onPrimary } }}
      action={{
        label: "OK",
        onPress: hideSnack,
      }}
    >
      {snackOptions.message}
    </Snackbar>
  );
};

export default React.forwardRef(SnackbarMessage);
