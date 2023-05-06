import dayjs from "dayjs";
import "dayjs/locale/es";
import { StatusBar } from "expo-status-bar";
import { AppRegistry, LogBox } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "reflect-metadata";

import { QueryClient, QueryClientProvider } from "react-query";
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
  } else {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeContextProvider>
          <SafeAreaProvider>
            <Navigation />
            <StatusBar />
          </SafeAreaProvider>
        </ThemeContextProvider>
      </QueryClientProvider>
    );
  }
}

dayjs.locale("es");
AppRegistry.registerComponent("app", () => App);
