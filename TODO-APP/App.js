import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import image from "./assets/background.jpg";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import * as firebase from "firebase";
import keys from "./auth.json";
import RNRestart from "react-native-restart";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.newTodo = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);

    const firebaseConfig = keys;


  }

  state = {
    todos: [],
    inputVal: "",
    todosHeight: null,
    netIssue: false,
    refreshing: false
  };

  onRefresh = () => {
    this.setState({
      refreshing: true
    })

    this.load()

    setTimeout(() => {
      this.setState({
        refreshing: false,
        netIssue: false
      })
    }, 1000)
  }

  componentDidMount = () => {
    if (!firebase.apps.length) firebase.initializeApp(keys);
    this.changeHeight(0);
    this.load();
  };

  load = () => {
    var dataAll = firebase.database().ref("todos/");
    var self = this;
    // dataAll.once('value', snapshot => {
    //   console.log(snapshot.val())
    // })
    dataAll.once("value").then((e) => {
      e.forEach((child) => {
        self.setState({
          todos: [...self.state.todos, child.val()],
        });
      });
      this.changeHeight(this.state.todos.length);
    });
  };

  changeHeight = (noOfTodos) => {
    // console.log(noOfTodos)
    if (noOfTodos == 1)
      this.setState({
        todosHeight: 42.80701700846354,
      });
    else if (noOfTodos == 2) {
      this.setState({
        todosHeight: 85.61403401692708,
      });
    } else if (noOfTodos == 3) {
      this.setState({
        todosHeight: 128.42105102539062,
      });
    } else if (noOfTodos == 4) {
      this.setState({
        todosHeight: 171.22806803385416,
      });
    } else if (noOfTodos > 4) {
      this.setState({
        todosHeight: 200,
      });
    } else if (noOfTodos == 0) {
      this.setState({
        todosHeight: 0,
      });
    }
  };

  handleSubmit = () => {
    var newTodo = {
      text: this.state.inputVal,
      complete: false,
    };

    // STORING TO FIREBASE
    var dataAll = firebase.database().ref("todos/");
    var newPush = dataAll.push();
    var newKey = newPush.key;
    newTodo.key = newKey;
    newPush
      .set(newTodo)
      .then(() => {
        this.setState({
          todos: [...this.state.todos, newTodo],
          inputVal: "",
        });
        this.changeHeight(this.state.todos.length);
      })
      .catch(() =>
        this.setState({
          netIssue: true
        })
      );
  };

  handleChange = (e) => {
    this.setState({
      inputVal: e,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={image} style={styles.backg}>
          <View style={styles.mainApp}>
              {this.state.netIssue == true ? (
                <View
                  style={{
                    ...styles.presentTodos,
                    height: 42.8,
                    width: 350,
                    flexDirection: "row",
                  }}
                >
                  <Text style={styles.network}>
                    Please check your Network!{" "}
                  </Text>
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={this.onRefresh}
                  >
                    <Text style={{ height: 42.8, textAlignVertical: "center" }}>
                      <AntDesign name="reload1" size={30} color="#fff" />
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <TextInput
                    style={styles.input}
                    placeholder="Add New Todo"
                    // ref={this.newTodo}
                    value={this.state.inputVal}
                    onChangeText={this.handleChange}
                    onSubmitEditing={this.handleSubmit}
                  />

                  <View
                    style={{
                      ...styles.presentTodos,
                      height: this.state.todosHeight,
                    }}
                  >
                    <ScrollView>
                      {this.state.todos.map((todo, index) => {
                        return (
                          <React.Fragment key={index}>
                            <View style={styles.list}>
                              <TouchableOpacity
                                style={{ flex: 3 }}
                                onPress={() => {
                                  var todos = this.state.todos;
                                  var dataAll = firebase
                                    .database()
                                    .ref("todos/");
                                  todos[index].complete = !todos[index]
                                    .complete;
                                  this.setState({
                                    todos: todos,
                                  });
                                  dataAll
                                    .child(todos[index].key)
                                    .set(todos[index]);
                                }}
                              >
                                <View style={{ flexDirection: "row" }}>
                                  {todo.complete == true ? (
                                    <Text style={{ padding: 10 }}>
                                      <Ionicons
                                        name="ios-checkmark-circle-outline"
                                        size={25}
                                        color="#888"
                                      />
                                    </Text>
                                  ) : null}

                                  <Text
                                    style={
                                      todo.complete == true
                                        ? styles.completedTodo
                                        : styles.todos
                                    }
                                  >
                                    {todo.text}
                                  </Text>
                                </View>
                              </TouchableOpacity>

                              <TouchableOpacity
                                activeOpacity={0.1}
                                onPress={() => {
                                  this.setState({
                                    todos: [
                                      ...this.state.todos.filter(
                                        (todo) =>
                                          this.state.todos.indexOf(todo) !=
                                          index
                                      ),
                                    ],
                                  });
                                  var dataAll = firebase
                                    .database()
                                    .ref("todos/");
                                  this.changeHeight(
                                    this.state.todos.length - 1
                                  );
                                  dataAll
                                    .child(todo.key)
                                    .remove()
                                    .catch(() => {
                                      this.setState({
                                        netIssue: true,
                                      });
                                    });
                                }}
                              >
                                <Text style={styles.deleteButton}>
                                  <AntDesign
                                    name="minuscircleo"
                                    size={25}
                                    color="rgb(205, 80, 70)"
                                  />
                                </Text>
                              </TouchableOpacity>
                            </View>
                            {index < this.state.todos.length - 1 ? (
                              <View style={styles.break}></View>
                            ) : null}
                          </React.Fragment>
                        );
                      })}
                    </ScrollView>
                  </View>
                </View>
              )}
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
  completedTodo: {
    padding: 10,
    fontSize: 18,
    color: "#888",
  },
  break: {
    backgroundColor: "#fff",
    height: 1,
    width: 150,
    alignSelf: "center",
  },
  list: {
    flexDirection: "row",
  },
  deleteButton: {
    padding: 10,
  },
  check: {
    padding: 10,
  },
  network: {
    color: "#f00",
    textAlign: "center",
    height: 42.8,
    textAlignVertical: "center",
    fontSize: 22,
    flex: 5,
  },
});
