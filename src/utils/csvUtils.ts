import * as FileSystem from 'expo-file-system';
import { startActivityAsync } from 'expo-intent-launcher';
import { shareAsync } from 'expo-sharing';
import { Platform } from 'react-native';

export function convertToCSV<T extends Record<string, string | number>>(
  objectsList: T[],
  keys: (keyof T)[]
) {
  const csvContent = [
    keys.join(','),
    ...objectsList.map((obj) => keys.map((key) => obj[key]).join(',')),
  ];

  return csvContent.join('\n');
}

async function shareCSV(name: string, csvData: string) {
  try {
    const filename = FileSystem.documentDirectory + name;

    await FileSystem.writeAsStringAsync(filename, csvData, {
      encoding: 'utf8',
    });

    const shareOptions = { mimeType: 'text/csv', UTI: 'public.comma-separated-values-text' };
    await shareAsync(filename, shareOptions);
  } catch (err) {
    console.log('Failed to save CSV file!', err);
    throw err;
  }
}

export async function saveCSV(filename: string, csvData: string) {
  if (Platform.OS === 'ios') {
    return await shareCSV(filename, csvData);
  }

  const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
  if (permissions.granted) {
    const fileType = 'text/csv';
    const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
      permissions.directoryUri,
      filename,
      fileType
    );

    await FileSystem.writeAsStringAsync(fileUri, csvData, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    await startActivityAsync('android.intent.action.VIEW', {
      flags: 1,
      data: fileUri,
      type: fileType,
    });
  }
}
