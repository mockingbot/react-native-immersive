# react-native-immersive [![npm](https://img.shields.io/npm/dm/react-native-immersive.svg)](https://www.npmjs.com/package/react-native-immersive) [![npm](https://img.shields.io/npm/v/react-native-immersive.svg)](https://www.npmjs.com/package/react-native-immersive)
Add Toggle for Android Immersive FullScreen Layout

Note: this project is Android only, and Immersive Full-Screen Mode is first introduced since [Android 4.4 (API Level 19)](https://developer.android.com/training/system-ui/immersive.html)

## Installation Process

* download this from npm

```bash
npm install react-native-immersive --save
```

* Edit `android/settings.gradle`:

  ```diff
  + include ':react-native-immersive'
  + project(':react-native-immersive').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-immersive/android')
  ```

* Edit `android/app/build.gradle`:

  ```diff
  dependencies {
    compile fileTree(dir: 'libs', include: ['*.jar'])
    compile "com.android.support:appcompat-v7:23.0.1"
    compile "com.facebook.react:react-native:+"
  + compile project(':react-native-immersive')
  }
  ```

* Edit your `android/app/src/main/java/.../MainActivity.java`:

  ```diff
  + import com.rnimmersive.RNImmersivePackage;
  ```

  ```diff
    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
        new MainReactPackage()
  +     , new RNImmersivePackage()
      );
    }
  ```

## Usage

```js
import Immersive from 'react-native-immersive';
// or
import {Immersive} from 'react-native-immersive';
// or
const Immersive = require('react-native-immersive');

// methods (Android Only, don't call on iOS)
Immersive.on();
Immersive.setImmersive(true);

Immersive.off();
Immersive.setImmersive(false);
```
