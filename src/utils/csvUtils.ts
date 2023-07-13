import * as DocumentPicker from 'expo-document-picker';
import { documentDirectory, readAsStringAsync, writeAsStringAsync } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { shareAsync } from 'expo-sharing';
import { PermissionsAndroid, Platform } from 'react-native';

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

export async function saveCSV(name: string, csvData: string): Promise<boolean> {
  try {
    const filename = documentDirectory + name;

    await writeAsStringAsync(filename, csvData, {
      encoding: 'utf8',
    });

    if (Platform.OS === 'ios') {
      const UTI = 'public.comma-separated-values-text';
      await shareAsync(filename, { UTI });
    } else {
      // TODO: Fix android error in Android 13
      const perm = await hasAndroidPermission();
      if (!perm) {
        throw Error('permission-error');
      }
      const asset = await MediaLibrary.createAssetAsync(filename);
      const album = await MediaLibrary.getAlbumAsync('Download');
      if (album == null) {
        await MediaLibrary.createAlbumAsync('Download', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }
    }
  } catch (err) {
    console.log('Failed to save CSV file!', err);
    throw err;
  }
  return true;
}

export async function openCSV() {
  const res = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true,
    type: ['text/csv', 'text/comma-separated-values', 'public.comma-separated-values-text'],
  });

  if (res.type === 'success') {
    const data = await readAsStringAsync(res.uri, {
      encoding: 'utf8',
    });
    console.log({ res, data });
  }
}

const hasAndroidPermission = async (): Promise<boolean> => {
  const OsVer = (Platform as any).constants['Release'];

  // GET SPECIFIC MEDIA PERMISSION ANDROID 13+
  const permission =
    parseInt(OsVer, 10) >= 13
      ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      : PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

  const hasPermission = await PermissionsAndroid.check(permission);

  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(permission);

  return status === 'granted';
};
