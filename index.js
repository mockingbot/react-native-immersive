import { NativeModules, Platform } from 'react-native'
const { RNImmersive } = NativeModules

function unSupportedError () {
  throw new Error('[react-native-immersive] does not support iOS')
}

const Immersive = Platform.OS === 'android' ? {
  on() {
    return RNImmersive.on()
  },
  off() {
    return RNImmersive.off()
  },
  setImmersive(isOn) {
    return RNImmersive.setImmersive(isOn)
  }
} : {
  on: unSupportedError,
  off: unSupportedError,
  setImmersive: unSupportedError
}

export { Immersive }
export default Immersive
