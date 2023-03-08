"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const codeMod_1 = require("@expo/config-plugins/build/android/codeMod");
const generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
const fs_1 = require("fs");
const generate_1 = require("react-native-bootsplash-cli-fork/dist/commonjs/generate");
function withBootsplahScreen(config, params) {
    let newConfig = (0, config_plugins_1.withAppBuildGradle)(config, (config) => {
        config.modResults.contents = applyGradleImplementation(config.modResults.contents);
        return config;
    });
    newConfig = (0, config_plugins_1.withAndroidStyles)(newConfig, (config) => {
        config.modResults = applyAndroidStyles(config.modResults);
        return config;
    });
    newConfig = (0, config_plugins_1.withAndroidManifest)(newConfig, (config) => {
        config.modResults = applyAndroidManifest(config.modResults);
        return config;
    });
    newConfig = (0, config_plugins_1.withMainActivity)(newConfig, (config) => {
        config.modResults.contents = initBootsplash(config.modResults.contents, config.modResults.language === 'java');
        return config;
    });
    newConfig = (0, config_plugins_1.withDangerousMod)(config, [
        'android',
        async (config) => {
            await generateAssets(params);
            return config;
        },
    ]);
    return newConfig;
}
async function generateAssets(params = {
    logoPath: `${process.cwd()}/assets/bootsplash_logo.svg`,
    backgroundColor: '#fff',
    flavor: 'main',
    logoWidth: 160,
}) {
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
    await (0, generate_1.generate)(generateParam);
}
function applyGradleImplementation(contents) {
    const implementationLine = `implementation("androidx.core:core-splashscreen:1.0.0")`;
    if (contents.includes(implementationLine)) {
        return contents;
    }
    return contents.replace(/dependencies\s?{/, `dependencies {
    ${implementationLine}`);
}
function applyAndroidStyles(styles) {
    const appTheme = styles.resources.style?.find((style) => style.$.name === 'AppTheme');
    if (appTheme) {
        appTheme.item?.push(...[
            config_plugins_1.AndroidConfig.Resources.buildResourceItem({
                name: 'android:statusBarColor',
                value: '@android:color/transparent',
            }),
            config_plugins_1.AndroidConfig.Resources.buildResourceItem({
                name: 'android:windowTranslucentNavigation',
                value: 'true',
            }),
            config_plugins_1.AndroidConfig.Resources.buildResourceItem({
                name: 'android:windowDrawsSystemBarBackgrounds',
                value: 'true',
            }),
            config_plugins_1.AndroidConfig.Resources.buildResourceItem({
                name: 'android:fitsSystemWindows',
                value: 'false',
            }),
            config_plugins_1.AndroidConfig.Resources.buildResourceItem({
                name: 'android:windowLightStatusBar',
                value: 'false',
            }),
        ]);
    }
    createStyles('values-v27');
    const bootTheme = config_plugins_1.AndroidConfig.Resources.buildResourceGroup({
        name: 'BootTheme',
        parent: 'Theme.SplashScreen',
        items: [
            config_plugins_1.AndroidConfig.Resources.buildResourceItem({
                name: 'windowSplashScreenBackground',
                value: '@color/bootsplash_background',
            }),
            config_plugins_1.AndroidConfig.Resources.buildResourceItem({
                name: 'windowSplashScreenAnimatedIcon',
                value: '@mipmap/bootsplash_logo',
            }),
            config_plugins_1.AndroidConfig.Resources.buildResourceItem({
                name: 'postSplashScreenTheme',
                value: '@style/AppTheme',
            }),
            config_plugins_1.AndroidConfig.Resources.buildResourceItem({
                name: 'android:windowTranslucentNavigation',
                value: 'true',
            }),
        ],
    });
    styles.resources.style?.push(bootTheme);
    return styles;
}
function createStyles(folder) {
    if (!(0, fs_1.existsSync)(`android/app/src/main/res/${folder}`)) {
        (0, fs_1.mkdirSync)(`android/app/src/main/res/${folder}`);
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
    (0, fs_1.writeFileSync)(`android/app/src/main/res/${folder}/styles.xml`, styles);
}
function applyAndroidManifest(manifest) {
    const mainApplication = config_plugins_1.AndroidConfig.Manifest.getMainApplication(manifest);
    const mainActivity = config_plugins_1.AndroidConfig.Manifest.getMainActivity(manifest);
    if (mainApplication) {
        mainApplication.$['android:theme'] = '@style/BootTheme';
    }
    if (mainActivity) {
        mainActivity.$['android:theme'] = undefined;
    }
    return manifest;
}
function initBootsplash(mainActivity, isJava) {
    mainActivity = (0, codeMod_1.addImports)(mainActivity, ['import android.os.Bundle', 'com.zoontek.rnbootsplash.RNBootSplash', 'com.zoontek.rnbars.RNBars'], isJava);
    mainActivity = (0, generateCode_1.mergeContents)({
        src: mainActivity,
        anchor: /super\.onCreate\(\w*\);/,
        offset: 0,
        comment: '//',
        tag: 'react-native-bootsplash',
        newSrc: '    RNBootSplash.init(this);',
    }).contents;
    return (0, generateCode_1.mergeContents)({
        src: mainActivity,
        anchor: /super\.onCreate\(\w*\);/,
        offset: 1,
        comment: '//',
        tag: 'react-native-bars',
        newSrc: '    RNBars.init(this, "dark-content");',
    }).contents;
}
module.exports = withBootsplahScreen;
