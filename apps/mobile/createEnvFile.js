import 'dotenv/config';

import { writeFileSync } from 'fs';

function main() {
  const googleMapsApiKeyIos =
    process.env.APP_ENV === 'production'
      ? process.env.GOOGLE_MAPS_API_KEY_IOS_PROD
      : process.env.GOOGLE_MAPS_API_KEY_IOS_DEV;
  const googleMapsApiKeyAndroid =
    process.env.APP_ENV === 'production'
      ? process.env.GOOGLE_MAPS_API_KEY_ANDROID_PROD
      : process.env.GOOGLE_MAPS_API_KEY_ANDROID_DEV;

  const envFileContent = `
    GOOGLE_MAPS_API_KEY_ANDROID=${googleMapsApiKeyAndroid}
    GOOGLE_MAPS_API_KEY_IOS=${googleMapsApiKeyIos}`;

  writeFileSync('.env', envFileContent);
}

main();
