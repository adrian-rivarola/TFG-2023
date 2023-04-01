import "reflect-metadata";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { StatusBar } from "expo-status-bar";
import { AppRegistry, LogBox } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { MainContextProvider } from "./context/MainContext";
import { RefContextProvider } from "./context/RefContext";
import { ThemeContextProvider } from "./context/ThemeContext";
import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";

LogBox.ignoreLogs([".+"]);
LogBox.ignoreAllLogs(); // Ignore all log notifications

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ThemeContextProvider>
        <MainContextProvider>
          <RefContextProvider>
            <SafeAreaProvider>
              <Navigation />
              <StatusBar />
            </SafeAreaProvider>
          </RefContextProvider>
        </MainContextProvider>
      </ThemeContextProvider>
    );
  }
}

dayjs.locale("es");
AppRegistry.registerComponent("app", () => App);
