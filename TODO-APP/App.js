import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  TextInput,
} from "react-native";
import image from "./assets/background.jpg";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.newTodo = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  state = {
    todos: ["One", "Two", "Three", "Four"],
    inputVal: ""
  };

  handleSubmit = () => {
    var newTodo = this.state.inputVal
    this.setState({
      todos: [...this.state.todos, newTodo],
      inputVal: ""
    })
  }

  handleChange = e => {
    this.setState({
      inputVal: e
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={image} style={styles.backg}>
          <View style={styles.mainApp}>
            <View>
              <TextInput
                style={styles.input}
                placeholder="Add New Todo"
                // ref={this.newTodo}
                value={this.state.inputVal}
                onChangeText={this.handleChange}
                onSubmitEditing={this.handleSubmit}
              />
              <View style={styles.presentTodos}>
                {this.state.todos.map((todo, index) => {
                  return (
                    <React.Fragment>
                      <Text style={styles.todos} key={index}>
                        {todo}
                      </Text>
                      {index < this.state.todos.length - 1 ? (
                        <View style={styles.break}></View>
                      ) : null}
                    </React.Fragment>
                  );
                })}
              </View>
            </View>
            <Text style={styles.footer}>
              Notes App with Firebase Integration
            </Text>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  backg: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    width: Dimensions.get("window").width,
  },
  mainApp: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    height: Dimensions.get("screen").height,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    backgroundColor: "#fff",
    padding: 5,
    paddingHorizontal: 10,
    width: 350,
  },
  footer: {
    backgroundColor: "#444",
    padding: 10,
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
    color: "#fff",
    width: 350,
  },
  presentTodos: {
    backgroundColor: "#444",
    borderBottomColor: "#fff",
    borderBottomWidth: 1,
  },
  todos: {
    padding: 10,
    fontSize: 18,
    color: "#fff",
  },
  break: {
    backgroundColor: "#fff",
    height: 1,
    width: 150,
    alignSelf: "center",
  },
});
