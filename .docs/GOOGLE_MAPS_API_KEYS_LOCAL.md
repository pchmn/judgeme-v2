# Handle Google Maps API Key locally when using development builds

## Create an `.env` file with your api keys

```bash
GOOGLE_MAPS_API_KEY_IOS=<your_api_key>
GOOGLE_MAPS_API_KEY_ANDROID=<your_api_key>
```

## Android

In `apps/mobile/android/app/build.gradle`, add a manifest placeholder:

```gradle
...
android {
    ...
    defaultConfig {
        ...
        manifestPlaceholders = [GOOGLE_MAPS_API_KEY: "$System.env.GOOGLE_MAPS_API_KEY_ANDROID"]
    }
}
```

Then use it in `apps/mobile/android/app/src/main/AndroidManifest.xml`:

```xml
<application android:name=".MainApplication" android:label="@string/app_name" android:icon="@mipmap/ic_launcher" android:roundIcon="@mipmap/ic_launcher_round" android:allowBackup="false" android:theme="@style/AppTheme" android:usesCleartextTraffic="true">
  ...
  <meta-data android:name="com.google.android.geo.API_KEY" android:value="${GOOGLE_MAPS_API_KEY}"/>
  ...
</application>
```

## iOS

In `apps/mobile/ios/KavoutDev/AppDelegate.mm`:

```mm
...
#import "ReactNativeConfig.h"
#import <GoogleMaps/GoogleMaps.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSString *mapsApiKey = [ReactNativeConfig envFor:@"GOOGLE_MAPS_API_KEY_IOS"];
  [GMSServices provideAPIKey:@"_YOUR_API_KEY_"];

  RCTAppSetupPrepareApp(application);

  RCTBridge *bridge = [self.reactDelegate createBridgeWithDelegate:self launchOptions:launchOptions];

...
```
