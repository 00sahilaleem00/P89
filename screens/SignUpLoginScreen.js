import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  StyleSheet,
  Header,
  Alert,
} from "react-native";
import db from "../config.js";
import firebase from "firebase";

export default class SignUpLoginScreen extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
    };
  }

  userSignUp = (email, password) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        return Alert.alert("User Added Successfully");
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        return Alert.alert(errorMessage);
      });
  };

  userLogin = (email, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        return Alert.alert("User Logged In Successfully");
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        return Alert.alert(errorMessage);
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <View>
          <TextInput
            style={styles.inputBox}
            keyboardType="email-address"
            placeholder={"Enter Email ID"}
            onChangeText={(text) => {
              this.setState({
                email: text,
              });
            }}
          />
          <TextInput
            style={styles.inputBox}
            secureTextEntry={true}
            placeholder={"Enter Password"}
            onChangeText={(text) => {
              this.setState({
                password: text,
              });
            }}
          />
        </View>

        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.userLogin(this.state.email, this.state.password);
            }}
          >
            <Text>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.userSignUp(this.state.email, this.state.password);
            }}
          >
            <Text>Sign Up</Text>
          </TouchableOpacity>
        </View>
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
  inputBox: {
    margin: 10,
    borderWidth: 2,
  },
  button: {
    margin: 10,
    backgroundColor: "red",
  },
});
