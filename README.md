# react-native-immersive 

[![i:npm]][l:npm]
[![i:npm-dm]][l:npm]

* [Installation Process](#installation-process)
* [Basic Usage](#basic-usage)
* [Restore Immersive State](#restore-immersive-state)
* [Sample Component](#sample-component)
* [Unified Compile Version](#unified-compile-version)

Add Toggle for Android Immersive FullScreen Layout

Note:
- this package is Android only, and Immersive Full-Screen Mode is first introduced since [Android 4.4 (API Level 19)][l:immersive]
- `v1.0.0` and above should be used with `react-native@>=0.47`
- `v0.0.5` should be used with `react-native@<=0.46`


## Installation Process

Download from npm: `npm i react-native-immersive`

Run `react-native link` to automatically link the library.

#### manual link process

Edit `android/settings.gradle`:

```diff
+ include ':react-native-immersive'
+ project(':react-native-immersive').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-immersive/android')
```

Edit `android/app/build.gradle`:

```diff
dependencies {
  compile fileTree(dir: "libs", include: ["*.jar"])
  compile "com.android.support:appcompat-v7:${rootProject.ext.supportLibVersion}"
  compile "com.facebook.react:react-native:+"  // From node_modules
+ compile project(':react-native-immersive')
}
```

Edit `android/app/src/main/java/.../MainApplication.java`:

```diff
+ import com.rnimmersive.RNImmersivePackage;

...

  @Override
  protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
      new MainReactPackage()
+     , new RNImmersivePackage()
    );
  }
```


## Basic Usage

```js
import { Immersive } from 'react-native-immersive'

// methods (Android only, will throw Error on iOS in __DEV__ mode)
Immersive.on()
Immersive.setImmersive(true)

Immersive.off()
Immersive.setImmersive(false)
```


## Restore Immersive State 

The Immersive State do not last forever (SYSTEM_UI_FLAG_IMMERSIVE_STICKY is not sticky enough). 
The Immersive State will get reset when:

- coming back to active AppState
- after Keyboard opening
- after Alert opening
- after Modal opening

To restore the Immersive State, add an additional listener.

```js
// listener for Immersive State recover
const restoreImmersive = () => {
  __DEV__ && console.warn('Immersive State Changed!')
  Immersive.on()
}
Immersive.addImmersiveListener(restoreImmersive)
Immersive.removeImmersiveListener(restoreImmersive)
```

The Native Module itself will cover some basic Immersive State change (but not something like Modal + Alert).
To get all Immersive State change, edit `android/app/src/main/java/.../MainActivity.java`:

```diff
+ import com.rnimmersive.RNImmersiveModule;
...

public class MainActivity extends ReactActivity {
  ...
+ @Override
+ public void onWindowFocusChanged(boolean hasFocus) {
+   super.onWindowFocusChanged(hasFocus);
+
+   if (hasFocus && RNImmersiveModule.getInstance() != null) {
+     RNImmersiveModule.getInstance().emitImmersiveStateChangeEvent();
+   }
+ }
}
```


## Sample Component

Change the code of `index.js` for testing: 
[example/index.sample.js](example/index.sample.js)


## Unified Compile Version

###### solution from SudoPlz [react-native-keychain#68][l:issue68]

When compile ReactNative android,
different package may set different compileSdkVersion and buildToolsVersion.

To force all the submodules to use the specified compileSdkVersion and buildToolsVersion,
add the following code to `android/build.gradle`:

```
subprojects {
    afterEvaluate {project ->
        if (project.hasProperty("android")) {
            android {
                compileSdkVersion 27
                buildToolsVersion "27.0.3"
            }
        }
    }
}
```

[i:npm]: https://img.shields.io/npm/v/react-native-immersive.svg
[i:npm-dm]: https://img.shields.io/npm/dm/react-native-immersive.svg
[l:npm]: https://www.npmjs.com/package/react-native-immersive
[l:immersive]: https://developer.android.com/training/system-ui/immersive.html
[l:issue68]: https://github.com/oblador/react-native-keychain/issues/68#issuecomment-304836725
