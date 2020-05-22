// External dependencies
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
/**
 * Registers device to Expo IO Camera/External Files service.
 */
export async function requirePermission() {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.CAMERA,
    Permissions.CAMERA_ROLL
  );

  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    try {
      const { status: cameraStatus } = await Camera.requestPermissionsAsync();
      const { satus: camerarollStatus } = await ImagePicker.requestCameraRollPermissionsAsync();
      finalStatus =
        cameraStatus !== 'granted' || camerarollStatus !== 'granted' ? 'not-granted' : 'granted';
    } catch (E) {
      console.log(E);
    }
  }

  if (finalStatus !== 'granted') {
    console.log('camera permision was conceded.');
  } else {
    console.log('camera permision was denied.');
  }
}
