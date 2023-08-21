import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
import { DataSource } from 'typeorm';

import { DB_ENTITIES, initiDB } from '@/data';
import { FontAwesome } from '@expo/vector-icons';

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
          dataSource.current = await initiDB();
        }

        // Load fonts
        await Font.loadAsync(FontAwesome.font);
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
