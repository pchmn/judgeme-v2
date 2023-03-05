"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const codeMod_1 = require("@expo/config-plugins/build/android/codeMod");
const generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
const generate_1 = require("react-native-bootsplash/dist/commonjs/generate");
function withBootsplahScreen(config) {
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
    await (0, generate_1.generate)(params);
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
        ],
    });
    styles.resources.style?.push(bootTheme);
    return styles;
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
    mainActivity = (0, codeMod_1.addImports)(mainActivity, ['import android.os.Bundle', 'com.zoontek.rnbootsplash.RNBootSplash'], isJava);
    return (0, generateCode_1.mergeContents)({
        src: mainActivity,
        anchor: /super\.onCreate\(\w*\);/,
        offset: 0,
        comment: '//',
        tag: 'bootsplash',
        newSrc: '    RNBootSplash.init(this);',
    }).contents;
}
module.exports = withBootsplahScreen;
