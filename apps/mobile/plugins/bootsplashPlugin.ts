import {
  AndroidConfig,
  withAndroidManifest,
  withAndroidStyles,
  withAppBuildGradle,
  withDangerousMod,
  withMainActivity,
} from '@expo/config-plugins';
import { addImports } from '@expo/config-plugins/build/android/codeMod';
import { mergeContents } from '@expo/config-plugins/build/utils/generateCode';
import { ExpoConfig } from '@expo/config-types';
import { generate } from 'react-native-bootsplash/dist/commonjs/generate';

function withBootsplahScreen(config: ExpoConfig) {
  let newConfig = withAppBuildGradle(config, (config) => {
    config.modResults.contents = applyGradleImplementation(config.modResults.contents);
    return config;
  });
  newConfig = withAndroidStyles(newConfig, (config) => {
    config.modResults = applyAndroidStyles(config.modResults);
    return config;
  });
  newConfig = withAndroidManifest(newConfig, (config) => {
    config.modResults = applyAndroidManifest(config.modResults);
    return config;
  });
  newConfig = withMainActivity(newConfig, (config) => {
    config.modResults.contents = initBootsplash(config.modResults.contents, config.modResults.language === 'java');
    return config;
  });
  newConfig = withDangerousMod(config, [
    'android',
    async (config) => {
      await generateAssets();
      return config;
    },
  ]);
  return newConfig;
}

async function generateAssets() {
  const params = {
    android: {
      sourceDir: `${process.cwd()}/android`,
      appName: 'app',
    },
    ios: {
      projectPath: `${process.cwd()}/ios/KavoutLocal`,
    },
    workingPath: `${process.cwd()}`,
    logoPath: `${process.cwd()}/assets/splash.png`,
    backgroundColor: '#fff',
    flavor: 'main',
    logoWidth: 100,
  };
  await generate(params);
}

function applyGradleImplementation(contents: string) {
  const implementationLine = `implementation("androidx.core:core-splashscreen:1.0.0")`;

  if (contents.includes(implementationLine)) {
    return contents;
  }

  return contents.replace(
    /dependencies\s?{/,
    `dependencies {
    ${implementationLine}`
  );
}

function applyAndroidStyles(styles: AndroidConfig.Resources.ResourceXML) {
  const bootTheme = AndroidConfig.Resources.buildResourceGroup({
    name: 'BootTheme',
    parent: 'Theme.SplashScreen',
    items: [
      AndroidConfig.Resources.buildResourceItem({
        name: 'windowSplashScreenBackground',
        value: '@color/bootsplash_background',
      }),
      AndroidConfig.Resources.buildResourceItem({
        name: 'windowSplashScreenAnimatedIcon',
        value: '@mipmap/bootsplash_logo',
      }),
      AndroidConfig.Resources.buildResourceItem({
        name: 'postSplashScreenTheme',
        value: '@style/AppTheme',
      }),
    ],
  });
  styles.resources.style?.push(bootTheme);

  return styles;
}

function applyAndroidManifest(manifest: AndroidConfig.Manifest.AndroidManifest) {
  const mainApplication = AndroidConfig.Manifest.getMainApplication(manifest);
  const mainActivity = AndroidConfig.Manifest.getMainActivity(manifest);
  if (mainApplication) {
    mainApplication.$['android:theme'] = '@style/BootTheme';
  }
  if (mainActivity) {
    mainActivity.$['android:theme'] = undefined;
  }
  return manifest;
}

function initBootsplash(mainActivity: string, isJava: boolean) {
  mainActivity = addImports(
    mainActivity,
    ['import android.os.Bundle', 'com.zoontek.rnbootsplash.RNBootSplash'],
    isJava
  );

  return mergeContents({
    src: mainActivity,
    anchor: /super\.onCreate\(\w*\);/,
    offset: 0,
    comment: '//',
    tag: 'bootsplash',
    newSrc: '    RNBootSplash.init(this);',
  }).contents;
}

module.exports = withBootsplahScreen;
