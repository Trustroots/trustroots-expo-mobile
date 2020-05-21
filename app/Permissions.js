// External dependencies
import * as Permissions from 'expo-permissions';

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
    const { status } = await Permissions.getAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('camera permision was conceded.');
  } else {
    console.log('camera permision was denied.');
  }
}
