import dayjs from 'dayjs';
import 'dayjs/locale/es';
import utc from 'dayjs/plugin/utc';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { AppRegistry, LogBox } from 'react-native';
import { es, registerTranslation } from 'react-native-paper-dates';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import 'reflect-metadata';

import ConfirmationModal from '@/components/ConfirmationModal';
import SnackbarMessage from '@/components/SnackbarMessage';
import useCachedResources from '@/hooks/useCachedResources';
import Navigation from '@/navigation';
import { ThemeContextProvider, useTheme } from '@/theme/ThemeContext';

LogBox.ignoreLogs(['.+']);
LogBox.ignoreAllLogs(); // Ignore all log notifications

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function App() {
  const isLoadingComplete = useCachedResources();
  const { theme } = useTheme();

  if (!isLoadingComplete) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContextProvider>
        <SafeAreaProvider>
          <Navigation />
          <StatusBar backgroundColor={theme.colors.backdrop} />
        </SafeAreaProvider>
        <ConfirmationModal />
        <SnackbarMessage />
      </ThemeContextProvider>
    </QueryClientProvider>
  );
}

dayjs.locale('es');
dayjs.extend(utc);

registerTranslation('en', es);
AppRegistry.registerComponent('app', () => App);
