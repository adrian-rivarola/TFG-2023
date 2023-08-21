import { documentDirectory, writeAsStringAsync } from 'expo-file-system';
import { shareAsync } from 'expo-sharing';

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

export async function saveCSV(name: string, csvData: string) {
  try {
    const filename = documentDirectory + name;

    await writeAsStringAsync(filename, csvData, {
      encoding: 'utf8',
    });

    const shareOptions = { mimeType: 'text/csv', UTI: 'public.comma-separated-values-text' };
    await shareAsync(filename, shareOptions);
  } catch (err) {
    console.log('Failed to save CSV file!', err);
    throw err;
  }
}
