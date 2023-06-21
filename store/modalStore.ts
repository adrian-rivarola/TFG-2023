import { create } from "zustand";

type SnackOptions = {
  visible?: boolean;
  message: string;
  type: "success" | "error";
};

type ModalOptions = {
  visible?: boolean;
  content?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?(): void;
};

interface ModalStore {
  snackOptions: SnackOptions;
  showSnackMessage: (options: SnackOptions) => void;
  hideSnackMessage: () => void;
  modalOptions: ModalOptions;
  showConfirmationModal: (options: ModalOptions) => void;
  closeConfirmationModal: () => void;
  loading: boolean;
  setLoading: (val: boolean) => void;
}

const DEFAULT_MODAL_OPTS = {
  content: "",
  confirmText: "",
  cancelText: "",
};

export const useModalStore = create<ModalStore>((set, get) => ({
  loading: false,
  snackOptions: {
    visible: false,
    message: "",
    type: "success",
  },
  modalOptions: DEFAULT_MODAL_OPTS,
  showSnackMessage: (options: SnackOptions) => {
    set({
      snackOptions: {
        ...options,
        visible: true,
      },
    });
  },
  hideSnackMessage: () => {
    set({
      snackOptions: {
        ...get().snackOptions,
        visible: false,
      },
    });
  },
  showConfirmationModal: (options: ModalOptions) => {
    set({
      modalOptions: {
        ...options,
        visible: true,
      },
    });
  },
  closeConfirmationModal: () => {
    set({
      modalOptions: {
        ...get().modalOptions,
        visible: false,
      },
    });
  },
  setLoading: (val: boolean) => {
    set({
      loading: val,
    });
  },
}));
