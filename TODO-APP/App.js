import React, {Component} from 'react';
import { StyleSheet, Text, View, ImageBackground, Dimensions } from 'react-native';
import image from "./assets/background.jpg"

export default class App extends Component{
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={image} style={styles.backg}>
          <Text>Open up App.js to start working on your app!</Text>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backg: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    width: Dimensions.get("window").width
  }
});
