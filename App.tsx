import dayjs from "dayjs";
import "dayjs/locale/es";
import { StatusBar } from "expo-status-bar";
import { AppRegistry, LogBox } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "react-query";
import { es, registerTranslation } from "react-native-paper-dates";
import "reflect-metadata";

import ConfirmationModal from "./components/ConfirmationModal";
import SnackbarMessage from "./components/SnackbarMessage";
import { ThemeContextProvider } from "./context/ThemeContext";
import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";

LogBox.ignoreLogs([".+"]);
LogBox.ignoreAllLogs(); // Ignore all log notifications

export const queryClient = new QueryClient();

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContextProvider>
        <SafeAreaProvider>
          <Navigation />
          <StatusBar />
        </SafeAreaProvider>
        <ConfirmationModal />
        <SnackbarMessage />
      </ThemeContextProvider>
    </QueryClientProvider>
  );
}

dayjs.locale("es");
registerTranslation("en", es);
AppRegistry.registerComponent("app", () => App);
