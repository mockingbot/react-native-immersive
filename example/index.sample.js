import React, { Component } from 'react'
import { AppRegistry, StyleSheet, Text, View, Button, TextInput, Alert, Modal } from 'react-native'
import { Immersive } from 'react-native-immersive'

class testReactNative extends Component {
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
