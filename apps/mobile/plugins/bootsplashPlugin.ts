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
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { generate } from 'react-native-bootsplash-cli-fork/dist/commonjs/generate';

interface Params {
  logoPath?: string;
  backgroundColor?: string;
  flavor?: string;
  logoWidth?: number;
}

function withBootsplahScreen(config: ExpoConfig, params: Params) {
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
      await generateAssets(params);
      return config;
    },
  ]);
  return newConfig;
}

async function generateAssets(
  params: Params = {
    logoPath: `${process.cwd()}/assets/bootsplash_logo.svg`,
    backgroundColor: '#fff',
    flavor: 'main',
    logoWidth: 160,
  }
) {
  const generateParam = {
    android: {
      sourceDir: `${process.cwd()}/android`,
      appName: 'app',
    },
    ios: {
      projectPath: `${process.cwd()}/ios/KavoutLocal`,
    },
    workingPath: `${process.cwd()}`,
    darkLogoPath: `${process.cwd()}/assets/bootsplash_logo.png`,
    darkBackgroundColor: '#201a1a',
    ...params,
  };
  await generate(generateParam);
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
  const appTheme = styles.resources.style?.find((style) => style.$.name === 'AppTheme');
  if (appTheme) {
    appTheme.item?.push(
      ...[
        AndroidConfig.Resources.buildResourceItem({
          name: 'android:statusBarColor',
          value: '@android:color/transparent',
        }),
        AndroidConfig.Resources.buildResourceItem({
          name: 'android:windowTranslucentNavigation',
          value: 'true',
        }),
        AndroidConfig.Resources.buildResourceItem({
          name: 'android:windowDrawsSystemBarBackgrounds',
          value: 'true',
        }),
        AndroidConfig.Resources.buildResourceItem({
          name: 'android:fitsSystemWindows',
          value: 'false',
        }),
        AndroidConfig.Resources.buildResourceItem({
          name: 'android:windowLightStatusBar',
          value: 'false',
        }),
      ]
    );
  }
  createStyles('values-v27');

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
      AndroidConfig.Resources.buildResourceItem({
        name: 'android:windowTranslucentNavigation',
        value: 'true',
      }),
    ],
  });
  styles.resources.style?.push(bootTheme);

  return styles;
}

function createStyles(folder: 'values-v27' | 'values-v27-night' | 'values-night') {
  if (!existsSync(`android/app/src/main/res/${folder}`)) {
    mkdirSync(`android/app/src/main/res/${folder}`);
  }
  const styles = `
<resources xmlns:tools="http://schemas.android.com/tools">

  <style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
      <!-- Set system bars background transparent -->
      <item name="android:statusBarColor">@android:color/transparent</item>
      <item name="android:navigationBarColor">@android:color/transparent</item>

      <!-- Disable auto contrasted system bars background -->
      <item name="android:enforceStatusBarContrast" tools:targetApi="q">false</item>
      <item name="android:enforceNavigationBarContrast" tools:targetApi="q">false</item>
  </style>

  <!-- BootTheme should inherit from Theme.SplashScreen -->
  <style name="BootTheme" parent="Theme.SplashScreen">
          <item name="windowSplashScreenBackground">@color/bootsplash_background</item>
    <item name="windowSplashScreenAnimatedIcon">@mipmap/bootsplash_logo</item>
    <item name="postSplashScreenTheme">@style/AppTheme</item>
      <!-- Bars initial styles: true = dark-content, false = light-content -->
      <item name="android:windowLightStatusBar">true</item>
      <item name="android:windowLightNavigationBar">true</item>
  </style>

</resources>`;

  writeFileSync(`android/app/src/main/res/${folder}/styles.xml`, styles);
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
    ['import android.os.Bundle', 'com.zoontek.rnbootsplash.RNBootSplash', 'com.zoontek.rnbars.RNBars'],
    isJava
  );

  mainActivity = mergeContents({
    src: mainActivity,
    anchor: /super\.onCreate\(\w*\);/,
    offset: 0,
    comment: '//',
    tag: 'react-native-bootsplash',
    newSrc: '    RNBootSplash.init(this);',
  }).contents;
  return mergeContents({
    src: mainActivity,
    anchor: /super\.onCreate\(\w*\);/,
    offset: 1,
    comment: '//',
    tag: 'react-native-bars',
    newSrc: '    RNBars.init(this, "dark-content");',
  }).contents;
}

module.exports = withBootsplahScreen;
