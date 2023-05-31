import { FontAwesome } from "@expo/vector-icons";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
import { initiDB } from "../data";
import { DataSource } from "typeorm";
import { createMockData } from "../data/mock";

const DB_NAME = "mydb-orm-test.db";

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const dataSource = useRef<DataSource | null>(null);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        await SplashScreen.preventAutoHideAsync();

        // initialize db connection
        if (!dataSource.current) {
          dataSource.current = await initiDB("testing.db");
          // await createMockData();
        }

        // Load fonts
        await Font.loadAsync({
          ...FontAwesome.font,
          "space-mono": require("../assets/fonts/SpaceMono-Regular.ttf"),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
