import { StatusBar } from "expo-status-bar";
import { AppRegistry } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MainContextProvider } from "./context/MainContext";

import { ThemeContextProvider } from "./context/ThemeContext";
import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ThemeContextProvider>
        <MainContextProvider>
          <SafeAreaProvider>
            <Navigation />
            <StatusBar />
          </SafeAreaProvider>
        </MainContextProvider>
      </ThemeContextProvider>
    );
  }
}

AppRegistry.registerComponent("app", () => App);
