/* eslint-disable @typescript-eslint/no-var-requires */
const { AndroidConfig, withAndroidStyles } = require('@expo/config-plugins');

const withSplashWindowIsTranslucent = (config) => {
  return withAndroidStyles(config, async (config) => {
    config.modResults = await configureFullScreenDialog(config.modResults);
    // config.modResults.resources.style.
    return config;
  });
};

async function configureFullScreenDialog(styles) {
  const splashScreen = styles.resources.style.find((style) => style.$.name === 'Theme.App.SplashScreen');

  if (splashScreen) {
    splashScreen.item = splashScreen.item.filter((item) => item.$.name !== 'android:windowIsTranslucent');
    splashScreen.item.push(
      AndroidConfig.Resources.buildResourceItem({
        name: 'android:windowIsTranslucent',
        value: true,
      })
    );
  }

  return styles;
}

module.exports = withSplashWindowIsTranslucent;
