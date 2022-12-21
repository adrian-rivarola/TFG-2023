import React, { useContext, useRef } from "react";
import { ModalRef } from "../components/ConfirmationModal";
import { SnackRef } from "../components/SnackbarMessage";

type RefContextValue = {
  confirmModalRef: React.RefObject<ModalRef>;
  snackRef: React.RefObject<SnackRef>;
};

const RefContext = React.createContext<RefContextValue>({
  confirmModalRef: {
    current: null,
  },
  snackRef: {
    current: null,
  },
});

export const useRefContext = () => useContext(RefContext);

export const RefContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const confirmModalRef = useRef<ModalRef>(null);
  const snackRef = useRef<SnackRef>(null);

  return (
    <RefContext.Provider value={{ confirmModalRef, snackRef }}>
      {children}
    </RefContext.Provider>
  );
};
