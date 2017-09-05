# react-native-immersive 

[![npm](https://img.shields.io/npm/dm/react-native-immersive.svg)](https://www.npmjs.com/package/react-native-immersive) 
[![npm](https://img.shields.io/npm/v/react-native-immersive.svg)](https://www.npmjs.com/package/react-native-immersive)

Add Toggle for Android Immersive FullScreen Layout

Note: this project is Android only, and Immersive Full-Screen Mode is first introduced since [Android 4.4 (API Level 19)](https://developer.android.com/training/system-ui/immersive.html)

Note: `v1.0.0` should be used with `react-native@>=0.47`. Use `v0.0.5` for `react-native@<=0.46`.

## Installation Process

* download from npm

```
npm i react-native-immersive
```

* Run `react-native link` to automatically link the library.

#### manual link process

* Edit `android/settings.gradle`:

  ```diff
  + include ':react-native-immersive'
  + project(':react-native-immersive').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-immersive/android')
  ```

* Edit `android/app/build.gradle`:

  ```diff
  dependencies {
    compile fileTree(dir: "libs", include: ["*.jar"])
    compile "com.android.support:appcompat-v7:23.0.1"
    compile "com.facebook.react:react-native:+"  // From node_modules
  + compile project(':react-native-immersive')
  }
  ```

* Edit `android/app/src/main/java/.../MainApplication.java`:

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

## Basic Usage

```js
import Immersive from 'react-native-immersive'
// or
import { Immersive } from 'react-native-immersive'

// methods (Android only, will throw Error on iOS in __DEV__ mode)
Immersive.on()
Immersive.setImmersive(true)

Immersive.off()
Immersive.setImmersive(false)
```

## Restore Immersive State 

The Immersive State do not last forever(SYSTEM_UI_FLAG_IMMERSIVE_STICKY is not sticky enough). 
The Immersive State will get reset on:

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

The Native Module itself will cover some basic Immersive State change(but not something like Modal + Alert).
To get all Immersive State change, edit `android/app/src/main/java/.../MainActivity.java`:

```diff
+ import com.rnimmersive.RNImmersiveModule;
...

public class MainActivity extends ReactActivity {
  ...
+  @Override
+  public void onWindowFocusChanged(boolean hasFocus) {
+    super.onWindowFocusChanged(hasFocus);
+
+    if (hasFocus && RNImmersiveModule.getInstance() != null) {
+      RNImmersiveModule.getInstance().emitImmersiveStateChangeEvent();
+    }
+  }
}
```

## Sample Component

The code of `index.android.js` for testing:

```jsx
import React, { Component } from 'react'
import { AppRegistry, StyleSheet, Text, View, Button, TextInput, Alert, Modal } from 'react-native'
import { Immersive } from 'react-native-immersive'

export default class testReactNative extends Component {
  constructor (props) {
    super(props)

    this.setImmersiveOn = () => {
      Immersive.on()
      this.setState({ isImmersive: true })
    }
    this.setImmersiveOff = () => {
      Immersive.off()
      this.setState({ isImmersive: false })
    }

    this.getImmersiveState = () => Immersive.getImmersive().then((immersiveState) => {
      __DEV__ && console.warn('[getImmersiveState]', immersiveState)
      this.setState({ immersiveState })
    })

    this.setRestoreImmersiveOn = () => this.setState({ isRestoreImmersive: true })
    this.setRestoreImmersiveOff = () => this.setState({ isRestoreImmersive: false })

    this.restoreImmersive = () => {
      __DEV__ && console.warn('[restoreImmersive]', this.state.isRestoreImmersive)
      this.state.isRestoreImmersive && Immersive.setImmersive(this.state.isImmersive)
    }

    this.showModal = () => this.setState({ isModal: true })
    this.hideModal = () => this.setState({ isModal: false })

    this.onTextChange = (text) => this.setState({ text })

    this.showAlert = () => Alert.alert('Alert Title', 'Alert Messsag')

    this.state = {
      isImmersive: false,
      isRestoreImmersive: true,
      immersiveState: null,
      isModal: false,
      text: 'test'
    }
  }

  componentDidMount () { Immersive.addImmersiveListener(this.restoreImmersive) }

  componentWillUnmount () { Immersive.removeImmersiveListener(this.restoreImmersive) }

  renderTest () {
    const { isImmersive, isRestoreImmersive, isModal, immersiveState, text } = this.state
    return <View style={styles.containerTest}>
      <Button onPress={isImmersive ? this.setImmersiveOff : this.setImmersiveOn} title="toggle isImmersive" />
      <Text style={styles.text}>isImmersive: {JSON.stringify(isImmersive)}</Text>

      <Button onPress={isRestoreImmersive ? this.setRestoreImmersiveOff : this.setRestoreImmersiveOn} title="toggle isRestoreImmersive" />
      <Text style={styles.text}>isRestoreImmersive: {JSON.stringify(isRestoreImmersive)}</Text>

      <Button onPress={this.getImmersiveState} title="get immersiveState" />
      <Text style={styles.text}>immersiveState: {JSON.stringify(immersiveState)}</Text>

      <Button onPress={isModal ? this.hideModal : this.showModal} title="toggle isModal" />
      <Text style={styles.text}>isModal: {JSON.stringify(isModal)}</Text>

      <Button onPress={this.showAlert} title="pop Alert" />

      <TextInput value={text} onChangeText={this.onTextChange} />
    </View>
  }

  render () {
    const { isModal } = this.state
    return <View style={styles.container}>
      <Text style={styles.text}>Welcome to React Native!</Text>
      {this.renderTest()}
      <Text style={styles.text}>Welcome to React Native!</Text>

      <Modal animationType="slide" visible={isModal} onRequestClose={this.hideModal}>
        <Text style={styles.text}>Modal!</Text>
        {this.renderTest()}
        <Text style={styles.text}>Modal!</Text>
      </Modal>
    </View>
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  containerTest: { alignItems: 'stretch', justifyContent: 'center', flex: 1 },
  text: { textAlign: 'center', fontSize: 14 }
})

AppRegistry.registerComponent('testReactNative', () => testReactNative)
```
